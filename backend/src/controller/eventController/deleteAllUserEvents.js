import supabase from "../../config/db.js";

async function User_DeleteAllUserEvents(userId) {
    // Check is there are any existng events created by this user
        const { data: fetchUserEvents, error: fetchEventError} = await supabase
        .from("events")
        .select('*')
        .eq('created_by',userId)

        if (fetchEventError) {
            throw new Error(`Error fetching user's events: ${fetchEventError.message}`); 
        }

        if (!fetchUserEvents || fetchUserEvents.length === 0) {
            return res.status(404).send({
                message:"No Events Found."
            }); // No events found, return empty array
        }

            const { data: deletedEvents, error: deleteEventsError} = await supabase
            .from("events")
            .delete()
            .eq('created_by',userId)
            .select()

            if (deleteEventsError) {
                throw new Error(`Error deleting events: ${deleteEventsError.message}`);
            }

            return { deletedEvents, message: `${deletedEvents.length} events deleted.`};
    }

export default User_DeleteAllUserEvents