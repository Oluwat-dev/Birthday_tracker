import React, { useState } from 'react';
import { Bell, Download, Trash2, Save, AlertCircle } from 'lucide-react';
import { NotificationSettings, Person } from '../types';
import { exportToExcel, exportToCSV } from '../utils/excelUtils';
import { requestNotificationPermission } from '../utils/notifications';

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  people: Person[];
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  people
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(Notification.permission);
    if (granted) {
      setLocalSettings(prev => ({ ...prev, enabled: true }));
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const getNotificationStatus = () => {
    switch (notificationPermission) {
      case 'granted':
        return { text: 'Enabled', color: 'text-green-600', bg: 'bg-green-50' };
      case 'denied':
        return { text: 'Blocked', color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { text: 'Not Set', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    }
  };

  const status = getNotificationStatus();

  return (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Browser Notifications</h4>
              <p className="text-sm text-gray-600">Allow the app to send birthday reminders</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                {status.text}
              </span>
              {notificationPermission !== 'granted' && (
                <button
                  onClick={handleRequestNotifications}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Birthday Reminders</h4>
                <p className="text-sm text-gray-600">Get notified about upcoming birthdays</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.enabled}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="sr-only peer"
                  disabled={notificationPermission === 'denied'}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {localSettings.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remind me this many days before:
                </label>
                <select
                  value={localSettings.daysBefore}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, daysBefore: parseInt(e.target.value) }))}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>1 day before</option>
                  <option value={2}>2 days before</option>
                  <option value={3}>3 days before</option>
                  <option value={5}>5 days before</option>
                  <option value={7}>1 week before</option>
                </select>
              </div>
            )}
          </div>

          {notificationPermission === 'denied' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Notifications Blocked</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  To enable notifications, please allow them in your browser settings and refresh the page.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSaveSettings}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Download className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
        </div>

        <div className="space-y-6">
          {/* Export Data */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Export Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download your birthday data in Excel or CSV format for backup or sharing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => exportToExcel(people)}
                disabled={people.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Export as Excel
              </button>
              <button
                onClick={() => exportToCSV(people)}
                disabled={people.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Export as CSV
              </button>
            </div>
            {people.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No data to export</p>
            )}
          </div>

          {/* Clear Data */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Clear All Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete all birthday data and settings. This action cannot be undone.
            </p>
            <button
              onClick={handleClearAllData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">App Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total People:</span>
            <span className="font-medium">{people.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Storage Used:</span>
            <span className="font-medium">
              {Math.round(JSON.stringify(people).length / 1024)} KB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};