// assets/styles/EditProfileStyles.js - Enhanced to match Settings page

import { StyleSheet } from 'react-native';
import { defaultTheme } from '../constants/theme.js';

export default StyleSheet.create({
  // Main Container Styles (matching settings page)
  container: {
    flex: 1,
    backgroundColor: defaultTheme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultTheme.background,
  },
  loadingText: {
    marginTop: 12,
    color: defaultTheme.secondary,
    fontSize: 16,
    fontWeight: '500',
  },

  // Header Styles (matching settings page)
 header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal:20,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerBackButton: {
    paddingLeft:8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: defaultTheme.text,
    flex: 1,
    textAlign: 'center',
    paddingRight:20
  },
  headerSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: defaultTheme.primary,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  headerSaveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // Scroll View Styles (matching settings page)
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Section Styles (matching settings page)
  sectionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: defaultTheme.text,
    letterSpacing: 0.3,
  },
  sectionContent: {
    padding: 20,
  },

  // Input Field Styles (enhanced)
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: defaultTheme.text,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: defaultTheme.text,
    backgroundColor: 'white',
    minHeight: 50,
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: defaultTheme.primary,
    borderWidth: 2,
    shadowColor: defaultTheme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    color: defaultTheme.secondary,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: defaultTheme.error,
    borderWidth: 2,
    backgroundColor: '#FEF2F2',
  },
  helperText: {
    marginTop: 8,
    fontSize: 13,
    color: defaultTheme.secondary,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: defaultTheme.error,
    lineHeight: 18,
    fontWeight: '600',
  },

  // User Profile Header Styles (matching settings page)
  userProfileContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userProfileAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  userProfileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userProfileAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userProfileCameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: defaultTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userProfileName: {
    fontSize: 20,
    fontWeight: '700',
    color: defaultTheme.text,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  userProfileEmail: {
    fontSize: 15,
    color: defaultTheme.secondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Button Styles (enhanced)
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: defaultTheme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: defaultTheme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonText: {
    color: defaultTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles (enhanced)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: defaultTheme.text,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  modalButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonLast: {
    borderBottomWidth: 0,
  },
  modalButtonIcon: {
    marginRight: 20,
    width: 24,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: defaultTheme.text,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  modalButtonDangerText: {
    color: defaultTheme.error,
  },
  modalCancelButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: defaultTheme.text,
    letterSpacing: 0.3,
  },

  // Success Message Styles
  successContainer: {
    backgroundColor: defaultTheme.primary,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: defaultTheme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  successIcon: {
    marginRight: 12,
  },
  successText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.2,
  },

  // Loading States
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.3,
  },

  // Version Container (matching settings page)
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  versionText: {
    fontSize: 13,
    color: defaultTheme.secondary,
    fontWeight: '500',
    opacity: 0.7,
  },

  // Validation Styles
  validationContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: defaultTheme.error,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  validationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: defaultTheme.error,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  validationMessage: {
    fontSize: 14,
    color: defaultTheme.error,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Utility Styles
  spacingSmall: {
    marginBottom: 12,
  },
  spacingMedium: {
    marginBottom: 20,
  },
  spacingLarge: {
    marginBottom: 32,
  },
  textCenter: {
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },

  // Additional Enhanced Styles
  formGroup: {
    marginBottom: 20,
  },
  formDescription: {
    fontSize: 14,
    color: defaultTheme.secondary,
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  requiredIndicator: {
    color: defaultTheme.error,
    fontSize: 16,
    fontWeight: '700',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  inputWithIcon: {
    paddingRight: 50,
  },

  // Animation Styles for smooth transitions
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },
  
  // Enhanced Shadow Styles
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  roleStatusContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  roleStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  // Apply to be Organizer Button Styles
  applyOrganizerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6' + '08', // Use your theme primary color
    borderWidth: 1,
    borderColor: '#3B82F6' + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  applyOrganizerButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  applyOrganizerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 2,
  },
  applyOrganizerButtonSubtext: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  reapplyButton: {
    backgroundColor: '#EF4444' + '08',
    borderColor: '#EF4444' + '20',
  },
});