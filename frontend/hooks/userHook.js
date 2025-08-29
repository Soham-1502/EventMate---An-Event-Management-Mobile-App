// hooks/useUserProfile.js - Enhanced version with avatar support

import { useState, useEffect, useMemo } from 'react';
import { API_URL } from './APIURL';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


export const useUserProfile = (clerkUser) => {
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    role: 'attendee',
    approved: false,
    avatarUrl: null // Add avatar URL to profile state
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false); // Separate loading for avatar
  const [initialData, setInitialData] = useState({});
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!clerkUser?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      // Start with Clerk fallback data (including avatar)
      const clerkData = {
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        avatarUrl: clerkUser.imageUrl || null, // Include avatar from Clerk
      };

      // Fetch data from Supabase
      const response = await fetch(`${API_URL}/user/profile/${clerkUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let combinedData = { ...clerkData };

      if (response.ok) {
        const userData = await response.json();
        if (userData.success && userData.data) {
          // Parse full_name from Supabase if available
          const fullName = userData.data.full_name || '';
          const nameParts = fullName.split(' ');
          const firstName = nameParts[0] || clerkData.firstName;
          const lastName = nameParts.slice(1).join(' ') || clerkData.lastName;

          combinedData = {
            // Prioritize Supabase data over Clerk data for names
            firstName: firstName,
            lastName: lastName,
            email: userData.data.email || clerkData.email,
            phone: userData.data.phone || '',
            organization: userData.data.organization || '',
            role: userData.data.role || 'attendee',
            approved: userData.data.approved || false,
            // Use Supabase avatar URL if available, otherwise use Clerk's
            avatarUrl: userData.data.avatar_url || clerkData.avatarUrl
          };
        }
      } else if (response.status === 404) {
        // User doesn't exist in Supabase yet - use Clerk defaults
        console.log('User not found in Supabase, will create on first save');
        combinedData = {
          ...clerkData,
          phone: '',
          organization: '',
          role: 'attendee',
          approved: false
        };
      } else {
        console.warn('Failed to fetch user profile from Supabase');
        // Use Clerk defaults if Supabase fetch fails
        combinedData = {
          ...clerkData,
          phone: '',
          organization: '',
          role: 'attendee',
          approved: false
        };
      }

      setUserProfile(combinedData);
      setInitialData(combinedData);

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(`Failed to load profile: ${error.message}`);
      
      // Fallback to Clerk data only
      const fallbackData = {
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        phone: '',
        organization: '',
        role: 'attendee',
        approved: false,
        avatarUrl: clerkUser.imageUrl || null
      };
      setUserProfile(fallbackData);
      setInitialData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const processImageForClerk = async (imageUri) => {
  try {
    console.log('Processing image:', imageUri);
    
    // Resize and compress the image
    const processedImage = await manipulateAsync(
      imageUri,
      [
        { resize: { width: 400, height: 400 } }
      ],
      {
        compress: 0.8,
        format: SaveFormat.JPEG
      }
    );
    
    console.log('Image processed successfully:', processedImage.uri);
    return processedImage.uri;
  } catch (error) {
    console.error('Image processing failed:', error);
    // Return original URI if processing fails
    return imageUri;
  }
};

  // Update avatar specifically
  // Updated updateAvatar function - simplified and correct
const updateAvatar = async (imageUri = null) => {
  try {
    setAvatarLoading(true);
    setError(null);

    let newAvatarUrl = null;

    if (imageUri) {
      // Process image then upload to Clerk
      const processedImageUri = await processImageForClerk(imageUri);
      const formData = new FormData();
      formData.append('file', {
        uri: processedImageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });

      await clerkUser.setProfileImage({ file: formData });

      // Reload Clerk user to get updated avatar URL
      await clerkUser.reload();

      newAvatarUrl = clerkUser.imageUrl;

    } else {
      // Remove avatar from Clerk
      await clerkUser.setProfileImage({ file: null });

      // Reload Clerk user to get updated (removed) avatar URL
      await clerkUser.reload();

      newAvatarUrl = clerkUser.imageUrl;
    }

    // Update local state with new avatarUrl
    setUserProfile(prev => ({
      ...prev,
      avatarUrl: newAvatarUrl,
    }));

    // Optionally sync to backend here

    return {
      success: true,
      message: imageUri ? 'Profile picture updated successfully!' : 'Profile picture removed successfully!',
      avatarUrl: newAvatarUrl,
    };

  } catch (error) {
    console.error('Avatar update failed:', error);
    const errorMessage = `Failed to update profile picture: ${error.message}`;
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setAvatarLoading(false);
  }
};


  // Update user profile (existing function)
  const updateUserProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Update Clerk user (firstName, lastName only) - with error handling
      const clerkUpdates = {};
      if (formData.firstName.trim() !== (clerkUser.firstName || "")) {
        clerkUpdates.firstName = formData.firstName.trim();
      }
      if (formData.lastName.trim() !== (clerkUser.lastName || "")) {
        clerkUpdates.lastName = formData.lastName.trim();
      }

      // Try to update Clerk user if there are changes
      if (Object.keys(clerkUpdates).length > 0) {
        try {
          await clerkUser.update(clerkUpdates);
          // Force reload the Clerk user to get fresh data
          await clerkUser.reload();
          console.log('Clerk user updated successfully');
        } catch (clerkError) {
          console.warn('Clerk update failed:', clerkError.message);
          // Continue with Supabase update even if Clerk fails
        }
      }

      // 2. Update/Create Supabase user
      const supabaseUpdates = {
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim() || null,
        organization: formData.organization.trim() || null,
        role: formData.role,
        avatar_url: formData.avatarUrl || userProfile.avatarUrl // Include avatar URL
      };

      const response = await fetch(`${API_URL}/user/update/${clerkUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supabaseUpdates),
      });

      // Check if response is OK before parsing
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status}. Please check if the API endpoint exists.`);
        }
      }

      const result = await response.json();
      
      // Update local state immediately with the new data
      const updatedProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        role: formData.role,
        approved: result.data?.approved || formData.approved,
        avatarUrl: clerkUser.imageUrl || formData.avatarUrl // Keep current avatar
      };
      
      setUserProfile(updatedProfile);
      setInitialData(updatedProfile);

      return { success: true, message: 'Profile updated successfully!' };

    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message.includes('fetch') 
        ? 'Network error. Please check your connection and try again.'
        : error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data (useful after avatar changes)
  const refreshUserData = async () => {
    if (clerkUser) {
      try {
        await clerkUser.reload();
        // Update avatar URL in local state if it changed
        if (clerkUser.imageUrl !== userProfile.avatarUrl) {
          setUserProfile(prev => ({
            ...prev,
            avatarUrl: clerkUser.imageUrl
          }));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return Object.keys(userProfile).some(key =>
      key !== 'approved' && key !== 'avatarUrl' && userProfile[key] !== (initialData[key] || '')
    );
  }, [userProfile, initialData]);

  // Reset form to initial state
  const resetForm = () => {
    setUserProfile(initialData);
    setError(null);
  };

  // Initialize data when clerkUser is available
  useEffect(() => {
    if (clerkUser?.id) {
      fetchUserProfile();
    }
  }, [clerkUser?.id]);

  // Watch for avatar changes in Clerk user
  useEffect(() => {
    if (clerkUser?.imageUrl !== userProfile.avatarUrl) {
      setUserProfile(prev => ({
        ...prev,
        avatarUrl: clerkUser.imageUrl
      }));
    }
  }, [clerkUser?.imageUrl]);

  return {
    userProfile,
    setUserProfile,
    loading,
    avatarLoading, // Separate loading state for avatar
    error,
    hasChanges,
    updateUserProfile,
    updateAvatar, // New avatar update function
    refreshUserData, // New refresh function
    resetForm,
    refetch: fetchUserProfile
  };
};