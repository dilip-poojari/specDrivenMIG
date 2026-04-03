import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SideNav, SideNavItems, SideNavLink } from '@carbon/react';
import {
  Checkmark,
  InProgress,
  Locked,
  Connect,
  Catalog,
  Recommend,
  CloudApp,
  DataBase,
  CheckmarkOutline,
  Rocket
} from '@carbon/icons-react';
import { useMigration } from '../context/MigrationContext';
import './Navigation.css';

const Navigation = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStageStatus, canAccessStage } = useMigration();

  const stages = [
    {
      id: 'connect',
      name: 'Connect Account',
      path: '/connect',
      icon: Connect,
      gate: null
    },
    {
      id: 'inventory',
      name: 'Resource Inventory',
      path: '/inventory',
      icon: Catalog,
      gate: 'Gate 1: Inventory Complete'
    },
    {
      id: 'recommendation',
      name: 'Recommendation',
      path: '/recommendation',
      icon: Recommend,
      gate: 'Gate 2: Approval Required'
    },
    {
      id: 'provision',
      name: 'Provision VPC',
      path: '/provision',
      icon: CloudApp,
      gate: 'Gate 3: Provisioning Complete'
    },
    {
      id: 'migration',
      name: 'Data Migration',
      path: '/migration',
      icon: DataBase,
      gate: 'Gate 4: Data Replicated'
    },
    {
      id: 'validation',
      name: 'Validation',
      path: '/validation',
      icon: CheckmarkOutline,
      gate: 'Gate 5: Validation Complete'
    },
    {
      id: 'cutover',
      name: 'Cutover & Finish',
      path: '/cutover',
      icon: Rocket,
      gate: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Checkmark size={16} className="status-icon completed" />;
      case 'in_progress':
        return <InProgress size={16} className="status-icon in-progress" />;
      case 'locked':
        return <Locked size={16} className="status-icon locked" />;
      default:
        return null;
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <SideNav
      isFixedNav
      expanded={isOpen}
      onOverlayClick={onToggle}
      aria-label="Migration stages navigation"
      className="migration-nav"
    >
      <SideNavItems>
        <div className="nav-header">
          <h2>Migration Stages</h2>
        </div>
        
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const isCurrentStage = isActive(stage.path);
          const status = getStageStatus(stage.id);
          const disabled = !canAccessStage(stage.id);

          return (
            <div key={stage.id} className="nav-stage-item">
              <SideNavLink
                renderIcon={() => <StageIcon size={20} />}
                onClick={() => !disabled && navigate(stage.path)}
                isActive={isCurrentStage}
                className={`stage-link ${status} ${disabled ? 'disabled' : ''}`}
              >
                <div className="stage-content">
                  <div className="stage-name">
                    <span>{stage.name}</span>
                    {getStatusIcon(status)}
                  </div>
                  {stage.gate && (
                    <div className="stage-gate">{stage.gate}</div>
                  )}
                </div>
              </SideNavLink>
            </div>
          );
        })}
      </SideNavItems>
    </SideNav>
  );
};

export default Navigation;

// Made with Bob
