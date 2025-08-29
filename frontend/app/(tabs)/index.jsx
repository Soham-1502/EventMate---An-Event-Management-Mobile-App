import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from '../../assets/styles/home.styles';
import AppHeader from '../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useMemo, useCallback } from 'react';
import PageLoader from '../components/PageLoader';
import FeaturedEventCard from '../components/FeaturedEventCard';
import UpcomingEventCard from '../components/UpcomingEventsCard';
import CategoryChips from '../components/CategoryChips';
import { GetEvents, GetCurrentUserEvents } from '../../hooks/useEventsHooks';

// Mock data
export const mockEvents = [
  {
    id: '1',
    name: 'React Global Conference 2025',
    description: 'Join the biggest React conference of the year with industry leaders and cutting-edge workshops.',
    date_start: '2025-11-10T09:00:00Z',
    date_end: '2025-11-12T18:00:00Z',
    location: 'San Francisco, CA',
    is_virtual: false,
    event_type: 'conference',
    is_featured: true,
    banner_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    price_from: 129.00,
  },
  {
    id: '2',
    name: 'AI Hackathon 2025',
    description: 'Build the future with AI in this intensive 48-hour hackathon.',
    date_start: '2025-11-22T08:00:00Z',
    date_end: '2025-11-24T20:00:00Z',
    location: 'New York, NY',
    is_virtual: false,
    event_type: 'hackathon',
    is_featured: true,
    banner_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop',
    price_from: 0,
  },
  {
    id: '3',
    name: 'Web3 Developer Meetup',
    description: 'Connect with fellow Web3 developers and explore the latest trends in blockchain technology.',
    date_start: '2025-12-05T18:00:00Z',
    date_end: '2025-12-05T21:00:00Z',
    location: 'Austin, TX',
    is_virtual: false,
    event_type: 'meetup',
    is_featured: false,
    banner_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    price_from: 0,
  }
];

const CategoryMap = {
  All: 'all',
  Conferences: 'conference',
  Hackathons: 'hackathon',
  Meetups: 'meetup',
  Virtual: 'virtual'
}

