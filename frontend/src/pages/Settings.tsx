import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  defaultTimeframe: string;
  riskTolerance: 'low' | 'medium' | 'high';
  tradingMode: 'paper' | 'live';
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    defaultTimeframe: '1D',
    riskTolerance: 'medium',
    tradingMode: 'paper'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('tradingDashboardSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('tradingDashboardSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Apply theme immediately
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const resetSettings = () => {
    const defaultSettings: UserSettings = {
      theme: 'dark',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30,
      defaultTimeframe: '1D',
      riskTolerance: 'medium',
      tradingMode: 'paper'
    };
    setSettings(defaultSettings);
  };

  return (
    <div className="container settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your trading dashboard experience</p>
      </div>

      <div className="settings-content">
        {/* User Profile Section */}
        <div className="settings-section">
          <h2>👤 User Profile</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
            <div className="setting-item">
              <label>Account Type</label>
              <select 
                value={settings.tradingMode} 
                onChange={(e) => handleSettingChange('tradingMode', e.target.value)}
              >
                <option value="paper">Paper Trading</option>
                <option value="live">Live Trading</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="settings-section">
          <h2>🎨 Appearance</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Theme</label>
              <select 
                value={settings.theme} 
                onChange={(e) => handleSettingChange('theme', e.target.value as 'light' | 'dark')}
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trading Preferences */}
        <div className="settings-section">
          <h2>📈 Trading Preferences</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Default Timeframe</label>
              <select 
                value={settings.defaultTimeframe} 
                onChange={(e) => handleSettingChange('defaultTimeframe', e.target.value)}
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1H">1 Hour</option>
                <option value="1D">1 Day</option>
                <option value="1W">1 Week</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Risk Tolerance</label>
              <select 
                value={settings.riskTolerance} 
                onChange={(e) => handleSettingChange('riskTolerance', e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Conservative</option>
                <option value="medium">Moderate</option>
                <option value="high">Aggressive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Refresh Settings */}
        <div className="settings-section">
          <h2>🔄 Data & Refresh</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                />
                Auto Refresh Data
              </label>
            </div>
            <div className="setting-item">
              <label>Refresh Interval (seconds)</label>
              <input 
                type="number" 
                min="5" 
                max="300" 
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                disabled={!settings.autoRefresh}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                Enable Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button className="btn btn-primary" onClick={saveSettings}>
            {saved ? '✅ Saved!' : '💾 Save Settings'}
          </button>
          <button className="btn btn-secondary" onClick={resetSettings}>
            🔄 Reset to Default
          </button>
        </div>

        {/* Settings Summary */}
        <div className="settings-summary">
          <h3>📋 Current Configuration</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span>Theme:</span>
              <span>{settings.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
            </div>
            <div className="summary-item">
              <span>Auto Refresh:</span>
              <span>{settings.autoRefresh ? '✅ Enabled' : '❌ Disabled'}</span>
            </div>
            <div className="summary-item">
              <span>Refresh Rate:</span>
              <span>{settings.refreshInterval}s</span>
            </div>
            <div className="summary-item">
              <span>Default Timeframe:</span>
              <span>{settings.defaultTimeframe}</span>
            </div>
            <div className="summary-item">
              <span>Risk Level:</span>
              <span>{settings.riskTolerance.charAt(0).toUpperCase() + settings.riskTolerance.slice(1)}</span>
            </div>
            <div className="summary-item">
              <span>Trading Mode:</span>
              <span>{settings.tradingMode === 'paper' ? '📝 Paper' : '💰 Live'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;