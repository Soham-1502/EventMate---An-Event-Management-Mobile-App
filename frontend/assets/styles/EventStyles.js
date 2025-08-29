// assets/styles/EventStyles.js

import { StyleSheet } from 'react-native';
import { defaultTheme } from '../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.background,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 35,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: defaultTheme.text,
    marginLeft: 8,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: defaultTheme.accent,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  controlText: {
    fontSize: 12,
    color: defaultTheme.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultTheme.text,
  },
  quickFiltersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  quickFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: defaultTheme.accent,
    borderRadius: 16,
    marginRight: 8,
  },
  quickFilterChipActive: {
    backgroundColor: defaultTheme.primary,
  },
  quickFilterText: {
    fontSize: 12,
    color: defaultTheme.text,
    fontWeight: '500',
  },
  quickFilterTextActive: {
    color: '#fff',
  },
  eventsList: {
    paddingHorizontal: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardGrid: {
    flex: 1,
    marginHorizontal: 4,
  },
  eventImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventImageGrid: {
    height: 120,
  },
  eventContent: {
    padding: 16,
  },
  eventContentGrid: {
    padding: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: defaultTheme.text,
    marginRight: 8,
  },
  eventTitleGrid: {
    fontSize: 14,
  },
  bookmarkButton: {
    padding: 4,
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: defaultTheme.primary,
    borderRadius: 6,
  },
  eventBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventMeta: {
    marginBottom: 12,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 14,
    color: defaultTheme.secondary,
    marginLeft: 8,
  },
  eventMetaTextGrid: {
    fontSize: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultTheme.primary,
  },
  eventPriceGrid: {
    fontSize: 14,
  },
  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  soldOutStatus: {
    backgroundColor: defaultTheme.error,
  },
  lowStockStatus: {
    backgroundColor: '#FFA500',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: defaultTheme.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: defaultTheme.accent,
    textAlign: 'center',
  },
});