export default function HomePage() {
  // ALL HOOKS MUST BE DECLARED FIRST - NO EARLY RETURNS BEFORE THIS SECTION
  const { isLoaded, user } = useUser();
  const { signOut, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [allFeaturedEvents, setAllFeaturedEvents] = useState([]);
  const [allUpcomingEvents, setAllUpcomingEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(false);

  // Use useMemo for filtering instead of useEffect to prevent re-renders
  const filteredEvents = useMemo(() => {
    const filterBySearch = (eventsList, searchQuery) => {
      if (!eventsList || !Array.isArray(eventsList)) {
        return [];
      }
      
      if (!searchQuery || !searchQuery.trim()) {
        return eventsList;
      }
      
      const query = searchQuery.toLowerCase().trim();
      
      return eventsList.filter(event => {
        if (!event) return false;
        
        const searchFields = [
          event.name,
          event.description,
          event.location,
          event.event_type
        ];
        
        return searchFields.some(field => 
          field && field.toLowerCase().includes(query)
        );
      });
    };

    const filterByCategory = (eventsList, category) => {
      if (!eventsList || !Array.isArray(eventsList)) {
        return [];
      }
      
      if (category === 'All') {
        return eventsList;
      }
      
      const eventTypeToFilter = CategoryMap[category];
      if (!eventTypeToFilter || eventTypeToFilter === 'all') {
        return eventsList;
      }
      
      return eventsList.filter(event => {
        if (!event) return false;
        
        // Handle virtual events special case
        if (category === 'Virtual') {
          return event.is_virtual === true;
        }
        
        const eventType = event.event_type?.toLowerCase();
        return eventType === eventTypeToFilter;
      });
    };

    // Apply filters
    let filteredFeatured = filterByCategory(allFeaturedEvents, activeCategory);
    let filteredUpcoming = filterByCategory(allUpcomingEvents, activeCategory);
    
    filteredFeatured = filterBySearch(filteredFeatured, searchText);
    filteredUpcoming = filterBySearch(filteredUpcoming, searchText);
    
    return {
      featured: filteredFeatured || [],
      upcoming: filteredUpcoming || []
    };
  }, [allFeaturedEvents, allUpcomingEvents, searchText, activeCategory]);

  // Fetch events only once
  useEffect(() => {
    const fetchEvents = async () => {

      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) return;
      
      setIsLoadingEvents(true);
      try {
        const response = await GetEvents();

        if (response && response.data) {
          const allEvents = response.data;
        
          const now = new Date();

          // Featured Events
          const featuredEvents = allEvents.filter((event) => {
            const eventStartDate = new Date(event.date_start);
            const isFeatured = event.is_featured === true;
            const isFuture = eventStartDate > now;
            return isFeatured && isFuture;
          });

          // Upcoming Events
          const upcomingEvents = allEvents.filter((event) => {
            const eventStartDate = new Date(event.date_start);
            return eventStartDate > now;
          });

          // Store all events for filtering
          setAllFeaturedEvents(featuredEvents);
          setAllUpcomingEvents(upcomingEvents);
          setEventsError(false)

        } else {
          console.log("No data found in response");
          setAllFeaturedEvents([]);
          setAllUpcomingEvents([]);
          setEventsError(true);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setAllFeaturedEvents([]);
        setAllUpcomingEvents([]);
        setEventsError(true);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [isLoaded, isSignedIn, user?.id]);

  // Handle search text change - Use useCallback to prevent recreation
  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
  }, []);

  // Clear search function - Use useCallback to prevent recreation
  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  // Handle category selection - Use useCallback to prevent recreation
  const handleCategorySelect = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleViewAllEvents = useCallback(() => {
    router.push('(tabs)/Events');
  }, [router]);

  const handleEventPress = (event)=>{
    router.push({
      pathname: `/events/${event.id}`,
      params: { from : 'home' }
    })
  }

  // Use filtered events from useMemo
  const featuredEvents = filteredEvents.featured;
  const upcomingEvents = filteredEvents.upcoming;

  // Calculate total results for search info - FIXED VERSION
  const getUniqueEventCount = (featuredEvents, upcomingEvents) => {
    const seenIds = new Set();
    let count = 0;
    
    // Count featured events
    featuredEvents.forEach(event => {
      if (event.id && !seenIds.has(event.id)) {
        seenIds.add(event.id);
        count++;
      }
    });
    
    // Count upcoming events (skip if already counted in featured)
    upcomingEvents.forEach(event => {
      if (event.id && !seenIds.has(event.id)) {
        seenIds.add(event.id);
        count++;
      }
    });
    
    return count;
  };

  const totalResults = getUniqueEventCount(featuredEvents, upcomingEvents);
  const hasSearchQuery = searchText.trim().length > 0;

  // EARLY RETURN AFTER ALL HOOKS - Only show page loader for auth/user loading
  if (!isLoaded || !isSignedIn) {
    return <PageLoader />;
  }

  // MAIN RETURN - Use ScrollView instead of FlatList with ListHeaderComponent
  return (
    <> 
    <AppHeader />
    <View style={styles.container}>
      
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Welcome, <Text style={styles.firstName}>{user?.firstName || 'Guest'}</Text>
            {'\n'}Discover amazing events happening around you
          </Text>
        </View>

        {/* Search Bar - Enhanced with clear functionality */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchEventInput}
            onChangeText={handleSearchChange}
            value={searchText}
            placeholder="Search for Events"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing" // iOS only
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
          <Ionicons name="filter" size={24} color="#666" />
        </View>

        {/* Show search results info */}
        {hasSearchQuery && (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <Text style={{ color: '#666', fontSize: 14 }}>
              {totalResults === 0 
                ? `No results found for "${searchText}"`
                : `Found ${totalResults} event${totalResults !== 1 ? 's' : ''} for "${searchText}"`
              }
            </Text>
          </View>
        )}

        {/* Category Chips */}
        <CategoryChips 
          active={activeCategory} 
          onSelect={handleCategorySelect} 
        />

        {/* Featured Events Section */}
        <View style={styles.featuredHeaderContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.featuredSectionTitle}>Featured Events</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.featuredSeeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoadingEvents ? (
          <View style={styles.noFeaturedEventsContainer}>
            <Text style={styles.noFeaturedEventsText}>Loading Featured Events...</Text>
          </View>
        ) : featuredEvents.length === 0 ? (
          <View style={styles.noFeaturedEventsContainer}>
            <Text style={styles.noFeaturedEventsText}>
              {hasSearchQuery
                ? "No featured events match your search"
                : activeCategory !== 'All' 
                ? `No featured ${activeCategory.toLowerCase()} events found`
                : "Stay tuned for featured events!"
              }
            </Text>
          </View>
        ) : (
          <View style={styles.featuredEventsContainer}>
            <FlatList
              data={featuredEvents}
              keyExtractor={item => item.id || `featured-${Math.random()}`}
              renderItem={({ item }) => (
                <FeaturedEventCard 
                  event={item}
                  onPress={(item)=>{
                      router.push({
                      pathname: `/events/${item.id}`,
                      params: { from : 'home' }
                  })}}
                />
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredFlatListContent}
              ItemSeparatorComponent={() => <View style={{width: 16}} />}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={280}
            />
          </View>
        )}

        {/* Upcoming Events Header */}
        <View style={[styles.featuredHeaderContainer, { marginTop: 24 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.featuredSectionTitle}>Upcoming Events</Text>
            
          </View>
          <TouchableOpacity onPress={handleViewAllEvents}>
            <Text style={styles.featuredSeeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {isLoadingEvents ? (
          <View style={styles.noFeaturedEventsContainer}>
            <Text style={styles.noFeaturedEventsText}>
              Loading Upcoming Events...
            </Text>
          </View>
        ) : upcomingEvents.length === 0 ? (
          <View style={styles.noFeaturedEventsContainer}>
            <Text style={styles.noFeaturedEventsText}>
              {hasSearchQuery
                ? "No upcoming events match your search"
                : activeCategory !== 'All'
                ? `No upcoming ${activeCategory.toLowerCase()} events found`
                : "No upcoming events found"
              }
            </Text>
          </View>
        ) : (
          <>
            {/* Upcoming Events List */}
            {upcomingEvents.map((item, index) => (
              <View key={item.id || `upcoming-${index}`}>
                <UpcomingEventCard
                  event={item}
                  onPress={(item)=>{
                      router.push({
                      pathname: `/events/${item.id}`,
                      params: { from : 'home' }
                  })}}
                />
                {index < upcomingEvents.length - 1 && <View style={{ height: 12 }} />}
              </View>
            ))}

            {/* View All Button */}
            <View style={styles.viewAllButtonContainer}>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={handleViewAllEvents}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllButtonText}>View All Events</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
    </>
  );
}