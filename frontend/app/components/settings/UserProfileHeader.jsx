import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from '../../../assets/styles/SettingStyles.js';
import { defaultTheme } from '../../../assets/constants/theme.js';

const UserProfileHeader = ({ user, onAvatarChange }) => (
  <View style={styles.userProfileContainer}>
    <View style={styles.userProfileAvatarContainer}>
      {user?.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.userProfileAvatar} />
      ) : (
        <Feather name="user" size={48} color={defaultTheme.secondary} style={styles.userProfileAvatar} />
      )}
      <TouchableOpacity
        style={styles.userProfileCameraButton}
        onPress={onAvatarChange}
        activeOpacity={0.7}
      >
        <Feather name="camera" size={20} color={defaultTheme.background} />
      </TouchableOpacity>
    </View>
    <Text style={styles.userProfileName}>{user?.name ?? 'User Name'}</Text>
    {user?.email ? <Text style={styles.userProfileEmail}>{user.email}</Text> : null}
  </View>
);

export default UserProfileHeader;
