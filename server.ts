import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { VEHICLES, VEHICLE_COLORS, WORKSHOP_SERVICES, WORKSHOP_STATUS } from './src/lib/dictionary';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/parse-schema', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt string is required' });
  }

  // Model fallback list (lightweight and fast first to avoid quota issues)
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
  let responseText: string | null = null;

  if (process.env.GEMINI_API_KEY) {
    const systemPrompt = `You are an expert database schema architect for Synthora Synthetic Data Studio.
User prompt: "${prompt}"

CRITICAL STRICT COLUMN RULE:
- If the user explicitly mentions specific columns or fields (e.g. "having vehicle name , color", "only vehicle name and color", "with columns x, y", "contains field1, field2"):
  YOU MUST ONLY OUTPUT THOSE EXACT COLUMNS!
  DO NOT add an 'id' column unless the user specifically asked for an id.
  DO NOT add, invent, or append ANY extra unrequested columns!
  Example: If the prompt is "a workshop managment system having vehicle name , color", the fields array MUST CONTAIN ONLY:
  1. "vehicle_name" (type: 'string', with realistic vehicle models in enumValues)
  2. "color" (type: 'enum', with realistic colors in enumValues)
  DO NOT add id, customer_name, license_plate, mechanic, cost, date, or status!

- ONLY if the prompt is purely generic with NO specific columns mentioned (e.g. just "workshop management system" or "hospital"), you may generate a realistic set of 5-8 standard domain columns.

Allowed field types:
- 'uuid'
- 'string'
- 'full_name'
- 'first_name'
- 'last_name'
- 'email'
- 'integer_cents'
- 'number'
- 'float'
- 'boolean'
- 'date'
- 'timestamp'
- 'status'
- 'country'
- 'city'
- 'address'
- 'zip_code'
- 'company'
- 'job_title'
- 'phone'
- 'ip_address'
- 'enum'

Rules:
1. Provide realistic enumValues where appropriate (e.g. for color: ["Midnight Black", "Pearl White", "Silver Metallic", "Deep Blue", "Crimson Red", "Graphite Gray"], for vehicle_name: ["Toyota Camry", "Honda Civic", "Ford F-150", "BMW 3 Series", "Tesla Model 3"]).
2. Detect the domain name and a clean snake_case tableName.
3. If user specifies record count (e.g. 50, 100), use that, otherwise default to 50.
4. Set nullRate: 0 unless user asks for nulls/dirty data.
5. Set outlierRate: 0 unless requested.`;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: systemPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                detectedDomain: { type: Type.STRING },
                tableName: { type: Type.STRING },
                detectedCount: { type: Type.INTEGER },
                inferredEntities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                description: { type: Type.STRING },
                fields: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      type: { type: Type.STRING },
                      nullRate: { type: Type.NUMBER },
                      outlierRate: { type: Type.NUMBER },
                      enumValues: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      min: { type: Type.NUMBER },
                      max: { type: Type.NUMBER },
                      prefix: { type: Type.STRING },
                    },
                    required: ['id', 'name', 'type', 'nullRate', 'outlierRate'],
                  },
                },
              },
              required: ['detectedDomain', 'tableName', 'detectedCount', 'fields'],
            },
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} encountered error or quota limit:`, err.message || err);
      }
    }
  }

  // If Gemini succeeded, return parsed result
  if (responseText) {
    try {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (parseErr) {
      console.warn('Failed to parse Gemini JSON output:', parseErr);
    }
  }

  // Graceful fallback to deterministic local extractor (Never fails on quota exhaustion)
  console.log('Using robust local semantic engine for prompt:', prompt);
  const fallbackResult = parseLocallyOnServer(prompt);
  return res.json(fallbackResult);
});

function parseLocallyOnServer(prompt: string) {
  const lower = prompt.toLowerCase();

  // Extract count
  let detectedCount = 50;
  const countMatch = lower.match(/\b(\d{1,4})\b/);
  if (countMatch && parseInt(countMatch[1], 10) > 0) {
    detectedCount = Math.min(1000, Math.max(5, parseInt(countMatch[1], 10)));
  }

  const explicitCols = extractExplicitColumns(prompt);

  // If user specified explicit columns, return ONLY those columns
  if (explicitCols.length > 0) {
    let detectedDomain = 'Custom Schema';
    let tableName = 'custom_dataset';

    if (lower.includes('workshop') || lower.includes('garage') || lower.includes('mechanic')) {
      detectedDomain = 'Workshop Management';
      tableName = 'workshop_management';
    } else if (lower.includes('vehicle') || lower.includes('car')) {
      detectedDomain = 'Vehicle Registry';
      tableName = 'vehicle_registry';
    } else if (lower.includes('patient') || lower.includes('hospital')) {
      detectedDomain = 'Healthcare';
      tableName = 'patient_records';
    } else if (lower.includes('school') || lower.includes('student')) {
      detectedDomain = 'Education';
      tableName = 'student_records';
    }

    const fields = explicitCols.map((colName, idx) => {
      const inferred = inferFieldDetails(colName);
      return {
        id: `col_${Date.now()}_${idx + 1}`,
        name: colName,
        type: inferred.type,
        nullRate: 0,
        outlierRate: 0,
        enumValues: inferred.enumValues,
        min: inferred.min,
        max: inferred.max,
      };
    });

    return {
      detectedDomain,
      tableName,
      detectedCount,
      inferredEntities: ['Custom Requested Entity'],
      description: `Synthesized schema with ${fields.length} columns: ${explicitCols.join(', ')}`,
      fields,
    };
  }

  // If NO columns were explicitly requested, provide a standard domain set
  if (lower.includes('workshop') || lower.includes('vehicle') || lower.includes('car') || lower.includes('mechanic')) {
    return {
      detectedDomain: 'Workshop & Vehicle Management',
      tableName: 'workshop_management',
      detectedCount,
      inferredEntities: ['Vehicle Profile', 'Service Order'],
      description: 'Standard workshop management schema',
      fields: [
        { id: `f_1`, name: 'service_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_2`, name: 'vehicle_name', type: 'string', nullRate: 0, outlierRate: 0, enumValues: [...VEHICLES] },
        { id: `f_3`, name: 'color', type: 'enum', nullRate: 0, outlierRate: 0, enumValues: [...VEHICLE_COLORS] },
        { id: `f_4`, name: 'license_plate', type: 'string', nullRate: 0, outlierRate: 0 },
        { id: `f_5`, name: 'service_task', type: 'string', nullRate: 0, outlierRate: 0, enumValues: [...WORKSHOP_SERVICES] },
        { id: `f_6`, name: 'service_status', type: 'status', nullRate: 0, outlierRate: 0, enumValues: [...WORKSHOP_STATUS] },
      ],
    };
  }

  // Generic fallback
  return {
    detectedDomain: 'General Dataset',
    tableName: 'general_dataset',
    detectedCount,
    inferredEntities: ['General Entity'],
    description: 'General data schema',
    fields: [
      { id: `f_1`, name: 'record_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
      { id: `f_2`, name: 'name', type: 'full_name', nullRate: 0, outlierRate: 0 },
      { id: `f_3`, name: 'email', type: 'email', nullRate: 0, outlierRate: 0 },
      { id: `f_4`, name: 'status', type: 'status', nullRate: 0, outlierRate: 0 },
    ],
  };
}

