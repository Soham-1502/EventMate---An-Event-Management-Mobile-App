import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styles from '../../../assets/styles/SettingStyles.js';

const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[
        styles.toggleContainer,
        checked ? styles.toggleOn : styles.toggleOff,
        disabled && styles.toggleDisabled,
      ]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.toggleKnob,
          checked ? styles.toggleKnobOn : styles.toggleKnobOff,
        ]}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
