// Mock data for IBM Cloud Migration Hub prototype

export const mockUser = {
  name: 'Olive',
  accountId: 'acc-12345',
  email: 'olive@example.com',
  role: 'Account Owner'
};

export const mockDeadline = {
  endOfSupportDate: '2026-12-31',
  monthsRemaining: 9,
  recommendedStartDate: '2026-05-01'
};

export const mockIncentive = {
  amount: 2000,
  currency: 'USD',
  deadline: '2026-10-31',
  description: 'IBM is offering $2,000 in VPC credits for migrations completed before October 31, 2026. This applies to your account.'
};

export const mockClusters = [
  {
    id: 'cluster-001',
    name: 'prod-cluster-01',
    type: 'Kubernetes Cluster',
    status: 'not_started',
    readinessScore: 95,
    zone: 'dal10',
    zones: ['dal10', 'dal12', 'dal13'],
    workerCount: 3,
    machineType: 'b3c.4x16',
    cpu: 4,
    ram: 16,
    estimatedMonthlyCost: 8420,
    complexity: 'simple',
    dependencies: ['classic-db-01'],
    lastUpdated: '2026-04-01T10:30:00Z'
  },
  {
    id: 'cluster-002',
    name: 'staging-cluster-02',
    type: 'Kubernetes Cluster',
    status: 'not_started',
    readinessScore: 92,
    zone: 'dal10',
    zones: ['dal10', 'dal12'],
    workerCount: 2,
    machineType: 'b3c.4x16',
    cpu: 4,
    ram: 16,
    estimatedMonthlyCost: 5640,
    complexity: 'simple',
    dependencies: [],
    lastUpdated: '2026-04-01T10:30:00Z'
  },
  {
    id: 'cluster-003',
    name: 'dev-cluster-03',
    type: 'Kubernetes Cluster',
    status: 'not_started',
    readinessScore: 68,
    zone: 'dal10',
    zones: ['dal10'],
    workerCount: 1,
    machineType: 'b3c.8x32.unusual',
    cpu: 8,
    ram: 32,
    estimatedMonthlyCost: 1280,
    complexity: 'needs_attention',
    complexityReason: 'Unusual machine type configuration detected. Recommend verification with IBM support.',
    dependencies: [],
    lastUpdated: '2026-04-01T10:30:00Z'
  }
];

export const mockDatabases = [
  {
    id: 'db-001',
    name: 'classic-db-01',
    type: 'PostgreSQL',
    status: 'not_started',
    readinessScore: 88,
    estimatedMonthlyCost: 450,
    connectedTo: ['cluster-001']
  },
  {
    id: 'db-002',
    name: 'classic-db-02',
    type: 'MySQL',
    status: 'not_started',
    readinessScore: 90,
    estimatedMonthlyCost: 380,
    connectedTo: []
  }
];

export const mockRecommendations = [
  {
    clusterId: 'cluster-001',
    classic: {
      name: 'prod-cluster-01',
      machineType: 'b3c.4x16',
      workerCount: 3,
      zones: ['dal10', 'dal12', 'dal13'],
      cpu: 4,
      ram: 16,
      estimatedMonthlyCost: 8420
    },
    vpc: {
      name: 'prod-cluster-01-vpc',
      profile: 'bx2.4x16',
      workerCount: 3,
      zones: ['us-south-1', 'us-south-2', 'us-south-3'],
      cpu: 4,
      ram: 16,
      estimatedMonthlyCost: 6940
    },
    costDelta: -1480,
    costDeltaPercent: -17.6,
    confidence: 'high',
    reasoning: 'Your classic b3c.4x16 maps to VPC bx2.4x16. Same CPU and RAM, VPC-native networking. Your 3 workers and 3 zones carry forward unchanged.',
    valueStatement: 'Moving to VPC could save you approximately $1,480/month while giving you improved security, faster networking, and continued IBM support.'
  },
  {
    clusterId: 'cluster-002',
    classic: {
      name: 'staging-cluster-02',
      machineType: 'b3c.4x16',
      workerCount: 2,
      zones: ['dal10', 'dal12'],
      cpu: 4,
      ram: 16,
      estimatedMonthlyCost: 5640
    },
    vpc: {
      name: 'staging-cluster-02-vpc',
      profile: 'bx2.4x16',
      workerCount: 2,
      zones: ['us-south-1', 'us-south-2'],
      cpu: 4,
      ram: 16,
      estimatedMonthlyCost: 4580
    },
    costDelta: -1060,
    costDeltaPercent: -18.8,
    confidence: 'high',
    reasoning: 'Your classic b3c.4x16 maps to VPC bx2.4x16. Same CPU and RAM, VPC-native networking. Your 2 workers and 2 zones carry forward unchanged.',
    valueStatement: 'Moving to VPC could save you approximately $1,060/month while giving you improved security, faster networking, and continued IBM support.'
  },
  {
    clusterId: 'cluster-003',
    classic: {
      name: 'dev-cluster-03',
      machineType: 'b3c.8x32.unusual',
      workerCount: 1,
      zones: ['dal10'],
      cpu: 8,
      ram: 32,
      estimatedMonthlyCost: 1280
    },
    vpc: {
      name: 'dev-cluster-03-vpc',
      profile: 'bx2.8x32',
      workerCount: 1,
      zones: ['us-south-1'],
      cpu: 8,
      ram: 32,
      estimatedMonthlyCost: 1280
    },
    costDelta: 0,
    costDeltaPercent: 0,
    confidence: 'low',
    reasoning: 'dev-cluster-03 has an unusual configuration. We recommend verifying with IBM support. You can still proceed — just acknowledge below.',
    valueStatement: 'Moving to VPC maintains your current cost while giving you improved security, faster networking, and continued IBM support.',
    requiresAcknowledgment: true
  }
];

