import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'aakarshan-super-secret-key-2026';

/**
 * POST /api/auth/login
 * Validates admin credentials locally inside Render PostgreSQL and returns signed JWT
 * PUBLIC endpoint
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: 'Please enter both email and password fields.' });
      return;
    }

    // Verify admin email
    const admin = await prisma.admin.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    });

    if (!admin) {
      res.status(401).json({ error: 'Invalid email address or password credentials.' });
      return;
    }

    // Validate bcrypt password hash
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: 'Invalid email address or password credentials.' });
      return;
    }

    // Sign a secure JWT session token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({
      token,
      user: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('[Auth Route Exception]:', error);
    res.status(500).json({ error: 'Internal server error during login operation.' });
  }
});

export default router;
