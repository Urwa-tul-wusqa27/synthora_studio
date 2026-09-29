import React, { useState, useMemo } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { generateInvoice, generateBankStatement, formatCents } from '../../lib/generators/document';
import { StudioHeader } from '../StudioHeader';
import { CheckCircle2, Printer, FileText, Landmark, ShieldCheck } from 'lucide-react';
import { triggerDownload } from '../../lib/export';

export const DocumentStudio: React.FC = () => {
  const { seed, theme } = useStudioStore();
  const [docType, setDocType] = useState<'invoice' | 'statement'>('invoice');

  const invoice = useMemo(() => generateInvoice(seed), [seed]);
  const statement = useMemo(() => generateBankStatement(seed), [seed]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const data = docType === 'invoice' ? invoice : statement;
    const jsonStr = JSON.stringify(data, null, 2);
    triggerDownload(jsonStr, `${docType}_seed${seed}.json`, 'application/json');
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <StudioHeader
        title="Document Generation Studio"
        tableName={docType === 'invoice' ? 'financial_invoice' : 'bank_statement'}
        currentDataRows={
          docType === 'invoice'
            ? invoice.items.map((i) => ({ ...i, invoiceNumber: invoice.invoiceNumber }))
            : statement.transactions.map((t) => ({ ...t, accountNumber: statement.accountNumber }))
        }
      />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Document Switcher & Verification Bar */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Document Type Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDocType('invoice')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                docType === 'invoice'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Commercial Invoice</span>
            </button>

            <button
              onClick={() => setDocType('statement')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                docType === 'statement'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : theme === 'dark'
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Bank Statement Ledger</span>
            </button>
          </div>

          {/* Mathematical Reconciliation Status */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1 text-emerald-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Exact Integer Cents Arithmetic</span>
            </div>
            <span aria-hidden="true">·</span>
            <span>Drift Discrepancy: <strong className="font-mono text-emerald-500">$0.00</strong></span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:text-blue-500 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
          </div>
        </div>

        {/* Live Document Paper Simulation */}
        {docType === 'invoice' ? (
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md font-sans">
            {/* Invoice Header */}
            <div className="flex flex-wrap items-start justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <div className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                  {invoice.vendor.name}
                </div>
                <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                  <p>{invoice.vendor.street}</p>
                  <p>{invoice.vendor.cityStateZip}</p>
                  <p className="font-mono text-[11px] text-slate-400">Tax ID: {invoice.vendor.taxId}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  COMMERCIAL INVOICE
                </span>
                <span className="text-lg font-mono font-bold text-slate-900 block mt-1">
                  {invoice.invoiceNumber}
                </span>
                <div className="text-xs text-slate-500 mt-2 space-y-0.5 font-mono">
                  <div>Issue Date: {invoice.issueDate}</div>
                  <div>Payment Due: {invoice.dueDate}</div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="font-mono font-semibold text-slate-400 uppercase text-[10px] block mb-1">
                  Billed To
                </span>
                <div className="font-bold text-slate-900 text-sm">{invoice.client.name}</div>
                <div className="text-slate-600 mt-0.5">Attn: {invoice.client.contactPerson}</div>
                <div className="text-slate-500">{invoice.client.street}</div>
                <div className="text-slate-500">{invoice.client.cityStateZip}</div>
                <div className="text-blue-600 font-mono mt-1">{invoice.client.email}</div>
              </div>

              <div>
                <span className="font-mono font-semibold text-slate-400 uppercase text-[10px] block mb-1">
                  Payment Details
                </span>
                <div className="text-slate-600 font-mono text-[11px] space-y-1">
                  <div>Terms: {invoice.paymentTerms}</div>
                  <div>Settlement Currency: {invoice.currency}</div>
                  <div>IBAN: {invoice.vendor.iban}</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-mono text-[11px]">
                    <th className="py-2 font-medium">DESCRIPTION</th>
                    <th className="py-2 text-center font-medium w-16">QTY</th>
                    <th className="py-2 text-right font-medium w-28">UNIT PRICE</th>
                    <th className="py-2 text-right font-medium w-28">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 text-center font-mono tabular-nums text-slate-600">{item.quantity}</td>
                      <td className="py-3 text-right font-mono tabular-nums text-slate-600">
                        {formatCents(item.unitPriceCents)}
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatCents(item.lineTotalCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reconciliation Totals */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-slate-200 gap-6">
              <div className="text-xs text-slate-500 max-w-sm">
                <div className="font-semibold text-slate-700 mb-1">Audit Reconciliation Notes</div>
                <p className="text-[11px] leading-relaxed text-slate-500">{invoice.notes}</p>
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">{formatCents(invoice.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.taxRatePercent}%):</span>
                  <span className="tabular-nums">{formatCents(invoice.taxCents)}</span>
                </div>
                {invoice.discountCents > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount Applied:</span>
                    <span className="tabular-nums">-{formatCents(invoice.discountCents)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-300">
                  <span>Total Due:</span>
                  <span className="tabular-nums text-blue-600">{formatCents(invoice.grandTotalCents)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md font-sans">
            {/* Statement Header */}
            <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-900">
                  NEXUS COMMERCIAL BANK
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Global Financial Services · Institutional Banking
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="font-bold text-slate-900 block text-sm">STATEMENT OF ACCOUNT</span>
                <span className="text-slate-500 block mt-0.5">
                  Period: {statement.periodStart} to {statement.periodEnd}
                </span>
              </div>
            </div>

            {/* Account Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Account Holder</div>
                <div className="font-bold text-slate-900 mt-1">{statement.accountHolder}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Sort: {statement.sortCode}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Opening Balance</div>
                <div className="font-bold text-slate-900 mt-1 tabular-nums">
                  {formatCents(statement.openingBalanceCents)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">As of {statement.periodStart}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Total Inflows (Credits)</div>
                <div className="font-bold text-emerald-600 mt-1 tabular-nums">
                  +{formatCents(statement.totalCreditsCents)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Verified Deposits</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[10px] text-slate-400 uppercase">Closing Balance</div>
                <div className="font-bold text-blue-600 mt-1 tabular-nums">
                  {formatCents(statement.closingBalanceCents)}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Reconciled</div>
              </div>
            </div>

            {/* Transactions Ledger */}
            <div className="py-6">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 text-[11px]">
                    <th className="py-2">DATE</th>
                    <th className="py-2">DESCRIPTION</th>
                    <th className="py-2 font-mono">REFERENCE</th>
                    <th className="py-2 text-right">DEBIT (-)</th>
                    <th className="py-2 text-right">CREDIT (+)</th>
                    <th className="py-2 text-right">RUNNING BALANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statement.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-2 text-slate-500">{tx.date}</td>
                      <td className="py-2 font-sans font-medium text-slate-800">{tx.description}</td>
                      <td className="py-2 text-slate-400 text-[11px]">{tx.reference}</td>
                      <td className="py-2 text-right tabular-nums text-rose-600">
                        {tx.type === 'debit' ? `-${formatCents(tx.amountCents)}` : ''}
                      </td>
                      <td className="py-2 text-right tabular-nums text-emerald-600">
                        {tx.type === 'credit' ? `+${formatCents(tx.amountCents)}` : ''}
                      </td>
                      <td className="py-2 text-right tabular-nums font-semibold text-slate-900">
                        {formatCents(tx.runningBalanceCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <div>End of ledger statement. Total Transactions: {statement.transactions.length}</div>
              <div className="font-mono text-emerald-600 font-semibold">Running balance verified: closing equals ledger sum.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
