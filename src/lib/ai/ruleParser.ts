import { TabularField } from '../../types/schema';

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
  public readonly label = 'Rule-based parser (LLM-ready)';

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

    // Step 1: Tokenize
    notify('tokenizing', 'Tokenizing user prompt and analyzing syntax...', 20);
    await delay(180);

    const lower = prompt.toLowerCase();

    // Extract count (e.g., "50 patients", "create 100", "25 customers")
    let detectedCount = 50;
    const countMatch = lower.match(/\b(\d{1,4})\b/);
    if (countMatch && parseInt(countMatch[1], 10) > 0) {
      detectedCount = Math.min(1000, Math.max(5, parseInt(countMatch[1], 10)));
    }

    // Step 2: Entities & Domain detection
    notify('entities', 'Identifying domain ontology and data entities...', 45);
    await delay(200);

    const hasNulls = lower.includes('null') || lower.includes('dirty') || lower.includes('missing') || lower.includes('sparse');
    const hasOutliers = lower.includes('outlier') || lower.includes('edge') || lower.includes('boundary') || lower.includes('extreme');
    const defaultNullRate = hasNulls ? 15 : 0;
    const defaultOutlierRate = hasOutliers ? 12 : 0;

    let detectedDomain = 'General Enterprise';
    const inferredEntities: string[] = [];
    const fields: TabularField[] = [];

    if (
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
        { id: 'f_mrn', name: 'patient_mrn', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_name', name: 'patient_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: 'f_email', name: 'contact_email', type: 'email', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_adm', name: 'admission_date', type: 'date', nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_cost', name: 'encounter_charge_cents', type: 'integer_cents', min: 25000, max: 980000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_stat', name: 'triage_status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: 'f_facility', name: 'facility_country', type: 'country', nullRate: 0, outlierRate: 0 },
        { id: 'f_phone', name: 'emergency_phone', type: 'phone', nullRate: defaultNullRate, outlierRate: 0 }
      );
    } else if (
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
        { id: 'f_sub_id', name: 'subscription_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_tenant', name: 'company_name', type: 'company', nullRate: 0, outlierRate: 0 },
        { id: 'f_owner', name: 'billing_contact', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: 'f_email', name: 'billing_email', type: 'email', nullRate: 0, outlierRate: 0 },
        { id: 'f_mrr', name: 'mrr_cents', type: 'integer_cents', min: 9900, max: 850000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_score', name: 'retention_score', type: 'float', min: 0.1, max: 10.0, nullRate: defaultNullRate, outlierRate: defaultOutlierRate },
        { id: 'f_status', name: 'account_status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: 'f_renew', name: 'renewal_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    } else if (
      lower.includes('ecommerce') ||
      lower.includes('order') ||
      lower.includes('store') ||
      lower.includes('retail') ||
      lower.includes('cart')
    ) {
      detectedDomain = 'E-Commerce & Retail';
      inferredEntities.push('Customer Profile', 'Order Transaction', 'Shipping Target');

      fields.push(
        { id: 'f_order_id', name: 'order_uuid', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_buyer', name: 'customer_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: 'f_mail', name: 'customer_email', type: 'email', nullRate: 0, outlierRate: 0 },
        { id: 'f_total', name: 'basket_total_cents', type: 'integer_cents', min: 1500, max: 145000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_city', name: 'shipping_city', type: 'city', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_address', name: 'delivery_address', type: 'address', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_status', name: 'fulfillment_state', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: 'f_date', name: 'order_timestamp', type: 'timestamp', nullRate: 0, outlierRate: 0 }
      );
    } else if (
      lower.includes('employee') ||
      lower.includes('payroll') ||
      lower.includes('salary') ||
      lower.includes('staff') ||
      lower.includes('hr')
    ) {
      detectedDomain = 'People & HR Systems';
      inferredEntities.push('Employee Master', 'Position & Compensation', 'Location');

      fields.push(
        { id: 'f_emp_id', name: 'badge_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_name', name: 'full_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: 'f_corp_email', name: 'work_email', type: 'email', nullRate: 0, outlierRate: 0 },
        { id: 'f_role', name: 'job_title', type: 'job_title', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_comp', name: 'employer', type: 'company', nullRate: 0, outlierRate: 0 },
        { id: 'f_salary', name: 'annual_base_cents', type: 'integer_cents', min: 6500000, max: 24000000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_country', name: 'tax_country', type: 'country', nullRate: 0, outlierRate: 0 },
        { id: 'f_hire', name: 'hire_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    } else if (
      lower.includes('security') ||
      lower.includes('cyber') ||
      lower.includes('network') ||
      lower.includes('ip') ||
      lower.includes('iot') ||
      lower.includes('threat')
    ) {
      detectedDomain = 'Cybersecurity & Telemetry';
      inferredEntities.push('Security Event', 'IP Addressing', 'Audit Metadata');

      fields.push(
        { id: 'f_sec_id', name: 'incident_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_ip', name: 'source_ip', type: 'ip_address', nullRate: 0, outlierRate: 0 },
        { id: 'f_threat', name: 'risk_level', type: 'float', min: 1.0, max: 100.0, nullRate: defaultNullRate, outlierRate: defaultOutlierRate },
        { id: 'f_status', name: 'investigation_status', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: 'f_analyst', name: 'assigned_analyst', type: 'full_name', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_time', name: 'logged_at', type: 'timestamp', nullRate: 0, outlierRate: 0 }
      );
    } else {
      detectedDomain = 'General Business Dataset';
      inferredEntities.push('Entity Identifier', 'Contact Data', 'Financial Field');

      fields.push(
        { id: 'f_gen_id', name: 'record_id', type: 'uuid', nullRate: 0, outlierRate: 0 },
        { id: 'f_gen_name', name: 'primary_name', type: 'full_name', nullRate: 0, outlierRate: 0 },
        { id: 'f_gen_email', name: 'email_address', type: 'email', nullRate: defaultNullRate, outlierRate: 0 },
        { id: 'f_gen_cents', name: 'valuation_cents', type: 'integer_cents', min: 10000, max: 500000, nullRate: 0, outlierRate: defaultOutlierRate },
        { id: 'f_gen_country', name: 'origin_country', type: 'country', nullRate: 0, outlierRate: 0 },
        { id: 'f_gen_status', name: 'status_flag', type: 'status', nullRate: 0, outlierRate: 0 },
        { id: 'f_gen_date', name: 'effective_date', type: 'date', nullRate: 0, outlierRate: 0 }
      );
    }

    // Step 3: Type inference
    notify('types', 'Inferring typed constraints, integer cents & null distributions...', 75);
    await delay(180);

    // Step 4: Assemble Schema
    notify('assembling', 'Assembling Synthora Schema specification...', 90);
    await delay(150);

    // Complete
    notify('complete', 'Schema synthesized successfully.', 100);

    return {
      fields,
      detectedCount,
      detectedDomain,
      inferredEntities,
      description: `Synthesized ${fields.length} typed fields for ${detectedDomain} with target ${detectedCount} rows.`,
    };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
