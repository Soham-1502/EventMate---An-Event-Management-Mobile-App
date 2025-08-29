// app/(shared)/organizer-application.jsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { defaultTheme } from '../../assets/constants/theme';
import { API_URL } from '../../hooks/APIURL';

// Styles for the application page
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    backgroundColor: defaultTheme.primary + '08',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: defaultTheme.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: defaultTheme.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: defaultTheme.primary,
    shadowColor: defaultTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  benefitsList: {
    marginTop: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  requirementsList: {
    marginTop: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requirementIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: defaultTheme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonDisabled: {
    backgroundColor: '#64748B' + '40',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#64748B' + '40',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLoadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  successContainer: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    marginRight: 8,
  },
  successText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
};

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  onFocus, 
  onBlur, 
  error, 
  helperText,
  focused = false,
  required = false,
  multiline = false,
  ...textInputProps 
}) => {
  const inputStyle = [
    styles.input,
    multiline && styles.textArea,
    focused && styles.inputFocused,
    error && { borderColor: '#EF4444' }
  ];

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={{ color: '#EF4444' }}>*</Text>}
      </Text>
      <TextInput
        style={inputStyle}
        value={value || ''}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        multiline={multiline}
        placeholderTextColor={'#64748B'}
        {...textInputProps}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitItem}>
    <View style={styles.benefitIcon}>
      <Feather name={icon} size={12} color={'#10B981'} />
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const RequirementItem = ({ icon, text }) => (
  <View style={styles.requirementItem}>
    <View style={styles.requirementIcon}>
      <Feather name={icon} size={12} color={'#F59E0B'} />
    </View>
    <Text style={styles.requirementText}>{text}</Text>
  </View>
);

function OrganizerApplication() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');

  const [formData, setFormData] = useState({
    organization: '',
    experience: '',
    eventTypes: '',
    motivation: '',
    contactPhone: '',
    website: '',
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.organization || !formData.organization.trim()) {
      newErrors.organization = 'Organization/Company name is required';
    }
    
    if (!formData.experience || !formData.experience.trim()) {
      newErrors.experience = 'Experience description is required';
    } else if (formData.experience.trim().length < 50) {
      newErrors.experience = 'Please provide at least 50 characters describing your experience';
    }
    
    if (!formData.motivation || !formData.motivation.trim()) {
      newErrors.motivation = 'Motivation is required';
    } else if (formData.motivation.trim().length < 30) {
      newErrors.motivation = 'Please provide at least 30 characters explaining your motivation';
    }

    if (!formData.eventTypes || !formData.eventTypes.trim()) {
      newErrors.eventTypes = 'Event types are required';
    }

    if (formData.contactPhone && formData.contactPhone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.contactPhone.trim())) {
        newErrors.contactPhone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || ''
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors below');
      return;
    }

    try {
      setLoading(true);
      
      const applicationData = {
        userId: user.id,
        userEmail: user.emailAddresses?.[0]?.emailAddress,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        ...formData,
        applicationDate: new Date().toISOString(),
        status: 'pending'
      };

      // Submit application to your API
      const response = await fetch(`${API_URL}/organizer/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          router.replace('/(tabs)/settings');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const hasFormData = Object.values(formData).some(value => value.trim() !== '');
    
    if (hasFormData) {
      Alert.alert(
        'Discard Application',
        'Are you sure you want to go back? Your application will not be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const SuccessMessage = () => {
    if (!showSuccess) return null;

    return (
      <View style={styles.successContainer}>
        <Feather name="check-circle" size={20} color="white" style={styles.successIcon} />
        <Text style={styles.successText}>
          Application submitted successfully! We'll review it and get back to you soon.
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={handleBack}
        >
          <Feather name="chevron-left" size={24} color={defaultTheme.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply to be Organizer</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SuccessMessage />

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Feather name="users" size={32} color={defaultTheme.primary} />
          </View>
          <Text style={styles.heroTitle}>Become an Event Organizer</Text>
          <Text style={styles.heroSubtitle}>
            Join our community of event creators and start organizing amazing experiences for others.
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Organizer Benefits</Text>
          <View style={styles.benefitsList}>
            <BenefitItem 
              icon="calendar" 
              text="Create and manage unlimited events" 
            />
            <BenefitItem 
              icon="users" 
              text="Access to attendee analytics and insights" 
            />
            <BenefitItem 
              icon="trending-up" 
              text="Promote your events to our community" 
            />
            <BenefitItem 
              icon="award" 
              text="Organizer badge and verification" 
            />
            <BenefitItem 
              icon="headphones" 
              text="Priority support and assistance" 
            />
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            <RequirementItem 
              icon="check" 
              text="Proven experience in event planning or management" 
            />
            <RequirementItem 
              icon="shield" 
              text="Commitment to maintaining high-quality events" 
            />
            <RequirementItem 
              icon="clock" 
              text="Available to respond to attendee inquiries promptly" 
            />
            <RequirementItem 
              icon="heart" 
              text="Passion for creating memorable experiences" 
            />
          </View>
        </View>

        {/* Application Form */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Application Form</Text>

          <InputField
            label="Organization/Company"
            value={formData.organization}
            onChangeText={(value) => handleInputChange('organization', value)}
            onFocus={() => setFocusedField('organization')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'organization'}
            error={errors.organization}
            required={true}
            placeholder="Enter your organization or company name"
            autoCapitalize="words"
            returnKeyType="next"
          />

          <InputField
            label="Event Planning Experience"
            value={formData.experience}
            onChangeText={(value) => handleInputChange('experience', value)}
            onFocus={() => setFocusedField('experience')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'experience'}
            error={errors.experience}
            required={true}
            multiline={true}
            placeholder="Describe your experience in organizing events, managing teams, or coordinating activities..."
            helperText="Please provide detailed information about your relevant experience (minimum 50 characters)"
          />

          <InputField
            label="Types of Events You Plan to Organize"
            value={formData.eventTypes}
            onChangeText={(value) => handleInputChange('eventTypes', value)}
            onFocus={() => setFocusedField('eventTypes')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'eventTypes'}
            error={errors.eventTypes}
            required={true}
            multiline={true}
            placeholder="e.g., Conferences, Workshops, Networking events, Social gatherings..."
            helperText="What types of events are you most interested in organizing?"
          />

          <InputField
            label="Motivation"
            value={formData.motivation}
            onChangeText={(value) => handleInputChange('motivation', value)}
            onFocus={() => setFocusedField('motivation')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'motivation'}
            error={errors.motivation}
            required={true}
            multiline={true}
            placeholder="Why do you want to become an event organizer on our platform?"
            helperText="Tell us what drives you to create events and bring people together"
          />

          <InputField
            label="Contact Phone (Optional)"
            value={formData.contactPhone}
            onChangeText={(value) => handleInputChange('contactPhone', value)}
            onFocus={() => setFocusedField('contactPhone')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'contactPhone'}
            error={errors.contactPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            returnKeyType="next"
            helperText="For urgent communications regarding your events"
          />

          <InputField
            label="Website/Portfolio (Optional)"
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            onFocus={() => setFocusedField('website')}
            onBlur={() => setFocusedField('')}
            focused={focusedField === 'website'}
            placeholder="https://your-website.com"
            keyboardType="url"
            autoCapitalize="none"
            returnKeyType="done"
            helperText="Link to your website, portfolio, or social media"
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              loading && styles.primaryButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.buttonLoadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.buttonLoadingText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBack}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default OrganizerApplication;