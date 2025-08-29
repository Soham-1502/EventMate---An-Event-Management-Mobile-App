import supabase from "../../config/db.js";

async function UserBuyTicket(req, res) {
  const { eventId } = req.params;
  const { userId, quantity } = req.body;

  try {
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity of tickets must be a positive integer."
      });
    }

    // Fetch event information including ticket stock and price
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id, price_from, ticket_stock")
      .eq("id", eventId)
      .single();

    if (!eventData || eventError) {
      return res.status(404).json({
        message: "Event not found.",
        error: eventError
      });
    }

    // Check if tickets are available
    if (eventData.ticket_stock <= 0) {
      return res.status(400).json({
        message: "Tickets are sold out."
      });
    }

    if (eventData.ticket_stock < quantity) {
      return res.status(400).json({
        message: "Not enough tickets available."
      });
    }

    // Define the ticket info (you can adjust the name/title)
    const ticketName = "Standard Ticket";
    const price = eventData.price_from || 0;

    // Atomically decrement available ticket stock
    const { error: updateError } = await supabase
      .from("events")
      .update({
        ticket_stock: eventData.ticket_stock - quantity
      })
      .eq("id", eventId)
      .gte("ticket_stock", quantity);

    if (updateError) {
      return res.status(500).json({
        message: "Failed to update ticket stock.",
        error: updateError.message
      });
    }

    // Insert purchased ticket records for the user
    const ticketsToInsert = Array.from({ length: quantity }, () => ({
      event_id: eventId,
      user_id: userId,
      status: "active",
      qr_code: null // can be generated later
    }));

    const { data: newTickets, error: insertError } = await supabase
      .from("tickets")
      .insert(ticketsToInsert)
      .select();

    if (insertError) {
      return res.status(500).json({
        message: "Failed to insert purchased tickets.",
        error: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    }

    // Respond with success and ticket details
    return res.status(201).json({
      message: "Tickets purchased successfully.",
      tickets: newTickets.map(ticket => ({
        ...ticket,
        ticketName,
        price
      }))
    });

  } catch (error) {
    console.error("Purchase error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message
    });
  }
}

export default UserBuyTicket;
