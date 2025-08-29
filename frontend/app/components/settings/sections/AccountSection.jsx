// sections/AccountSection.jsx

import React from 'react';
import { Feather } from '@expo/vector-icons';
import SettingSection from '../sections/SettingsSection.jsx';
import SettingItem from '../SettingsItem';
import UserProfileHeader from '../UserProfileHeader';
import { defaultTheme } from '../../../../assets/constants/theme.js';

const AccountSection = ({ user, onEditProfile, onEmailSettings, onSecuritySettings, onAvatarChange }) => {
  return (
    <SettingSection title="Account">
      <UserProfileHeader user={user} onAvatarChange={onAvatarChange} />
      <SettingItem
        icon={props => <Feather name="user" size={24} color={defaultTheme.primary} {...props} />}
        title="Edit Profile"
        subtitle="Update your name, photo, and details"
        onPress={onEditProfile}
      />
      <SettingItem
        icon={props => <Feather name="mail" size={24} color={defaultTheme.primary} {...props} />}
        title="Email Settings"
        subtitle="Change your email preferences"
        onPress={onEmailSettings}
      />
      <SettingItem
        icon={props => <Feather name="lock" size={24} color={defaultTheme.primary} {...props} />}
        title="Security"
        subtitle="Change password and secure account"
        onPress={onSecuritySettings}
      />
    </SettingSection>
  );
};

export default AccountSection;
