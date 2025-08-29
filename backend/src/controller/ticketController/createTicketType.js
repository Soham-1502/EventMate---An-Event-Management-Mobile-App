import supabase from "../../config/db.js";

async function CreateTicket(req, res) {
    const { eventId, userId } = req.params;
    const { name, price, quantity} = req.body;

    if (!name || !price || !quantity) {return res.status(400).json({ message:"All Fields are required!"}) }

    if (price <= 0) {return res.status(400).json({message:"Ticket's price cannot be zero or less."})}
    if (quantity <= 0) {return res.status(400).json({message:"Ticket's quantity cannot be zero or less."})}

    const { data: fetchUserEvent, error: fetchEventError} = await supabase
        .from("events")
        .select('*')
        .eq('id',eventId)
        .eq('created_by',userId)

        if (fetchEventError) {
            throw new Error(`Error fetching user's events: ${fetchEventError.message}`); 
        }

        if (!fetchUserEvent || fetchUserEvent.length === 0) {
            return res.status(404).send({
                message:"This Event does not exists."
        });
        }

        try {
        const {data: ticket, error : CreateTicketError} = await supabase
        .from("ticket_types")
        .insert([{
            event_id: eventId,
            name: name,
            price: price,
            quantity: quantity
        }])
        .select()

        if (CreateTicketError) {
            return res.status(400).json({
                message:"Error Occured while creating a ticket",

            })
        }
        return res.status(201).json({
            message:"Ticket Created Succesfully.",
            ticket: ticket
        })

    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error",
            error : error.message
        })
    }
}

export default CreateTicket