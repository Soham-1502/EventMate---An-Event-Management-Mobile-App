import supabase from "../../config/db.js";

/**
 * GET /api/users/:userId/tickets
 * Fetch all tickets for a specific user with event details
 */
async function GetUserTickets(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Fetch tickets with event details using join
    const { data: tickets, error: fetchError } = await supabase
      .from('tickets')
      .select(`
        *,
        events (
          id,
          name, 
          description,
          date_start,
          date_end,
          location,
          banner_url,
          is_virtual,
          event_type,
          price_from,
          is_featured
        )
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Error fetching user tickets: ${fetchError.message}`);
    }

    if (!tickets || tickets.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No tickets found for this user'
      });
    }

    // Map tickets to include event data properly
    const mappedTickets = tickets.map(ticket => ({
      id: ticket.id,
      user_id: ticket.user_id,
      event_id: ticket.event_id,
      quantity: ticket.quantity,
      status: ticket.status,
      purchased_at: ticket.purchased_at,
      qr_code: ticket.qr_code,
      
      // Event details
      event: ticket.events ? {
        id: ticket.events.id,
        name: ticket.events.name,
        description: ticket.events.description,
        date_start: ticket.events.date_start,
        date_end: ticket.events.date_end,
        location: ticket.events.location,
        banner_url: ticket.events.banner_url,
        is_virtual: ticket.events.is_virtual,
        event_type: ticket.events.event_type,
        price_from: ticket.events.price_from,
        is_featured: ticket.events.is_featured
      } : null
    }));

    res.status(200).json({
      success: true,
      data: mappedTickets,
      count: mappedTickets.length,
      message: "Tickets Fetch Successful."
    });

  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export default GetUserTickets;