export const mockTeamMembers = [
  {
    id: 'user-001',
    name: 'Olive',
    email: 'olive@example.com',
    role: 'Account Owner',
    status: 'active'
  },
  {
    id: 'user-002',
    name: 'Maya',
    email: 'maya@example.com',
    role: 'IT Manager',
    status: 'invited',
    invitedDate: '2026-04-02T14:20:00Z'
  },
  {
    id: 'user-003',
    name: 'Raj',
    email: 'raj@example.com',
    role: 'DBA',
    status: 'invited',
    invitedDate: '2026-04-02T14:22:00Z'
  }
];

export const mockMigrationStages = [
  {
    id: 'stage-1',
    name: 'Connect Account',
    status: 'completed',
    completedDate: '2026-04-01T10:30:00Z'
  },
  {
    id: 'stage-2',
    name: 'Resource Inventory',
    status: 'completed',
    completedDate: '2026-04-01T10:35:00Z'
  },
  {
    id: 'stage-3',
    name: 'Recommendation',
    status: 'in_progress',
    startedDate: '2026-04-01T10:40:00Z'
  },
  {
    id: 'stage-4',
    name: 'Provision VPC',
    status: 'locked',
    gateRequired: 'Gate 2: Approval'
  },
  {
    id: 'stage-5',
    name: 'Data Migration',
    status: 'locked',
    gateRequired: 'Gate 3: Provisioning Complete'
  },
  {
    id: 'stage-6',
    name: 'Validation',
    status: 'locked',
    gateRequired: 'Gate 4: Data Replicated'
  },
  {
    id: 'stage-7',
    name: 'Cutover & Finish',
    status: 'locked',
    gateRequired: 'Gate 5: Validation Complete'
  }
];

export const mockBobMessages = {
  dashboard: [
    "Hi Olive. I've reviewed your account. Here is what I found and what I recommend you do first.",
    "You have 3 Kubernetes clusters to migrate. Based on my analysis, 2 clusters map cleanly to VPC.",
    "prod-cluster-01 is connected to classic-db-01. I recommend migrating the database first to avoid connectivity issues.",
    "Based on your 3 clusters, I recommend starting provisioning by May 15, 2026 to safely meet IBM's deadline."
  ],
  connectAccount: [
    "Connecting to your account...",
    "Found 3 classic Kubernetes clusters...",
    "Reading worker node configurations...",
    "Fetching current billing data...",
    "Scan complete. Here is what I found."
  ],
  inventory: [
    "2 clusters map cleanly to VPC.",
    "1 cluster (dev-cluster-03) has an unusual machine type. I'll flag this when we get to the recommendation — you can still proceed.",
    "I've generated a shareable brief you can email to Maya for cost approval."
  ],
  recommendation: [
    "Your classic b3c.4x16 maps to VPC bx2.4x16. Same CPU and RAM, VPC-native networking. Your 3 workers and 3 zones carry forward unchanged.",
    "Moving to VPC could save you approximately $2,540/month while giving you improved security, faster networking, and continued IBM support.",
    "dev-cluster-03 has an unusual configuration. We recommend verifying with IBM support. You can still proceed — just acknowledge below."
  ]
};

export const mockActivityFeed = [
  {
    id: 'activity-001',
    user: 'Olive',
    action: 'completed account scan',
    timestamp: '2026-04-01T10:30:00Z'
  },
  {
    id: 'activity-002',
    user: 'Olive',
    action: 'reviewed resource inventory',
    timestamp: '2026-04-01T10:35:00Z'
  },
  {
    id: 'activity-003',
    user: 'Olive',
    action: 'invited Maya (IT Manager)',
    timestamp: '2026-04-02T14:20:00Z'
  },
  {
    id: 'activity-004',
    user: 'Olive',
    action: 'invited Raj (DBA)',
    timestamp: '2026-04-02T14:22:00Z'
  }
];

export const getTotalEstimatedCost = () => {
  const clusterCost = mockClusters.reduce((sum, cluster) => sum + cluster.estimatedMonthlyCost, 0);
  const dbCost = mockDatabases.reduce((sum, db) => sum + db.estimatedMonthlyCost, 0);
  return clusterCost + dbCost;
};

export const getTotalEstimatedSavings = () => {
  return mockRecommendations.reduce((sum, rec) => sum + Math.abs(rec.costDelta), 0);
};

// Made with Bob
