import { MulberryPRNG } from '../prng';
import { TabularField } from '../../types/schema';
import {
  FIRST_NAMES,
  LAST_NAMES,
  EMAIL_DOMAINS,
  COMPANIES,
  JOB_TITLES,
  CITIES,
  COUNTRIES,
  STREETS,
  STATUS_OPTIONS,
} from '../dictionary';

export interface TabularGenerationResult {
  rows: Record<string, any>[];
  fields: TabularField[];
  seed: number | string;
  count: number;
  generationTimeMs: number;
  qualityMetrics: {
    totalCells: number;
    nullCells: number;
    nullRateActual: number;
    outlierCells: number;
    outlierRateActual: number;
    completenessRate: number;
  };
}

export function generateTabularData(
  fields: TabularField[],
  count: number,
  seed: number | string
): TabularGenerationResult {
  const startTime = performance.now();
  const prng = new MulberryPRNG(seed);
  const rows: Record<string, any>[] = [];

  let nullCount = 0;
  let outlierCount = 0;
  const totalCells = fields.length * count;

  for (let rowIndex = 0; rowIndex < count; rowIndex++) {
    const row: Record<string, any> = { _id: rowIndex + 1 };

    for (const field of fields) {
      // Check null rate
      const isNull = field.nullRate > 0 && prng.next() * 100 < field.nullRate;
      if (isNull) {
        row[field.name] = null;
        nullCount++;
        continue;
      }

      // Check outlier rate
      const isOutlier = field.outlierRate > 0 && prng.next() * 100 < field.outlierRate;
      if (isOutlier) {
        outlierCount++;
        row[field.name] = generateOutlierValue(field, prng);
        continue;
      }

      // Standard generation
      row[field.name] = generateStandardValue(field, prng, rowIndex);
    }

    rows.push(row);
  }

  const endTime = performance.now();

  return {
    rows,
    fields,
    seed,
    count,
    generationTimeMs: Math.max(1, Math.round(endTime - startTime)),
    qualityMetrics: {
      totalCells,
      nullCells: nullCount,
      nullRateActual: totalCells > 0 ? Math.round((nullCount / totalCells) * 1000) / 10 : 0,
      outlierCells: outlierCount,
      outlierRateActual: totalCells > 0 ? Math.round((outlierCount / totalCells) * 1000) / 10 : 0,
      completenessRate: totalCells > 0 ? Math.round(((totalCells - nullCount) / totalCells) * 1000) / 10 : 100,
    },
  };
}

function generateStandardValue(field: TabularField, prng: MulberryPRNG, rowIndex: number): any {
  switch (field.type) {
    case 'uuid':
      return generateDeterministicUUID(prng);

    case 'first_name':
      return prng.pick(FIRST_NAMES);

    case 'last_name':
      return prng.pick(LAST_NAMES);

    case 'full_name': {
      const first = prng.pick(FIRST_NAMES);
      const last = prng.pick(LAST_NAMES);
      return `${first} ${last}`;
    }

    case 'email': {
      const first = prng.pick(FIRST_NAMES).toLowerCase();
      const last = prng.pick(LAST_NAMES).toLowerCase();
      const domain = prng.pick(EMAIL_DOMAINS);
      const suffix = prng.nextInt(10, 99);
      return `${first}.${last}${suffix}@${domain}`;
    }

    case 'integer_cents': {
      const min = field.min ?? 1000; // $10.00
      const max = field.max ?? 500000; // $5,000.00
      return prng.nextInt(min, max);
    }

    case 'number': {
      const min = field.min ?? 1;
      const max = field.max ?? 1000;
      return prng.nextInt(min, max);
    }

    case 'float': {
      const min = field.min ?? 0;
      const max = field.max ?? 100;
      return prng.nextFloat(min, max, 2);
    }

    case 'boolean':
      return prng.boolean(0.5);

    case 'date': {
      // Past 3 years
      const currentYear = 2026;
      const year = prng.nextInt(currentYear - 2, currentYear);
      const month = String(prng.nextInt(1, 12)).padStart(2, '0');
      const day = String(prng.nextInt(1, 28)).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    case 'timestamp': {
      const currentYear = 2026;
      const year = prng.nextInt(currentYear - 1, currentYear);
      const month = String(prng.nextInt(1, 12)).padStart(2, '0');
      const day = String(prng.nextInt(1, 28)).padStart(2, '0');
      const hour = String(prng.nextInt(0, 23)).padStart(2, '0');
      const min = String(prng.nextInt(0, 59)).padStart(2, '0');
      const sec = String(prng.nextInt(0, 59)).padStart(2, '0');
      return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
    }

    case 'status':
      return prng.pick(STATUS_OPTIONS);

    case 'country':
      return prng.pick(COUNTRIES);

    case 'city':
      return prng.pick(CITIES);

    case 'address': {
      const num = prng.nextInt(10, 9999);
      const street = prng.pick(STREETS);
      const city = prng.pick(CITIES);
      return `${num} ${street}, ${city}`;
    }

    case 'zip_code':
      return `${prng.nextInt(10000, 99999)}`;

    case 'company':
      return prng.pick(COMPANIES);

    case 'job_title':
      return prng.pick(JOB_TITLES);

    case 'phone': {
      const area = prng.nextInt(200, 999);
      const mid = prng.nextInt(100, 999);
      const end = prng.nextInt(1000, 9999);
      return `+1 (${area}) ${mid}-${end}`;
    }

    case 'ip_address':
      return `192.168.${prng.nextInt(1, 254)}.${prng.nextInt(1, 254)}`;

    case 'enum': {
      if (field.enumValues && field.enumValues.length > 0) {
        return prng.pick(field.enumValues);
      }
      return 'DEFAULT';
    }

    case 'string':
    default: {
      const prefix = field.prefix || 'SYNTH';
      return `${prefix}-${String(rowIndex + 1).padStart(4, '0')}-${prng.nextInt(100, 999)}`;
    }
  }
}

function generateOutlierValue(field: TabularField, prng: MulberryPRNG): any {
  switch (field.type) {
    case 'integer_cents':
      // Extreme values: 0, negative cents, or extreme $10,000,000
      return prng.pick([0, -50000, 999999999, 1]);

    case 'number':
    case 'float':
      return prng.pick([-999, 0, 999999, -1]);

    case 'date':
      // Boundary leap years or far-future/ancient dates
      return prng.pick(['1900-01-01', '2099-12-31', '2000-02-29', '1970-01-01']);

    case 'string':
    case 'full_name':
      // Edge case string lengths or non-ASCII test vectors
      return prng.pick([
        'X'.repeat(128),
        "O'Connor-Smith Jr. & Sons",
        'Test <script>alert(1)</script>',
        'Nullius In Verba 🚀 0xDEADBEEF',
        '   whitespace-padded-entry   ',
      ]);

    case 'email':
      return prng.pick([
        'user+tag.complex@test.corp.co.uk',
        'very-long-anonymized-synthetic-identifier-alpha-beta-gamma@sandbox.io',
      ]);

    default:
      return 'OUTLIER_VALUE';
  }
}

function generateDeterministicUUID(prng: MulberryPRNG): string {
  const hex = '0123456789abcdef';
  let uuid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; // UUID v4
    } else if (i === 19) {
      uuid += hex[(Math.floor(prng.next() * 4) + 8)];
    } else {
      uuid += hex[Math.floor(prng.next() * 16)];
    }
  }
  return uuid;
}
