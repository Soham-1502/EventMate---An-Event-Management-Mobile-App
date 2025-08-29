import supabase from "../../config/db.js";

async function GetOneEvent(req, res) {
  try {
    const { eventId } = req.params;
    const { include_stats = 'false' } = req.query;

    // Start base query for event by id
    let query = supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    // Execute the query
    const { data: eventData, error: dbError } = await query;

    // Handle database errors
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // Event not found
        return res.status(404).json({
          success: false,
          error: "Event not found",
          message: "This event does not exist."
        });
      }
      // Other DB errors
      console.error('Database error in GetOneEvent:', dbError);
      return res.status(500).json({
        success: false,
        error: "Database error",
        message: dbError.message
      });
    }

    // Prepare response object
    const response = {
      success: true,
      message: "Event fetched successfully",
      data: eventData
    };

    // If include_stats is true, optionally add event stats
    if (include_stats === 'true') {
      // Example queries to get stats - uncomment and modify as per your schema
      /*
      const { count: attendeeCount, error: attendeeErr } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
      if (attendeeErr) {
        console.warn('Failed to fetch attendee count:', attendeeErr);
      }
      const { count: bookmarkCount, error: bookmarkErr } = await supabase
        .from('event_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
      if (bookmarkErr) {
        console.warn('Failed to fetch bookmark count:', bookmarkErr);
      }
      response.stats = {
        attendee_count: attendeeCount || 0,
        bookmark_count: bookmarkCount || 0,
      };
      */
      // For now include just view count from event data if available
      response.stats = {
        views: eventData.view_count || 0
      };
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Internal server error in GetOneEvent:', error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message
    });
  }
}

export default GetOneEvent;
