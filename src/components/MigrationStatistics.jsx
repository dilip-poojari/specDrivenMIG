import React from 'react';
import { Tile, Tag, ProgressBar } from '@carbon/react';
import { Checkmark, InProgress, WarningAlt, Time } from '@carbon/icons-react';
import './MigrationStatistics.css';

const MigrationStatistics = ({ resources = [] }) => {
  // Calculate statistics
  const stats = {
    total: resources.length,
    completed: resources.filter(r => r.status === 'complete').length,
    inProgress: resources.filter(r => 
      ['assessing', 'provisioning', 'replicating', 'validating', 'ready_to_cutover'].includes(r.status)
    ).length,
    pending: resources.filter(r => 
      ['not_started', 'pending_approval'].includes(r.status)
    ).length,
    needsAttention: resources.filter(r => 
      r.complexity === 'needs_attention' || r.complexity === 'requires_support'
    ).length
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const getStatusIcon = (type) => {
    switch(type) {
      case 'completed':
        return <Checkmark size={24} className="stat-icon completed" />;
      case 'inProgress':
        return <InProgress size={24} className="stat-icon in-progress" />;
      case 'pending':
        return <Time size={24} className="stat-icon pending" />;
      case 'needsAttention':
        return <WarningAlt size={24} className="stat-icon warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (type) => {
    switch(type) {
      case 'completed':
        return 'green';
      case 'inProgress':
        return 'blue';
      case 'pending':
        return 'gray';
      case 'needsAttention':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Tile className="migration-statistics">
      <div className="stats-header">
        <h3>Migration Progress</h3>
        <div className="overall-progress">
          <span className="progress-percentage">{completionPercentage}%</span>
          <span className="progress-label">Complete</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <ProgressBar
          value={completionPercentage}
          max={100}
          label=""
          size="big"
        />
        <div className="progress-details">
          <span>{stats.completed} of {stats.total} resources migrated</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card completed">
          <div className="stat-header">
            {getStatusIcon('completed')}
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-description">
            {stats.completed === 0 ? 'No migrations completed yet' : 
             stats.completed === 1 ? '1 resource fully migrated' :
             `${stats.completed} resources fully migrated`}
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-header">
            {getStatusIcon('inProgress')}
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-description">
            {stats.inProgress === 0 ? 'No active migrations' :
             stats.inProgress === 1 ? '1 resource being migrated' :
             `${stats.inProgress} resources being migrated`}
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-header">
            {getStatusIcon('pending')}
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-description">
            {stats.pending === 0 ? 'All resources started' :
             stats.pending === 1 ? '1 resource not started' :
             `${stats.pending} resources not started`}
          </div>
        </div>

        <div className="stat-card needs-attention">
          <div className="stat-header">
            {getStatusIcon('needsAttention')}
            <span className="stat-label">Needs Attention</span>
          </div>
          <div className="stat-value">{stats.needsAttention}</div>
          <div className="stat-description">
            {stats.needsAttention === 0 ? 'No issues detected' :
             stats.needsAttention === 1 ? '1 resource needs review' :
             `${stats.needsAttention} resources need review`}
          </div>
        </div>
      </div>

      {/* Status breakdown by resource type */}
      <div className="status-breakdown">
        <h4>Status by Resource Type</h4>
        <div className="breakdown-list">
          {resources.map((resource, index) => (
            <div key={index} className="breakdown-item">
              <div className="resource-info">
                <span className="resource-name">{resource.name}</span>
                <span className="resource-type">{resource.type}</span>
              </div>
              <Tag type={getStatusColor(
                resource.status === 'complete' ? 'completed' :
                ['assessing', 'provisioning', 'replicating', 'validating', 'ready_to_cutover'].includes(resource.status) ? 'inProgress' :
                'pending'
              )} size="sm">
                {resource.status === 'not_started' ? 'Not started' :
                 resource.status === 'assessing' ? 'Assessing' :
                 resource.status === 'pending_approval' ? 'Pending approval' :
                 resource.status === 'provisioning' ? 'Provisioning' :
                 resource.status === 'replicating' ? 'Replicating' :
                 resource.status === 'validating' ? 'Validating' :
                 resource.status === 'ready_to_cutover' ? 'Ready to cut over' :
                 resource.status === 'complete' ? 'Complete' :
                 resource.status}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </Tile>
  );
};

export default MigrationStatistics;

// Made with Bob
