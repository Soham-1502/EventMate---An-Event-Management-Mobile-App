// userGet.js
import supabase from "../../config/db.js";

async function UserGet(req, res) {
    const { userId } = req.params;

    try {
        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        console.log('Fetching user with clerk_id:', userId);

        // Fetch user by clerk_id
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, full_name, phone, role, organization, approved, created_at, updated_at")
            .eq('clerk_id', userId)
            .single();

        if (error) {
            console.log('Database error:', error);
            
            // If user not found, return 404
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(500).json({
                success: false,
                message: "Error fetching user",
                error: error.message
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user
        });

    } catch (error) {
        console.error('Error in UserGet:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default UserGet;