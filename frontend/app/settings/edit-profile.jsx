// app/(shared)/edit-profile.jsx - Fixed version with proper avatar integration

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { defaultTheme } from '../../assets/constants/theme';
import ProfileStyles from '../../assets/styles/EditProfileStyles';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from '../../hooks/userHook';

// Enhanced User Profile Header Component
const UserProfileHeader = ({ user, onAvatarChange, avatarLoading }) => {
  return (
    <View style={ProfileStyles.userProfileContainer}>
      <View style={ProfileStyles.userProfileAvatarContainer}>
        <View style={ProfileStyles.userProfileAvatar}>
          {avatarLoading ? (
            <ActivityIndicator size="large" color={defaultTheme.primary} />
          ) : user.avatarUrl ? (
            <Image 
              source={{ uri: user.avatarUrl }} 
              style={ProfileStyles.userProfileAvatarImage}
              onError={() => console.log('Avatar image failed to load')}
            />
          ) : (
            <Feather name="user" size={32} color={defaultTheme.primary} />
          )}
        </View>
        <TouchableOpacity 
          style={ProfileStyles.userProfileCameraButton}
          onPress={onAvatarChange}
          activeOpacity={0.7}
          disabled={avatarLoading}
        >
          <Feather name="camera" size={14} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={[ProfileStyles.userProfileEmail, { fontSize: 13, marginTop: 4, opacity: 0.7 }]}>
        Tap the camera icon to update your photo
      </Text>
    </View>
  );
};

