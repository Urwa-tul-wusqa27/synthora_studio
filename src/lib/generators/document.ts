import { MulberryPRNG } from '../prng';
import {
  InvoiceDocument,
  InvoiceLineItem,
  BankStatementDocument,
  BankTransaction,
} from '../../types/schema';
import {
  COMPANIES,
  FIRST_NAMES,
  LAST_NAMES,
  STREETS,
  CITIES,
  COUNTRIES,
  INVOICE_PRODUCTS,
  BANK_TRANSACTIONS,
  EMAIL_DOMAINS,
} from '../dictionary';

export function generateInvoice(seed: number | string = 101): InvoiceDocument {
  const prng = new MulberryPRNG(seed);

  const vendorCompany = prng.pick(COMPANIES);
  const clientCompany = prng.pick(COMPANIES.filter((c) => c !== vendorCompany));
  const clientContact = `${prng.pick(FIRST_NAMES)} ${prng.pick(LAST_NAMES)}`;

  const invoiceNum = `INV-2026-${prng.nextInt(10040, 99999)}`;
  const issueDate = `2026-03-${String(prng.nextInt(1, 15)).padStart(2, '0')}`;
  const dueDate = `2026-04-${String(prng.nextInt(1, 15)).padStart(2, '0')}`;

  const numItems = prng.nextInt(3, 5);
  const items: InvoiceLineItem[] = [];
  let subtotalCents = 0;

  for (let i = 0; i < numItems; i++) {
    const product = prng.pick(INVOICE_PRODUCTS);
    const quantity = prng.nextInt(1, 4);
    const unitPriceCents = product.unitCents;
    const lineTotalCents = quantity * unitPriceCents;
    subtotalCents += lineTotalCents;

    items.push({
      id: `ITEM-${i + 1}`,
      description: product.desc,
      quantity,
      unitPriceCents,
      lineTotalCents,
    });
  }

  // Exact math in integer cents
  const taxRatePercent = 8.5;
  const taxCents = Math.round(subtotalCents * (taxRatePercent / 100));
  const discountCents = prng.boolean(0.4) ? prng.pick([5000, 10000, 25000]) : 0; // $50, $100, $250
  const grandTotalCents = subtotalCents + taxCents - discountCents;

  return {
    invoiceNumber: invoiceNum,
    issueDate,
    dueDate,
    currency: 'USD',
    vendor: {
      name: `${vendorCompany} Technologies Inc.`,
      street: `${prng.nextInt(100, 999)} ${prng.pick(STREETS)}`,
      cityStateZip: `${prng.pick(CITIES)}, CA 94107`,
      taxId: `US-EIN-${prng.nextInt(10, 99)}-${prng.nextInt(1000000, 9999999)}`,
      iban: `US33PRSM${prng.nextInt(1000000000, 9999999999)}`,
    },
    client: {
      name: clientCompany,
      contactPerson: clientContact,
      street: `${prng.nextInt(10, 899)} ${prng.pick(STREETS)}`,
      cityStateZip: `${prng.pick(CITIES)}, NY 10001`,
      email: `billing@${clientCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    },
    items,
    subtotalCents,
    taxRatePercent,
    taxCents,
    discountCents,
    grandTotalCents,
    paymentTerms: 'Net 30 Days. Late fees apply at 1.5% monthly.',
    notes: 'Generated via Synthora Document Engine. Integer cents verified; zero rounding drift.',
  };
}

export function generateBankStatement(seed: number | string = 202): BankStatementDocument {
  const prng = new MulberryPRNG(seed);

  const holderFirst = prng.pick(FIRST_NAMES);
  const holderLast = prng.pick(LAST_NAMES);
  const accountHolder = `${holderFirst} ${holderLast}`;
  const accountNumber = `${prng.nextInt(10000000, 99999999)}`;
  const sortCode = `${prng.nextInt(10, 99)}-${prng.nextInt(10, 99)}-${prng.nextInt(10, 99)}`;
  const iban = `GB29NEXU${sortCode.replace(/-/g, '')}${accountNumber}`;
  const bic = 'NEXUGB2L';

  const periodStart = '2026-02-01';
  const periodEnd = '2026-02-28';

  // Opening balance in integer cents, e.g. $42,500.00
  let currentBalanceCents = prng.nextInt(3500000, 6500000);
  const openingBalanceCents = currentBalanceCents;

  const numTransactions = prng.nextInt(10, 16);
  const transactions: BankTransaction[] = [];
  let totalDebitsCents = 0;
  let totalCreditsCents = 0;

  for (let i = 1; i <= numTransactions; i++) {
    const day = Math.min(28, Math.floor((i / numTransactions) * 27) + 1);
    const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
    const txFixture = prng.pick(BANK_TRANSACTIONS);
    const amountCents = prng.nextInt(txFixture.minCents, txFixture.maxCents);

    if (txFixture.type === 'credit') {
      currentBalanceCents += amountCents;
      totalCreditsCents += amountCents;
    } else {
      currentBalanceCents -= amountCents;
      totalDebitsCents += amountCents;
    }

    transactions.push({
      id: `TXN-${String(i).padStart(4, '0')}`,
      date: dateStr,
      description: txFixture.desc,
      reference: `REF-${prng.nextInt(10000, 99999)}`,
      type: txFixture.type as 'debit' | 'credit',
      amountCents,
      runningBalanceCents: currentBalanceCents, // Reconciled running balance
    });
  }

  return {
    accountHolder,
    accountNumber,
    sortCode,
    iban,
    bic,
    periodStart,
    periodEnd,
    currency: 'USD',
    openingBalanceCents,
    closingBalanceCents: currentBalanceCents, // Exactly matches final runningBalanceCents!
    totalDebitsCents,
    totalCreditsCents,
    transactions,
  };
}

export function formatCents(cents: number, currency: string = 'USD'): string {
  const isNegative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = (abs / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  return `${isNegative ? '-' : ''}${symbol}${dollars}`;
}
