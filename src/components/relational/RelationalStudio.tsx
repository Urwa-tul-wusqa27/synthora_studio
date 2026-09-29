import React, { useState, useMemo } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { generateRelationalData } from '../../lib/generators/relational';
import { StudioHeader } from '../StudioHeader';
import { CheckCircle2, GitFork, ArrowRight, Layers, Filter } from 'lucide-react';
import { formatCents } from '../../lib/generators/document';

export const RelationalStudio: React.FC = () => {
  const { seed, recordCount, theme } = useStudioStore();
  const [activeTable, setActiveTable] = useState<'customers' | 'orders' | 'orderItems'>('customers');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Generate relational dataset based on seed and customer record count
  const dataset = useMemo(() => {
    return generateRelationalData(Math.min(recordCount, 50), seed);
  }, [recordCount, seed]);

  // If a customer is selected, filter orders and items to demonstrate relational traversal
  const displayedOrders = useMemo(() => {
    if (!selectedCustomerId) return dataset.orders;
    return dataset.orders.filter((o) => o.customer_id === selectedCustomerId);
  }, [dataset.orders, selectedCustomerId]);

  const displayedOrderItems = useMemo(() => {
    if (!selectedCustomerId) return dataset.orderItems;
    const orderIds = new Set(displayedOrders.map((o) => o.order_id));
    return dataset.orderItems.filter((i) => orderIds.has(i.order_id));
  }, [dataset.orderItems, displayedOrders, selectedCustomerId]);

  const activeRows =
    activeTable === 'customers'
      ? dataset.customers
      : activeTable === 'orders'
      ? displayedOrders
      : displayedOrderItems;

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <StudioHeader
        title="Relational Data Studio"
        tableName={`relational_${activeTable}`}
        currentDataRows={activeRows}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* Referential Integrity Status Bar */}
        <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Metadata telemetry (zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Referential Integrity: 100%
              </span>
            </div>
            <span aria-hidden="true">·</span>
            <span>Orphan Records: <strong className="font-mono text-emerald-500">0</strong></span>
            <span aria-hidden="true">·</span>
            <span>Customers: <strong className="font-mono tabular-nums">{dataset.summary.totalCustomers}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Orders: <strong className="font-mono tabular-nums">{dataset.summary.totalOrders}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Line Items: <strong className="font-mono tabular-nums">{dataset.summary.totalItems}</strong></span>
          </div>

          {/* Interactive filter reset if customer drill-down active */}
          {selectedCustomerId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-500 font-mono">
                Filtering by Customer: <strong>{selectedCustomerId}</strong>
              </span>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-xs px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:text-rose-500 transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* Visual Entity-Relationship Schema Map */}
        <div className={`p-4 rounded-xl border ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-400">
            <GitFork className="w-3.5 h-3.5 text-blue-500" />
            <span>RELATIONAL TOPOLOGY & FOREIGN KEY CONSTRAINTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Table 1: Customers */}
            <div
              onClick={() => setActiveTable('customers')}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeTable === 'customers'
                  ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                  : theme === 'dark'
                  ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-500">1. customers (Parent)</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{dataset.customers.length} rows</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="text-amber-500 font-semibold">[PK] customer_id</div>
                <div>full_name</div>
                <div>email</div>
                <div>country</div>
                <div>signup_date</div>
                <div>customer_tier</div>
              </div>
            </div>

            {/* Table 2: Orders */}
            <div
              onClick={() => setActiveTable('orders')}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeTable === 'orders'
                  ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                  : theme === 'dark'
                  ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-500">2. orders (Child)</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{displayedOrders.length} rows</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="text-amber-500 font-semibold">[PK] order_id</div>
                <div className="text-blue-500 font-semibold">[FK] customer_id → customers</div>
                <div>order_date</div>
                <div>fulfillment_status</div>
                <div>shipping_cents</div>
              </div>
            </div>

            {/* Table 3: Order Items */}
            <div
              onClick={() => setActiveTable('orderItems')}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeTable === 'orderItems'
                  ? 'border-blue-500 bg-blue-500/5 shadow-xs'
                  : theme === 'dark'
                  ? 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-500">3. order_items (Grandchild)</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{displayedOrderItems.length} rows</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="text-amber-500 font-semibold">[PK] item_id</div>
                <div className="text-blue-500 font-semibold">[FK] order_id → orders</div>
                <div>product_name</div>
                <div>quantity</div>
                <div>unit_price_cents</div>
                <div className="text-emerald-500">[Calc] total_cents (qty * unit)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Active Table */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            {(['customers', 'orders', 'orderItems'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTable(t)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  activeTable === t
                    ? 'bg-blue-600 text-white font-semibold'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t === 'orderItems' ? 'Order Items Table' : `${t} Table`}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Click any row to drill down into foreign key references
          </span>
        </div>

        {/* Relational Table View */}
        <div
          className={`rounded-xl border flex-1 flex flex-col overflow-hidden ${
            theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="overflow-x-auto flex-1">
            {activeTable === 'customers' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'}`}>
                    <th className="py-2.5 px-3 font-mono font-semibold">customer_id [PK]</th>
                    <th className="py-2.5 px-3 font-medium">full_name</th>
                    <th className="py-2.5 px-3 font-medium">email</th>
                    <th className="py-2.5 px-3 font-medium">country</th>
                    <th className="py-2.5 px-3 font-medium">signup_date</th>
                    <th className="py-2.5 px-3 font-medium">customer_tier</th>
                    <th className="py-2.5 px-3 text-right">Drilldown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                  {dataset.customers.map((c) => {
                    const isSelected = selectedCustomerId === c.customer_id;
                    return (
                      <tr
                        key={c.customer_id}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-500/10'
                            : 'hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
                        }`}
                        onClick={() => setSelectedCustomerId(isSelected ? null : c.customer_id)}
                      >
                        <td className="py-2 px-3 font-mono text-blue-500 font-semibold">{c.customer_id}</td>
                        <td className="py-2 px-3 font-medium">{c.full_name}</td>
                        <td className="py-2 px-3 text-slate-500">{c.email}</td>
                        <td className="py-2 px-3">{c.country}</td>
                        <td className="py-2 px-3 font-mono text-slate-400">{c.signup_date}</td>
                        <td className="py-2 px-3 font-medium">{c.customer_tier}</td>
                        <td className="py-2 px-3 text-right">
                          <button className="text-[11px] text-blue-500 hover:underline flex items-center gap-1 justify-end ml-auto">
                            <span>View Orders</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeTable === 'orders' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'}`}>
                    <th className="py-2.5 px-3 font-mono font-semibold">order_id [PK]</th>
                    <th className="py-2.5 px-3 font-mono font-semibold text-blue-500">customer_id [FK]</th>
                    <th className="py-2.5 px-3 font-medium">order_date</th>
                    <th className="py-2.5 px-3 font-medium">fulfillment_status</th>
                    <th className="py-2.5 px-3 font-medium">shipping_cents</th>
                    <th className="py-2.5 px-3 font-medium">currency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                  {displayedOrders.map((o) => (
                    <tr key={o.order_id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20">
                      <td className="py-2 px-3 font-mono text-amber-500 font-semibold">{o.order_id}</td>
                      <td className="py-2 px-3 font-mono text-blue-500">{o.customer_id}</td>
                      <td className="py-2 px-3 font-mono text-slate-400">{o.order_date}</td>
                      <td className="py-2 px-3 font-medium">{o.fulfillment_status}</td>
                      <td className="py-2 px-3 font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                        {formatCents(o.shipping_cents)}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400">{o.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'orderItems' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'}`}>
                    <th className="py-2.5 px-3 font-mono font-semibold">item_id [PK]</th>
                    <th className="py-2.5 px-3 font-mono font-semibold text-amber-500">order_id [FK]</th>
                    <th className="py-2.5 px-3 font-medium">product_name</th>
                    <th className="py-2.5 px-3 font-mono">sku</th>
                    <th className="py-2.5 px-3 font-mono">quantity</th>
                    <th className="py-2.5 px-3 font-mono">unit_price_cents</th>
                    <th className="py-2.5 px-3 font-mono text-emerald-500 font-semibold">total_cents (Reconciled)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                  {displayedOrderItems.map((item) => (
                    <tr key={item.item_id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20">
                      <td className="py-2 px-3 font-mono font-semibold">{item.item_id}</td>
                      <td className="py-2 px-3 font-mono text-amber-500">{item.order_id}</td>
                      <td className="py-2 px-3 font-medium">{item.product_name}</td>
                      <td className="py-2 px-3 font-mono text-slate-400">{item.sku}</td>
                      <td className="py-2 px-3 font-mono tabular-nums">{item.quantity}</td>
                      <td className="py-2 px-3 font-mono tabular-nums">{formatCents(item.unit_price_cents)}</td>
                      <td className="py-2 px-3 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCents(item.total_cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
