import { Express, Request, Response } from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { calculateCouponDiscount } from '../src/lib/couponLogic'; // Adjust path if needed

export function registerCouponRoutes(
  app: Express,
  db: any,
  authenticateUser: any,
  requireRole: any
) {
  // POST /api/admin/coupons (Create)
  app.post('/api/admin/coupons', authenticateUser, requireRole(['owner', 'manager']), async (req: Request, res: Response) => {
    try {
      const { code, discount_type, discount_value, applies_to } = req.body;
      const couponRef = db.collection('coupons').doc(code.toUpperCase());
      const snapshot = await couponRef.get();
      if (snapshot.exists) {
        return res.status(400).json({ error: 'Coupon code already exists' });
      }

      await couponRef.set({
        ...req.body,
        code: code.toUpperCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'DRAFT',
        used_count: 0
      });

      res.status(201).json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // GET /api/admin/coupons (List)
  app.get('/api/admin/coupons', authenticateUser, requireRole(['owner', 'manager']), async (req: Request, res: Response) => {
    try {
      const snapshot = await db.collection('coupons').get();
      const coupons = snapshot.docs.map((doc: any) => doc.data());
      res.json(coupons);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST /api/cart/apply-coupon (Customer)
  app.post('/api/cart/apply-coupon', authenticateUser, async (req: Request, res: Response) => {
    // 1. Get cart
    // 2. Fetch coupon
    // 3. Use calculateCouponDiscount to calculate discount
    // 4. Return result
  });
}
