// controllers/organizerController/organizerApplication.js

import supabase from "../../config/db.js";

async function submitOrganizerApplication(req, res) {
    console.log('=== DEBUG: submitOrganizerApplication called ===');
    console.log('Method:', req.method);
    console.log('Body:', req.body);

    const { 
        userId, 
        userEmail, 
        userName, 
        organization, 
        experience, 
        eventTypes, 
        motivation, 
        contactPhone, 
        website 
    } = req.body;

    try {
        // Validate required fields
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "User email is required"
            });
        }

        if (!organization || !experience || !eventTypes || !motivation) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Validate minimum character requirements
        if (experience.trim().length < 50) {
            return res.status(400).json({
                success: false,
                message: "Experience description must be at least 50 characters"
            });
        }

        if (motivation.trim().length < 30) {
            return res.status(400).json({
                success: false,
                message: "Motivation must be at least 30 characters"
            });
        }

        console.log('Checking if user exists with clerk_id:', userId);

        // Check if user exists in the users table
        const { data: existingUser, error: userFetchError } = await supabase
            .from("users")
            .select("id, role, approved")
            .eq('clerk_id', userId)
            .single();

        if (userFetchError && userFetchError.code !== 'PGRST116') {
            console.log('Error fetching user:', userFetchError);
            return res.status(500).json({
                success: false,
                message: "Error checking user status",
                error: userFetchError.message
            });
        }

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please complete your profile first."
            });
        }

        // Check if user is already an organizer
        if (existingUser.role === 'organizer') {
            return res.status(400).json({
                success: false,
                message: existingUser.approved 
                    ? "You are already an approved organizer" 
                    : "Your organizer application is already under review"
            });
        }

        // Check if there's already a pending application
        const { data: existingApplication, error: appFetchError } = await supabase
            .from("organizer_applications")
            .select("*")
            .eq('user_id', existingUser.id)
            .eq('status', 'pending')
            .single();

        if (existingApplication && !appFetchError) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending organizer application"
            });
        }

        // Create the organizer application
        const applicationData = {
            user_id: existingUser.id,
            clerk_id: userId,
            user_email: userEmail,
            user_name: userName || '',
            organization: organization.trim(),
            experience: experience.trim(),
            event_types: eventTypes.trim(),
            motivation: motivation.trim(),
            contact_phone: contactPhone?.trim() || null,
            website: website?.trim() || null,
            status: 'pending',
            applied_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        console.log('Creating application:', applicationData);

        const { data: newApplication, error: createError } = await supabase
            .from("organizer_applications")
            .insert([applicationData])
            .select("*")
            .single();

        if (createError) {
            console.log('CREATE ERROR:', createError);
            return res.status(500).json({
                success: false,
                message: "Error creating application",
                error: createError.message
            });
        }

        // Update user role to organizer but keep approved as false
        const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update({ 
                role: 'organizer', 
                approved: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id)
            .select("id, email, full_name, phone, role, organization, approved")
            .single();

        if (updateError) {
            console.log('UPDATE USER ERROR:', updateError);
            // If user update fails, we should rollback the application
            await supabase
                .from("organizer_applications")
                .delete()
                .eq('id', newApplication.id);
            
            return res.status(500).json({
                success: false,
                message: "Error updating user role",
                error: updateError.message
            });
        }

        console.log('Application created successfully:', newApplication);

        return res.status(201).json({
            success: true,
            message: "Organizer application submitted successfully! We'll review it and get back to you soon.",
            data: {
                application: newApplication,
                user: updatedUser
            }
        });

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

// Get organizer application status
async function getOrganizerApplicationStatus(req, res) {
    console.log('=== DEBUG: getOrganizerApplicationStatus called ===');
    
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Get user and their application status
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, role, approved")
            .eq('clerk_id', userId)
            .single();

        if (userError) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get the latest application if exists
        const { data: application, error: appError } = await supabase
            .from("organizer_applications")
            .select("*")
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        const response = {
            success: true,
            data: {
                user_role: user.role,
                is_approved: user.approved,
                has_application: !!application,
                application_status: application?.status || null,
                application_date: application?.applied_at || null,
                can_apply: user.role === 'attendee' && !application
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error('Error getting application status:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export { submitOrganizerApplication, getOrganizerApplicationStatus };