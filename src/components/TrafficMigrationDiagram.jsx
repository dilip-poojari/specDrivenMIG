import React, { useEffect, useState } from 'react';
import './TrafficMigrationDiagram.css';

const TrafficMigrationDiagram = ({ progress = 0 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to target
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= progress) {
          clearInterval(interval);
          return progress;
        }
        return Math.min(prev + 2, progress);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  // Calculate traffic distribution
  const classicTraffic = 100 - animatedProgress;
  const vpcTraffic = animatedProgress;

  // Generate flowing arrows
  const generateArrows = (count, delay) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="traffic-arrow"
        style={{
          animationDelay: `${delay + (i * 0.3)}s`
        }}
      >
        →
      </div>
    ));
  };

  return (
    <div className="traffic-migration-diagram">
      <div className="diagram-header">
        <h4>Traffic Migration Progress</h4>
        <div className="progress-indicator">
          <span className="progress-value">{animatedProgress}%</span>
          <span className="progress-label">migrated to VPC</span>
        </div>
      </div>

      <div className="diagram-container">
        {/* Classic Infrastructure (Left) */}
        <div className="infrastructure-box classic">
          <div className="box-header">
            <div className="status-indicator classic-active"></div>
            <h5>Classic Infrastructure</h5>
          </div>
          <div className="box-content">
            <div className="traffic-percentage">
              <span className="percentage-value">{classicTraffic.toFixed(0)}%</span>
              <span className="percentage-label">traffic</span>
            </div>
            <div className="infrastructure-details">
              <div className="detail-item">
                <span className="detail-icon">🖥️</span>
                <span>Classic Clusters</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌐</span>
                <span>Classic Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Flow (Center) */}
        <div className="traffic-flow">
          <div className="flow-container">
            {/* Classic to VPC arrows */}
            <div 
              className="flow-stream classic-to-vpc"
              style={{ 
                opacity: vpcTraffic / 100,
                width: `${Math.max(20, vpcTraffic)}%`
              }}
            >
              {generateArrows(Math.ceil(vpcTraffic / 20), 0)}
            </div>
            
            {/* Classic staying arrows */}
            <div 
              className="flow-stream classic-staying"
              style={{ 
                opacity: classicTraffic / 100,
                width: `${Math.max(20, classicTraffic)}%`
              }}
            >
              {generateArrows(Math.ceil(classicTraffic / 20), 0.15)}
            </div>
          </div>
          
          <div className="flow-label">
            <span className="flow-icon">⚡</span>
            <span>Live Traffic</span>
          </div>
        </div>

        {/* VPC Infrastructure (Right) */}
        <div className="infrastructure-box vpc">
          <div className="box-header">
            <div className="status-indicator vpc-active"></div>
            <h5>VPC Infrastructure</h5>
          </div>
          <div className="box-content">
            <div className="traffic-percentage">
              <span className="percentage-value">{vpcTraffic.toFixed(0)}%</span>
              <span className="percentage-label">traffic</span>
            </div>
            <div className="infrastructure-details">
              <div className="detail-item">
                <span className="detail-icon">☁️</span>
                <span>VPC Clusters</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔒</span>
                <span>VPC Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="migration-progress-bar">
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${animatedProgress}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span className="label-start">Classic</span>
          <span className="label-end">VPC</span>
        </div>
      </div>
    </div>
  );
};

export default TrafficMigrationDiagram;

// Made with Bob
