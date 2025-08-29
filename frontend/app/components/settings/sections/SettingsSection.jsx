// components/settings/SettingSection.jsx

import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../../../assets/styles/SettingStyles.js';

const SettingSection = ({ title, children }) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
        color: styles.settingItemTitle.color, // assumes heading color matches item title
        marginLeft: 20,
        marginTop: 8,
      }}>
        {title}
      </Text>
      <View>
        {children}
      </View>
    </View>
  );
};

export default SettingSection;
