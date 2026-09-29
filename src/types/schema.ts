export type FieldType =
  | 'uuid'
  | 'string'
  | 'full_name'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'integer_cents'
  | 'number'
  | 'float'
  | 'boolean'
  | 'date'
  | 'timestamp'
  | 'status'
  | 'country'
  | 'city'
  | 'address'
  | 'zip_code'
  | 'company'
  | 'job_title'
  | 'phone'
  | 'ip_address'
  | 'enum';

export interface TabularField {
  id: string;
  name: string;
  type: FieldType;
  nullRate: number; // 0 to 100 percentage
  outlierRate: number; // 0 to 20 percentage
  enumValues?: string[];
  min?: number;
  max?: number;
  prefix?: string;
}

export type ProblemPainId =
  | 'privacy'
  | 'scarce_data'
  | 'slow_access'
  | 'edge_cases'
  | 'relational'
  | 'documents';

export interface ProblemPreset {
  id: ProblemPainId;
  title: string;
  subtitle: string;
  painDescription: string;
  tagline: string;
  targetDomain: 'tabular' | 'relational' | 'documents';
  recommendedSeed: number;
  recommendedCount: number;
  fields?: TabularField[];
  badge: string;
  samplePrompt: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface CustomerRow {
  customer_id: string;
  full_name: string;
  email: string;
  country: string;
  signup_date: string;
  customer_tier: 'Standard' | 'Pro' | 'Enterprise';
}

export interface OrderRow {
  order_id: string;
  customer_id: string; // Foreign Key
  order_date: string;
  fulfillment_status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shipping_cents: number;
  currency: string;
}

export interface OrderItemRow {
  item_id: string;
  order_id: string; // Foreign Key
  product_name: string;
  sku: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number; // quantity * unit_price_cents
}

export interface RelationalDataset {
  customers: CustomerRow[];
  orders: OrderRow[];
  orderItems: OrderItemRow[];
  summary: {
    totalCustomers: number;
    totalOrders: number;
    totalItems: number;
    referentialIntegrityRate: number; // 100%
    orphanCount: number; // 0
  };
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface InvoiceDocument {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  vendor: {
    name: string;
    street: string;
    cityStateZip: string;
    taxId: string;
    iban: string;
  };
  client: {
    name: string;
    contactPerson: string;
    street: string;
    cityStateZip: string;
    email: string;
  };
  items: InvoiceLineItem[];
  subtotalCents: number;
  taxRatePercent: number;
  taxCents: number;
  discountCents: number;
  grandTotalCents: number;
  paymentTerms: string;
  notes: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  type: 'debit' | 'credit';
  amountCents: number;
  runningBalanceCents: number;
}

export interface BankStatementDocument {
  accountHolder: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
  bic: string;
  periodStart: string;
  periodEnd: string;
  currency: string;
  openingBalanceCents: number;
  closingBalanceCents: number;
  totalDebitsCents: number;
  totalCreditsCents: number;
  transactions: BankTransaction[];
}
