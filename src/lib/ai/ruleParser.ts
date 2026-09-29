import { TabularField, FieldType } from '../../types/schema';
import {
  VEHICLES,
  VEHICLE_COLORS,
  WORKSHOP_SERVICES,
  WORKSHOP_STATUS,
} from '../dictionary';

export interface SchemaGenerationPipeline {
  step: 'idle' | 'tokenizing' | 'entities' | 'types' | 'assembling' | 'complete';
  stepMessage: string;
  progress: number;
}

export interface SchemaParseResult {
  fields: TabularField[];
  detectedCount: number;
  detectedDomain: string;
  inferredEntities: string[];
  description: string;
}

export interface SchemaProvider {
  label: string;
  parsePrompt(
    prompt: string,
    onStepChange?: (pipeline: SchemaGenerationPipeline) => void
  ): Promise<SchemaParseResult>;
}

export class RuleBasedSchemaParser implements SchemaProvider {
  public readonly label = 'Gemini 3.8 Flash + Adaptive Semantic Engine';

  async parsePrompt(
    prompt: string,
    onStepChange?: (pipeline: SchemaGenerationPipeline) => void
  ): Promise<SchemaParseResult> {
    const notify = (
      step: SchemaGenerationPipeline['step'],
      stepMessage: string,
      progress: number
    ) => {
      if (onStepChange) {
        onStepChange({ step, stepMessage, progress });
      }
    };

    notify('tokenizing', 'Tokenizing user prompt and analyzing syntax...', 20);

    // Try calling the server-side Gemini 3.8 Flash proxy endpoint
    try {
      notify('entities', 'Querying Gemini API for domain entities and schema...', 45);

      const apiUrl =
        typeof window !== 'undefined'
          ? '/api/parse-schema'
          : 'http://localhost:3000/api/parse-schema';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.fields && Array.isArray(data.fields) && data.fields.length > 0) {
          notify('types', 'Applying type constraints and distributions...', 75);
          await delay(120);

          notify('assembling', 'Assembling Synthora Schema specification...', 90);
          await delay(120);

          notify('complete', 'Schema synthesized successfully via Gemini.', 100);

          const formattedFields: TabularField[] = data.fields.map((f: any, idx: number) => ({
            id: f.id || `f_${Date.now()}_${idx}`,
            name: (f.name || `field_${idx + 1}`).toLowerCase().replace(/[^a-z0-9_]/g, '_'),
            type: validateFieldType(f.type),
            nullRate: typeof f.nullRate === 'number' ? f.nullRate : 0,
            outlierRate: typeof f.outlierRate === 'number' ? f.outlierRate : 0,
            enumValues: Array.isArray(f.enumValues) ? f.enumValues : undefined,
            min: typeof f.min === 'number' ? f.min : undefined,
            max: typeof f.max === 'number' ? f.max : undefined,
            prefix: f.prefix || undefined,
          }));

          return {
            fields: formattedFields,
            detectedCount: data.detectedCount || 50,
            detectedDomain: data.detectedDomain || 'Custom Generated Domain',
            inferredEntities: data.inferredEntities || ['Entity Data'],
            description: data.description || `Synthesized ${formattedFields.length} fields from prompt.`,
          };
        }
      }
    } catch (err) {
      console.warn('Server Gemini call unavailable or timed out; falling back to local semantic engine:', err);
    }

    // Fallback: Local Semantic & Keyword NLP Extraction
    return this.parseLocally(prompt, notify);
  }

  private async parseLocally(
    prompt: string,
    notify: (step: SchemaGenerationPipeline['step'], msg: string, progress: number) => void
  ): Promise<SchemaParseResult> {
    notify('entities', 'Extracting custom columns and domain ontology...', 50);
    await delay(150);

    const lower = prompt.toLowerCase();

    // Extract count (e.g., "50 patients", "create 100", "25 cars")
    let detectedCount = 50;
    const countMatch = lower.match(/\b(\d{1,4})\b/);
    if (countMatch && parseInt(countMatch[1], 10) > 0) {
      detectedCount = Math.min(1000, Math.max(5, parseInt(countMatch[1], 10)));
    }

    const hasNulls =
      lower.includes('null') ||
      lower.includes('dirty') ||
      lower.includes('missing') ||
      lower.includes('sparse');
    const hasOutliers =
      lower.includes('outlier') ||
      lower.includes('edge') ||
      lower.includes('boundary') ||
      lower.includes('extreme');
    const defaultNullRate = hasNulls ? 15 : 0;
    const defaultOutlierRate = hasOutliers ? 12 : 0;

    let detectedDomain = 'General Custom Schema';
    const inferredEntities: string[] = [];
    const fields: TabularField[] = [];

    // Check for explicit column mentions in prompt: e.g. "having vehicle name , color"
    const explicitCols = extractExplicitColumns(prompt);

    // If the user specified explicit columns, STRICTLY output ONLY those columns!
    if (explicitCols.length > 0) {
      if (lower.includes('workshop') || lower.includes('vehicle') || lower.includes('mechanic') || lower.includes('garage')) {
        detectedDomain = 'Workshop & Vehicle Management';
      } else if (lower.includes('patient') || lower.includes('health') || lower.includes('hospital')) {
        detectedDomain = 'Healthcare & Life Sciences';
      } else if (lower.includes('saas') || lower.includes('subscription')) {
        detectedDomain = 'B2B SaaS';
      } else if (lower.includes('ecommerce') || lower.includes('store') || lower.includes('retail')) {
        detectedDomain = 'E-Commerce';
      } else {
        detectedDomain = 'Custom Specified Schema';
      }
      inferredEntities.push('Requested Entity');

      // ONLY the columns the user explicitly requested (no extra unrequested columns)
      for (let i = 0; i < explicitCols.length; i++) {
        const colName = explicitCols[i];
        const inferred = inferFieldDetailsFromName(colName);
        fields.push({
          id: `f_${Date.now()}_${i + 1}`,
          name: colName,
          type: inferred.type,
          nullRate: defaultNullRate,
          outlierRate: defaultOutlierRate,
          enumValues: inferred.enumValues,
          min: inferred.min,
          max: inferred.max,
        });
      }
    }
    // Otherwise, if NO specific columns were listed, provide full domain templates:
    else if (
      lower.includes('workshop') ||
      lower.includes('vehicle') ||
      lower.includes('car') ||
      lower.includes('auto') ||
      lower.includes('mechanic') ||
      lower.includes('garage') ||
      lower.includes('repair') ||
      lower.includes('motor')
    ) {
      detectedDomain = 'Workshop & Vehicle Management';
      inferredEntities.push('Vehicle Profile', 'Service Order', 'Mechanic Log');

      fields.push(
        { id: `f_${Date.now()}_1`, name: 'service_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_2`, name: 'vehicle_name', type: 'string', nullRate: 0, outlierRate: 0, enumValues: [...VEHICLES] },
        { id: `f_${Date.now()}_3`, name: 'color', type: 'enum', nullRate: 0, outlierRate: 0, enumValues: [...VEHICLE_COLORS] },
        { id: `f_${Date.now()}_4`, name: 'license_plate', type: 'string', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_5`, name: 'customer_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_6`, name: 'service_task', type: 'string', nullRate: 0, outlierRate: 0, enumValues: [...WORKSHOP_SERVICES] },
        { id: `f_${Date.now()}_7`, name: 'service_cost_cents', type: 'integer_cents', min: 4500, max: 280000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_8`, name: 'service_status', type: 'status', nullRate: 0, outlierRate: 0, enumValues: [...WORKSHOP_STATUS] },
        { id: `f_${Date.now()}_9`, name: 'admitted_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    }
    // 2. Healthcare & Life Sciences
    else if (
      lower.includes('patient') ||
      lower.includes('clinic') ||
      lower.includes('health') ||
      lower.includes('hipaa') ||
      lower.includes('hospital') ||
      lower.includes('medical')
    ) {
      detectedDomain = 'Healthcare & Life Sciences';
      inferredEntities.push('Patient Identity', 'Clinical Encounter', 'Billing Record');

      fields.push(
        { id: `f_${Date.now()}_1`, name: 'patient_mrn', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_2`, name: 'patient_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_3`, name: 'contact_email', type: 'email', nullRate: defaultNullRate, outlierRate: 0 },
        { id: `f_${Date.now()}_4`, name: 'admission_date', type: 'date', nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_5`, name: 'encounter_charge_cents', type: 'integer_cents', min: 25000, max: 980000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_6`, name: 'triage_status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_7`, name: 'emergency_phone', type: 'phone', nullRate: defaultNullRate, outlierRate: 0 }
      );
    }
    // 3. B2B SaaS & Cloud
    else if (
      lower.includes('saas') ||
      lower.includes('subscription') ||
      lower.includes('mrr') ||
      lower.includes('churn') ||
      lower.includes('arr') ||
      lower.includes('software')
    ) {
      detectedDomain = 'B2B SaaS & Cloud';
      inferredEntities.push('Tenant Account', 'Subscription Tier', 'Revenue Metrics');

      fields.push(
        { id: `f_${Date.now()}_1`, name: 'subscription_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_2`, name: 'company_name', type: 'company', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_3`, name: 'billing_contact', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_4`, name: 'billing_email', type: 'email', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_5`, name: 'mrr_cents', type: 'integer_cents', min: 9900, max: 850000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_6`, name: 'retention_score', type: 'float', min: 0.1, max: 10.0, nullRate: defaultNullRate, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_7`, name: 'account_status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_8`, name: 'renewal_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    }
    // 4. E-Commerce & Retail
    else if (
      lower.includes('ecommerce') ||
      lower.includes('order') ||
      lower.includes('store') ||
      lower.includes('retail') ||
      lower.includes('cart')
    ) {
      detectedDomain = 'E-Commerce & Retail';
      inferredEntities.push('Customer Profile', 'Order Transaction', 'Shipping Target');

      fields.push(
        { id: `f_${Date.now()}_1`, name: 'order_uuid', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_2`, name: 'customer_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_3`, name: 'customer_email', type: 'email', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_4`, name: 'basket_total_cents', type: 'integer_cents', min: 1500, max: 145000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_5`, name: 'shipping_city', type: 'city', nullRate: defaultNullRate, outlierRate: 0 },
        { id: `f_${Date.now()}_6`, name: 'fulfillment_state', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_7`, name: 'order_timestamp', type: 'timestamp', nullRate: 0, outlierRate: 0 }
      );
    }
    // 5. General fallback with custom naming (only if no explicit columns and no domain match)
    else {
      detectedDomain = 'General Business Dataset';
      inferredEntities.push('Entity Identifier', 'Core Record', 'Status & Metric');

      fields.push(
        { id: `f_${Date.now()}_1`, name: 'record_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_2`, name: 'item_name', type: 'string', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_3`, name: 'contact_person', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_4`, name: 'email', type: 'email', nullRate: defaultNullRate, outlierRate: 0 },
        { id: `f_${Date.now()}_5`, name: 'amount_cents', type: 'integer_cents', min: 10000, max: 500000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: `f_${Date.now()}_6`, name: 'status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: `f_${Date.now()}_7`, name: 'created_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    }

    notify('types', 'Inferring typed constraints, integer cents & null distributions...', 75);
    await delay(120);

    notify('assembling', 'Assembling Synthora Schema specification...', 90);
    await delay(120);

    notify('complete', 'Schema synthesized successfully.', 100);

    return {
      fields,
      detectedCount,
      detectedDomain,
      inferredEntities,
      description: `Synthesized ${fields.length} typed fields for ${detectedDomain} (${detectedCount} rows).`,
    };
  }
}

function extractExplicitColumns(prompt: string): string[] {
  const lower = prompt.toLowerCase();
  const results: string[] = [];

  // Patterns like "having x, y and z" or "with x, y and z" or "columns: x, y, z"
  const markerRegex = /(?:having|with|including|columns?|fields?|contains?)\s+([^.]+)/i;
  const match = lower.match(markerRegex);

  if (match && match[1]) {
    const listPart = match[1];
    // Split by comma or 'and'
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

  // Also check direct keywords
  if (lower.includes('vehicle name') && !results.includes('vehicle_name')) {
    results.push('vehicle_name');
  }
  if (lower.includes('color') && !results.includes('color')) {
    results.push('color');
  }

  return results;
}

function inferFieldDetailsFromName(name: string): {
  type: FieldType;
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
  if (n.includes('plate') || n.includes('vin') || n.includes('registration')) {
    return { type: 'string' };
  }
  if (n.includes('email') || n.includes('mail')) {
    return { type: 'email' };
  }
  if (n.includes('name') || n.includes('customer') || n.includes('owner') || n.includes('driver')) {
    return { type: 'full_name' };
  }
  if (n.includes('cost') || n.includes('price') || n.includes('fee') || n.includes('charge') || n.includes('cents') || n.includes('bill')) {
    return { type: 'integer_cents', min: 2500, max: 250000 };
  }
  if (n.includes('date') || n.includes('time') || n.includes('admitted') || n.includes('scheduled')) {
    return { type: 'date' };
  }
  if (n.includes('status') || n.includes('stage') || n.includes('condition')) {
    return { type: 'status' };
  }
  if (n.includes('phone') || n.includes('mobile') || n.includes('cell')) {
    return { type: 'phone' };
  }
  if (n.includes('address') || n.includes('street') || n.includes('location')) {
    return { type: 'address' };
  }
  if (n.includes('city')) {
    return { type: 'city' };
  }
  if (n.includes('country')) {
    return { type: 'country' };
  }
  if (n.includes('count') || n.includes('qty') || n.includes('quantity') || n.includes('mileage') || n.includes('km')) {
    return { type: 'number', min: 1, max: 150000 };
  }
  if (n.includes('id') || n.includes('uuid')) {
    return { type: 'uuid' };
  }

  return { type: 'string' };
}

function validateFieldType(type: string): FieldType {
  const validTypes: FieldType[] = [
    'uuid',
    'string',
    'full_name',
    'first_name',
    'last_name',
    'email',
    'integer_cents',
    'number',
    'float',
    'boolean',
    'date',
    'timestamp',
    'status',
    'country',
    'city',
    'address',
    'zip_code',
    'company',
    'job_title',
    'phone',
    'ip_address',
    'enum',
  ];
  return validTypes.includes(type as FieldType) ? (type as FieldType) : 'string';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
