// utils.js

// Parse database timestamp format (2025-08-22 12:43:49.141953+00)
export const parseDBTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  let date;
  if (typeof timestamp === 'string' && timestamp.includes('+')) {
    // Convert database format to ISO format
    const isoFormat = timestamp.replace(' ', 'T').replace('+00', '+00:00');
    date = new Date(isoFormat);
  } else {
    date = new Date(timestamp);
  }
  
  return isNaN(date.getTime()) ? null : date;
};

// Safe date formatting with database timestamp support
export const formatDBDate = (timestamp, options = {}) => {
  const date = parseDBTimestamp(timestamp);
  if (!date) return 'Unknown';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
}
  
// Safe date formatting with fallbacks
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Date TBD';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Format date for display (no time)
export const formatDateOnly = (dateString) => {
  if (!dateString) return 'Date TBD';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time only
export const formatTimeOnly = (dateString) => {
  if (!dateString) return 'Time TBD';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Time';
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Check if date is valid
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Check if event is upcoming
export const isUpcomingEvent = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  return date > new Date();
};

// Get relative time (e.g., "in 2 days", "2 hours ago")
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown time';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid time';
  
  const now = new Date();
  const diffInSeconds = Math.floor((date - now) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `in ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  } else if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `in ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInHours < 0) {
    return `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `in ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInMinutes < 0) {
    return `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''} ago`;
  } else {
    return 'now';
  }
};

// Event type utilities
export const getEventTypeColor = (eventType) => {
  switch (eventType?.toLowerCase()) {
    case 'conference': return '#3B82F6';
    case 'hackathon': return '#EF4444';
    case 'meetup': return '#10B981';
    case 'virtual': return '#8B5CF6';
    case 'workshop': return '#F59E0B';
    case 'seminar': return '#EC4899';
    case 'webinar': return '#6366F1';
    default: return '#6B7280';
  }
};

export const getEventTypeIcon = (eventType) => {
  switch (eventType?.toLowerCase()) {
    case 'conference': return 'people';
    case 'hackathon': return 'code-slash';
    case 'meetup': return 'chatbubbles';
    case 'virtual': return 'videocam';
    case 'workshop': return 'construct';
    case 'seminar': return 'school';
    case 'webinar': return 'desktop';
    default: return 'calendar';
  }
};

// Price formatting
export const formatPrice = (price) => {
  if (!price || price === 0) return 'Free';
  if (typeof price !== 'number') return 'Price TBD';
  
  return `₹${price.toLocaleString('en-IN')}`;
};

// Ticket status utilities
export const getTicketStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return '#4CAF50';
    case 'used': return '#9E9E9E';
    case 'cancelled': return '#F44336';
    case 'expired': return '#FF9800';
    case 'pending': return '#2196F3';
    default: return '#6B7280';
  }
};

export const getTicketStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'check-circle';
    case 'used': return 'check-circle-2';
    case 'cancelled': return 'x-circle';
    case 'expired': return 'clock';
    case 'pending': return 'loader';
    default: return 'help-circle';
  }
};

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}