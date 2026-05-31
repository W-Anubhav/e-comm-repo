import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Zod validation schema for Products
 * Ensures fields conform to strict business rules and block malicious injection vectors
 */
export const productSchema = z.object({
  title: z.string()
    .trim()
    .min(2, 'Title must be at least 2 characters long')
    .max(80, 'Title cannot exceed 80 characters')
    .regex(/^[^<>]*$/, 'HTML tags are not allowed in titles'), // Basic XSS check
  description: z.string()
    .trim()
    .min(2, 'Description must be at least 2 characters long')
    .max(1000, 'Description cannot exceed 1000 characters')
    .regex(/^[^<>]*$/, 'HTML tags are not allowed in descriptions'), // Basic XSS check
  price: z.number({ message: 'Price is required and must be a number' })
    .positive('Price must be a positive number')
    .max(1000000, 'Price cannot exceed 1,000,000 (INR)'),
  category: z.string()
    .trim()
    .min(2, 'Category must be at least 2 characters long')
    .max(40, 'Category cannot exceed 40 characters')
    .regex(/^[^<>]*$/, 'HTML tags are not allowed in categories'),
  image_url: z.string()
    .trim()
    .url('Image URL must be a valid HTTP or HTTPS URL')
    .regex(/^https:\/\/.*$/, 'Image URL must be served over secure HTTPS')
});

/**
 * Middleware to validate and sanitize product body schemas
 */
export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Coerce price string to number if submitted as form body
    if (typeof req.body.price === 'string') {
      const parsedPrice = parseFloat(req.body.price);
      if (!isNaN(parsedPrice)) {
        req.body.price = parsedPrice;
      }
    }
    
    // Parse, validate, and sanitize the fields
    const validatedBody = productSchema.parse(req.body);
    req.body = validatedBody;
    
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMap = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      res.status(400).json({ error: 'Input Validation Failed', details: errorMap });
      return;
    }
    res.status(500).json({ error: 'Internal validation failure' });
  }
};
export const productUpdateSchema = productSchema.partial();

export const validateProductUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (typeof req.body.price === 'string') {
      const parsedPrice = parseFloat(req.body.price);
      if (!isNaN(parsedPrice)) {
        req.body.price = parsedPrice;
      }
    }

    const validatedBody = productUpdateSchema.parse(req.body);
    req.body = validatedBody;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMap = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      res.status(400).json({ error: 'Input Validation Failed', details: errorMap });
      return;
    }
    res.status(500).json({ error: 'Internal validation failure' });
  }
};
