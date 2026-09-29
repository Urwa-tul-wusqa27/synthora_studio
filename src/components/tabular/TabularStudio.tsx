import React, { useState, useMemo } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { generateTabularData } from '../../lib/generators/tabular';
import { StudioHeader } from '../StudioHeader';
import { TabularField, FieldType } from '../../types/schema';
import {
  Plus,
  Trash2,
  Settings2,
  Sliders,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  FileCode,
  Download,
  Upload,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { formatCents } from '../../lib/generators/document';
import { SchemaManagerModal } from '../schema/SchemaManagerModal';
import { RuleBasedSchemaParser } from '../../lib/ai/ruleParser';
import confetti from 'canvas-confetti';

const AVAILABLE_TYPES: { type: FieldType; label: string }[] = [
  { type: 'uuid', label: 'UUID Identifier (e.g. 550e8400...)' },
  { type: 'string', label: 'Sequential String (e.g. USR-001)' },
  { type: 'full_name', label: 'Person Full Name' },
  { type: 'first_name', label: 'First Name' },
  { type: 'last_name', label: 'Last Name' },
  { type: 'email', label: 'Email Address' },
  { type: 'integer_cents', label: 'Money (Cents - e.g. $1,450.00)' },
  { type: 'number', label: 'Integer Count (1 to 1000)' },
  { type: 'float', label: 'Decimal / Float (e.g. 98.4)' },
  { type: 'boolean', label: 'Boolean Flag (true / false)' },
  { type: 'date', label: 'Date (YYYY-MM-DD)' },
  { type: 'timestamp', label: 'ISO Timestamp' },
  { type: 'status', label: 'Lifecycle Status (Active, Pending...)' },
  { type: 'country', label: 'Country' },
  { type: 'city', label: 'City' },
  { type: 'address', label: 'Street Address' },
  { type: 'zip_code', label: 'Postal Code' },
  { type: 'company', label: 'Company / Organization' },
  { type: 'job_title', label: 'Job Role / Title' },
  { type: 'phone', label: 'Phone Number' },
  { type: 'ip_address', label: 'IPv4 Address' },
  { type: 'enum', label: 'Custom Picklist / Enum' },
];

export const TabularStudio: React.FC = () => {
  const {
    seed,
    recordCount,
    setRecordCount,
    tabularFields,
    setTabularFields,
    theme,
    tableName,
    setTableName,
    updateField,
    addField,
    removeField,
    resetDefaultFields,
  } = useStudioStore();

  const [isSchemaDrawerOpen, setIsSchemaDrawerOpen] = useState(false); // Hidden/collapsed by default, opens on user click
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isPromptParsing, setIsPromptParsing] = useState(false);
  const pageSize = 15;

  // Generate deterministic dataset based on seed, count, and fields
  const generated = useMemo(() => {
    return generateTabularData(tabularFields, recordCount, seed);
  }, [tabularFields, recordCount, seed]);

  // Client-side search filtering
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return generated.rows;
    const q = searchQuery.toLowerCase();
    return generated.rows.filter((row) =>
      Object.entries(row).some(([k, v]) => {
        if (k === '_id' || v === null || v === undefined) return false;
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [generated.rows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const handleAddNewColumn = () => {
    const newField: TabularField = {
      id: `col_${Date.now()}`,
      name: `custom_field_${tabularFields.length + 1}`,
      type: 'string',
      nullRate: 0,
      outlierRate: 0,
    };
    addField(newField);
    setIsSchemaDrawerOpen(true);
  };

  const handleSynthesizeFromPrompt = async () => {
    if (!promptInput.trim() || isPromptParsing) return;
    setIsPromptParsing(true);
    try {
      const parser = new RuleBasedSchemaParser();
      const res = await parser.parsePrompt(promptInput);
      setTabularFields(res.fields);
      setRecordCount(res.detectedCount);
      setTableName(res.detectedDomain.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      setPromptInput('');
      setIsSchemaDrawerOpen(true);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsPromptParsing(false);
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <StudioHeader
        title={`Custom Schema: ${tableName}`}
        tableName={tableName}
        currentDataRows={generated.rows}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-6">
        {/* Custom Schema Definition Header Bar */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800 shadow-md'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            {/* Table Name Customizer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                    Your Test Table:
                  </span>
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="font-mono font-bold text-base bg-transparent border-b border-slate-300 dark:border-slate-700 hover:border-blue-500 focus:border-blue-600 focus:outline-none px-1 text-slate-900 dark:text-white"
                    placeholder="table_name"
                    title="Click to rename your test table"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Define your own columns and data types below to validate your exact test cases.
                </p>
              </div>
            </div>

            {/* Quick Actions: Save/Reuse Schema JSON & Toggle Editor */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => setIsSchemaModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                <span>Save / Reuse Schema JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSchemaDrawerOpen(!isSchemaDrawerOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSchemaDrawerOpen
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-950 dark:hover:text-white shadow-2xs'
                }`}
                aria-expanded={isSchemaDrawerOpen}
              >
                <Sliders className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>{isSchemaDrawerOpen ? 'Hide Column Editor' : `Edit Columns (${tabularFields.length})`}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isSchemaDrawerOpen ? 'rotate-180 text-white' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Natural Language Prompt to Schema Input Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch gap-2.5">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSynthesizeFromPrompt();
              }}
              placeholder="Tell Synthora your schema: e.g. '50 patient records with blood type, admitted date, and doctor name'..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
            <button
              onClick={handleSynthesizeFromPrompt}
              disabled={isPromptParsing || !promptInput.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl transition-all whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPromptParsing ? 'Parsing Schema...' : 'Tell Schema & Generate'}</span>
            </button>
          </div>
        </div>

        {/* Custom Column Builder (When Open) */}
        {isSchemaDrawerOpen && (
          <div
            className={`p-5 rounded-2xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  COLUMN DEFINITIONS ({tabularFields.length} CUSTOM COLUMNS)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetDefaultFields}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleAddNewColumn}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Custom Column</span>
                </button>
              </div>
            </div>

            {/* Grid of Custom Column Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {tabularFields.map((field, idx) => (
                <div
                  key={field.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col justify-between gap-3 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Column Name & Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">#{idx + 1}</span>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className="font-mono font-bold text-xs bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:outline-none w-full text-slate-900 dark:text-white"
                        placeholder="column_name"
                      />
                    </div>
                    {tabularFields.length > 1 && (
                      <button
                        onClick={() => removeField(field.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete column"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Type Selector */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                      Data Generator Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                      className="w-full rounded-lg px-2.5 py-1.5 text-xs border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {AVAILABLE_TYPES.map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Edge Case Controls: Null Rate & Outliers */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div>
                      <div className="flex justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>Null Rate</span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {field.nullRate}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="5"
                        value={field.nullRate}
                        onChange={(e) => updateField(field.id, { nullRate: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-600 h-1.5 cursor-pointer"
                        title="Inject missing values to test dirty feeds"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>Outlier Rate</span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                          {field.outlierRate}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="2"
                        value={field.outlierRate}
                        onChange={(e) => updateField(field.id, { outlierRate: parseInt(e.target.value, 10) })}
                        className="w-full accent-rose-600 h-1.5 cursor-pointer"
                        title="Inject boundary edge-case values"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Data Grid Section with High-Contrast Light Mode */}
        <div
          className={`rounded-2xl border flex-1 flex flex-col overflow-hidden shadow-sm transition-all ${
            theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{generated.count} Valid Records Generated</span>
              </span>
              <span className="text-slate-400">·</span>
              <span>Generated in <strong className="font-mono text-blue-600 dark:text-blue-400">{generated.generationTimeMs}ms</strong></span>
              <span className="text-slate-400">·</span>
              <span>Nulls: <strong className="font-mono text-amber-600">{generated.qualityMetrics.nullCells} cells</strong></span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-xl border px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Filter generated rows..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent focus:outline-none w-44 sm:w-56 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-slate-100/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <th className="py-2.5 px-3 font-bold w-12 text-center text-slate-500">#</th>
                  {tabularFields.map((field) => (
                    <th key={field.id} className="py-2.5 px-3 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 dark:text-white">{field.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({field.type})</span>
                        {field.nullRate > 0 && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                            null:{field.nullRate}%
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans text-slate-900 dark:text-slate-100">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={tabularFields.length + 1} className="py-12 text-center text-slate-500">
                      No matching rows found. Try adjusting your search query.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr
                      key={row._id}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-400 tabular-nums">
                        {row._id}
                      </td>
                      {tabularFields.map((field) => {
                        const val = row[field.name];
                        return (
                          <td key={field.id} className="py-2.5 px-3 whitespace-nowrap">
                            {renderCellContent(val, field)}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60">
            <div>
              Showing <span className="font-mono font-bold text-slate-900 dark:text-white">{paginatedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {Math.min(currentPage * pageSize, filteredRows.length)}
              </span>{' '}
              of <span className="font-mono font-bold text-slate-900 dark:text-white">{filteredRows.length}</span> rows
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SchemaManagerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />
    </div>
  );
};

function renderCellContent(val: any, field: TabularField) {
  if (val === null || val === undefined) {
    return <span className="font-mono text-amber-600 dark:text-amber-400 font-bold italic text-[11px]">&lt;null&gt;</span>;
  }

  if (field.type === 'integer_cents' && typeof val === 'number') {
    return <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">{formatCents(val)}</span>;
  }

  if (field.type === 'uuid') {
    return <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{val}</span>;
  }

  if (field.type === 'boolean') {
    return (
      <span className={`font-mono text-[11px] font-bold ${val ? 'text-emerald-600' : 'text-slate-500'}`}>
        {val ? 'TRUE' : 'FALSE'}
      </span>
    );
  }

  if (field.type === 'status') {
    return <span className="font-semibold text-blue-600 dark:text-blue-400">{val}</span>;
  }

  if (typeof val === 'number') {
    return <span className="font-mono tabular-nums font-medium">{val}</span>;
  }

  return <span>{String(val)}</span>;
}
