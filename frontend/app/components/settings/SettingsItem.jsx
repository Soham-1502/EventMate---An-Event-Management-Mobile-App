import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../../../assets/styles/SettingStyles.js';
import { defaultTheme } from '../../../assets/constants/theme.js'; // For icon color fallback

const SettingItem = ({
  icon: Icon,
  title,
  subtitle,
  rightElement,
  onPress,
  showChevron = true,
  style = {},
}) => (
  <TouchableOpacity
    style={[styles.settingItemContainer, style]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    {Icon && (
      <View style={styles.settingItemIcon}>
        <Icon size={24} color={defaultTheme.primary} />
      </View>
    )}
    <View style={styles.settingItemTextContainer}>
      <Text style={styles.settingItemTitle}>{title}</Text>
      {subtitle ? <Text style={styles.settingItemSubtitle}>{subtitle}</Text> : null}
    </View>
    {rightElement ? (
      <View style={styles.settingItemRightElement}>{rightElement}</View>
    ) : null}
    {showChevron && (
      <Feather name="chevron-right" size={20} color={defaultTheme.secondary} style={styles.settingItemChevron} />
    )}
  </TouchableOpacity>
);

export default SettingItem;
