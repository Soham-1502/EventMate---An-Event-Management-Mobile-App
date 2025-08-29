// Events.jsx - Final Optimized Version with Server-Side Pagination
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import CategoryChips from '../components/CategoryChips';
import AppHeader from '../components/AppHeader';
import { GetEvents } from '../../hooks/useEventsHooks';
import { formatDate } from '../../lib/utils';
import EventStyles from '../../assets/styles/EventStyles';
import { defaultTheme } from '../../assets/constants/theme';

// Constants
const QUICK_FILTERS = [
  { id: 'free', label: 'Free', active: false },
  { id: 'weekend', label: 'This Weekend', active: false },
  { id: 'virtual', label: 'Virtual Only', active: false },
  { id: 'near', label: 'Near Me', active: false },
];

const SORT_OPTIONS = [
  { id: 'date_asc', label: 'Soonest First' },
  { id: 'date_desc', label: 'Latest First' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'popularity', label: 'Most Popular' },
];

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 500;

// Optimized EventCard Component
const EventCard = memo(({ item, isBookmarked, viewMode, onBookmarkToggle, onEventPress }) => {
  const isGrid = viewMode === 'grid';
  
  // Pre-calculate expensive values
  const eventData = useMemo(() => ({
    formattedDate: formatDate(item.date_start),
    priceText: item.price_from > 0 ? `From $${item.price_from}` : 'Free',
    locationText: item.is_virtual ? 'Virtual Event' : item.location,
    showLowStock: item.attendee_count && item.max_attendees ? 
      (item.attendee_count / item.max_attendees) > 0.8 : false,
  }), [item.id, item.date_start, item.price_from, item.is_virtual, item.location, item.attendee_count, item.max_attendees]);

  const handlePress = useCallback(() => {
    onEventPress(item.id);
  }, [item.id, onEventPress]);

  const handleBookmarkPress = useCallback(() => {
    onBookmarkToggle(item.id);
  }, [item.id, onBookmarkToggle]);

  return (
    <TouchableOpacity
      style={[EventStyles.eventCard, isGrid && EventStyles.eventCardGrid]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View>
        <Image
          source={{ uri: item.banner_url }}
          style={[EventStyles.eventImage, isGrid && EventStyles.eventImageGrid]}
          resizeMode="cover"
          progressiveRenderingEnabled={true}
          fadeDuration={200}
        />
        <View style={EventStyles.eventBadge}>
          <Text style={EventStyles.eventBadgeText}>
            {item.event_type}
          </Text>
        </View>
        {item.is_featured && (
          <View style={EventStyles.featuredBadge}>
            <Ionicons name="star" size={16} color="white" />
          </View>
        )}
      </View>

      <View style={[EventStyles.eventContent, isGrid && EventStyles.eventContentGrid]}>
        <View style={EventStyles.eventHeader}>
          <Text style={[EventStyles.eventTitle, isGrid && EventStyles.eventTitleGrid]} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity
            style={EventStyles.bookmarkButton}
            onPress={handleBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? defaultTheme.primary : defaultTheme.secondary}
            />
          </TouchableOpacity>
        </View>

        <View style={EventStyles.eventMeta}>
          <View style={EventStyles.eventMetaRow}>
            <Ionicons name="calendar-outline" size={16} color={defaultTheme.secondary} />
            <Text style={[EventStyles.eventMetaText, isGrid && EventStyles.eventMetaTextGrid]}>
              {eventData.formattedDate}
            </Text>
          </View>
          <View style={EventStyles.eventMetaRow}>
            <Ionicons 
              name={item.is_virtual ? 'videocam-outline' : 'location-outline'} 
              size={16} 
              color={defaultTheme.secondary} 
            />
            <Text style={[EventStyles.eventMetaText, isGrid && EventStyles.eventMetaTextGrid]} numberOfLines={1}>
              {eventData.locationText}
            </Text>
          </View>
        </View>

        <View style={EventStyles.eventFooter}>
          <Text style={[EventStyles.eventPrice, isGrid && EventStyles.eventPriceGrid]}>
            {eventData.priceText}
          </Text>
          {eventData.showLowStock && (
            <View style={[EventStyles.eventStatus, EventStyles.lowStockStatus]}>
              <Text style={EventStyles.statusText}>Few left</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.isBookmarked === nextProps.isBookmarked &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.date_start === nextProps.item.date_start
  );
});

EventCard.displayName = 'EventCard';

export default function EventsPage() {
  const router = useRouter();
  const { user } = useUser();
  
  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [quickFilters, setQuickFilters] = useState(QUICK_FILTERS);
  const [sortBy, setSortBy] = useState('date_asc');
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_events: 0,
    events_per_page: PAGE_SIZE,
    has_next_page: false,
    has_prev_page: false
  });
  
  // Debounced search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Debounced search implementation
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setSearchQuery(searchText);
    }, SEARCH_DEBOUNCE_MS);
    
    setSearchTimeout(timeout);
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchText]);

  // Build filters object
  const currentFilters = useMemo(() => {
    const filters = {
      search: searchQuery,
      category: activeCategory,
      sort_by: sortBy.includes('_') ? sortBy.split('_')[0] : sortBy,
      sort_order: sortBy.includes('_desc') ? 'desc' : 'asc'
    };

    // Add quick filters
    quickFilters.forEach(filter => {
      if (filter.active) {
        switch (filter.id) {
          case 'free':
            filters.price_filter = 'free';
            break;
          case 'virtual':
            filters.is_virtual = 'true';
            break;
          case 'weekend':
            // Calculate weekend dates
            const now = new Date();
            const currentDay = now.getDay();
            const daysUntilSaturday = (6 - currentDay) % 7;
            const saturday = new Date(now);
            saturday.setDate(now.getDate() + daysUntilSaturday);
            const sunday = new Date(saturday);
            sunday.setDate(saturday.getDate() + 1);
            
            filters.date_from = saturday.toISOString().split('T')[0];
            filters.date_to = sunday.toISOString().split('T')[0];
            break;
          case 'near':
            // This would need geolocation implementation
            break;
        }
      }
    });

    return filters;
  }, [searchQuery, activeCategory, sortBy, quickFilters]);

  // Fetch events with current filters
  const fetchEvents = useCallback(async (page = 1, reset = false) => {
    if ((loading || loadingMore) && !reset) return;
    
    if (page === 1) {
      setLoading(true);
      setInitialLoading(reset);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await GetEvents({
        page,
        limit: PAGE_SIZE,
        ...currentFilters,
        use_cache: page === 1 // Only cache first page
      });
      
      if (response && !response.error) {
        const newEvents = response.data || [];
        
        setEvents(prev => page === 1 ? newEvents : [...prev, ...newEvents]);
        setPagination(response.pagination || pagination);
      } else {
        console.error('API Error:', response.error);
        Alert.alert('Error', response.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoading(false);
    }
  }, [currentFilters, loading, loadingMore, pagination]);

  // Load initial events and reset when filters change
  useEffect(() => {
    fetchEvents(1, true);
  }, [currentFilters]);

  // Handlers
  const handleSearch = useCallback((text) => {
    setSearchText(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
    setSearchQuery('');
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const toggleQuickFilter = useCallback((filterId) => {
    setQuickFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, active: !filter.active }
        : filter
    ));
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const toggleBookmark = useCallback((eventId) => {
    setBookmarkedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.has_next_page && !loading && !loadingMore) {
      fetchEvents(pagination.current_page + 1);
    }
  }, [pagination, loading, loadingMore, fetchEvents]);

  const handleEventPress = useCallback((eventId) => {
    router.push({
      pathname: `/events/${eventId}`,
      params: { from: 'events' }
    });
  }, [router]);

  const handleRefresh = useCallback(() => {
    fetchEvents(1, true);
  }, [fetchEvents]);

  // Show sort options modal
  const showSortOptions = useCallback(() => {
    const options = SORT_OPTIONS.map(option => option.label);
    const selectedIndex = SORT_OPTIONS.findIndex(option => option.id === sortBy);
    
    Alert.alert(
      'Sort Events',
      'Choose how to sort events',
      [
        ...SORT_OPTIONS.map((option, index) => ({
          text: option.label + (index === selectedIndex ? ' ✓' : ''),
          onPress: () => handleSortChange(option.id)
        })),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }, [sortBy, handleSortChange]);

  // Optimized render function
  const renderEventCard = useCallback(({ item }) => {
    return (
      <EventCard
        item={item}
        isBookmarked={bookmarkedEvents.has(item.id)}
        viewMode={viewMode}
        onBookmarkToggle={toggleBookmark}
        onEventPress={handleEventPress}
      />
    );
  }, [bookmarkedEvents, viewMode, toggleBookmark, handleEventPress]);

  // Key extractor
  const keyExtractor = useCallback((item) => item.id?.toString(), []);

  // Loading components
  const ListFooterComponent = useCallback(() => {
    if (loadingMore) {
      return (
        <ActivityIndicator 
          style={{ marginVertical: 20 }} 
          color={defaultTheme.primary} 
          size="small"
        />
      );
    }
    
    if (events.length > 0 && !pagination.has_next_page) {
      return (
        <View style={EventStyles.endOfListContainer}>
          <Text style={EventStyles.endOfListText}>
            You've reached the end! 🎉
          </Text>
        </View>
      );
    }
    
    return null;
  }, [loadingMore, events.length, pagination.has_next_page]);

  const ListEmptyComponent = useCallback(() => {
    if (initialLoading || loading) return null;
    
    return (
      <View style={EventStyles.emptyContainer}>
        <Ionicons name="calendar-outline" size={64} color={defaultTheme.accent} />
        <Text style={EventStyles.emptyText}>No events found</Text>
        <Text style={EventStyles.emptySubtext}>
          {searchQuery ? 'Try different search terms' : 'Try adjusting your filters'}
        </Text>
        {searchQuery && (
          <TouchableOpacity 
            style={EventStyles.clearButton}
            onPress={clearSearch}
          >
            <Text style={EventStyles.clearButtonText}>Clear search</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [initialLoading, loading, searchQuery, clearSearch]);

  // Initial loading state
  if (initialLoading) {
    return (
      <>
        <AppHeader />
        <View style={EventStyles.loadingContainer}>
          <ActivityIndicator size="large" color={defaultTheme.primary} />
          <Text style={{ marginTop: 16, color: defaultTheme.secondary }}>
            Loading events...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <View style={EventStyles.container}>
        
        {/* Search Bar */}
        <View style={EventStyles.headerContainer}>
          <View style={EventStyles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={defaultTheme.secondary} />
            <TextInput
              style={EventStyles.searchInput}
              placeholder="Search events..."
              value={searchText}
              onChangeText={handleSearch}
              placeholderTextColor={defaultTheme.secondary}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={defaultTheme.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Chips */}
        <CategoryChips active={activeCategory} onSelect={handleCategoryChange} />

        {/* Quick Filters */}
        <View style={EventStyles.quickFiltersContainer}>
          <View style={EventStyles.quickFiltersRow}>
            {quickFilters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  EventStyles.quickFilterChip,
                  filter.active && EventStyles.quickFilterChipActive
                ]}
                onPress={() => toggleQuickFilter(filter.id)}
              >
                <Text style={[
                  EventStyles.quickFilterText,
                  filter.active && EventStyles.quickFilterTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Control Bar */}
        <View style={EventStyles.controlBar}>
          <TouchableOpacity
            style={EventStyles.controlButton}
            onPress={() => Alert.alert('Filters', 'Advanced filters coming soon!')}
          >
            <Ionicons name="filter-outline" size={20} color={defaultTheme.primary} />
            <Text style={EventStyles.controlText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={EventStyles.controlButton}
            onPress={showSortOptions}
          >
            <Ionicons name="swap-vertical-outline" size={20} color={defaultTheme.primary} />
            <Text style={EventStyles.controlText}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={EventStyles.controlButton}
            onPress={toggleViewMode}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} 
              size={20} 
              color={defaultTheme.primary} 
            />
            <Text style={EventStyles.controlText}>
              {viewMode === 'list' ? 'Grid' : 'List'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={EventStyles.controlButton}
            onPress={() => Alert.alert('Map', 'Map view coming soon!')}
          >
            <Ionicons name="map-outline" size={20} color={defaultTheme.primary} />
            <Text style={EventStyles.controlText}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Results Count & Status */}
        <View style={EventStyles.resultsContainer}>
          <Text style={EventStyles.resultsCount}>
            {pagination.total_events} events found
          </Text>
          {searchQuery && (
            <Text style={EventStyles.searchIndicator}>
              Searching for "{searchQuery}"
            </Text>
          )}
          {loading && events.length === 0 && (
            <ActivityIndicator size="small" color={defaultTheme.primary} />
          )}
        </View>

        {/* Events List */}
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={keyExtractor}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={`${viewMode}-${activeCategory}`}
          contentContainerStyle={EventStyles.eventsList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshing={loading && events.length > 0}
          onRefresh={handleRefresh}
          
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          legacyImplementation={false}
          disableVirtualization={false}
        />
      </View>
    </>
  );
}