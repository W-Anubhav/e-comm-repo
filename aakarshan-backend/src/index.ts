import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
app.enable('trust proxy');
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// 1. Hardened Security Headers using Helmet (adjusted to allow loading of static uploads)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Strict CORS Configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const cleanedClientUrl = clientUrl.endsWith('/') ? clientUrl.slice(0, -1) : clientUrl;

const allowedOrigins = [
  cleanedClientUrl,
  'https://e-comm-repo.vercel.app',
  'https://e-comm-repo-git-main-manubhav619-9876s-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Security Violation: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Static folder serving for uploaded boutique pictures
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 5. Rate Limiting Protection (Anti-DoS)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true, 
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again in 15 minutes.' }
});
app.use('/api/', globalLimiter);

// 6. REST API Routers
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// 7. API Server Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root fallback (fixed to show nice index info)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Aakarshan Boutique API Platform is fully operational.',
    endpoints: {
      health: '/health',
      products: '/api/products'
    }
  });
});

// 8. Global Unhandled Exception Catch-all Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Exception Handler]:', err);
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  res.status(statusCode).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : message
  });
});

/**
 * Database Auto-Seeding: Automatically creates administrator account if admins table is empty
 */
async function seedAdminOnStartup() {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount === 0) {
      const defaultEmail = 'ramanujmaurya1971@gmail.com';
      const defaultPassword = 'AakarshanAdmin2026'; // Pre-configured secure startup admin password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await prisma.admin.create({
        data: {
          email: defaultEmail,
          password: hashedPassword
        }
      });
      
      console.log(`\n========================================================================`);
      console.log(`[Database Auto-Seed]: Admin account successfully generated!`);
      console.log(`📧 Email: ${defaultEmail}`);
      console.log(`🔑 Password: ${defaultPassword}`);
      console.log(`========================================================================\n`);
    }
  } catch (err) {
    console.warn('\n[Database Auto-Seed Warning]: Could not auto-seed admin account. Database connection may be initializing or schema.sql is not yet executed.\n');
  }
}

// Launch express listener & run auto-seed
app.listen(PORT, async () => {
  console.log(`[Aakarshan Backend]: Running successfully on http://localhost:${PORT}`);
  await seedAdminOnStartup();
});
