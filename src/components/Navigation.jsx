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
import './Navigation.css';

const Navigation = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const stages = [
    {
      id: 1,
      name: 'Connect Account',
      path: '/connect',
      icon: Connect,
      status: 'completed',
      gate: null
    },
    {
      id: 2,
      name: 'Resource Inventory',
      path: '/inventory',
      icon: Catalog,
      status: 'completed',
      gate: 'Gate 1: Inventory Complete'
    },
    {
      id: 3,
      name: 'Recommendation',
      path: '/recommendation',
      icon: Recommend,
      status: 'in_progress',
      gate: 'Gate 2: Approval Required'
    },
    {
      id: 4,
      name: 'Provision VPC',
      path: '/provision',
      icon: CloudApp,
      status: 'locked',
      gate: 'Gate 3: Provisioning Complete'
    },
    {
      id: 5,
      name: 'Data Migration',
      path: '/migration',
      icon: DataBase,
      status: 'locked',
      gate: 'Gate 4: Data Replicated'
    },
    {
      id: 6,
      name: 'Validation',
      path: '/validation',
      icon: CheckmarkOutline,
      status: 'locked',
      gate: 'Gate 5: Validation Complete'
    },
    {
      id: 7,
      name: 'Cutover & Finish',
      path: '/cutover',
      icon: Rocket,
      status: 'locked',
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

  const canNavigate = (status) => {
    return status === 'completed' || status === 'in_progress';
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
          const disabled = !canNavigate(stage.status);

          return (
            <div key={stage.id} className="nav-stage-item">
              <SideNavLink
                renderIcon={() => <StageIcon size={20} />}
                onClick={() => !disabled && navigate(stage.path)}
                isActive={isCurrentStage}
                className={`stage-link ${stage.status} ${disabled ? 'disabled' : ''}`}
              >
                <div className="stage-content">
                  <div className="stage-name">
                    <span>{stage.name}</span>
                    {getStatusIcon(stage.status)}
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
