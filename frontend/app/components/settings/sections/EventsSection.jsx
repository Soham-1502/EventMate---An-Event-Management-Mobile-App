// sections/EventsSection.jsx

import React from 'react';
import { Feather } from '@expo/vector-icons';
import SettingSection from '../sections/SettingsSection.jsx';
import SettingItem from '../SettingsItem';
import { defaultTheme } from '../../../../assets/constants/theme.js';

const EventsSection = ({ onBookingHistory, onSavedEvents, onPaymentMethods, onLocationSettings }) => {
  return (
    <SettingSection title="Events & Payments">
      <SettingItem
        icon={props => <Feather name="calendar" size={24} color={defaultTheme.primary} {...props} />}
        title="Booking History"
        subtitle="See your previously booked events"
        onPress={onBookingHistory}
      />
      <SettingItem
        icon={props => <Feather name="heart" size={24} color={defaultTheme.primary} {...props} />}
        title="Saved Events"
        subtitle="Manage your saved events"
        onPress={onSavedEvents}
      />
      <SettingItem
        icon={props => <Feather name="credit-card" size={24} color={defaultTheme.primary} {...props} />}
        title="Payment Methods"
        subtitle="Manage your cards & sources"
        onPress={onPaymentMethods}
      />
      <SettingItem
        icon={props => <Feather name="map-pin" size={24} color={defaultTheme.primary} {...props} />}
        title="Location Settings"
        subtitle="Update default event location"
        onPress={onLocationSettings}
      />
    </SettingSection>
  );
};

export default EventsSection;
