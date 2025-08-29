// assets/styles/OrganizerApplicationStyles.js

import { StyleSheet } from 'react-native';
import { defaultTheme } from '../constants/theme.js';

export default StyleSheet.create({
  // Role Status Styles
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
    backgroundColor: '#F3F4F6', // subtle background for badge
  },
  roleStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    color: defaultTheme.text,
  },

  // Apply to be Organizer Button Styles
  applyOrganizerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: defaultTheme.primary + '08',
    borderWidth: 1,
    borderColor: defaultTheme.primary + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: defaultTheme.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  applyOrganizerButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: defaultTheme.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  applyOrganizerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultTheme.primary,
    marginBottom: 2,
  },
  applyOrganizerButtonSubtext: {
    fontSize: 13,
    color: defaultTheme.secondary,
    lineHeight: 18,
  },

  // Reapply Button Variant (Danger)
  reapplyButton: {
    backgroundColor: defaultTheme.error + '08',
    borderColor: defaultTheme.error + '20',
  },
});
