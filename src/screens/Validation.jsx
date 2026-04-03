import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tile,
  Tag,
  InlineNotification,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell
} from '@carbon/react';
import { ArrowRight, Checkmark, WarningAlt } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import { mockClusters, mockRecommendations } from '../mock/mockData';
import { useMigration } from '../context/MigrationContext';
import './Validation.css';

const Validation = () => {
  const navigate = useNavigate();
  const { completeStage, setCurrentStage } = useMigration();
  const [bobOpen, setBobOpen] = useState(true);
  const [bobMessages] = useState([
    "All validation checks have passed!",
    "Your VPC clusters are healthy and ready for cutover.",
    "Review the summary below and proceed when ready."
  ]);

  const handleContinue = () => {
    completeStage('validation');
    setCurrentStage('cutover');
    navigate('/cutover');
  };

  const validationSummary = {
    totalClusters: mockRecommendations.length,
    healthyCluster: mockRecommendations.length,
    failedClusters: 0,
    checksCompleted: mockRecommendations.length * 5, // 5 checks per cluster
    checksPassed: mockRecommendations.length * 5,
    checksFailed: 0
  };

  const clusterValidations = mockRecommendations.map(rec => {
    const cluster = mockClusters.find(c => c.id === rec.clusterId);
    return {
      clusterId: rec.clusterId,
      clusterName: cluster.name,
      checks: [
        { name: 'Connectivity', status: 'passed', assignee: 'SysAdmin', completedBy: 'System', notes: 'All network connections verified' },
        { name: 'Application Health', status: 'passed', assignee: 'Developer', completedBy: 'Tara', notes: 'All endpoints responding correctly' },
        { name: 'Data Integrity', status: 'passed', assignee: 'DBA', completedBy: 'Raj', notes: 'Checksums match, no data loss detected' },
        { name: 'Performance Baseline', status: 'passed', assignee: 'SysAdmin', completedBy: 'System', notes: 'Performance within acceptable range' },
        { name: 'Rollback Verification', status: 'passed', assignee: 'SysAdmin', completedBy: 'System', notes: 'Rollback procedure documented and tested' }
      ]
    };
  });

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="validation-container">
          {/* Header */}
          <div className="validation-header">
            <h1>Validation Complete</h1>
            <p className="subtitle">
              All validation checks have passed. Your VPC clusters are ready for cutover.
            </p>
          </div>

          {/* Success Notice */}
          <InlineNotification
            kind="success"
            title="Gate 5: Validation Complete"
            subtitle="All clusters have been validated and are ready for production cutover."
            lowContrast
            hideCloseButton
            className="validation-success"
          />

          {/* Validation Summary */}
          <Tile className="validation-summary">
            <h3>Validation Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-icon success">
                  <Checkmark size={32} />
                </div>
                <div className="summary-details">
                  <span className="summary-value">{validationSummary.healthyCluster}/{validationSummary.totalClusters}</span>
                  <span className="summary-label">Clusters Healthy</span>
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-icon success">
                  <Checkmark size={32} />
                </div>
                <div className="summary-details">
                  <span className="summary-value">{validationSummary.checksPassed}/{validationSummary.checksCompleted}</span>
                  <span className="summary-label">Checks Passed</span>
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-icon neutral">
                  <WarningAlt size={32} />
                </div>
                <div className="summary-details">
                  <span className="summary-value">{validationSummary.checksFailed}</span>
                  <span className="summary-label">Issues Found</span>
                </div>
              </div>
            </div>
          </Tile>

          {/* Per-Cluster Validation Details */}
          <div className="cluster-validations">
            <h3>Cluster Validation Details</h3>
            {clusterValidations.map(clusterVal => (
              <Tile key={clusterVal.clusterId} className="cluster-validation-card">
                <div className="cluster-validation-header">
                  <h4>{clusterVal.clusterName}-vpc</h4>
                  <Tag type="green" renderIcon={Checkmark}>All Checks Passed</Tag>
                </div>

                <StructuredListWrapper>
                  <StructuredListHead>
                    <StructuredListRow head>
                      <StructuredListCell head>Check</StructuredListCell>
                      <StructuredListCell head>Status</StructuredListCell>
                      <StructuredListCell head>Completed By</StructuredListCell>
                      <StructuredListCell head>Notes</StructuredListCell>
                    </StructuredListRow>
                  </StructuredListHead>
                  <StructuredListBody>
                    {clusterVal.checks.map((check, idx) => (
                      <StructuredListRow key={idx}>
                        <StructuredListCell>{check.name}</StructuredListCell>
                        <StructuredListCell>
                          <Tag type="green" renderIcon={Checkmark} size="sm">Passed</Tag>
                        </StructuredListCell>
                        <StructuredListCell>{check.completedBy}</StructuredListCell>
                        <StructuredListCell className="notes-cell">{check.notes}</StructuredListCell>
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              </Tile>
            ))}
          </div>

          {/* Next Steps */}
          <Tile className="next-steps">
            <h3>What happens next?</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Trigger Cutover</h4>
                  <p>Switch traffic from classic to VPC clusters</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>24-Hour Monitoring</h4>
                  <p>Monitor VPC clusters for stability and performance</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Decommission Classic</h4>
                  <p>After 24 hours of stable operation, decommission classic resources</p>
                </div>
              </div>
            </div>
          </Tile>

          {/* Actions */}
          <div className="validation-actions">
            <Button
              kind="primary"
              size="lg"
              renderIcon={ArrowRight}
              onClick={handleContinue}
            >
              Proceed to cutover
            </Button>
          </div>
        </div>
      </div>

      <BobPanel
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
        messages={bobMessages}
        context="validation"
      />
    </div>
  );
};

export default Validation;

// Made with Bob
