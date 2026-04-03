import React, { createContext, useContext, useState } from 'react';

const MigrationContext = createContext();

export const useMigration = () => {
  const context = useContext(MigrationContext);
  if (!context) {
    throw new Error('useMigration must be used within MigrationProvider');
  }
  return context;
};

export const MigrationProvider = ({ children }) => {
  const [completedStages, setCompletedStages] = useState([]);
  const [currentStage, setCurrentStage] = useState('connect');

  const completeStage = (stageId) => {
    if (!completedStages.includes(stageId)) {
      setCompletedStages([...completedStages, stageId]);
    }
  };

  const isStageCompleted = (stageId) => {
    return completedStages.includes(stageId);
  };

  const getStageStatus = (stageId) => {
    if (completedStages.includes(stageId)) {
      return 'completed';
    }
    if (stageId === currentStage) {
      return 'in_progress';
    }
    return 'locked';
  };

  const canAccessStage = (stageId) => {
    // Define stage order
    const stageOrder = ['connect', 'inventory', 'recommendation', 'provision', 'migration', 'validation', 'cutover'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const targetIndex = stageOrder.indexOf(stageId);
    
    // Can access completed stages, current stage, or next stage if current is completed
    return completedStages.includes(stageId) || 
           stageId === currentStage || 
           (targetIndex === currentIndex + 1 && completedStages.includes(currentStage));
  };

  const value = {
    completedStages,
    currentStage,
    setCurrentStage,
    completeStage,
    isStageCompleted,
    getStageStatus,
    canAccessStage
  };

  return (
    <MigrationContext.Provider value={value}>
      {children}
    </MigrationContext.Provider>
  );
};

// Made with Bob
