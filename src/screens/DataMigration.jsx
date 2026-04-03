import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ProgressBar,
  Tile,
  Tag,
  Checkbox,
  TextArea,
  InlineNotification,
  Accordion,
  AccordionItem
} from '@carbon/react';
import { ArrowRight, Checkmark, InProgress, WarningAlt } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import { mockClusters, mockRecommendations, mockBobMessages } from '../mock/mockData';
import { useMigration } from '../context/MigrationContext';
import './DataMigration.css';

const DataMigration = () => {
  const navigate = useNavigate();
  const { completeStage, setCurrentStage } = useMigration();
  const [bobOpen, setBobOpen] = useState(true);
  const [migrationState, setMigrationState] = useState('start'); // 'start', 'replicating', 'validating', 'complete'
  const [replicationProgress, setReplicationProgress] = useState({});
  const [validationChecklist, setValidationChecklist] = useState({});
  const [bobMessages, setBobMessages] = useState([
    "Ready to start data migration using IBM Block Replication Service (BRS).",
    "I'll copy your data from classic to VPC clusters while keeping classic running.",
    "This typically takes 4-6 hours depending on data volume."
  ]);

  // Initialize validation checklist
  useEffect(() => {
    const checklist = {};
    mockRecommendations.forEach(rec => {
      checklist[rec.clusterId] = {
        connectivity: { status: 'pending', notes: '', assignee: '' },
        applicationHealth: { status: 'pending', notes: '', assignee: '' },
        dataIntegrity: { status: 'pending', notes: '', assignee: '' },
        performanceBaseline: { status: 'pending', notes: '', assignee: '' },
        rollbackVerification: { status: 'pending', notes: '', assignee: '' }
      };
    });
    setValidationChecklist(checklist);
  }, []);

  // Simulate replication progress
  useEffect(() => {
    if (migrationState === 'replicating') {
      const clusters = mockRecommendations.map(rec => rec.clusterId);
      
      // Initialize progress
      const initialProgress = {};
      clusters.forEach(id => {
        const cluster = mockClusters.find(c => c.id === id);
        const dataSize = Math.floor(Math.random() * 500) + 200; // GB
        initialProgress[id] = {
          progress: 0,
          status: 'replicating',
          dataSize: dataSize,
          copied: 0,
          rate: Math.floor(Math.random() * 50) + 30, // MB/s
          estimatedTime: Math.floor((dataSize * 1024) / ((Math.random() * 50) + 30) / 60) // minutes
        };
      });
      setReplicationProgress(initialProgress);

      // Simulate progress updates
      const interval = setInterval(() => {
        setReplicationProgress(prev => {
          const updated = { ...prev };
          let allComplete = true;

          Object.keys(updated).forEach(clusterId => {
            if (updated[clusterId].progress < 100) {
              allComplete = false;
              const increment = Math.random() * 3 + 1;
              const newProgress = Math.min(updated[clusterId].progress + increment, 100);
              const newCopied = Math.floor((newProgress / 100) * updated[clusterId].dataSize);
              const remainingGB = updated[clusterId].dataSize - newCopied;
              const newEstimatedTime = Math.floor((remainingGB * 1024) / updated[clusterId].rate / 60);

              updated[clusterId] = {
                ...updated[clusterId],
                progress: newProgress,
                copied: newCopied,
                estimatedTime: newEstimatedTime,
                status: newProgress >= 100 ? 'complete' : 'replicating'
              };
            }
          });

          if (allComplete) {
            clearInterval(interval);
            setTimeout(() => {
              setMigrationState('validating');
              setBobMessages([
                "Data replication complete for all clusters!",
                "Now it's time to validate. I've created a checklist based on your clusters.",
                "You can assign sections to your team members."
              ]);
            }, 1000);
          }

          return updated;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [migrationState]);

  const handleStartReplication = () => {
    setMigrationState('replicating');
    setBobMessages([
      "Starting Block Replication Service (BRS)...",
      "Copying data from classic to VPC clusters.",
      "I'll update you on progress every few minutes."
    ]);
  };

  const handleChecklistChange = (clusterId, section, field, value) => {
    setValidationChecklist(prev => ({
      ...prev,
      [clusterId]: {
        ...prev[clusterId],
        [section]: {
          ...prev[clusterId][section],
          [field]: value
        }
      }
    }));
  };

  const isValidationComplete = () => {
    return Object.values(validationChecklist).every(cluster =>
      Object.values(cluster).every(section => section.status === 'pass' || section.status === 'skip')
    );
  };

  const handleContinue = () => {
    if (isValidationComplete()) {
      completeStage('migration');
      setCurrentStage('validation');
      setMigrationState('complete');
      setBobMessages([
        "Gate 4: Data Migration Complete!",
        "All validation checks passed.",
        "Ready to proceed to final validation and cutover?"
      ]);
      // For now, show alert since validation screen isn't built yet
      setTimeout(() => {
        alert('Gate 4 passed! Ready for final validation and cutover. (Validation screen coming next)');
      }, 500);
    }
  };

  const getChecklistSections = () => [
    {
      id: 'connectivity',
      name: 'Connectivity',
      description: 'Verify network connectivity between VPC cluster and dependent services',
      assignee: 'SysAdmin'
    },
    {
      id: 'applicationHealth',
      name: 'Application Health',
      description: 'Test application endpoints and verify all services are responding',
      assignee: 'Developer'
    },
    {
      id: 'dataIntegrity',
      name: 'Data Integrity',
      description: 'Compare data checksums and verify no data loss during replication',
      assignee: 'DBA'
    },
    {
      id: 'performanceBaseline',
      name: 'Performance Baseline',
      description: 'Run performance tests and compare against classic baseline',
      assignee: 'SysAdmin'
    },
    {
      id: 'rollbackVerification',
      name: 'Rollback Verification',
      description: 'Verify rollback procedure is documented and tested',
      assignee: 'SysAdmin'
    }
  ];

  const formatTime = (minutes) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="migration-container">
          {/* Header */}
          <div className="migration-header">
            <h1>Data Migration</h1>
            <p className="subtitle">
              {migrationState === 'start' && "Copy your data from classic to VPC clusters using Block Replication Service."}
              {migrationState === 'replicating' && "Replication in progress. Your classic clusters remain operational."}
              {migrationState === 'validating' && "Validate your VPC clusters before proceeding to cutover."}
              {migrationState === 'complete' && "Data migration and validation complete!"}
            </p>
          </div>

          {/* Start State */}
          {migrationState === 'start' && (
            <>
              <InlineNotification
                kind="info"
                title="Safe migration process"
                subtitle="We'll copy your data to VPC while your classic clusters continue running. No downtime during replication."
                lowContrast
                hideCloseButton
                className="safety-notice"
              />

              <Tile className="migration-overview">
                <h3>What will happen</h3>
                <div className="migration-steps">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Initialize BRS</h4>
                      <p>Set up Block Replication Service connections between classic and VPC</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Copy data</h4>
                      <p>Replicate all persistent volumes and configurations to VPC clusters</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Validate</h4>
                      <p>Run validation checklist to ensure data integrity and application health</p>
                    </div>
                  </div>
                </div>
              </Tile>

              <div className="clusters-to-migrate">
                <h3>Clusters to migrate</h3>
                {mockRecommendations.map(rec => {
                  const cluster = mockClusters.find(c => c.id === rec.clusterId);
                  return (
                    <Tile key={rec.clusterId} className="cluster-migrate-card">
                      <div className="cluster-migrate-header">
                        <h4>{cluster.name}</h4>
                        <Tag type="blue">Ready</Tag>
                      </div>
                      <div className="cluster-migrate-info">
                        <span>Classic → VPC replication</span>
                        <span>Estimated: 4-6 hours</span>
                      </div>
                    </Tile>
                  );
                })}
              </div>

              <div className="migration-actions">
                <Button
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  onClick={handleStartReplication}
                >
                  Start data replication
                </Button>
              </div>
            </>
          )}

          {/* Replicating State */}
          {migrationState === 'replicating' && (
            <div className="replication-progress">
              <InlineNotification
                kind="info"
                title="Replication in progress"
                subtitle="Data is being copied to VPC. Your classic clusters are still running and serving traffic."
                lowContrast
                hideCloseButton
                className="replication-notice"
              />

              {mockRecommendations.map(rec => {
                const cluster = mockClusters.find(c => c.id === rec.clusterId);
                const progress = replicationProgress[rec.clusterId] || { progress: 0, status: 'pending' };

                return (
                  <Tile key={rec.clusterId} className="replication-card">
                    <div className="replication-header">
                      <div className="cluster-info">
                        <h4>{cluster.name}</h4>
                        {progress.status === 'replicating' && <Tag type="blue" renderIcon={InProgress}>Replicating</Tag>}
                        {progress.status === 'complete' && <Tag type="green" renderIcon={Checkmark}>Complete</Tag>}
                      </div>
                      <span className="progress-percentage">{Math.round(progress.progress)}%</span>
                    </div>

                    <ProgressBar
                      value={progress.progress}
                      max={100}
                      status={progress.status === 'complete' ? 'finished' : 'active'}
                      className="replication-progress-bar"
                    />

                    <div className="replication-stats">
                      <div className="stat">
                        <span className="stat-label">Copied:</span>
                        <span className="stat-value">{progress.copied} GB / {progress.dataSize} GB</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Rate:</span>
                        <span className="stat-value">{progress.rate} MB/s</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Est. remaining:</span>
                        <span className="stat-value">{formatTime(progress.estimatedTime)}</span>
                      </div>
                    </div>
                  </Tile>
                );
              })}
            </div>
          )}

          {/* Validating State */}
          {migrationState === 'validating' && (
            <>
              <InlineNotification
                kind="success"
                title="Replication complete"
                subtitle="All data has been copied to VPC. Now validate your clusters before proceeding."
                lowContrast
                hideCloseButton
                className="validation-notice"
              />

              <div className="validation-checklist">
                <h3>Validation Checklist</h3>
                <p className="checklist-description">
                  Complete these checks for each cluster. You can assign sections to team members.
                </p>

                {mockRecommendations.map(rec => {
                  const cluster = mockClusters.find(c => c.id === rec.clusterId);
                  const clusterChecklist = validationChecklist[rec.clusterId] || {};

                  return (
                    <Accordion key={rec.clusterId} className="cluster-checklist">
                      <AccordionItem title={`${cluster.name} - Validation`}>
                        {getChecklistSections().map(section => {
                          const sectionData = clusterChecklist[section.id] || { status: 'pending', notes: '', assignee: '' };

                          return (
                            <div key={section.id} className="checklist-section">
                              <div className="section-header">
                                <h4>{section.name}</h4>
                                <Tag type="gray">Assignee: {section.assignee}</Tag>
                              </div>
                              <p className="section-description">{section.description}</p>

                              <div className="section-controls">
                                <div className="status-buttons">
                                  <Button
                                    kind={sectionData.status === 'pass' ? 'primary' : 'tertiary'}
                                    size="sm"
                                    onClick={() => handleChecklistChange(rec.clusterId, section.id, 'status', 'pass')}
                                  >
                                    Pass
                                  </Button>
                                  <Button
                                    kind={sectionData.status === 'fail' ? 'danger' : 'tertiary'}
                                    size="sm"
                                    onClick={() => handleChecklistChange(rec.clusterId, section.id, 'status', 'fail')}
                                  >
                                    Fail
                                  </Button>
                                  <Button
                                    kind={sectionData.status === 'skip' ? 'secondary' : 'tertiary'}
                                    size="sm"
                                    onClick={() => handleChecklistChange(rec.clusterId, section.id, 'status', 'skip')}
                                  >
                                    Skip
                                  </Button>
                                </div>

                                <TextArea
                                  labelText="Notes"
                                  placeholder="Add validation notes..."
                                  value={sectionData.notes}
                                  onChange={(e) => handleChecklistChange(rec.clusterId, section.id, 'notes', e.target.value)}
                                  rows={2}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>

              <div className="migration-actions">
                <Button
                  kind="primary"
                  size="lg"
                  renderIcon={ArrowRight}
                  onClick={handleContinue}
                  disabled={!isValidationComplete()}
                >
                  Continue to cutover
                </Button>
                {!isValidationComplete() && (
                  <p className="action-hint">Complete all validation checks to continue</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <BobPanel
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
        messages={bobMessages}
        context="migration"
      />
    </div>
  );
};

export default DataMigration;

// Made with Bob
