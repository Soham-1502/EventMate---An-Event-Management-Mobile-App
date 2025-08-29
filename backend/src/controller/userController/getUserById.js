import supabase from "../../config/db.js";

async function getUserById(req, res) {
    const { userId } = req.params; // This should be the clerk_id

    try {
        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Fetch user by clerk_id (not UUID id)
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq('clerk_id', userId) // Changed from 'id' to 'clerk_id'
            .single();

        if (fetchError) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: fetchError.message
            });
        }

        // Remove password from response for security
        const { password, ...userResponse } = user;

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: "User fetched successfully"
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default getUserById;