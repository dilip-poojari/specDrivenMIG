import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ProgressBar,
  Tile,
  Accordion,
  AccordionItem,
  InlineNotification,
  Tag,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell
} from '@carbon/react';
import { ArrowRight, Checkmark, InProgress, Time } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import { mockClusters, mockRecommendations, mockBobMessages } from '../mock/mockData';
import { useMigration } from '../context/MigrationContext';
import './ProvisionVPC.css';

const ProvisionVPC = () => {
  const navigate = useNavigate();
  const { completeStage, setCurrentStage } = useMigration();
  const [bobOpen, setBobOpen] = useState(true);
  const [provisioningState, setProvisioningState] = useState('review'); // 'review', 'provisioning', 'complete'
  const [clusterProgress, setClusterProgress] = useState({});
  const [showTerraformPlan, setShowTerraformPlan] = useState(false);
  const [bobMessages, setBobMessages] = useState([
    "I've generated a Terraform plan to create your VPC clusters.",
    "Review the plan below. When you're ready, click 'Start Provisioning' to begin."
  ]);

  // Simulate provisioning progress
  useEffect(() => {
    if (provisioningState === 'provisioning') {
      const clusters = mockRecommendations.map(rec => rec.clusterId);
      
      // Initialize progress for all clusters
      const initialProgress = {};
      clusters.forEach(id => {
        initialProgress[id] = { progress: 0, status: 'pending', logs: [] };
      });
      setClusterProgress(initialProgress);

      // Simulate provisioning for each cluster
      clusters.forEach((clusterId, index) => {
        setTimeout(() => {
          startClusterProvisioning(clusterId);
        }, index * 2000); // Stagger start times
      });
    }
  }, [provisioningState]);

  const startClusterProvisioning = (clusterId) => {
    const logs = [
      'Creating VPC network...',
      'Configuring security groups...',
      'Provisioning worker node 1...',
      'Provisioning worker node 2...',
      'Provisioning worker node 3...',
      'Configuring load balancer...',
      'Running health checks...',
      'Cluster ready!'
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      setClusterProgress(prev => {
        const current = prev[clusterId] || { progress: 0, status: 'provisioning', logs: [] };
        const newProgress = Math.min(current.progress + 12.5, 100);
        const newLogs = currentLog < logs.length ? [...current.logs, logs[currentLog]] : current.logs;
        
        currentLog++;

        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [clusterId]: {
              progress: 100,
              status: 'complete',
              logs: newLogs,
              healthCheck: {
                status: 'healthy',
                responseTime: Math.floor(Math.random() * 200) + 300
              }
            }
          };
        }

        return {
          ...prev,
          [clusterId]: {
            ...current,
            progress: newProgress,
            status: 'provisioning',
            logs: newLogs
          }
        };
      });
    }, 1500);
  };

  // Check if all clusters are complete
  const allClustersComplete = () => {
    const clusters = mockRecommendations.map(rec => rec.clusterId);
    return clusters.every(id => clusterProgress[id]?.status === 'complete');
  };

  useEffect(() => {
    if (provisioningState === 'provisioning' && allClustersComplete()) {
      setTimeout(() => {
        setProvisioningState('complete');
        setBobMessages([
          "All VPC clusters have been provisioned successfully!",
          "Health checks passed. Your classic clusters are still running.",
          "Ready to start data migration?"
        ]);
      }, 1000);
    }
  }, [clusterProgress, provisioningState]);

  const handleStartProvisioning = () => {
    setProvisioningState('provisioning');
    setBobMessages([
      "Starting VPC provisioning...",
      "This will take approximately 30-40 minutes.",
      "I'll keep you updated on progress."
    ]);
  };

  const handleContinue = () => {
    completeStage('provision');
    setCurrentStage('migration');
    navigate('/migration');
  };

  const getTerraformPlan = () => {
    return `# Terraform Plan Summary
# Generated: ${new Date().toISOString()}

Plan: 15 to add, 0 to change, 0 to destroy.

Resources to be created:
${mockRecommendations.map((rec, idx) => `
  # ibm_container_vpc_cluster.${rec.clusterId}
  + resource "ibm_container_vpc_cluster" "${rec.clusterId}" {
      + id                = (known after apply)
      + name              = "${rec.clusterId}-vpc"
      + vpc_id            = ibm_is_vpc.migration_vpc.id
      + flavor            = "${rec.vpc.profile}"
      + worker_count      = ${rec.vpc.workerCount}
      + kube_version      = "1.28"
      + zones             = ${JSON.stringify(rec.vpc.zones)}
      + resource_group_id = data.ibm_resource_group.default.id
    }
`).join('\n')}

# Note: Your classic clusters will remain unchanged.
# No resources will be deleted during this operation.`;
  };

  const getEstimatedTime = () => {
    const totalClusters = mockRecommendations.length;
    return `${totalClusters * 12}-${totalClusters * 15} minutes`;
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="provision-container">
          {/* Header */}
          <div className="provision-header">
            <h1>Provision VPC Resources</h1>
            <p className="subtitle">
              {provisioningState === 'review' && "Review the Terraform plan and start provisioning your VPC clusters."}
              {provisioningState === 'provisioning' && "Provisioning your VPC clusters. This may take 30-40 minutes."}
              {provisioningState === 'complete' && "All VPC clusters have been provisioned successfully!"}
            </p>
          </div>

          {/* Review State */}
          {provisioningState === 'review' && (
            <>
              {/* Plan Summary */}
              <Tile className="plan-summary">
                <h3>Terraform Plan Summary</h3>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-value">{mockRecommendations.length}</span>
                    <span className="stat-label">New VPC clusters</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Resources deleted</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{getEstimatedTime()}</span>
                    <span className="stat-label">Estimated time</span>
                  </div>
                </div>
                <InlineNotification
                  kind="info"
                  title="Your classic clusters are safe"
                  subtitle="We will create new VPC resources. Your classic clusters will not be touched during provisioning."
                  lowContrast
                  hideCloseButton
                  className="safety-notice"
                />
              </Tile>

              {/* Cluster Details */}
              <div className="clusters-to-provision">
                <h3>Clusters to be created</h3>
                {mockRecommendations.map((rec) => {
                  const cluster = mockClusters.find(c => c.id === rec.clusterId);
                  return (
                    <Tile key={rec.clusterId} className="cluster-provision-card">
                      <div className="cluster-provision-header">
                        <h4>{cluster.name}-vpc</h4>
                        <Tag type="blue">VPC</Tag>
                      </div>
                      <div className="cluster-provision-details">
                        <div className="detail-row">
                          <span className="detail-label">Profile:</span>
                          <span className="detail-value">{rec.vpc.profile}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Workers:</span>
                          <span className="detail-value">{rec.vpc.workerCount}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Zones:</span>
                          <span className="detail-value">{rec.vpc.zones.join(', ')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Est. monthly:</span>
                          <span className="detail-value">${rec.vpc.estimatedMonthlyCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </Tile>
                  );
                })}
              </div>

              {/* Terraform Plan Accordion */}
              <Accordion>
                <AccordionItem
                  title="View full Terraform plan"
                  open={showTerraformPlan}
                  onHeadingClick={() => setShowTerraformPlan(!showTerraformPlan)}
                >
                  <pre className="terraform-plan">{getTerraformPlan()}</pre>
                </AccordionItem>
              </Accordion>

              {/* Action Button */}
              <div className="provision-actions">
                <Button
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  onClick={handleStartProvisioning}
                >
                  Start provisioning
                </Button>
              </div>
            </>
          )}

          {/* Provisioning State */}
          {provisioningState === 'provisioning' && (
            <div className="provisioning-progress">
              <InlineNotification
                kind="info"
                title="Provisioning in progress"
                subtitle="Your VPC clusters are being created. This process cannot be interrupted."
                lowContrast
                hideCloseButton
                className="provisioning-notice"
              />

              {mockRecommendations.map((rec) => {
                const cluster = mockClusters.find(c => c.id === rec.clusterId);
                const progress = clusterProgress[rec.clusterId] || { progress: 0, status: 'pending', logs: [] };
                
                return (
                  <Tile key={rec.clusterId} className="cluster-progress-card">
                    <div className="cluster-progress-header">
                      <div className="cluster-info">
                        <h4>{cluster.name}-vpc</h4>
                        {progress.status === 'pending' && <Tag type="gray">Pending</Tag>}
                        {progress.status === 'provisioning' && <Tag type="blue" renderIcon={InProgress}>Provisioning</Tag>}
                        {progress.status === 'complete' && <Tag type="green" renderIcon={Checkmark}>Complete</Tag>}
                      </div>
                      <span className="progress-percentage">{Math.round(progress.progress)}%</span>
                    </div>
                    
                    <ProgressBar
                      value={progress.progress}
                      max={100}
                      status={progress.status === 'complete' ? 'finished' : 'active'}
                      className="cluster-progress-bar"
                    />

                    {progress.logs.length > 0 && (
                      <div className="progress-logs">
                        {progress.logs.slice(-3).map((log, idx) => (
                          <div key={idx} className="log-entry">
                            <Time size={16} />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {progress.status === 'complete' && progress.healthCheck && (
                      <div className="health-check">
                        <Checkmark size={16} className="health-icon" />
                        <span>Health check passed • Response time: {progress.healthCheck.responseTime}ms</span>
                      </div>
                    )}
                  </Tile>
                );
              })}
            </div>
          )}

          {/* Complete State */}
          {provisioningState === 'complete' && (
            <>
              <InlineNotification
                kind="success"
                title="Gate 3: Provisioning Complete"
                subtitle="All VPC clusters have been created and health checks passed. Your classic clusters are still running."
                lowContrast
                hideCloseButton
                className="completion-notice"
              />

              {/* Health Check Summary */}
              <Tile className="health-summary">
                <h3>Health Check Results</h3>
                <StructuredListWrapper>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Cluster</StructuredListCell>
                      <StructuredListCell head>Status</StructuredListCell>
                      <StructuredListCell head>Response Time</StructuredListCell>
                      <StructuredListCell head>Nodes</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {mockRecommendations.map((rec) => {
                      const cluster = mockClusters.find(c => c.id === rec.clusterId);
                      const progress = clusterProgress[rec.clusterId];
                      return (
                        <StructuredListRow key={rec.clusterId}>
                          <StructuredListCell>{cluster.name}-vpc</StructuredListCell>
                          <StructuredListCell>
                            <Tag type="green" renderIcon={Checkmark}>Healthy</Tag>
                          </StructuredListCell>
                          <StructuredListCell>{progress?.healthCheck?.responseTime}ms</StructuredListCell>
                          <StructuredListCell>{rec.vpcWorkerCount}/{rec.vpcWorkerCount} Ready</StructuredListCell>
                        </StructuredListRow>
                      );
                    })}
                  </StructuredListBody>
                </StructuredListWrapper>
              </Tile>

              {/* Next Steps */}
              <div className="provision-actions">
                <Button
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  onClick={handleContinue}
                >
                  Continue to data migration
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <BobPanel
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
        messages={bobMessages}
        context="provision"
      />
    </div>
  );
};

export default ProvisionVPC;

// Made with Bob
