// assets/styles/SettingStyles.js - Updated with Edit Profile support

import { StyleSheet } from 'react-native';
import { defaultTheme } from '../constants/theme.js';

export default StyleSheet.create({
  // Container Styles
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

  // Header Styles
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 25,
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
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: defaultTheme.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
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

  // Scroll Container Styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Section Styles
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
    paddingHorizontal:6,
    paddingVertical:8
  },

  // Setting Item Styles
  settingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'white',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingItemTextContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultTheme.text,
    letterSpacing: 0.2,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: defaultTheme.secondary,
    marginTop: 2,
    fontWeight: '500',
  },
  settingItemDanger: {
    color: defaultTheme.error,
  },
  settingItemRightElement: {
    marginLeft: 16,
  },
  settingItemChevron: {
    color: defaultTheme.secondary,
  },

  // User Profile Header Styles
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

  // Input Field Styles
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

  // Button Styles
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

  // Loading Button Styles
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

  // Modal Styles
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

  // Toggle Styles
  toggleContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: defaultTheme.primary,
  },
  toggleOff: {
    backgroundColor: '#D1D5DB',
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },

  // Version Container
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

  // Utility Classes
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
});