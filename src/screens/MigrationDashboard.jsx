import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  InlineNotification,
  Tag,
  Tile,
  ProgressBar,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell
} from '@carbon/react';
import { ArrowRight, Add, Calendar, Money } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import MigrationStatistics from '../components/MigrationStatistics';
import {
  mockUser,
  mockDeadline,
  mockIncentive,
  mockClusters,
  mockDatabases,
  mockBobMessages,
  getTotalEstimatedCost
} from '../mock/mockData';
import './MigrationDashboard.css';

const MigrationDashboard = ({ showScanSuccess = false, onDismissScanSuccess }) => {
  const navigate = useNavigate();
  const [bobOpen, setBobOpen] = useState(true);

  const totalResources = mockClusters.length + mockDatabases.length;
  const totalCost = getTotalEstimatedCost();

  const handleScanForMore = () => {
    // Navigate to Connect Account screen to scan for more resources
    navigate('/connect');
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'gray',
      assessing: 'blue',
      pending_approval: 'purple',
      provisioning: 'cyan',
      replicating: 'teal',
      validating: 'magenta',
      ready_to_cutover: 'green',
      complete: 'green'
    };
    return colors[status] || 'gray';
  };

  const getStatusLabel = (status) => {
    const labels = {
      not_started: 'Not started',
      assessing: 'Assessing',
      pending_approval: 'Pending approval',
      provisioning: 'Provisioning',
      replicating: 'Replicating',
      validating: 'Validating',
      ready_to_cutover: 'Ready to cut over',
      complete: 'Complete'
    };
    return labels[status] || status;
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      simple: 'green',
      needs_attention: 'yellow',
      requires_support: 'red'
    };
    return colors[complexity] || 'gray';
  };

  const getComplexityLabel = (complexity) => {
    const labels = {
      simple: 'Simple',
      needs_attention: 'Needs attention',
      requires_support: 'Requires IBM support'
    };
    return labels[complexity] || complexity;
  };

  const calculateMonthsRemaining = () => {
    const deadline = new Date(mockDeadline.endOfSupportDate);
    const now = new Date();
    const months = Math.round((deadline - now) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <h1>IBM Cloud Migration Hub</h1>
            <p className="welcome-message">
              Welcome back, {mockUser.name}. You have {totalResources} resources to migrate.
            </p>
          </div>

          {/* Deadline Timeline */}
          <InlineNotification
            kind="warning"
            title="Classic infrastructure end of support"
            subtitle={`${mockDeadline.endOfSupportDate} — You have ${calculateMonthsRemaining()} months remaining.`}
            lowContrast
            hideCloseButton
            className="deadline-banner"
          />

          {/* Scan Success Notification */}
          {showScanSuccess && (
            <InlineNotification
              kind="success"
              title="Account scan complete"
              subtitle="Your IBM Cloud account has been successfully connected and scanned. Resources are ready for migration."
              lowContrast
              onCloseButtonClick={onDismissScanSuccess}
              className="scan-success-banner"
            />
          )}

          {/* Incentive Banner */}
          <InlineNotification
            kind="info"
            title="Migration incentive available"
            subtitle={mockIncentive.description}
            lowContrast
            hideCloseButton
            className="incentive-banner"
          />

          {/* Migration Statistics */}
          <MigrationStatistics resources={[...mockClusters, ...mockDatabases]} />

          {/* Summary Cards */}
          <div className="summary-cards">
            <Tile className="summary-card">
              <div className="summary-icon">
                <Calendar size={32} />
              </div>
              <div className="summary-content">
                <h3>{calculateMonthsRemaining()} months</h3>
                <p>Until deadline</p>
              </div>
            </Tile>

            <Tile className="summary-card">
              <div className="summary-icon">
                <Money size={32} />
              </div>
              <div className="summary-content">
                <h3>${totalCost.toLocaleString()}</h3>
                <p>Estimated monthly cost</p>
                <span className="disclaimer">Based on current usage</span>
              </div>
            </Tile>

            <Tile className="summary-card">
              <div className="summary-icon">
                <Money size={32} />
              </div>
              <div className="summary-content">
                <h3>${mockIncentive.amount.toLocaleString()}</h3>
                <p>VPC credit available</p>
                <span className="disclaimer">Complete by {mockIncentive.deadline}</span>
              </div>
            </Tile>
          </div>

          {/* Kubernetes Clusters */}
          <div className="resource-section">
            <div className="section-header">
              <h2>Kubernetes Clusters ({mockClusters.length})</h2>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Add}
                onClick={handleScanForMore}
              >
                Scan for more
              </Button>
            </div>


            <StructuredListWrapper>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Resource</StructuredListCell>
                  <StructuredListCell head>Configuration</StructuredListCell>
                  <StructuredListCell head>Status</StructuredListCell>
                  <StructuredListCell head>Readiness</StructuredListCell>
                  <StructuredListCell head>Est. Monthly Cost</StructuredListCell>
                  <StructuredListCell head>Actions</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {mockClusters.map((cluster) => (
                  <StructuredListRow key={cluster.id}>
                    <StructuredListCell>
                      <div className="resource-name">
                        <strong>{cluster.name}</strong>
                        <span className="resource-type">{cluster.type}</span>
                        {cluster.dependencies.length > 0 && (
                          <Tag type="blue" size="sm" className="dependency-tag">
                            Connected to {cluster.dependencies[0]}
                          </Tag>
                        )}
                      </div>
                    </StructuredListCell>
                    <StructuredListCell>
                      <div className="config-details">
                        <span>{cluster.workerCount} workers</span>
                        <span>{cluster.machineType}</span>
                        <span>{cluster.zones.length} zones</span>
                      </div>
                    </StructuredListCell>
                    <StructuredListCell>
                      <Tag type={getStatusColor(cluster.status)} size="sm">
                        {getStatusLabel(cluster.status)}
                      </Tag>
                      <Tag type={getComplexityColor(cluster.complexity)} size="sm">
                        {getComplexityLabel(cluster.complexity)}
                      </Tag>
                    </StructuredListCell>
                    <StructuredListCell>
                      <div className="readiness-score">
                        <ProgressBar
                          value={cluster.readinessScore}
                          max={100}
                          size="sm"
                          label=""
                        />
                        <span>{cluster.readinessScore}%</span>
                      </div>
                    </StructuredListCell>
                    <StructuredListCell>
                      <strong>${cluster.estimatedMonthlyCost.toLocaleString()}</strong>
                      <span className="cost-disclaimer">Estimated</span>
                    </StructuredListCell>
                    <StructuredListCell>
                      <Button
                        kind="primary"
                        size="sm"
                        renderIcon={ArrowRight}
                        onClick={() => navigate('/inventory')}
                      >
                        View details
                      </Button>
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          </div>

          {/* Databases */}
          <div className="resource-section">
            <div className="section-header">
              <h2>Databases ({mockDatabases.length})</h2>
            </div>

            <StructuredListWrapper>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Resource</StructuredListCell>
                  <StructuredListCell head>Type</StructuredListCell>
                  <StructuredListCell head>Status</StructuredListCell>
                  <StructuredListCell head>Readiness</StructuredListCell>
                  <StructuredListCell head>Est. Monthly Cost</StructuredListCell>
                  <StructuredListCell head>Actions</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {mockDatabases.map((db) => (
                  <StructuredListRow key={db.id}>
                    <StructuredListCell>
                      <div className="resource-name">
                        <strong>{db.name}</strong>
                        {db.connectedTo.length > 0 && (
                          <Tag type="blue" size="sm" className="dependency-tag">
                            Used by {db.connectedTo.length} resource(s)
                          </Tag>
                        )}
                      </div>
                    </StructuredListCell>
                    <StructuredListCell>{db.type}</StructuredListCell>
                    <StructuredListCell>
                      <Tag type={getStatusColor(db.status)} size="sm">
                        {getStatusLabel(db.status)}
                      </Tag>
                    </StructuredListCell>
                    <StructuredListCell>
                      <div className="readiness-score">
                        <ProgressBar
                          value={db.readinessScore}
                          max={100}
                          size="sm"
                          label=""
                        />
                        <span>{db.readinessScore}%</span>
                      </div>
                    </StructuredListCell>
                    <StructuredListCell>
                      <strong>${db.estimatedMonthlyCost.toLocaleString()}</strong>
                      <span className="cost-disclaimer">Estimated</span>
                    </StructuredListCell>
                    <StructuredListCell>
                      <Button
                        kind="primary"
                        size="sm"
                        renderIcon={ArrowRight}
                        disabled
                      >
                        Start migration
                      </Button>
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          </div>

          {/* Team Collaboration */}
          <div className="collaboration-section">
            <Tile>
              <h3>Team Collaboration</h3>
              <p>Invite teammates to help with your migration. They'll get role-specific views without needing full hub access.</p>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Add}
              >
                Invite teammates
              </Button>
            </Tile>
          </div>
        </div>
      </div>

      <BobPanel
        messages={mockBobMessages.dashboard}
        context="dashboard"
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
      />
    </div>
  );
};

export default MigrationDashboard;

// Made with Bob
