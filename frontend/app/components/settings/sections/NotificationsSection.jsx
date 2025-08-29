// sections/NotificationSection.jsx

import React from 'react';
import { Feather } from '@expo/vector-icons';
import SettingSection from '../sections/SettingsSection';
import SettingItem from '../SettingsItem';
import Toggle from '../../ui/Toggle';
import { defaultTheme } from '../../../../assets/constants/theme.js';

const NotificationSection = ({ notifications, onNotificationChange }) => {
  const handleToggle = (key, value) => {
    onNotificationChange({ ...notifications, [key]: value });
  };

  return (
    <SettingSection title="Notifications">
      <SettingItem
        icon={props => <Feather name="mail" size={24} color={defaultTheme.primary} {...props} />}
        title="Email notifications"
        rightElement={
          <Toggle
            checked={!!notifications.email}
            onChange={value => handleToggle('email', value)}
          />
        }
        showChevron={false}
      />
      <SettingItem
        icon={props => <Feather name="bell" size={24} color={defaultTheme.primary} {...props} />}
        title="Push notifications"
        rightElement={
          <Toggle
            checked={!!notifications.push}
            onChange={value => handleToggle('push', value)}
          />
        }
        showChevron={false}
      />
      <SettingItem
        icon={props => <Feather name="calendar" size={24} color={defaultTheme.primary} {...props} />}
        title="Event Reminders"
        rightElement={
          <Toggle
            checked={!!notifications.eventReminders}
            onChange={value => handleToggle('eventReminders', value)}
          />
        }
        showChevron={false}
      />
      <SettingItem
        icon={props => <Feather name="volume-2" size={24} color={defaultTheme.primary} {...props} />}
        title="Announcements"
        rightElement={
          <Toggle
            checked={!!notifications.announcements}
            onChange={value => handleToggle('announcements', value)}
          />
        }
        showChevron={false}
      />
    </SettingSection>
  );
};

export default NotificationSection;
