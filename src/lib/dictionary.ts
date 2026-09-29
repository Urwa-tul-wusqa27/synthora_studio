export const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Lucas', 'Mia', 'Mason',
  'Isabella', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'Aiden', 'Harper', 'James',
  'Evelyn', 'Benjamin', 'Abigail', 'Alexander', 'Emily', 'Henry', 'Ella', 'Sebastian',
  'Elizabeth', 'Jack', 'Camila', 'Samuel', 'Luna', 'Daniel', 'Aria', 'Matthew', 'Chloe',
  'Jackson', 'Penelope', 'David', 'Layla', 'Joseph', 'Mila', 'Carter', 'Nora', 'Owen',
  'Hazel', 'Wyatt', 'Madison', 'John', 'Ellie', 'Luke', 'Elena', 'Julian', 'Stella'
] as const;

export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright',
  'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall',
  'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Vance', 'Sterling', 'Chen', 'Patel'
] as const;

export const EMAIL_DOMAINS = [
  'syntheticmail.org', 'testcloud.io', 'example-corp.net', 'datalab.internal',
  'quantumsafe.dev', 'sandbox.io', 'vaultsec.org', 'hypothetical.io', 'nexusmail.dev'
] as const;

export const COMPANIES = [
  'Apex Systems', 'Vanguard Data', 'Helios Analytics', 'Meridian Technologies',
  'Starlight Logistics', 'Aura BioLabs', 'Solstice Fintech', 'Nexus Security',
  'Kinetics Software', 'BluePeak Capital', 'Prism Cloud', 'Novus Therapeutics',
  'Elysium Robotics', 'Stratosphere Digital', 'Horizon Networks', 'Vector AI Lab'
] as const;

export const JOB_TITLES = [
  'Staff Software Engineer', 'Chief Compliance Officer', 'Senior Data Architect',
  'Product Operations Manager', 'Head of Risk Analysis', 'Platform Engineer',
  'Clinical Research Lead', 'Security Operations Analyst', 'Financial Controller',
  'Lead ML Scientist', 'DevOps Infrastructure Lead', 'Enterprise Solutions Director'
] as const;

export const CITIES = [
  'San Francisco', 'New York', 'London', 'Berlin', 'Zurich', 'Toronto',
  'Singapore', 'Austin', 'Seattle', 'Tokyo', 'Stockholm', 'Amsterdam',
  'Dublin', 'Boston', 'Sydney', 'Chicago', 'Vancouver', 'Copenhagen'
] as const;

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'Switzerland', 'Canada',
  'Singapore', 'Sweden', 'Netherlands', 'Ireland', 'Japan', 'Australia', 'France'
] as const;

export const STREETS = [
  'Market Street', 'Wall Street', 'King Street', 'Friedrichstrasse', 'Bahnhofstrasse',
  'Bayside Boulevard', 'Orchard Road', 'Congress Avenue', 'Pine Street', 'Rodeo Drive',
  'St. Mary Axe', 'Kallang Way', 'Post Street', 'Crown Passage', 'Montgomery Street'
] as const;

export const STATUS_OPTIONS = [
  'Active', 'Pending', 'Suspended', 'Completed', 'Archived', 'In Review'
] as const;

export const INVOICE_PRODUCTS = [
  { desc: 'Cloud Enterprise Compute Tier 3 (Monthly)', unitCents: 245000 },
  { desc: 'Dedicated Synthetic Training Cluster (vGPU)', unitCents: 480000 },
  { desc: 'SOC2 & HIPAA Compliance Audit Package', unitCents: 320000 },
  { desc: 'Zero-Trust Gateway Data Connector License', unitCents: 115000 },
  { desc: 'Continuous Penetration Testing SLA (Quarterly)', unitCents: 650000 },
  { desc: 'Database Read Replicas (High Availability)', unitCents: 85000 },
  { desc: 'API Ingestion Bandwidth Allocation (10TB)', unitCents: 160000 },
  { desc: 'Enterprise Identity & SSO Enforcement Module', unitCents: 210000 },
  { desc: 'Autonomous QA Pipeline Integration Advisory', unitCents: 390000 },
  { desc: 'Confidential Computing Enclave Provisioning', unitCents: 540000 }
];

export const BANK_TRANSACTIONS = [
  { desc: 'Payroll Direct Deposit - Executive & Engineering', type: 'debit', minCents: 450000, maxCents: 980000 },
  { desc: 'Enterprise Client Wire Transfer - ACME Corp', type: 'credit', minCents: 1200000, maxCents: 3500000 },
  { desc: 'AWS Infrastructure Services Bill', type: 'debit', minCents: 180000, maxCents: 420000 },
  { desc: 'Software SaaS Licensing & Tooling', type: 'debit', minCents: 35000, maxCents: 89000 },
  { desc: 'Venture Capital Tranche Inflow', type: 'credit', minCents: 5000000, maxCents: 15000000 },
  { desc: 'Office Lease & Facility Operating Expenses', type: 'debit', minCents: 220000, maxCents: 450000 },
  { desc: 'Merchant Payment Gateway Settlement', type: 'credit', minCents: 650000, maxCents: 1850000 },
  { desc: 'Corporate Tax Quarterly Installment', type: 'debit', minCents: 380000, maxCents: 820000 },
  { desc: 'Vendor Settlement - CloudFlare Edge CDN', type: 'debit', minCents: 42000, maxCents: 95000 },
  { desc: 'Contractor Professional Services Payout', type: 'debit', minCents: 85000, maxCents: 240000 }
];