// Enhanced Setting Section Component
const SettingSection = ({ title, children, style = {} }) => {
  return (
    <View style={[ProfileStyles.sectionContainer, style]}>
      <View style={ProfileStyles.sectionHeader}>
        <Text style={ProfileStyles.sectionTitle}>{title}</Text>
      </View>
      <View style={ProfileStyles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

// Enhanced Input Field Component
const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  onFocus, 
  onBlur, 
  error, 
  helperText,
  focused = false,
  disabled = false,
  required = false,
  ...textInputProps 
}) => {
  const inputStyle = [
    ProfileStyles.input,
    focused && ProfileStyles.inputFocused,
    error && ProfileStyles.inputError,
    disabled && ProfileStyles.inputDisabled
  ];

  return (
    <View style={ProfileStyles.inputContainer}>
      <Text style={ProfileStyles.inputLabel}>
        {label} {required && <Text style={{ color: defaultTheme.error }}>*</Text>}
      </Text>
      <TextInput
        style={inputStyle}
        value={value || ''} // Ensure value is never undefined
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        editable={!disabled}
        placeholderTextColor={defaultTheme.secondary}
        {...textInputProps}
      />
      {error && (
        <Text style={ProfileStyles.errorText}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={ProfileStyles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

// Role Picker Component
const RolePicker = ({ value, onSelect, error, disabled = false, isApproved = false }) => {
  const [showModal, setShowModal] = useState(false);
  const roles = [
    { label: 'Attendee', value: 'attendee', description: 'Join and attend events' },
    { label: 'Organizer', value: 'organizer', description: 'Create and manage events' }
  ];

  const selectedRole = roles.find(role => role.value === value);

  const getHelperText = () => {
    if (disabled) return "Contact support to change your role";
    if (value === 'organizer' && !isApproved) {
      return "Your organizer role is pending approval";
    }
    return "Select your primary role on the platform";
  };

  if (disabled) {
    return (
      <InputField
        label="Role"
        value={selectedRole?.label || 'Not specified'}
        disabled={true}
        helperText={getHelperText()}
      />
    );
  }

  return (
    <View style={ProfileStyles.inputContainer}>
      <Text style={ProfileStyles.inputLabel}>Role</Text>
      <TouchableOpacity
        style={[
          ProfileStyles.input,
          error && ProfileStyles.inputError
        ]}
        onPress={() => setShowModal(true)}
      >
        <Text style={[
          { flex: 1 },
          selectedRole ? { color: '#000' } : { color: defaultTheme.secondary }
        ]}>
          {selectedRole?.label || 'Select role'}
        </Text>
        <Feather name="chevron-down" size={20} color={defaultTheme.secondary} />
      </TouchableOpacity>
      
      {error && (
        <Text style={ProfileStyles.errorText}>{error}</Text>
      )}
      
      <Text style={ProfileStyles.helperText}>{getHelperText()}</Text>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={ProfileStyles.modalOverlay}>
          <TouchableOpacity 
            style={{ flex: 1 }}
            onPress={() => setShowModal(false)}
          />
          <View style={ProfileStyles.modalContainer}>
            <View style={ProfileStyles.modalHandle} />
            <Text style={ProfileStyles.modalTitle}>Select Role</Text>
            
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  ProfileStyles.modalButton,
                  value === role.value && { backgroundColor: defaultTheme.primary + '10' }
                ]}
                onPress={() => {
                  onSelect(role.value);
                  setShowModal(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[
                    ProfileStyles.modalButtonText,
                    value === role.value && { color: defaultTheme.primary, fontWeight: '600' }
                  ]}>
                    {role.label}
                  </Text>
                  <Text style={[ProfileStyles.helperText, { marginTop: 2 }]}>
                    {role.description}
                  </Text>
                </View>
                {value === role.value && (
                  <Feather name="check" size={20} color={defaultTheme.primary} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={ProfileStyles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={ProfileStyles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function EditProfile() {
  const { user, isLoaded } = useUser();
  const { from } = useLocalSearchParams();
  
  // State hooks - these must be called BEFORE any conditional returns
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingNavigateBack, setPendingNavigateBack] = useState(false);

  // Custom hook - this must also be called BEFORE any conditional returns
  const {
    userProfile,
    setUserProfile,
    loading,
    avatarLoading, // Use avatar loading state
    error,
    hasChanges,
    updateUserProfile,
    updateAvatar, // Use the hook's updateAvatar function
    refreshUserData, // Use refresh function
    resetForm
  } = useUserProfile(user);

  // Effects - these can be called after hooks but before conditional returns
  useEffect(() => {
    if (pendingNavigateBack && !hasChanges) {
      navigateBack();
      setPendingNavigateBack(false);
    }
  }, [pendingNavigateBack, hasChanges]);

  // NOW we can do conditional returns after all hooks have been called
  if (!isLoaded || loading) {
    return (
      <View style={ProfileStyles.loadingContainer}>
        <ActivityIndicator size="large" color={defaultTheme.primary} />
        <Text style={ProfileStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Success Message Component
  const SuccessMessage = () => {
    if (!showSuccess) return null;

    return (
      <View style={ProfileStyles.successContainer}>
        <Feather name="check-circle" size={20} color="white" style={ProfileStyles.successIcon} />
        <Text style={ProfileStyles.successText}>
          Profile updated successfully!
        </Text>
      </View>
    );
  };

  // Avatar change functions - Updated to use the hook's updateAvatar function
  const handleAvatarChange = () => {
    setShowAvatarModal(true);
  };

  // Updated camera function
const openCamera = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
  setShowAvatarModal(false);
  const updateResult = await updateAvatar(result.assets[0].uri);
  if (updateResult.success) {
    // Update local avatar URL state so UI updates immediately
    if (updateResult.avatarUrl) {
      setUserProfile(prev => ({
        ...prev,
        avatarUrl: updateResult.avatarUrl,
      }));
    } else {
      // Fallback: refresh entire user data including avatar
      await refreshUserData();
    }
    showSuccessMessage(updateResult.message);
  } else {
      setShowAvatarModal(false);
      Alert.alert('Error', updateResult.error);
    }
  }
  } catch (error) {
    console.error('Camera error:', error);
    Alert.alert('Error', `Failed to capture photo: ${error.message}`);
    setShowAvatarModal(false);
  }
};

  // Updated gallery function
const openGallery = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setShowAvatarModal(false);
      
      const updateResult = await updateAvatar(result.assets[0].uri);
      
      if (updateResult.success) {
        showSuccessMessage(updateResult.message);
      } else {
        Alert.alert('Error', updateResult.error);
      }
    } else {
      setShowAvatarModal(false);
    }
  } catch (error) {
    console.error('Gallery error:', error);
    Alert.alert('Error', `Failed to select photo: ${error.message}`);
    setShowAvatarModal(false);
  }
};

// Remove avatar function
const removeAvatar = async () => {
  try {
    setShowAvatarModal(false);
    
    const updateResult = await updateAvatar(null);
    
    if (updateResult.success) {
      showSuccessMessage(updateResult.message);
    } else {
      Alert.alert('Error', updateResult.error);
    }
  } catch (error) {
    console.error('Remove error:', error);
    Alert.alert('Error', `Failed to remove photo: ${error.message}`);
    setShowAvatarModal(false);
  }
};

  const showSuccessMessage = (message) => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Enhanced Avatar Modal Component
  const AvatarOptionsModal = () => (
    <Modal
      visible={showAvatarModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAvatarModal(false)}
    >
      <View style={ProfileStyles.modalOverlay}>
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={() => setShowAvatarModal(false)}
        />
        <View style={ProfileStyles.modalContainer}>
          <View style={ProfileStyles.modalHandle} />
          <Text style={ProfileStyles.modalTitle}>Update Profile Picture</Text>
          
          <TouchableOpacity 
            style={ProfileStyles.modalButton}
            onPress={openCamera}
            disabled={avatarLoading}
          >
            <View style={ProfileStyles.modalButtonIcon}>
              <Feather name="camera" size={20} color={defaultTheme.primary} />
            </View>
            <Text style={ProfileStyles.modalButtonText}>Take Photo</Text>
            {avatarLoading && <ActivityIndicator size="small" color={defaultTheme.primary} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={ProfileStyles.modalButton}
            onPress={openGallery}
            disabled={avatarLoading}
          >
            <View style={ProfileStyles.modalButtonIcon}>
              <Feather name="image" size={20} color={defaultTheme.primary} />
            </View>
            <Text style={ProfileStyles.modalButtonText}>Choose from Gallery</Text>
            {avatarLoading && <ActivityIndicator size="small" color={defaultTheme.primary} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[ProfileStyles.modalButton, ProfileStyles.modalButtonLast]}
            onPress={removeAvatar}
            disabled={avatarLoading}
          >
            <View style={ProfileStyles.modalButtonIcon}>
              <Feather name="trash-2" size={20} color={defaultTheme.error} />
            </View>
            <Text style={[ProfileStyles.modalButtonText, ProfileStyles.modalButtonDangerText]}>
              Remove Photo
            </Text>
            {avatarLoading && <ActivityIndicator size="small" color={defaultTheme.error} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={ProfileStyles.modalCancelButton}
            onPress={() => setShowAvatarModal(false)}
            disabled={avatarLoading}
          >
            <Text style={ProfileStyles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!userProfile.firstName || !userProfile.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (userProfile.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!userProfile.lastName || !userProfile.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (userProfile.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (userProfile.phone && userProfile.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(userProfile.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value || ''
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below');
      return;
    }

    const result = await updateUserProfile(userProfile);
    
    if (result.success) {
      showSuccessMessage(result.message);
      // Reset the form state to mark as saved
      resetForm();
      // Navigate back immediately after successful save
      setTimeout(() => navigateBack(), 1500);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const userData = {
    name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User',
    email: userProfile.email || user?.primaryEmailAddress?.emailAddress || '',
    avatarUrl: userProfile.avatarUrl || null, // Use userProfile.avatarUrl instead of user.imageUrl
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              navigateBack();
            }
          }
        ]
      );
    } else {
      navigateBack();
    }
  };

  const navigateBack = () => {
    try {
      if (from === "settings") {
        router.replace("/(tabs)/settings");
      } else if (from === "home") {
        router.replace("/(tabs)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={ProfileStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={ProfileStyles.header}>
        <TouchableOpacity 
          style={ProfileStyles.headerBackButton}
          onPress={handleBack}
        >
          <Feather name="chevron-left" size={24} color={defaultTheme.primary} />
        </TouchableOpacity>
        <Text style={ProfileStyles.headerTitle}>Edit Profile</Text>
        {(loading || avatarLoading) && (
          <ActivityIndicator size="small" color={defaultTheme.primary} />
        )}
      </View>

      <ScrollView 
        style={ProfileStyles.scrollContainer}
        contentContainerStyle={ProfileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Message */}
        <SuccessMessage />

        {/* Error Message */}
        {error && (
          <View style={ProfileStyles.errorContainer}>
            <Text style={ProfileStyles.errorText}>{error}</Text>
          </View>
        )}

        {/* Profile Picture Section */}
        <UserProfileHeader 
          user={userData}
          onAvatarChange={handleAvatarChange}
          avatarLoading={avatarLoading}
        />

        {/* Personal Information Section */}
        <SettingSection title="Personal Information">
          <InputField
            label="First Name"
            value={userProfile.firstName}
            onChangeText={(value) => handleInputChange('firstName', value)}
            onFocus={() => setFocusedField('firstName')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'firstName'}
            error={errors.firstName}
            required={true}
            placeholder="Enter your first name"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <InputField
            label="Last Name"
            value={userProfile.lastName}
            onChangeText={(value) => handleInputChange('lastName', value)}
            onFocus={() => setFocusedField('lastName')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'lastName'}
            error={errors.lastName}
            required={true}
            placeholder="Enter your last name"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <InputField
            label="Email Address"
            value={userProfile.email}
            disabled={true}
            helperText="To change your email address, please contact our support team"
            placeholder="Email address"
          />

          <InputField
            label="Phone Number"
            value={userProfile.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'phone'}
            error={errors.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            returnKeyType="next"
            helperText="Optional - for event updates and notifications"
          />
        </SettingSection>

        {/* Professional Information Section */}
        <SettingSection title="Professional Information">
          <InputField
            label="Organization"
            value={userProfile.organization}
            onChangeText={(value) => handleInputChange('organization', value)}
            onFocus={() => setFocusedField('organization')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'organization'}
            placeholder="Enter your organization or company"
            autoCapitalize="words"
            returnKeyType="done"
            helperText="Optional - displayed on your profile"
          />

          <RolePicker
            value={userProfile.role}
            onSelect={(value) => handleInputChange('role', value)}
            error={errors.role}
            disabled={false}
            isApproved={userProfile.approved}
          />
        </SettingSection>

        {/* Action Buttons */}
        <View style={ProfileStyles.buttonContainer}>
          <TouchableOpacity
            style={[
              ProfileStyles.primaryButton,
              (!hasChanges || loading || avatarLoading) && ProfileStyles.primaryButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!hasChanges || loading || avatarLoading}
          >
            {(loading || avatarLoading) ? (
              <View style={ProfileStyles.buttonLoadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={ProfileStyles.buttonLoadingText}>Saving...</Text>
              </View>
            ) : (
              <Text style={ProfileStyles.primaryButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={ProfileStyles.secondaryButton}
            onPress={handleBack}
            disabled={loading || avatarLoading}
          >
            <Text style={ProfileStyles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={ProfileStyles.versionContainer}>
          <Text style={ProfileStyles.versionText}>Profile Settings</Text>
        </View>
      </ScrollView>

      {/* Avatar Options Modal */}
      <AvatarOptionsModal />
    </KeyboardAvoidingView>
  );
}

export default EditProfile;