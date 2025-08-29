import supabase from "../../config/db.js";
import User_DeleteAllUserEvents from "../eventController/deleteAllUserEvents.js";

async function DeleteAllUserEvents(req, res) {

    const { userId } = req.params;

    // Check is there are any existng events created by this user
        const { data: fetchUserEvents, error: fetchEventError} = await supabase
        .from("events")
        .select('*')
        .eq('created_by',userId)

        console.log(fetchUserEvents);

        if (fetchEventError) {
            throw new Error(`Error fetching user's events: ${fetchEventError.message}`); 
        }
        
        if (!fetchUserEvents || fetchUserEvents.length === 0) {
            return res.status(404).send({
                message:"No Events Found."
            }); // No events found, return empty array
        } else {

            // Fetch Events Created by this user and then delete the events First
            const {deletedEvents, message} = await User_DeleteAllUserEvents(userId);

            return res.status(200).send({ 
               deletedEvents,
               message: message
            })
        }
}

export default DeleteAllUserEvents