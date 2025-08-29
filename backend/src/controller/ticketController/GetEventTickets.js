import supabase from "../../config/db.js";

async function GetEventTickets(req, res) {
  const { eventId } = req.params;

  try {
    // Fetch the event to get price and available ticket stock
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, name, price_from, ticket_stock")
      .eq("id", eventId)
      .single();

    if (eventError || !eventData) {
      return res.status(404).json({
        message: "Event not found or no tickets available.",
        error: eventError?.message
      });
    }

    // Prepare a single default ticket object based on event data
    const ticketInfo = {
      id: "default",             // placeholder id
      name: "Standard Ticket",   // default ticket name
      price: eventData.price_from || 0,
      quantity: eventData.ticket_stock || 0
    };

    return res.status(200).json({
      message: "Tickets for Event",
      Tickets: [ticketInfo]
    });

  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}

export default GetEventTickets;
