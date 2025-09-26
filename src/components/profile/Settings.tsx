import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Smartphone, 
  Mail, 
  MessageCircle,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface NotificationSettings {
  newInquiries: boolean;
  bookingConfirmations: boolean;
  sessionReminders: boolean;
  paymentUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
}

interface PreferencesSettings {
  language: string;
  timezone: string;
  darkMode: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  preferences: PreferencesSettings;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      newInquiries: true,
      bookingConfirmations: true,
      sessionReminders: true,
      paymentUpdates: true,
      emailNotifications: true,
      pushNotifications: false,
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowDirectMessages: true,
    },
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      darkMode: false,
    }
  });

  const toggleSetting = (category: keyof SettingsState, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting]
      }
    }));
  };

  const updateSetting = (category: keyof SettingsState, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className="focus:outline-none">
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-purple-600" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">New Inquiries</p>
                <p className="text-sm text-gray-600">Get notified when clients send new inquiries</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.notifications.newInquiries}
              onToggle={() => toggleSetting('notifications', 'newInquiries')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">Booking Confirmations</p>
                <p className="text-sm text-gray-600">Notifications for confirmed sessions</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.notifications.bookingConfirmations}
              onToggle={() => toggleSetting('notifications', 'bookingConfirmations')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">Session Reminders</p>
                <p className="text-sm text-gray-600">Reminders before upcoming sessions</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.notifications.sessionReminders}
              onToggle={() => toggleSetting('notifications', 'sessionReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.notifications.emailNotifications}
              onToggle={() => toggleSetting('notifications', 'emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-600">Mobile push notifications</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.notifications.pushNotifications}
              onToggle={() => toggleSetting('notifications', 'pushNotifications')}
            />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Privacy</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="public">Public - Visible to all users</option>
              <option value="verified">Verified clients only</option>
              <option value="private">Private - By invitation only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Show Online Status</p>
              <p className="text-sm text-gray-600">Let clients see when you're online</p>
            </div>
            <ToggleSwitch 
              enabled={settings.privacy.showOnlineStatus}
              onToggle={() => toggleSetting('privacy', 'showOnlineStatus')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Allow Direct Messages</p>
              <p className="text-sm text-gray-600">Clients can message you directly</p>
            </div>
            <ToggleSwitch 
              enabled={settings.privacy.allowDirectMessages}
              onToggle={() => toggleSetting('privacy', 'allowDirectMessages')}
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-800">Dark Mode</p>
                <p className="text-sm text-gray-600">Use dark theme for the app</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.preferences.darkMode}
              onToggle={() => toggleSetting('preferences', 'darkMode')}
            />
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
        
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-800">Download My Data</p>
            <p className="text-sm text-gray-600">Export your account data and session history</p>
          </button>
          
          <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors">
            <p className="font-medium text-red-600">Deactivate Account</p>
            <p className="text-sm text-red-500">Temporarily disable your account</p>
          </button>
          
          <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 transition-colors">
            <p className="font-medium text-red-600">Delete Account</p>
            <p className="text-sm text-red-500">Permanently delete your account and all data</p>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <button className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;