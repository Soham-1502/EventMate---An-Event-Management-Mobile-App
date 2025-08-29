// userCreateOrUpdate.js - Fixed version

import supabase from "../../config/db.js";

async function userCreateOrUpdate(req, res) {
    console.log('=== DEBUG: userCreateOrUpdate called ===');
    console.log('Method:', req.method);
    console.log('Params:', req.params);
    console.log('Body:', req.body);

    const { userId } = req.params;
    const { full_name, phone, organization, role, email } = req.body; // Added email extraction

    try {
        // Validate that userId is provided
        if (!userId) {
            console.log('ERROR: User ID missing');
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        console.log('Checking if user exists with clerk_id:', userId);

        // Check if user exists first using clerk_id
        const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq('clerk_id', userId)
            .single();

        console.log('Existing user query result:');
        console.log('Data:', existingUser);
        console.log('Error:', fetchError);

        if (existingUser && !fetchError) {
            console.log('User exists, performing UPDATE');
            
            // Prepare update object - only include changed fields
            const updateData = {
                updated_at: new Date().toISOString()
            };
            
            if (full_name !== undefined && full_name !== existingUser.full_name) {
                updateData.full_name = full_name;
            }
            // Only update email if it's provided in the request
            if (email !== undefined && email !== existingUser.email) {
                updateData.email = email;
            }
            if (phone !== undefined && phone !== existingUser.phone) {
                updateData.phone = phone;
            }
            if (organization !== undefined && organization !== existingUser.organization) {
                updateData.organization = organization;
            }
            if (role !== undefined && role !== existingUser.role) {
                updateData.role = role;
            }

            console.log('Update data:', updateData);

            // Only perform update if there are actual changes
            if (Object.keys(updateData).length > 1) { // More than just updated_at
                const { data: updatedUser, error: updateError } = await supabase
                    .from("users")
                    .update(updateData)
                    .eq('clerk_id', userId)
                    .select("id, email, full_name, phone, role, organization, approved, created_at, updated_at")
                    .single();

                console.log('Update result:');
                console.log('Data:', updatedUser);
                console.log('Error:', updateError);

                if (updateError) {
                    console.log('UPDATE ERROR:', updateError);
                    return res.status(500).json({
                        success: false,
                        message: "Error updating user",
                        error: updateError.message
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    data: updatedUser
                });
            } else {
                // No changes detected
                const { password, ...userResponse } = existingUser;
                return res.status(200).json({
                    success: true,
                    message: "No changes detected",
                    data: {
                        id: userResponse.id,
                        email: userResponse.email,
                        full_name: userResponse.full_name,
                        phone: userResponse.phone,
                        role: userResponse.role,
                        organization: userResponse.organization,
                        approved: userResponse.approved,
                        created_at: userResponse.created_at,
                        updated_at: userResponse.updated_at
                    }
                });
            }

        } else {
            console.log('User does not exist, performing CREATE');
            
            // For user creation, we need email - get it from Clerk or require it
            if (!email) {
                console.log('ERROR: Email missing for user creation');
                return res.status(400).json({
                    success: false,
                    message: "Email is required for creating a new user"
                });
            }

            const createData = {
                clerk_id: userId,
                email: email,
                full_name: full_name || '',
                phone: phone || null,
                organization: organization || null,
                role: role || 'attendee',
                approved: false,
                password: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            console.log('Create data:', createData);

            // Create the user
            const { data: newUser, error: createError } = await supabase
                .from("users")
                .insert([createData])
                .select("id, email, full_name, phone, role, organization, approved, created_at, updated_at")
                .single();

            console.log('Create result:');
            console.log('Data:', newUser);
            console.log('Error:', createError);

            if (createError) {
                console.log('CREATE ERROR:', createError);
                
                // Handle unique constraint violations
                if (createError.code === '23505') {
                    if (createError.message.includes('email')) {
                        return res.status(409).json({
                            success: false,
                            message: "A user with this email already exists"
                        });
                    }
                    if (createError.message.includes('clerk_id')) {
                        return res.status(409).json({
                            success: false,
                            message: "A user with this Clerk ID already exists"
                        });
                    }
                }
                
                return res.status(500).json({
                    success: false,
                    message: "Error creating user",
                    error: createError.message
                });
            }

            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: newUser,
                isNewUser: true
            });
        }

    } catch (error) {
        console.error('=== CATCH ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Stack trace:', error.stack);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default userCreateOrUpdate;