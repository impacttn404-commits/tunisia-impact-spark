import { describe, it, expect } from 'vitest';
import { marketplaceProductSchema } from '../marketplace';

describe('marketplace validation schemas', () => {
  describe('marketplaceProductSchema', () => {
    it('should validate correct product data', () => {
      const validProduct = {
        title: 'Premium Consulting',
        description: 'Professional consulting services for your project with expert guidance.',
        price_tokens: 500,
        category: 'service',
        stock_quantity: 10,
      };

      const result = marketplaceProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject short title', () => {
      const invalidProduct = {
        title: 'Ab',
        description: 'Professional consulting services for your project with expert guidance.',
        price_tokens: 500,
        category: 'service',
        stock_quantity: 10,
      };

      const result = marketplaceProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 3 caractères');
      }
    });

    it('should reject short description', () => {
      const invalidProduct = {
        title: 'Premium Consulting',
        description: 'Short',
        price_tokens: 500,
        category: 'service',
        stock_quantity: 10,
      };

      const result = marketplaceProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 10 caractères');
      }
    });

    it('should reject negative price', () => {
      const invalidProduct = {
        title: 'Premium Consulting',
        description: 'Professional consulting services for your project with expert guidance.',
        price_tokens: -100,
        category: 'service',
        stock_quantity: 10,
      };

      const result = marketplaceProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positif');
      }
    });

    it('should reject missing prices', () => {
      const invalidProduct = {
        title: 'Premium Consulting',
        description: 'Professional consulting services for your project with expert guidance.',
        category: 'service',
        stock_quantity: 10,
      };

      const result = marketplaceProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('prix');
      }
    });

    it('should accept valid categories', () => {
      const categories = ['service', 'product', 'formation'];
      
      categories.forEach(category => {
        const validProduct = {
          title: 'Test Product',
          description: 'A valid description with enough characters to pass validation.',
          price_tokens: 100,
          category,
          stock_quantity: 10,
        };

        const result = marketplaceProductSchema.safeParse(validProduct);
        expect(result.success).toBe(true);
      });
    });

    it('should handle optional image_url', () => {
      const productWithImage = {
        title: 'Premium Consulting',
        description: 'Professional consulting services for your project with expert guidance.',
        price_tokens: 500,
        category: 'service',
        stock_quantity: 10,
        image_url: 'https://example.com/image.jpg',
      };

      const result = marketplaceProductSchema.safeParse(productWithImage);
      expect(result.success).toBe(true);
    });
  });
});
