import supabase from "../../config/db.js";
import User_DeleteAllUserEvents from "../eventController/deleteAllUserEvents.js";

async function deleteUser(req, res) {
    const { userId } = req.params;
    console.log(userId);

    try {

        //Check if user exists
        const {data : fetchUser , error : fetchError} = await supabase
        .from("users")
        .select("*")
        .eq('id', userId)
        .single();
        console.log("fetch user:",fetchUser)

        if (fetchError) {
            return res.status(404).send({
                message:"User not Found.",
                error : fetchError.message
            })
        }

        // Fetch Events Created by this user and then delete the events First
        const {userEvents, message} = await User_DeleteAllUserEvents(userId);

        if (!userEvents || userEvents.length === 0) {
            return res.status(404).send({
                message:"Events Not Found"
            })
        }

        const { data: userData, error: deleteUserError} = await supabase
        .from("users")
        .delete()
        .eq('id', userId)

        if (deleteUserError) {
            return res.status(500).send({
                message:"Error Deleting User.",
                error : deleteUserError.message
            })
        }

        return res.status(200).send({
            message:"User Deleted Successfully",
            deletedUser: userData,
            deletedEvents: userEvents,
            message: message
        })

    } catch(error) {
        return res.status(500).send({
            message:"Internal Server Error",
            error : error.message
        })
    }   
}

export default deleteUser