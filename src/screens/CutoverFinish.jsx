import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tile,
  Tag,
  InlineNotification,
  TextInput,
  Modal,
  ProgressBar,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell
} from '@carbon/react';
import { ArrowRight, Checkmark, WarningAlt, Renew, Time } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import { mockClusters, mockRecommendations } from '../mock/mockData';
import { useMigration } from '../context/MigrationContext';
import './CutoverFinish.css';

const CutoverFinish = () => {
  const navigate = useNavigate();
  const { completeStage } = useMigration();
  const [bobOpen, setBobOpen] = useState(true);
  const [cutoverState, setCutoverState] = useState('ready'); // 'ready', 'monitoring', 'complete'
  const [showDecommissionModal, setShowDecommissionModal] = useState(false);
  const [decommissionConfirm, setDecommissionConfirm] = useState('');
  const [monitoringTime, setMonitoringTime] = useState(0); // seconds elapsed
  const [clusterMetrics, setClusterMetrics] = useState({});
  const [bobMessages, setBobMessages] = useState([
    "Ready to trigger cutover?",
    "This will switch traffic from classic to VPC clusters.",
    "You'll have 24 hours to monitor before decommissioning classic."
  ]);

  // Simulate 24-hour countdown (accelerated for demo)
  useEffect(() => {
    if (cutoverState === 'monitoring') {
      const interval = setInterval(() => {
        setMonitoringTime(prev => {
          const newTime = prev + 1;
          // Simulate 24 hours in 2 minutes (1 second = 12 minutes)
          if (newTime >= 120) { // 120 seconds = 24 hours in demo
            clearInterval(interval);
            setCutoverState('ready_to_decommission');
            setBobMessages([
              "24 hours complete. VPC has been stable.",
              "No anomalies detected. Ready to decommission classic resources."
            ]);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [cutoverState]);

  // Simulate real-time metrics
  useEffect(() => {
    if (cutoverState === 'monitoring') {
      const interval = setInterval(() => {
        const newMetrics = {};
        mockRecommendations.forEach(rec => {
          const baseResponseTime = 350;
          const baseErrorRate = 0.1;
          
          // Add some random variation
          const responseTime = baseResponseTime + (Math.random() * 100 - 50);
          const errorRate = Math.max(0, baseErrorRate + (Math.random() * 0.3 - 0.15));
          
          newMetrics[rec.clusterId] = {
            responseTime: Math.round(responseTime),
            errorRate: parseFloat(errorRate.toFixed(2)),
            podHealth: '100%',
            nodeStatus: `${rec.vpc.workerCount}/${rec.vpc.workerCount} Ready`,
            status: errorRate > 1 ? 'warning' : 'healthy'
          };
        });
        setClusterMetrics(newMetrics);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [cutoverState]);

  const handleTriggerCutover = () => {
    setCutoverState('monitoring');
    setBobMessages([
      "Cutover initiated!",
      "Traffic is now flowing to VPC clusters.",
      "Monitoring for 24 hours. Rollback available if needed."
    ]);
    
    // Initialize metrics
    const initialMetrics = {};
    mockRecommendations.forEach(rec => {
      initialMetrics[rec.clusterId] = {
        responseTime: 350,
        errorRate: 0.1,
        podHealth: '100%',
        nodeStatus: `${rec.vpc.workerCount}/${rec.vpc.workerCount} Ready`,
        status: 'healthy'
      };
    });
    setClusterMetrics(initialMetrics);
  };

  const handleRollback = () => {
    if (window.confirm('Are you sure you want to roll back to classic? This will switch traffic back immediately.')) {
      setCutoverState('ready');
      setMonitoringTime(0);
      setBobMessages([
        "Rolled back to classic clusters.",
        "Traffic is now flowing to classic infrastructure.",
        "You can try cutover again when ready."
      ]);
    }
  };

  const handleDecommission = () => {
    if (decommissionConfirm === 'DECOMMISSION') {
      setCutoverState('complete');
      completeStage('cutover');
      setBobMessages([
        "Migration complete!",
        "Classic resources have been decommissioned.",
        "Your migration to VPC is now complete."
      ]);
      setShowDecommissionModal(false);
    }
  };

  const getTimeRemaining = () => {
    const totalSeconds = 120; // 24 hours in demo time
    const remaining = totalSeconds - monitoringTime;
    const hours = Math.floor(remaining / 5); // 5 seconds = 1 hour in demo
    const minutes = Math.floor((remaining % 5) * 12); // Convert to minutes
    return `${hours}h ${minutes}m`;
  };

  const getMonitoringProgress = () => {
    return (monitoringTime / 120) * 100; // 120 seconds = 100%
  };

  const getTotalCostSavings = () => {
    return mockRecommendations.reduce((sum, rec) => {
      return sum + Math.abs(rec.costDelta);
    }, 0);
  };

  const getAnnualSavings = () => {
    return getTotalCostSavings() * 12;
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="cutover-container">
          {/* Header */}
          <div className="cutover-header">
            <h1>Cutover & Finish</h1>
            <p className="subtitle">
              {cutoverState === 'ready' && "Trigger cutover to switch traffic from classic to VPC clusters."}
              {cutoverState === 'monitoring' && "Monitoring VPC clusters. Classic clusters remain available for rollback."}
              {cutoverState === 'ready_to_decommission' && "24-hour monitoring complete. Ready to decommission classic resources."}
              {cutoverState === 'complete' && "Migration complete! Your workloads are now running on VPC."}
            </p>
          </div>

          {/* Ready State */}
          {cutoverState === 'ready' && (
            <>
              <InlineNotification
                kind="info"
                title="Ready for cutover"
                subtitle="All gates passed. VPC clusters are healthy and validated. Classic clusters will remain available for 24 hours after cutover."
                lowContrast
                hideCloseButton
                className="cutover-notice"
              />

              <Tile className="cutover-readiness">
                <h3>Pre-Cutover Checklist</h3>
                <div className="checklist">
                  <div className="checklist-item">
                    <Checkmark size={20} className="check-icon" />
                    <span>Gate 1: Resource inventory complete</span>
                  </div>
                  <div className="checklist-item">
                    <Checkmark size={20} className="check-icon" />
                    <span>Gate 2: VPC sizing approved</span>
                  </div>
                  <div className="checklist-item">
                    <Checkmark size={20} className="check-icon" />
                    <span>Gate 3: VPC clusters provisioned</span>
                  </div>
                  <div className="checklist-item">
                    <Checkmark size={20} className="check-icon" />
                    <span>Gate 4: Data replicated and validated</span>
                  </div>
                  <div className="checklist-item">
                    <Checkmark size={20} className="check-icon" />
                    <span>Gate 5: Final validation complete</span>
                  </div>
                </div>
              </Tile>

              <Tile className="cutover-info">
                <h3>What happens during cutover?</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <h4>Traffic Switch</h4>
                    <p>DNS and load balancer configurations will be updated to route traffic to VPC clusters</p>
                  </div>
                  <div className="info-item">
                    <h4>24-Hour Window</h4>
                    <p>Classic clusters remain running for 24 hours. You can roll back instantly if needed</p>
                  </div>
                  <div className="info-item">
                    <h4>Monitoring</h4>
                    <p>Real-time monitoring of VPC cluster health, performance, and error rates</p>
                  </div>
                </div>
              </Tile>

              <div className="cutover-actions">
                <Button
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  onClick={handleTriggerCutover}
                >
                  Trigger cutover
                </Button>
              </div>
            </>
          )}

          {/* Monitoring State */}
          {cutoverState === 'monitoring' && (
            <>
              <InlineNotification
                kind="info"
                title="Cutover in progress"
                subtitle="Traffic is now flowing to VPC. Monitoring for 24 hours. Rollback available if needed."
                lowContrast
                hideCloseButton
                className="monitoring-notice"
              />

              {/* Countdown */}
              <Tile className="monitoring-countdown">
                <div className="countdown-header">
                  <div className="countdown-info">
                    <Time size={32} />
                    <div>
                      <h3>Decommission available in</h3>
                      <p className="countdown-time">{getTimeRemaining()}</p>
                    </div>
                  </div>
                  <Button
                    kind="danger--tertiary"
                    size="sm"
                    renderIcon={Renew}
                    onClick={handleRollback}
                  >
                    Roll back to classic
                  </Button>
                </div>
                <ProgressBar
                  value={getMonitoringProgress()}
                  max={100}
                  label="Monitoring progress"
                  className="monitoring-progress"
                />
              </Tile>

              {/* Real-time Metrics */}
              <div className="cluster-metrics">
                <h3>Live Cluster Metrics</h3>
                {mockRecommendations.map(rec => {
                  const cluster = mockClusters.find(c => c.id === rec.clusterId);
                  const metrics = clusterMetrics[rec.clusterId] || {};
                  const hasWarning = metrics.errorRate > 1;

                  return (
                    <Tile key={rec.clusterId} className={`metric-card ${hasWarning ? 'warning' : ''}`}>
                      <div className="metric-header">
                        <h4>{cluster.name}-vpc</h4>
                        <Tag type={hasWarning ? 'red' : 'green'} renderIcon={hasWarning ? WarningAlt : Checkmark}>
                          {hasWarning ? 'Warning' : 'Healthy'}
                        </Tag>
                      </div>

                      <div className="metrics-grid">
                        <div className="metric-item">
                          <span className="metric-label">Response Time</span>
                          <span className="metric-value">{metrics.responseTime}ms</span>
                          <span className="metric-baseline">Baseline: 420ms</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Error Rate</span>
                          <span className={`metric-value ${hasWarning ? 'warning' : ''}`}>
                            {metrics.errorRate}%
                          </span>
                          <span className="metric-baseline">Threshold: {'<'} 1%</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Pod Health</span>
                          <span className="metric-value">{metrics.podHealth}</span>
                          <span className="metric-baseline">All Running</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Node Status</span>
                          <span className="metric-value">{metrics.nodeStatus}</span>
                          <span className="metric-baseline">All Ready</span>
                        </div>
                      </div>

                      {hasWarning && (
                        <InlineNotification
                          kind="warning"
                          title="Threshold breach detected"
                          subtitle={`Error rate is ${metrics.errorRate}% - above the 1% threshold. Recommend investigating before proceeding.`}
                          lowContrast
                          hideCloseButton
                          className="metric-warning"
                        />
                      )}
                    </Tile>
                  );
                })}
              </div>
            </>
          )}

          {/* Ready to Decommission State */}
          {cutoverState === 'ready_to_decommission' && (
            <>
              <InlineNotification
                kind="success"
                title="24-hour monitoring complete"
                subtitle="VPC clusters have been stable. No anomalies detected. Ready to decommission classic resources."
                lowContrast
                hideCloseButton
                className="decommission-ready"
              />

              <Tile className="monitoring-summary">
                <h3>Monitoring Summary</h3>
                <StructuredListWrapper>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Cluster</StructuredListCell>
                      <StructuredListCell head>Avg Response Time</StructuredListCell>
                      <StructuredListCell head>Avg Error Rate</StructuredListCell>
                      <StructuredListCell head>Uptime</StructuredListCell>
                      <StructuredListCell head>Status</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {mockRecommendations.map(rec => {
                      const cluster = mockClusters.find(c => c.id === rec.clusterId);
                      return (
                        <StructuredListRow key={rec.clusterId}>
                          <StructuredListCell>{cluster.name}-vpc</StructuredListCell>
                          <StructuredListCell>365ms</StructuredListCell>
                          <StructuredListCell>0.2%</StructuredListCell>
                          <StructuredListCell>100%</StructuredListCell>
                          <StructuredListCell>
                            <Tag type="green" renderIcon={Checkmark} size="sm">Stable</Tag>
                          </StructuredListCell>
                        </StructuredListRow>
                      );
                    })}
                  </StructuredListBody>
                </StructuredListWrapper>
              </Tile>

              <div className="cutover-actions">
                <Button
                  kind="danger"
                  size="lg"
                  onClick={() => setShowDecommissionModal(true)}
                >
                  Decommission classic resources
                </Button>
              </div>
            </>
          )}

          {/* Complete State */}
          {cutoverState === 'complete' && (
            <>
              <InlineNotification
                kind="success"
                title="Migration Complete!"
                subtitle="Your workloads are now running on IBM Cloud VPC. Classic resources have been decommissioned."
                lowContrast
                hideCloseButton
                className="completion-notice"
              />

              <Tile className="completion-summary">
                <h3>Migration Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Clusters Migrated</span>
                    <span className="summary-value">{mockRecommendations.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Monthly Savings</span>
                    <span className="summary-value">${getTotalCostSavings().toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Annual Savings</span>
                    <span className="summary-value">${getAnnualSavings().toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Gates Passed</span>
                    <span className="summary-value">5/5</span>
                  </div>
                </div>
              </Tile>

              <Tile className="next-steps-complete">
                <h3>What's Next?</h3>
                <ul>
                  <li>Continue monitoring your VPC clusters through IBM Cloud console</li>
                  <li>Review your cost savings in the billing dashboard</li>
                  <li>Explore additional VPC features like security groups and load balancers</li>
                  <li>Contact IBM support if you need assistance</li>
                </ul>
              </Tile>

              <div className="cutover-actions">
                <Button
                  kind="primary"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Return to dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Decommission Confirmation Modal */}
      <Modal
        open={showDecommissionModal}
        onRequestClose={() => setShowDecommissionModal(false)}
        modalHeading="Decommission Classic Resources"
        primaryButtonText="Decommission"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleDecommission}
        danger
        primaryButtonDisabled={decommissionConfirm !== 'DECOMMISSION'}
      >
        <p style={{ marginBottom: '1rem' }}>
          This action is <strong>permanent and cannot be undone</strong>. Your classic clusters will be deleted and all data will be removed.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Type <strong>DECOMMISSION</strong> to confirm:
        </p>
        <TextInput
          id="decommission-confirm"
          labelText=""
          placeholder="Type DECOMMISSION"
          value={decommissionConfirm}
          onChange={(e) => setDecommissionConfirm(e.target.value)}
        />
      </Modal>

      <BobPanel
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
        messages={bobMessages}
        context="cutover"
      />
    </div>
  );
};

export default CutoverFinish;

// Made with Bob