function extractExplicitColumns(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const results: string[] = [];

  const markerRegex = /(?:having|with|including|columns?|fields?|contains?)\s+([^.]+)/i;
  const match = lower.match(markerRegex);

  if (match && match[1]) {
    const listPart = match[1];
    const parts = listPart.split(/,|\band\b/);
    for (let part of parts) {
      part = part.trim().replace(/^having\s+|^with\s+|^a\s+|^an\s+|^the\s+/g, '');
      part = part.replace(/[^a-z0-9_\s]/g, '').trim();
      if (part && part.length > 1 && part.length < 35) {
        const cleanName = part.replace(/\s+/g, '_');
        if (!results.includes(cleanName)) {
          results.push(cleanName);
        }
      }
    }
  }

  if (lower.includes('vehicle name') && !results.includes('vehicle_name')) {
    results.push('vehicle_name');
  }
  if (lower.includes('color') && !results.includes('color')) {
    results.push('color');
  }

  return results;
}

function inferFieldDetails(name: string): {
  type: string;
  enumValues?: string[];
  min?: number;
  max?: number;
} {
  const n = name.toLowerCase();

  if (n.includes('vehicle') || n.includes('car') || n.includes('model') || n.includes('automobile')) {
    return { type: 'string', enumValues: [...VEHICLES] };
  }
  if (n.includes('color') || n.includes('colour') || n.includes('paint')) {
    return { type: 'enum', enumValues: [...VEHICLE_COLORS] };
  }
  if (n.includes('email') || n.includes('mail')) {
    return { type: 'email' };
  }
  if (n.includes('name') || n.includes('customer') || n.includes('owner')) {
    return { type: 'full_name' };
  }
  if (n.includes('cost') || n.includes('price') || n.includes('fee') || n.includes('charge') || n.includes('cents')) {
    return { type: 'integer_cents', min: 2500, max: 250000 };
  }
  if (n.includes('date') || n.includes('time')) {
    return { type: 'date' };
  }
  if (n.includes('status')) {
    return { type: 'status' };
  }
  if (n.includes('phone')) {
    return { type: 'phone' };
  }
  if (n.includes('city')) {
    return { type: 'city' };
  }
  if (n.includes('country')) {
    return { type: 'country' };
  }
  if (n.includes('id') || n.includes('uuid')) {
    return { type: 'uuid' };
  }

  return { type: 'string' };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
