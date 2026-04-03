import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Tag,
  Tile,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  InlineNotification
} from '@carbon/react';
import { ArrowRight, Download, Add } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import {
  mockUser,
  mockClusters,
  mockDatabases,
  mockBobMessages,
  getTotalEstimatedCost
} from '../mock/mockData';
import { useMigration } from '../context/MigrationContext';
import './ResourceInventory.css';

const ResourceInventory = () => {
  const navigate = useNavigate();
  const { completeStage, setCurrentStage } = useMigration();
  const [bobOpen, setBobOpen] = useState(true);

  const totalResources = mockClusters.length + mockDatabases.length;
  const totalCost = getTotalEstimatedCost();

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

  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download would start here. This is a prototype.');
  };

  const handleInviteTeammate = () => {
    // In a real implementation, this would open an invite modal
    alert('Invite teammate modal would open here. This is a prototype.');
  };

  const handleContinue = () => {
    // Mark inventory stage as complete and move to recommendation
    completeStage('inventory');
    setCurrentStage('recommendation');
    navigate('/recommendation');
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="inventory-container">
          {/* Header */}
          <div className="inventory-header">
            <h1>Resource Inventory</h1>
            <p className="subtitle">
              Here's what we found in your IBM Cloud Classic Infrastructure account.
            </p>
          </div>

          {/* Summary Section */}
          <Tile className="inventory-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <h3>{totalResources}</h3>
                <p>Total resources</p>
              </div>
              <div className="summary-item">
                <h3>${totalCost.toLocaleString()}</h3>
                <p>Estimated monthly cost</p>
                <span className="disclaimer">Based on current usage. Not a final billing figure.</span>
              </div>
              <div className="summary-item">
                <h3>{mockClusters.length}</h3>
                <p>Kubernetes clusters</p>
              </div>
              <div className="summary-item">
                <h3>{mockDatabases.length}</h3>
                <p>Databases</p>
              </div>
            </div>
          </Tile>

          {/* Kubernetes Clusters */}
          <div className="resource-section">
            <h2>Kubernetes Clusters ({mockClusters.length})</h2>
            
            {mockClusters.map((cluster) => (
              <Tile key={cluster.id} className="resource-card">
                <div className="resource-card-header">
                  <div>
                    <h3>{cluster.name}</h3>
                    <p className="resource-type">{cluster.type}</p>
                  </div>
                  <div className="resource-tags">
                    <Tag type={getComplexityColor(cluster.complexity)} size="sm">
                      {getComplexityLabel(cluster.complexity)}
                    </Tag>
                  </div>
                </div>

                <div className="resource-details">
                  <div className="detail-row">
                    <span className="detail-label">Configuration:</span>
                    <span className="detail-value">
                      {cluster.workerCount} workers × {cluster.machineType} ({cluster.cpu} CPU, {cluster.ram}GB RAM)
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Zones:</span>
                    <span className="detail-value">{cluster.zones.join(', ')}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Estimated monthly cost:</span>
                    <span className="detail-value cost">${cluster.estimatedMonthlyCost.toLocaleString()}</span>
                  </div>
                  {cluster.dependencies.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Dependencies:</span>
                      <span className="detail-value">
                        <Tag type="blue" size="sm">Connected to {cluster.dependencies[0]}</Tag>
                      </span>
                    </div>
                  )}
                  {cluster.complexityReason && (
                    <InlineNotification
                      kind="warning"
                      title="Attention needed"
                      subtitle={cluster.complexityReason}
                      lowContrast
                      hideCloseButton
                      className="complexity-warning"
                    />
                  )}
                </div>
              </Tile>
            ))}
          </div>

          {/* Databases */}
          <div className="resource-section">
            <h2>Databases ({mockDatabases.length})</h2>
            
            {mockDatabases.map((db) => (
              <Tile key={db.id} className="resource-card">
                <div className="resource-card-header">
                  <div>
                    <h3>{db.name}</h3>
                    <p className="resource-type">{db.type}</p>
                  </div>
                </div>

                <div className="resource-details">
                  <div className="detail-row">
                    <span className="detail-label">Estimated monthly cost:</span>
                    <span className="detail-value cost">${db.estimatedMonthlyCost.toLocaleString()}</span>
                  </div>
                  {db.connectedTo.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Used by:</span>
                      <span className="detail-value">
                        <Tag type="blue" size="sm">{db.connectedTo.length} resource(s)</Tag>
                      </span>
                    </div>
                  )}
                </div>
              </Tile>
            ))}
          </div>

          {/* Actions Section */}
          <div className="actions-section">
            <div className="actions-left">
              <Button
                kind="secondary"
                size="md"
                renderIcon={Download}
                onClick={handleDownloadPDF}
              >
                Download as PDF
              </Button>
              <Button
                kind="tertiary"
                size="md"
                renderIcon={Add}
                onClick={handleInviteTeammate}
              >
                Invite Maya to review costs
              </Button>
            </div>
            <Button
              kind="primary"
              size="md"
              renderIcon={ArrowRight}
              onClick={handleContinue}
            >
              This looks right — continue
            </Button>
          </div>

          {/* Gate 1 Confirmation */}
          <InlineNotification
            kind="info"
            title="Gate 1: Inventory Complete"
            subtitle="You've reviewed your resource inventory. Ready to see VPC recommendations?"
            lowContrast
            hideCloseButton
            className="gate-notification"
          />
        </div>
      </div>

      <BobPanel
        messages={mockBobMessages.inventory}
        context="inventory"
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
      />
    </div>
  );
};

export default ResourceInventory;

// Made with Bob
