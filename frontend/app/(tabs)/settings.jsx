// settings.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { defaultTheme } from '../../assets/constants/theme';
import SettingStyles from '../../assets/styles/SettingStyles';
import { useUserProfile } from '../../hooks/userHook';

// Enhanced Toggle Component
const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[
        SettingStyles.toggleContainer,
        checked ? SettingStyles.toggleOn : SettingStyles.toggleOff,
        disabled && SettingStyles.toggleDisabled
      ]}
      activeOpacity={0.7}
    >
      <View style={[
        SettingStyles.toggleKnob,
        checked ? SettingStyles.toggleKnobOn : SettingStyles.toggleKnobOff
      ]} />
    </TouchableOpacity>
  );
};

// Enhanced Setting Section Component
const SettingSection = ({ title, children, style = {} }) => {
  return (
    <View style={[SettingStyles.sectionContainer, style]}>
      <View style={SettingStyles.sectionHeader}>
        <Text style={SettingStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={SettingStyles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

// Enhanced Setting Item Component
const SettingItem = ({ 
  icon: IconComponent, 
  title, 
  subtitle, 
  rightElement, 
  onPress, 
  showChevron = true,
  style = {},
  isDanger = false
}) => {
  return (
    <TouchableOpacity 
      style={[SettingStyles.settingItemContainer, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={SettingStyles.settingItemLeft}>
        <View style={SettingStyles.settingItemIcon}>
          <IconComponent 
            size={22} 
            color={isDanger ? defaultTheme.error : defaultTheme.primary} 
          />
        </View>
        <View style={SettingStyles.settingItemTextContainer}>
          <Text style={[
            SettingStyles.settingItemTitle, 
            isDanger && SettingStyles.settingItemDanger
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={SettingStyles.settingItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={SettingStyles.settingItemRightElement}>
        {rightElement || (onPress && showChevron && (
          <Feather 
            name="chevron-right" 
            size={18} 
            style={SettingStyles.settingItemChevron} 
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

// Enhanced User Profile Header Component
const UserProfileHeader = ({ user, onAvatarChange, loading }) => {
  return (
    <View style={SettingStyles.userProfileContainer}>
      <View style={SettingStyles.userProfileAvatarContainer}>
        <View style={SettingStyles.userProfileAvatar}>
          {user.avatarUrl ? (
            <Image 
              source={{ uri: user.avatarUrl }} 
              style={SettingStyles.userProfileAvatarImage}
            />
          ) : (
            <Feather name="user" size={32} color={defaultTheme.primary} />
          )}
        </View>
        <TouchableOpacity 
          style={SettingStyles.userProfileCameraButton}
          onPress={onAvatarChange}
          activeOpacity={0.7}
        >
          <Feather name="camera" size={14} color="white" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <ActivityIndicator size="small" color={defaultTheme.primary} />
          <Text style={SettingStyles.userProfileEmail}>Loading profile...</Text>
        </View>
      ) : (
        <>
          <Text style={SettingStyles.userProfileName}>{user.name}</Text>
          <Text style={SettingStyles.userProfileEmail}>{user.email}</Text>
          {user.role && user.role !== 'attendee' && (
            <View style={SettingStyles.userRoleBadge}>
              <Text style={SettingStyles.userRoleText}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                {user.role === 'organizer' && !user.approved && ' (Pending)'}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

// Main Settings Component
export default function SettingsPage() {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();

  // Use the custom hook to get updated user profile data
  const { userProfile, loading: profileLoading, refetch } = useUserProfile(user);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    eventReminders: true,
    announcements: false,
  });

  const [darkMode, setDarkMode] = useState(false);

  if (!isLoaded) {
    return (
      <View style={SettingStyles.loadingContainer}>
        <ActivityIndicator size="large" color={defaultTheme.primary} />
        <Text style={SettingStyles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  // Action Handlers
  const handleEditProfile = () => {
    console.log('Current route before navigation:', router);
    router.push({
      pathname: '/settings/edit-profile',
      params: { from: 'settings' }
    });
  };

  const handleEmailSettings = () => router.push('/settings/email-settings');
  const handleSecuritySettings = () => router.push('/settings/security');
  const handleBookingHistory = () => router.push('/settings/booking-history');
  const handleSavedEvents = () => router.push('/settings/saved-events');
  const handlePaymentMethods = () => router.push('/settings/payment-methods');
  const handleLocationSettings = () => router.push('/settings/location-settings');
  const handleHelpCenter = () => router.push('/settings/help');
  const handleContactSupport = () => router.push('/settings/support');
  const handleTermsPrivacy = () => router.push('/settings/terms-privacy');

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    // Here you would typically save to AsyncStorage or API
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    // Here you would implement theme switching logic
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out", 
      "Are you sure you want to sign out?", 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all associated data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            // Implement account deletion logic
            Alert.alert('Account Deletion', 'Account deletion functionality will be implemented.');
          }
        }
      ]
    );
  };

  const handleAvatarChange = () => router.push('/settings/edit-profile');

  // Use updated userProfile data instead of direct Clerk user data
  const userData = {
    name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User',
    email: userProfile.email || user?.emailAddresses?.[0]?.emailAddress || 'No email',
    avatarUrl: user?.imageUrl || null,
    role: userProfile.role,
    approved: userProfile.approved,
  };

  return (
    <View style={SettingStyles.container}>
      {/* Header */}
      <View style={SettingStyles.header}>
        <Text style={SettingStyles.headerTitle}>Settings</Text>
        {profileLoading && (
          <TouchableOpacity onPress={refetch} style={{ marginLeft: 'auto' }}>
            <ActivityIndicator size="small" color={defaultTheme.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={SettingStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={SettingStyles.scrollContent}
      >
        {/* User Profile Header */}
        <UserProfileHeader
          user={userData}
          onAvatarChange={handleAvatarChange}
          loading={profileLoading}
        />

        {/* Account Section */}
        <SettingSection title="Account">
          <SettingItem
            icon={(props) => <Feather name="user" {...props} />}
            title="Edit Profile"
            subtitle="Update your name and personal information"
            onPress={handleEditProfile}
          />
          <SettingItem
            icon={(props) => <Feather name="mail" {...props} />}
            title="Email Settings"
            subtitle="Manage email verification and preferences"
            onPress={handleEmailSettings}
          />
          <SettingItem
            icon={(props) => <Feather name="lock" {...props} />}
            title="Password & Security"
            subtitle="Change password and manage login methods"
            onPress={handleSecuritySettings}
          />
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingItem
            icon={(props) => <Feather name="bell" {...props} />}
            title="Email Notifications"
            subtitle="Receive updates via email"
            rightElement={
              <Toggle 
                checked={notifications.email}
                onChange={(value) => handleNotificationChange('email', value)}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={(props) => <Feather name="bell" {...props} />}
            title="Push Notifications"
            subtitle="Get notifications on your device"
            rightElement={
              <Toggle 
                checked={notifications.push}
                onChange={(value) => handleNotificationChange('push', value)}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={(props) => <Feather name="calendar" {...props} />}
            title="Event Reminders"
            subtitle="Reminders for upcoming events"
            rightElement={
              <Toggle 
                checked={notifications.eventReminders}
                onChange={(value) => handleNotificationChange('eventReminders', value)}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={(props) => <Feather name="volume-2" {...props} />}
            title="Announcements"
            subtitle="Platform updates and news"
            rightElement={
              <Toggle 
                checked={notifications.announcements}
                onChange={(value) => handleNotificationChange('announcements', value)}
              />
            }
            showChevron={false}
          />
        </SettingSection>

        {/* Events & Bookings Section */}
        <SettingSection title="Events & Bookings">
          <SettingItem
            icon={(props) => <Feather name="calendar" {...props} />}
            title="Booking History"
            subtitle="View past bookings and purchases"
            onPress={handleBookingHistory}
          />
          <SettingItem
            icon={(props) => <Feather name="heart" {...props} />}
            title="Saved Events"
            subtitle="Your favorite and bookmarked events"
            onPress={handleSavedEvents}
          />
          <SettingItem
            icon={(props) => <Feather name="credit-card" {...props} />}
            title="Payment Methods"
            subtitle="Manage saved cards and billing info"
            onPress={handlePaymentMethods}
          />
          <SettingItem
            icon={(props) => <Feather name="map-pin" {...props} />}
            title="Location Preferences"
            subtitle="Default city and search radius"
            onPress={handleLocationSettings}
          />
        </SettingSection>

        {/* App Settings Section */}
        <SettingSection title="App Settings">
          <SettingItem
            icon={(props) => <Feather name={darkMode ? "moon" : "sun"} {...props} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightElement={
              <Toggle 
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
            }
            showChevron={false}
          />
          <SettingItem
            icon={(props) => <Feather name="globe" {...props} />}
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Language', 'Language selection coming soon!')}
          />
          <SettingItem
            icon={(props) => <Feather name="shield" {...props} />}
            title="Privacy Settings"
            subtitle="Control your data and visibility"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
        </SettingSection>

        {/* Support & Legal Section */}
        <SettingSection title="Support & Legal">
          <SettingItem
            icon={(props) => <Feather name="help-circle" {...props} />}
            title="Help Center"
            subtitle="FAQs and support articles"
            onPress={handleHelpCenter}
          />
          <SettingItem
            icon={(props) => <Feather name="mail" {...props} />}
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={handleContactSupport}
          />
          <SettingItem
            icon={(props) => <Feather name="shield" {...props} />}
            title="Terms & Privacy"
            subtitle="Read our terms and privacy policy"
            onPress={handleTermsPrivacy}
          />
        </SettingSection>

        {/* Account Actions Section */}
        <SettingSection title="Account Actions">
          <SettingItem
            icon={(props) => <Feather name="log-out" {...props} />}
            title="Sign Out"
            subtitle="Log out from your account"
            onPress={handleSignOut}
            isDanger={true}
          />
          <SettingItem
            icon={(props) => <Feather name="trash-2" {...props} />}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            isDanger={true}
          />
        </SettingSection>

        {/* App Version */}
        <View style={SettingStyles.versionContainer}>
          <Text style={SettingStyles.versionText}>Version 1.0.0</Text>
          <Text style={SettingStyles.versionText}>Made By Dual Core</Text>
        </View>
      </ScrollView>
    </View>
  );
}