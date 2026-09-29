import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProblemPainId, TabularField } from '../types/schema';
import { DEFAULT_TABULAR_FIELDS, PROBLEM_PRESETS } from '../lib/presets';

export type StudioView = 'landing' | 'tabular' | 'relational' | 'documents' | 'ai_prompt';

interface StudioState {
  // Persisted state
  seed: number;
  recordCount: number;
  activePresetId: ProblemPainId | null;
  tabularFields: TabularField[];
  theme: 'dark' | 'light';
  tableName: string;
  hasSeenWalkthrough: boolean;

  // Transient state
  isWalkthroughOpen: boolean;
  currentView: StudioView;
  searchFilter: string;
  selectedTableTab: 'customers' | 'orders' | 'orderItems';
  selectedDocTab: 'invoice' | 'statement';

  // Actions
  setSeed: (seed: number) => void;
  randomizeSeed: () => void;
  setRecordCount: (count: number) => void;
  setCurrentView: (view: StudioView) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setTableName: (name: string) => void;
  applyPreset: (presetId: ProblemPainId) => void;
  setTabularFields: (fields: TabularField[]) => void;
  updateField: (id: string, updates: Partial<TabularField>) => void;
  addField: (field: TabularField) => void;
  removeField: (id: string) => void;
  resetDefaultFields: () => void;
  setSearchFilter: (filter: string) => void;
  setSelectedTableTab: (tab: 'customers' | 'orders' | 'orderItems') => void;
  setSelectedDocTab: (tab: 'invoice' | 'statement') => void;
  walkthroughStep: number;
  openWalkthrough: (stepIndex?: number) => void;
  closeWalkthrough: () => void;
  setCustomSchema: (name: string, fields: TabularField[], count?: number) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      seed: 42,
      recordCount: 50,
      activePresetId: null,
      tabularFields: DEFAULT_TABULAR_FIELDS,
      theme: 'dark', // Default to sleek dark mode when anyone enters or opens the app
      tableName: 'custom_test_schema',
      hasSeenWalkthrough: false,

      isWalkthroughOpen: false, // Default false so app lands directly on overview page without modal
      walkthroughStep: 0,
      currentView: 'landing', // Directly lands on Overview/Landing page
      searchFilter: '',
      selectedTableTab: 'customers',
      selectedDocTab: 'invoice',

      setSeed: (seed) => set({ seed }),
      randomizeSeed: () => set({ seed: Math.floor(Math.random() * 900000) + 100000 }),
      setRecordCount: (recordCount) => set({ recordCount }),
      setCurrentView: (currentView) => set({ currentView }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTableName: (tableName) => set({ tableName }),

      openWalkthrough: (stepIndex?: number) =>
        set({
          isWalkthroughOpen: true,
          walkthroughStep: typeof stepIndex === 'number' ? stepIndex : 0,
        }),
      closeWalkthrough: () => set({ isWalkthroughOpen: false, hasSeenWalkthrough: true }),

      setCustomSchema: (name, fields, count) =>
        set((state) => ({
          tableName: name || 'custom_dataset',
          tabularFields: fields,
          recordCount: count || state.recordCount,
          activePresetId: null,
          currentView: 'tabular',
        })),

      applyPreset: (presetId: ProblemPainId) => {
        const preset = PROBLEM_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;

        if (preset.targetDomain === 'tabular' && preset.fields) {
          set({
            activePresetId: presetId,
            tableName: preset.id,
            seed: preset.recommendedSeed,
            recordCount: preset.recommendedCount,
            tabularFields: [...preset.fields],
            currentView: 'tabular',
          });
        } else if (preset.targetDomain === 'relational') {
          set({
            activePresetId: presetId,
            seed: preset.recommendedSeed,
            recordCount: preset.recommendedCount,
            currentView: 'relational',
          });
        } else if (preset.targetDomain === 'documents') {
          set({
            activePresetId: presetId,
            seed: preset.recommendedSeed,
            currentView: 'documents',
          });
        }
      },

      setTabularFields: (fields) => set({ tabularFields: fields }),

      updateField: (id, updates) =>
        set((state) => ({
          tabularFields: state.tabularFields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

      addField: (field) =>
        set((state) => ({
          tabularFields: [...state.tabularFields, field],
        })),

      removeField: (id) =>
        set((state) => ({
          tabularFields: state.tabularFields.filter((f) => f.id !== id),
        })),

      resetDefaultFields: () =>
        set({
          tableName: 'custom_test_schema',
          tabularFields: DEFAULT_TABULAR_FIELDS,
          activePresetId: null,
        }),

      setSearchFilter: (searchFilter) => set({ searchFilter }),
      setSelectedTableTab: (selectedTableTab) => set({ selectedTableTab }),
      setSelectedDocTab: (selectedDocTab) => set({ selectedDocTab }),
    }),
    {
      name: 'synthora-studio-store',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState || {}) as Record<string, unknown>;
        if (version < 2) {
          return {
            ...state,
            theme: 'dark',
          };
        }
        return state;
      },
      partialize: (state) => ({
        seed: state.seed,
        recordCount: state.recordCount,
        activePresetId: state.activePresetId,
        tabularFields: state.tabularFields,
        theme: state.theme,
        tableName: state.tableName,
        hasSeenWalkthrough: state.hasSeenWalkthrough,
      }),
    }
  )
);
