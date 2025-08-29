// GetAllUserEvents.js - Enhanced with Pagination, Filtering & Sorting
import supabase from "../../config/db.js";

async function GetAllUserEvents(req, res) {
    try {
        const { userId } = req.params;
        
        // Extract query parameters with defaults
        const {
            page = 1,
            limit = 20,
            search = '',
            category = '',
            event_type = '',
            is_virtual = '',
            price_filter = '', // 'free', 'paid', 'all'
            sort_by = 'date_start',
            sort_order = 'asc',
            date_from = '',
            date_to = '',
            min_price = '',
            max_price = ''
        } = req.query;

        // Calculate offset for pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Start building the query
        let query = supabase
            .from("events")
            .select('*', { count: 'exact' }) // Get total count for pagination
            // .eq('created_by', userId);

        // Apply search filter
        if (search && search.trim()) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
        }

        // Apply category filter
        if (category && category !== 'All') {
            if (category === 'Virtual') {
                query = query.eq('is_virtual', true);
            } else {
                // Map frontend categories to backend event_type values
                const categoryMap = {
                    'Conferences': 'conference',
                    'Hackathons': 'hackathon',
                    'Meetups': 'meetup',
                    'Workshops': 'workshop',
                    'Seminars': 'seminar'
                };
                const mappedCategory = categoryMap[category];
                if (mappedCategory) {
                    query = query.eq('event_type', mappedCategory);
                }
            }
        }

        // Apply specific event type filter
        if (event_type) {
            query = query.eq('event_type', event_type);
        }

        // Apply virtual filter
        if (is_virtual !== '') {
            query = query.eq('is_virtual', is_virtual === 'true');
        }

        // Apply price filter
        if (price_filter === 'free') {
            query = query.eq('price_from', 0);
        } else if (price_filter === 'paid') {
            query = query.gt('price_from', 0);
        }

        // Apply price range filter
        if (min_price !== '') {
            query = query.gte('price_from', parseFloat(min_price));
        }
        if (max_price !== '') {
            query = query.lte('price_from', parseFloat(max_price));
        }

        // Apply date range filter
        if (date_from) {
            query = query.gte('date_start', date_from);
        }
        if (date_to) {
            query = query.lte('date_start', date_to);
        }

        // Apply sorting
        const validSortColumns = ['date_start', 'date_end', 'price_from', 'name', 'created_at'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'date_start';
        const sortDirection = sort_order === 'desc' ? false : true;
        
        query = query.order(sortColumn, { ascending: sortDirection });

        // Apply pagination
        query = query.range(offset, offset + limitNum - 1);

        // Execute query
        const { data: fetchUserEvents, error: fetchEventError, count } = await query;

        if (fetchEventError) {
            console.error('Database error:', fetchEventError);
            return res.status(500).json({
                error: "Database error",
                message: fetchEventError.message
            });
        }

        // Calculate pagination metadata
        const totalEvents = count || 0;
        const totalPages = Math.ceil(totalEvents / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        // Return response with pagination metadata
        return res.status(200).json({
            message: "User Events Fetch Successful",
            data: fetchUserEvents || [],
            pagination: {
                current_page: pageNum,
                total_pages: totalPages,
                total_events: totalEvents,
                events_per_page: limitNum,
                has_next_page: hasNextPage,
                has_prev_page: hasPrevPage
            },
            filters_applied: {
                search: search || null,
                category: category || null,
                event_type: event_type || null,
                is_virtual: is_virtual || null,
                price_filter: price_filter || null,
                date_range: {
                    from: date_from || null,
                    to: date_to || null
                }
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
}

export default GetAllUserEvents;