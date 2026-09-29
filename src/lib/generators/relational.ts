import { MulberryPRNG } from '../prng';
import { CustomerRow, OrderRow, OrderItemRow, RelationalDataset } from '../../types/schema';
import { FIRST_NAMES, LAST_NAMES, EMAIL_DOMAINS, COUNTRIES, INVOICE_PRODUCTS } from '../dictionary';

export function generateRelationalData(
  customerCount: number = 25,
  seed: number | string = 42
): RelationalDataset {
  const prng = new MulberryPRNG(seed);

  const customers: CustomerRow[] = [];
  const orders: OrderRow[] = [];
  const orderItems: OrderItemRow[] = [];

  const tiers: ('Standard' | 'Pro' | 'Enterprise')[] = ['Standard', 'Pro', 'Enterprise'];
  const statuses: ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled')[] = [
    'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  ];

  // 1. Generate Customers (Parent Table)
  for (let i = 1; i <= customerCount; i++) {
    const custId = `CUST-${String(1000 + i)}`;
    const firstName = prng.pick(FIRST_NAMES);
    const lastName = prng.pick(LAST_NAMES);
    const domain = prng.pick(EMAIL_DOMAINS);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
    const country = prng.pick(COUNTRIES);
    const tier = prng.pick(tiers);

    const year = prng.nextInt(2023, 2025);
    const month = String(prng.nextInt(1, 12)).padStart(2, '0');
    const day = String(prng.nextInt(1, 28)).padStart(2, '0');
    const signupDate = `${year}-${month}-${day}`;

    customers.push({
      customer_id: custId,
      full_name: `${firstName} ${lastName}`,
      email,
      country,
      signup_date: signupDate,
      customer_tier: tier,
    });
  }

  // 2. Generate Orders (Child Table with FK -> customers.customer_id)
  let orderSeq = 5001;
  let itemSeq = 9001;

  for (const customer of customers) {
    // Each customer has between 1 and 4 orders
    const numOrders = prng.nextInt(1, 4);

    for (let o = 0; o < numOrders; o++) {
      const orderId = `ORD-${orderSeq++}`;
      const year = 2025;
      const month = String(prng.nextInt(1, 12)).padStart(2, '0');
      const day = String(prng.nextInt(1, 28)).padStart(2, '0');
      const orderDate = `${year}-${month}-${day}`;
      const status = prng.pick(statuses);
      const shippingCents = prng.pick([0, 1500, 2500, 4900]);

      orders.push({
        order_id: orderId,
        customer_id: customer.customer_id, // Strict FK consistency
        order_date: orderDate,
        fulfillment_status: status,
        shipping_cents: shippingCents,
        currency: 'USD',
      });

      // 3. Generate Order Items (Grandchild with FK -> orders.order_id)
      const numItems = prng.nextInt(1, 3);
      for (let k = 0; k < numItems; k++) {
        const itemId = `ITEM-${itemSeq++}`;
        const prod = prng.pick(INVOICE_PRODUCTS);
        const qty = prng.nextInt(1, 5);
        const unitCents = prod.unitCents;
        const totalCents = qty * unitCents; // Exact cents reconciliation

        orderItems.push({
          item_id: itemId,
          order_id: orderId, // Strict FK consistency
          product_name: prod.desc,
          sku: `SKU-${prng.nextInt(100, 999)}-${prng.pick(['X', 'PRO', 'ENT', 'MAX'])}`,
          quantity: qty,
          unit_price_cents: unitCents,
          total_cents: totalCents,
        });
      }
    }
  }

  // Verification & referential integrity validation
  const customerIdSet = new Set(customers.map((c) => c.customer_id));
  const orderIdSet = new Set(orders.map((o) => o.order_id));

  let orphanOrders = 0;
  for (const order of orders) {
    if (!customerIdSet.has(order.customer_id)) orphanOrders++;
  }

  let orphanItems = 0;
  for (const item of orderItems) {
    if (!orderIdSet.has(item.order_id)) orphanItems++;
  }

  const totalOrphans = orphanOrders + orphanItems;

  return {
    customers,
    orders,
    orderItems,
    summary: {
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalItems: orderItems.length,
      referentialIntegrityRate: totalOrphans === 0 ? 100 : 0,
      orphanCount: totalOrphans,
    },
  };
}
