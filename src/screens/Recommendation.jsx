import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  InlineNotification,
  Tile,
  Tag,
  Modal
} from '@carbon/react';
import { ArrowRight, Checkmark, WarningAlt, Add } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import {
  mockRecommendations,
  mockIncentive,
  mockBobMessages
} from '../mock/mockData';
import './Recommendation.css';

const Recommendation = () => {
  const navigate = useNavigate();
  const [bobOpen, setBobOpen] = useState(true);
  const [approvedClusters, setApprovedClusters] = useState({});
  const [acknowledgedClusters, setAcknowledgedClusters] = useState({});
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleApprove = (clusterId) => {
    setApprovedClusters({
      ...approvedClusters,
      [clusterId]: true
    });
  };

  const handleAcknowledge = (clusterId, checked) => {
    setAcknowledgedClusters({
      ...acknowledgedClusters,
      [clusterId]: checked
    });
  };

  const canProceed = () => {
    // Check if all clusters are either approved or acknowledged (for low confidence ones)
    return mockRecommendations.every(rec => {
      if (rec.requiresAcknowledgment) {
        return acknowledgedClusters[rec.clusterId] && approvedClusters[rec.clusterId];
      }
      return approvedClusters[rec.clusterId];
    });
  };

  const handleContinue = () => {
    if (canProceed()) {
      // In a real app, this would save approvals and proceed to provisioning
      alert('Gate 2 passed! Proceeding to VPC provisioning. (This is a prototype - Screen 5 not yet built)');
    }
  };

  const handleInviteMaya = () => {
    setShowInviteModal(true);
  };

  const sendInvite = () => {
    // In a real app, this would send an email invite
    alert(`Invite sent to ${inviteEmail || 'maya@example.com'} with role: IT Manager`);
    setShowInviteModal(false);
    setInviteEmail('');
  };

  const getTotalSavings = () => {
    return mockRecommendations.reduce((sum, rec) => {
      return sum + Math.abs(rec.costDelta);
    }, 0);
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="recommendation-container">
          {/* Header */}
          <div className="recommendation-header">
            <h1>VPC Recommendations</h1>
            <p className="subtitle">
              Here's how your Classic Infrastructure maps to IBM Cloud VPC.
            </p>
          </div>

          {/* Value Statement */}
          <Tile className="value-statement">
            <h3>Estimated Savings</h3>
            <div className="savings-amount">
              <span className="amount">${getTotalSavings().toLocaleString()}</span>
              <span className="period">/month</span>
            </div>
            <p className="value-description">
              Moving to VPC could save you approximately ${getTotalSavings().toLocaleString()}/month 
              while giving you improved security, faster networking, and continued IBM support.
            </p>
            <p className="disclaimer">
              This is not a final price. Estimates based on current usage and VPC pricing.
            </p>
          </Tile>

          {/* Incentive Banner */}
          <InlineNotification
            kind="info"
            title="Migration incentive"
            subtitle={mockIncentive.description}
            lowContrast
            hideCloseButton
            className="incentive-banner"
          />

          {/* Recommendation Cards */}
          <div className="recommendations-section">
            <h2>Per-Cluster Recommendations</h2>
            
            {mockRecommendations.map((rec) => (
              <div key={rec.clusterId} className="recommendation-card">
                <Tile>
                  <div className="card-header">
                    <h3>{rec.classic.name}</h3>
                    {rec.confidence === 'high' ? (
                      <Tag type="green" size="sm" renderIcon={Checkmark}>
                        High confidence
                      </Tag>
                    ) : (
                      <Tag type="yellow" size="sm" renderIcon={WarningAlt}>
                        Needs attention
                      </Tag>
                    )}
                  </div>

                  <div className="comparison-grid">
                    {/* Classic (Current) */}
                    <div className="comparison-panel classic">
                      <div className="panel-header">
                        <h4>Current (Classic)</h4>
                      </div>
                      <div className="panel-content">
                        <div className="detail-row">
                          <span className="label">Machine type:</span>
                          <span className="value">{rec.classic.machineType}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Workers:</span>
                          <span className="value">{rec.classic.workerCount}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Zones:</span>
                          <span className="value">{rec.classic.zones.join(', ')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">CPU / RAM:</span>
                          <span className="value">{rec.classic.cpu} CPU, {rec.classic.ram}GB RAM</span>
                        </div>
                        <div className="detail-row cost-row">
                          <span className="label">Est. monthly:</span>
                          <span className="value cost">${rec.classic.estimatedMonthlyCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="comparison-arrow">
                      <ArrowRight size={32} />
                    </div>

                    {/* VPC (Recommended) */}
                    <div className="comparison-panel vpc">
                      <div className="panel-header">
                        <h4>Recommended (VPC)</h4>
                      </div>
                      <div className="panel-content">
                        <div className="detail-row">
                          <span className="label">VPC profile:</span>
                          <span className="value">{rec.vpc.profile}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Workers:</span>
                          <span className="value">{rec.vpc.workerCount}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">VPC zones:</span>
                          <span className="value">{rec.vpc.zones.join(', ')}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">CPU / RAM:</span>
                          <span className="value">{rec.vpc.cpu} CPU, {rec.vpc.ram}GB RAM</span>
                        </div>
                        <div className="detail-row cost-row">
                          <span className="label">Est. monthly:</span>
                          <span className="value cost">${rec.vpc.estimatedMonthlyCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Delta */}
                  <div className={`cost-delta ${rec.costDelta < 0 ? 'savings' : 'increase'}`}>
                    {rec.costDelta < 0 ? (
                      <>
                        <Checkmark size={20} />
                        <span>Est. saving: ~${Math.abs(rec.costDelta).toLocaleString()}/month ({Math.abs(rec.costDeltaPercent).toFixed(1)}%)</span>
                      </>
                    ) : rec.costDelta > 0 ? (
                      <>
                        <WarningAlt size={20} />
                        <span>Est. increase: ~${rec.costDelta.toLocaleString()}/month ({rec.costDeltaPercent.toFixed(1)}%)</span>
                      </>
                    ) : (
                      <span>Similar cost: ~${rec.vpc.estimatedMonthlyCost.toLocaleString()}/month</span>
                    )}
                  </div>

                  {/* Bob's Reasoning */}
                  <div className="reasoning-section">
                    <h5>How did we get this?</h5>
                    <p>{rec.reasoning}</p>
                  </div>

                  {/* Low Confidence Warning */}
                  {rec.requiresAcknowledgment && (
                    <InlineNotification
                      kind="warning"
                      title="Attention needed"
                      subtitle={rec.reasoning}
                      lowContrast
                      hideCloseButton
                      className="attention-warning"
                    />
                  )}

                  {/* Acknowledgment Checkbox */}
                  {rec.requiresAcknowledgment && (
                    <div className="acknowledgment-section">
                      <Checkbox
                        id={`ack-${rec.clusterId}`}
                        labelText="I understand and want to continue"
                        checked={acknowledgedClusters[rec.clusterId] || false}
                        onChange={(e) => handleAcknowledge(rec.clusterId, e.target.checked)}
                      />
                    </div>
                  )}

                  {/* Approval Actions */}
                  <div className="approval-actions">
                    {!approvedClusters[rec.clusterId] ? (
                      <>
                        <Button
                          kind="primary"
                          size="md"
                          onClick={() => handleApprove(rec.clusterId)}
                          disabled={rec.requiresAcknowledgment && !acknowledgedClusters[rec.clusterId]}
                        >
                          Approve {rec.classic.name}
                        </Button>
                        <Button
                          kind="tertiary"
                          size="md"
                          renderIcon={Add}
                          onClick={handleInviteMaya}
                        >
                          Invite Maya to approve costs
                        </Button>
                      </>
                    ) : (
                      <div className="approved-indicator">
                        <Checkmark size={20} />
                        <span>Approved</span>
                      </div>
                    )}
                  </div>
                </Tile>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="continue-section">
            <Button
              kind="primary"
              size="lg"
              renderIcon={ArrowRight}
              onClick={handleContinue}
              disabled={!canProceed()}
            >
              Continue to provisioning
            </Button>
            {!canProceed() && (
              <p className="continue-hint">
                Approve all clusters to continue
              </p>
            )}
          </div>

          {/* Gate 2 Info */}
          {canProceed() && (
            <InlineNotification
              kind="success"
              title="Gate 2: Approvals Complete"
              subtitle="All recommendations have been approved. Ready to provision VPC resources."
              lowContrast
              hideCloseButton
              className="gate-notification"
            />
          )}
        </div>
      </div>

      <BobPanel
        messages={mockBobMessages.recommendation}
        context="recommendation"
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
      />

      {/* Invite Modal */}
      <Modal
        open={showInviteModal}
        onRequestClose={() => setShowInviteModal(false)}
        modalHeading="Invite teammate"
        primaryButtonText="Send invite"
        secondaryButtonText="Cancel"
        onRequestSubmit={sendInvite}
      >
        <p>Invite Maya (IT Manager) to review and approve costs.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#8d8d8d' }}>
          She'll receive a direct link to approve these recommendations without needing full hub access.
        </p>
      </Modal>
    </div>
  );
};

export default Recommendation;

// Made with Bob
