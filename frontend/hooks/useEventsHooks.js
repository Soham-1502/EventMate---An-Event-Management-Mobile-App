import { API_URL } from "./APIURL";

// Cache implementation for better performance
class EventsCache {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    generateKey(endpoint, params) {
        return `${endpoint}_${JSON.stringify(params)}`;
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }

    clearByPattern(pattern) {
        for (let key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
}

const eventsCache = new EventsCache();

// Helper function to build query parameters
function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value.toString());
        }
    });
    
    return searchParams.toString();
}

// Enhanced function to get all events with filtering and pagination
export async function GetEvents(options = {}) {
    const {
        page = 1,
        limit = 20,
        search = '',
        category = '',
        event_type = '',
        is_virtual = '',
        price_filter = '',
        sort_by = 'date_start',
        sort_order = 'asc',
        date_from = '',
        date_to = '',
        min_price = '',
        max_price = '',
        location = '',
        featured_only = false,
        use_cache = true,
        userId = null // If provided, gets user-specific events
    } = options;

    try {
        // Build endpoint
        const endpoint = userId 
            ? `events/getAll/${userId}` 
            : 'events/getAll';

        // Build query parameters
        const queryParams = {
            page,
            limit,
            search,
            category,
            event_type,
            is_virtual,
            price_filter,
            sort_by,
            sort_order,
            date_from,
            date_to,
            min_price,
            max_price,
            location,
            featured_only: featured_only.toString()
        };

        const queryString = buildQueryString(queryParams);
        const url = `${API_URL}/${endpoint}?${queryString}`;
        
        // Check cache first
        const cacheKey = eventsCache.generateKey(endpoint, queryParams);
        if (use_cache) {
            const cachedData = eventsCache.get(cacheKey);
            if (cachedData) {
                console.log('Returning cached events data');
                return cachedData;
            }
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the result
        if (use_cache && data.data) {
            eventsCache.set(cacheKey, data);
        }
        
        return data;
        
    } catch (error) {
        console.error("Error Fetching Events:", error);
        return {
            error: error.message,
            data: [],
            pagination: {
                current_page: page,
                total_pages: 0,
                total_events: 0,
                events_per_page: limit,
                has_next_page: false,
                has_prev_page: false
            }
        };
    }
}

// Get events for current user (organizer's events)
export async function GetCurrentUserEvents(user, options = {}) {
    if (!user?.id) {
        console.error("User ID not available");
        return {
            error: "User ID not available",
            data: [],
            pagination: {
                current_page: 1,
                total_pages: 0,
                total_events: 0,
                events_per_page: 20,
                has_next_page: false,
                has_prev_page: false
            }
        };
    }
    
    return GetEvents({
        ...options,
        userId: user.id
    });
}

// Get single event by ID
export async function GetEventById(eventId, options = {}) {
    const {
        include_stats = false,
        use_cache = true
    } = options;

    try {
        const queryString = buildQueryString({
            include_stats: include_stats.toString()
        });
        
        const url = `${API_URL}/events/getOne/${eventId}?${queryString}`;
        
        // Check cache first
        const cacheKey = eventsCache.generateKey(`event_${eventId}`, { include_stats });
        if (use_cache) {
            const cachedData = eventsCache.get(cacheKey);
            if (cachedData) {
                console.log('Returning cached event data');
                return cachedData;
            }
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the result
        if (use_cache && data.data) {
            eventsCache.set(cacheKey, data);
        }
        
        return data;
        
    } catch (error) {
        console.error("Error Fetching Event:", error);
        return {
            error: error.message,
            data: null
        };
    }
}

// Search events with debouncing
export async function SearchEvents(searchQuery, options = {}) {
    const {
        page = 1,
        limit = 20,
        category = '',
        price_filter = '',
        sort_by = 'date_start',
        sort_order = 'asc'
    } = options;

    return GetEvents({
        page,
        limit,
        search: searchQuery,
        category,
        price_filter,
        sort_by,
        sort_order,
        use_cache: false // Don't cache search results as they change frequently
    });
}

// Get events by category
export async function GetEventsByCategory(category, options = {}) {
    return GetEvents({
        ...options,
        category
    });
}

// Get events by date range
export async function GetEventsByDateRange(dateFrom, dateTo, options = {}) {
    return GetEvents({
        ...options,
        date_from: dateFrom,
        date_to: dateTo
    });
}

// Get free events
export async function GetFreeEvents(options = {}) {
    return GetEvents({
        ...options,
        price_filter: 'free'
    });
}

// Get virtual events
export async function GetVirtualEvents(options = {}) {
    return GetEvents({
        ...options,
        is_virtual: 'true'
    });
}

// Get featured events
export async function GetFeaturedEvents(options = {}) {
    return GetEvents({
        ...options,
        featured_only: true
    });
}

// Clear cache functions
export function clearEventsCache() {
    eventsCache.clear();
    console.log('Events cache cleared');
}

export function clearEventsCacheByPattern(pattern) {
    eventsCache.clearByPattern(pattern);
    console.log(`Events cache cleared for pattern: ${pattern}`);
}

// Hook for React components to get events with loading states
export function useEvents(options = {}) {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [pagination, setPagination] = React.useState({
        current_page: 1,
        total_pages: 0,
        total_events: 0,
        events_per_page: 20,
        has_next_page: false,
        has_prev_page: false
    });

    const fetchEvents = React.useCallback(async (newOptions = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await GetEvents({ ...options, ...newOptions });
            
            if (result.error) {
                setError(result.error);
            } else {
                setEvents(result.data || []);
                setPagination(result.pagination || pagination);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [options]);

    React.useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        loading,
        error,
        pagination,
        refetch: fetchEvents,
        setEvents
    };
}

// Hook for single event
export function useEvent(eventId, options = {}) {
    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const fetchEvent = React.useCallback(async () => {
        if (!eventId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const result = await GetEventById(eventId, options);
            
            if (result.error) {
                setError(result.error);
            } else {
                setEvent(result.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [eventId, options]);

    React.useEffect(() => {
        fetchEvent();
    }, [fetchEvent]);

    return {
        event,
        loading,
        error,
        refetch: fetchEvent
    };
}

export default {
    GetEvents,
    GetCurrentUserEvents,
    GetEventById,
    SearchEvents,
    GetEventsByCategory,
    GetEventsByDateRange,
    GetFreeEvents,
    GetVirtualEvents,
    GetFeaturedEvents,
    clearEventsCache,
    clearEventsCacheByPattern,
    useEvents,
    useEvent
};