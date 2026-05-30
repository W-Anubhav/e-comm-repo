import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { validateProduct, validateProductUpdate } from '../middlewares/validation.middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/products
 * Fetch all products, optional filtering by category
 * PUBLIC endpoint
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    
    const queryOptions: any = {
      orderBy: {
        created_at: 'desc',
      },
    };

    if (category) {
      queryOptions.where = {
        category: String(category).trim(),
      };
    }

    const products = await prisma.product.findMany(queryOptions);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id
 * Fetch single product details
 * PUBLIC endpoint
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to retrieve product details' });
  }
});

/**
 * POST /api/products
 * Create a new product listing
 * PROTECTED (Admin session verified + validated params)
 */
router.post('/', authenticateAdmin, validateProduct, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category, image_url } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        image_url,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product listing' });
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product
 * PROTECTED (Admin session verified + validated params)
 */
router.put('/:id', authenticateAdmin, validateProductUpdate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image_url } = req.body;

    // Verify product exists
    const existing = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updated = await prisma.product.update({
      where: { id: String(id) },
      data: {
        title,
        description,
        price,
        category,
        image_url,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product details' });
  }
});

/**
 * DELETE /api/products/:id
 * Remove a product listing
 * PROTECTED (Admin session verified)
 */
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!existing) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await prisma.product.delete({ where: { id: String(id) } });
    res.json({ message: 'Product successfully deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product listing' });
  }
});

export default router;
