import supabase from "../../config/db.js";

async function UserUpdate(req, res) {
    const { userId } = req.params; // This should be the clerk_id
    const { full_name, email, phone, organization, role } = req.body;

    try {
        // Validate that userId is provided
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Check if user exists first using clerk_id
        const { data: existingUser, error: fetchError } = await supabase
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

        // Prepare update object - only include fields that are provided
        const updateData = {};
        
        if (full_name !== undefined) updateData.full_name = full_name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (organization !== undefined) updateData.organization = organization;
        if (role !== undefined) updateData.role = role;

        // Add updated timestamp
        updateData.updated_at = new Date().toISOString();

        // Check if there's anything to update
        if (Object.keys(updateData).length === 1) { // Only updated_at
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        // If email is being updated, check if it already exists for another user
        if (email && email !== existingUser.email) {
            const { data: emailCheck, error: emailCheckError } = await supabase
                .from('users')
                .select('id, email')
                .eq('email', email)
                .neq('clerk_id', userId) // Changed from 'id' to 'clerk_id'
                .single();

            if (emailCheck) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already in use by another user"
                });
            }

            // Ignore the "no rows found" error as it means email is available
            if (emailCheckError && emailCheckError.code !== 'PGRST116') {
                return res.status(500).json({
                    success: false,
                    message: "Error checking email availability",
                    error: emailCheckError.message
                });
            }
        }

        // Validate role if provided
        if (role !== undefined) {
            const allowedRoles = ['attendee', 'organizer', 'admin'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`
                });
            }
        }

        // Perform the update using clerk_id
        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update(updateData)
            .eq('clerk_id', userId) // Changed from 'id' to 'clerk_id'
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({
                success: false,
                message: "Error updating user",
                error: updateError.message
            });
        }

        // Return success response (excluding sensitive data like password)
        const { password, ...userResponse } = updatedUser;

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: userResponse
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default UserUpdate;