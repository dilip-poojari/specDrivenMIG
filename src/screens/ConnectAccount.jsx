import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  InlineNotification,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link,
  Loading
} from '@carbon/react';
import { ArrowRight, Launch, Checkmark } from '@carbon/icons-react';
import BobPanel from '../components/BobPanel';
import { mockBobMessages } from '../mock/mockData';
import './ConnectAccount.css';

const ConnectAccount = ({ onConnect }) => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState(null); // null, 'valid', 'invalid', 'wrong_permissions', 'no_resources'
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [bobOpen, setBobOpen] = useState(true);
  const [bobMessages, setBobMessages] = useState([
    "Let's connect your IBM Cloud account so I can scan your Classic Infrastructure resources.",
    "I'll only read your account information. I won't make any changes during the scan."
  ]);

  const services = [
    { name: 'Kubernetes Clusters', id: 'kubernetes' },
    { name: 'Virtual Servers', id: 'virtual-servers' },
    { name: 'Databases', id: 'databases' }
  ];

  const handleValidateKey = () => {
    setIsValidating(true);
    setValidationState(null);

    // Simulate API key validation
    setTimeout(() => {
      setIsValidating(false);
      
      // Mock validation logic
      if (apiKey === '') {
        setValidationState('invalid');
      } else if (apiKey.length < 20) {
        setValidationState('wrong_permissions');
      } else if (apiKey.startsWith('test-')) {
        setValidationState('no_resources');
      } else {
        setValidationState('valid');
        setBobMessages([
          "Great! Your API key is valid.",
          "I have the permissions I need to scan your Classic Infrastructure.",
          "Ready to start the scan?"
        ]);
      }
    }, 1500);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    let currentMessage = 0;
    const scanMessages = mockBobMessages.connectAccount;
    
    // Update Bob's messages during scan
    const messageInterval = setInterval(() => {
      if (currentMessage < scanMessages.length) {
        setBobMessages([scanMessages[currentMessage]]);
        currentMessage++;
      }
    }, 1800);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(() => {
            onConnect();
            navigate('/');
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="screen-container">
      <div className={`main-content ${bobOpen ? 'with-bob' : ''}`}>
        <div className="connect-account-container">
          {/* Header */}
          <div className="connect-header">
            <h1>Connect Your IBM Cloud Account</h1>
            <p className="subtitle">
              Let's scan your Classic Infrastructure to see what needs to migrate.
            </p>
          </div>

          {/* Reassurance Banner */}
          <InlineNotification
            kind="info"
            title="Read-only scan"
            subtitle="We will scan your account and show you exactly what needs to move. We won't change anything."
            lowContrast
            hideCloseButton
            className="reassurance-banner"
          />

          {/* Service Selector */}
          <div className="service-selector">
            <h2>What would you like to migrate?</h2>
            <Tabs selectedIndex={selectedService} onChange={({ selectedIndex }) => setSelectedService(selectedIndex)}>
              <TabList aria-label="Service selection">
                {services.map((service) => (
                  <Tab key={service.id}>{service.name}</Tab>
                ))}
              </TabList>
              <TabPanels>
                {services.map((service) => (
                  <TabPanel key={service.id}>
                    <p className="service-description">
                      We'll scan your account for Classic {service.name} and show you migration recommendations.
                    </p>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </div>

          {/* API Key Input */}
          <div className="api-key-section">
            <h2>Connect with your API key</h2>
            
            <div className="api-key-instructions">
              <p>
                Generate a read-only API key with <strong>Classic Infrastructure Viewer</strong> access.
              </p>
              <Link
                href="https://cloud.ibm.com/iam/apikeys"
                target="_blank"
                renderIcon={Launch}
              >
                Open IBM Cloud IAM
              </Link>
            </div>

            <TextInput
              id="api-key"
              labelText="IBM Cloud API Key"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isValidating || isScanning}
              invalid={validationState === 'invalid' || validationState === 'wrong_permissions'}
              invalidText={
                validationState === 'invalid' 
                  ? "Please enter a valid API key"
                  : "Your key doesn't have Classic Infrastructure Viewer access"
              }
            />

            {validationState === 'valid' && (
              <div className="validation-success">
                <Checkmark size={20} />
                <span>API key validated successfully</span>
              </div>
            )}

            {validationState === 'no_resources' && (
              <InlineNotification
                kind="warning"
                title="No resources found"
                subtitle={`No classic ${services[selectedService].name.toLowerCase()} found on this account.`}
                lowContrast
                hideCloseButton
              />
            )}

            <div className="action-buttons">
              {!validationState && (
                <Button
                  kind="primary"
                  onClick={handleValidateKey}
                  disabled={!apiKey || isValidating}
                >
                  {isValidating ? 'Validating...' : 'Validate API key'}
                </Button>
              )}

              {validationState === 'valid' && !isScanning && (
                <Button
                  kind="primary"
                  renderIcon={ArrowRight}
                  onClick={handleStartScan}
                >
                  Start scan
                </Button>
              )}

              {(validationState === 'invalid' || validationState === 'wrong_permissions') && (
                <Button
                  kind="secondary"
                  onClick={() => {
                    setValidationState(null);
                    setApiKey('');
                  }}
                >
                  Try again
                </Button>
              )}
            </div>
          </div>

          {/* Scanning Progress */}
          {isScanning && (
            <div className="scanning-section">
              <Loading description="Scanning your account" withOverlay={false} />
              <div className="scan-progress">
                <h3>Bob is scanning your environment</h3>
                <p>This takes about 90 seconds...</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="progress-text">{scanProgress}% complete</span>
              </div>
            </div>
          )}

          {/* Error States */}
          {validationState === 'invalid' && (
            <InlineNotification
              kind="error"
              title="Invalid API key"
              subtitle="We couldn't connect. Check your API key and try again."
              lowContrast
              hideCloseButton
              className="error-notification"
            />
          )}

          {validationState === 'wrong_permissions' && (
            <div className="error-notification">
              <InlineNotification
                kind="error"
                title="Wrong permissions"
                subtitle="Your key doesn't have Classic Infrastructure Viewer access."
                lowContrast
                hideCloseButton
              />
              <div className="error-help-link">
                <Link
                  href="https://cloud.ibm.com/docs/account?topic=account-mngclassicinfra"
                  target="_blank"
                  renderIcon={Launch}
                >
                  View IBM docs for help
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <BobPanel
        messages={bobMessages}
        context="connect"
        isOpen={bobOpen}
        onToggle={() => setBobOpen(!bobOpen)}
      />
    </div>
  );
};

export default ConnectAccount;

// Made with Bob
