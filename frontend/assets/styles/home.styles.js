import { StyleSheet, Dimensions } from 'react-native';
import { defaultTheme, themes } from '../constants/theme.js';   // assumes themes.primary etc.
import { defaultRouteInfo } from 'expo-router/build/global-state/routeInfo';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  /* ─────────── Existing Rules ─────────────── */
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9'
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal:20,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
  },
  greeting: {
    fontSize: 26,          // slightly larger for prominence
    fontWeight: '700',     // crisper weight for titles
    color: themes.primary, // your brand colour
    letterSpacing: 0.2,    // a touch of breathing room
    marginBottom: 6,
    lineHeight:38        // gap before the search bar
  },
  // greeting 
  greetingContainer: {
    paddingVertical: 10,
    paddingHorizontal: 2,     // slight padding if needed
    marginBottom: 12,         // space before search bar
    backgroundColor: 'transparent',  // or match your container bg
    alignItems: 'flex-start', // keeps text left-aligned
    justifyContent: 'center'
  },
  firstName : {
    color:defaultTheme.primary,
    fontSize:28
  },
  headerIcons: {
    flexDirection: 'row'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10
  },
  upcomingEventCard: {
    backgroundColor: '#fff',
    width: screenWidth * 0.6,
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  eventDate: {
    fontSize: 14,
    color: '#555'
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
    marginTop: 6
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingIcon: {
    color: themes.primary
  },

  /* ─────────── NEW HOME-PAGE ELEMENTS ─────────── */

  /* Search Bar */
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

  searchEventInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: defaultTheme.text
  },

  /* Category Chips */
  categoriesWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20
  },

  categoriesWrapperView: {
    marginBottom:18
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },

  chipActive: {
    backgroundColor: defaultTheme.background,
    borderColor: defaultTheme.accent
  },

  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: defaultTheme.text
  },

  chipTextActive: {
    color: defaultTheme.text
  },

  categoriesContentContainer: {
    paddingRight: 30,        // Extra space on the right
    alignItems: 'center',
  },

  /* My Tickets Preview */
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  ticketInfo: {
    flex: 1,
    marginLeft: 12
  },
  ticketEvent: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  ticketType: {
    fontSize: 14,
    color: '#666'
  },
  ticketStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f1f5f9'
  },
  ticketStatusActive: {
    backgroundColor: themes.primary + '22'
  },
  ticketStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: themes.primary
  },
  ticketEventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketList: {
    paddingBottom: 20,
  },

  /* Quick Action Buttons (optional floating) */
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30
  },
  fabBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themes.primary,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  /* ── Header Layout ────────────────── */
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: defaultTheme.primary,
    letterSpacing: 0.2
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap:5
  },

  /* Profile avatar */
  avatarWrapper: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    borderWidth:2,
    borderColor:defaultTheme.primary,
    overflow: 'hidden',
    backgroundColor: '#d8d8d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode:'cover'
  },

  /* Notification button */
  notificationBtn: {
    width: 40,
    height: 40,
    color:defaultTheme.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation:3
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultTheme.primary
  },

  /* ──── Featured Event Card Styles ──── */
  featuredEventContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  featuredHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuredSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  featuredSeeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  
  /* FIXED: Featured Events Container for proper centering */
  featuredEventsContainer: {
    alignItems: 'center', // Centers the entire FlatList container
    marginBottom: 8,
  },
  
  /* FIXED: Featured Events FlatList Content */
  featuredFlatListContent: {
    paddingHorizontal: 20, // Consistent horizontal padding
    alignItems: 'center',  // Centers items within the content container
  },
  
  /* FIXED: No Featured Events Container */
  noFeaturedEventsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  
  featuredCardsContainer: {
    gap: 16,
  },
  featuredCardContainer: {
    width: 280, // Slightly smaller for better mobile fit
    marginHorizontal: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  featuredImageContainer: {
    position: 'relative',
    height: 200,
  },
  featuredBannerImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },
  featuredTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
  featuredCardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  featuredEventName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  featuredInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  featuredInfoText: {
    fontSize: 13,
    color: '#E5E7EB',
    flex: 1,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  featuredPriceContainer: {
    flex: 1,
  },
  featuredPriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  featuredFreeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  featuredActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  featuredActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  /* ──── FlatList Styles ──── */
  flatListContent: {
    paddingBottom: 20,
  },
  flatListRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  horizontalFlatListContent: {
    paddingHorizontal: 16,
  },

  /* ──── No Featured Events Text Style ──── */
  noFeaturedEventsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },

  /* ╔═══ IMPROVED UPCOMING EVENT CARD STYLES ═══╗ */

  improvedUpcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  upcomingImageContainer: {
    position: 'relative',
    height: 140,
    width: '100%',
  },

  upcomingBannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F9FAFB',
  },

  upcomingImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  upcomingImageTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  upcomingImageTypeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },

  upcomingContentContainer: {
    padding: 16,
    paddingTop: 14,
  },

  upcomingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  improvedEventTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 22,
    marginRight: 12,
  },

  upcomingPriceContainer: {
    alignItems: 'flex-end',
  },

  paidPriceTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  paidPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  freePriceTag: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  freePriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },

  upcomingInfoContainer: {
    gap: 8,
    marginBottom: 14,
  },

  improvedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  improvedInfoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },

  upcomingBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  attendeesPreview: {
    flex: 1,
  },

  attendeesText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },

  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },

  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },

  /* ── Header Layout ────────────────── */
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap:5
  },

  /* Profile avatar */
  avatarWrapper: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    borderWidth:2,
    borderColor:defaultTheme.primary,
    overflow: 'hidden',
    backgroundColor: '#d8d8d8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode:'cover'
  },

  /* Notification button */
  notificationBtn: {
    width: 40,
    height: 40,
    color:defaultTheme.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation:3
  },

  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultTheme.primary
  },

  /* ╔═══ SIMPLE VIEW ALL EVENTS BUTTON ═══╗ */

  viewAllButtonContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },

  viewAllButton: {
    backgroundColor: defaultTheme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  viewAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

});