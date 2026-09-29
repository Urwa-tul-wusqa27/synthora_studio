import React, { useState } from 'react';
import { useStudioStore } from '../../store/studioStore';
import { exportSchemaConfigurationJSON, parseSchemaJSON, triggerDownload } from '../../lib/export';
import {
  Download,
  Upload,
  Copy,
  Check,
  X,
  FileCode,
  Sparkles,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchemaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaManagerModal: React.FC<SchemaManagerModalProps> = ({ isOpen, onClose }) => {
  const { tabularFields, seed, recordCount, setTabularFields, setRecordCount, setSeed, theme } =
    useStudioStore();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [schemaName, setSchemaName] = useState('my_synthetic_schema');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
    fieldsCount?: number;
  } | null>(null);

  if (!isOpen) return null;

  const currentExportJson = exportSchemaConfigurationJSON({
    name: schemaName,
    seed,
    recordCount,
    fields: tabularFields,
  });

  const handleDownloadSchema = () => {
    triggerDownload(currentExportJson, `${schemaName || 'schema'}.json`, 'application/json');
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(currentExportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      validateAndPreviewImport(content);
    };
    reader.readAsText(file);
  };

  const validateAndPreviewImport = (raw: string) => {
    const res = parseSchemaJSON(raw);
    if (res.success && res.data) {
      setImportStatus({
        success: true,
        message: `Valid Schema: "${res.data.name}" with ${res.data.fields.length} columns ready to apply.`,
        fieldsCount: res.data.fields.length,
      });
    } else {
      setImportStatus({
        success: false,
        message: res.error || 'Invalid JSON format.',
      });
    }
  };

  const handleApplyImportedSchema = () => {
    const res = parseSchemaJSON(importJsonText);
    if (res.success && res.data) {
      setTabularFields(res.data.fields);
      setRecordCount(res.data.recordCount);
      setSeed(res.data.seed);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
      } catch {}
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Schema Manager</h3>
              <p className="text-xs text-slate-500">Save, reuse, and share your synthetic data structures</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 dark:border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Schema JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-[1px] ${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import / Reuse Schema</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Schema File Name
                  </label>
                  <input
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={handleCopySchema}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSchema}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Schema JSON</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Schema Definition Preview ({tabularFields.length} Columns)
                </label>
                <pre className="p-3.5 rounded-xl border font-mono text-[11px] leading-relaxed overflow-x-auto max-h-64 bg-slate-950 text-slate-200 border-slate-800">
                  {currentExportJson}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload a previously saved <code className="font-mono text-blue-500">.json</code> schema file or paste raw schema JSON to instantly configure the studio with your exact field definitions.
              </p>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed rounded-xl p-5 text-center border-slate-300 dark:border-slate-800 hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-950/40">
                <Upload className="w-7 h-7 mx-auto text-blue-600 mb-2 opacity-80" />
                <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                  <span>Click to browse and upload JSON file</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">Accepts any Synthora schema JSON</p>
              </div>

              {/* Or Paste Area */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Or Paste Schema JSON Directly:
                </label>
                <textarea
                  rows={5}
                  value={importJsonText}
                  onChange={(e) => {
                    setImportJsonText(e.target.value);
                    validateAndPreviewImport(e.target.value);
                  }}
                  placeholder='Paste {"version": "1.0", "schema": { "fields": [...] }}'
                  className="w-full p-3 text-xs font-mono rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Validation Status */}
              {importStatus && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    importStatus.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {importStatus.success ? (
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{importStatus.message}</span>
                  </div>

                  {importStatus.success && (
                    <button
                      onClick={handleApplyImportedSchema}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                    >
                      Apply Schema
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
