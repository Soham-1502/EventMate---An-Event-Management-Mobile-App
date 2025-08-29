import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../assets/styles/home.styles';
import { formatDate, getEventTypeColor, getEventTypeIcon } from '../../lib/utils';

// Main Card Component - receives event as prop
export default function FeaturedEventCard({ event, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    } else {
      // Default action - you can navigate or show details
      console.log('Event pressed:', event.name);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.featuredCardContainer}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.featuredImageContainer}>
        <Image 
          source={{ uri: event.banner_url }}
          style={styles.featuredBannerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.featuredGradientOverlay}
        />
        
        {/* Event Type Badge */}
        <View style={[styles.featuredTypeBadge, { backgroundColor: getEventTypeColor(event.event_type) }]}>
          <Ionicons 
            name={getEventTypeIcon(event.event_type)} 
            size={12} 
            color="white" 
          />
          <Text style={styles.featuredTypeText}>
            {event.event_type.toUpperCase()}
          </Text>
        </View>

        {/* Featured Badge */}
        {event.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}

        {/* Card Content Overlay */}
        <View style={styles.featuredCardContent}>
          <Text style={styles.featuredEventName} numberOfLines={2}>
            {event.name}
          </Text>
          
          <View style={styles.featuredInfoRow}>
            <Ionicons name="calendar-outline" size={16} color="#E5E7EB" />
            <Text style={styles.featuredInfoText}>
              {formatDate(event.date_start)}
            </Text>
          </View>
          
          <View style={styles.featuredInfoRow}>
            <Ionicons 
              name={event.is_virtual ? "videocam-outline" : "location-outline"} 
              size={16} 
              color="#E5E7EB" 
            />
            <Text style={styles.featuredInfoText} numberOfLines={1}>
              {event.is_virtual ? 'Virtual Event' : event.location}
            </Text>
          </View>
          
          <View style={styles.featuredBottomRow}>
            <View style={styles.featuredPriceContainer}>
              {event.price_from > 0 ? (
                <Text style={styles.featuredPriceText}>
                  From ${event.price_from}
                </Text>
              ) : (
                <Text style={styles.featuredFreeText}>FREE</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.featuredActionButton}
              onPress={(e) => {
                e.stopPropagation(); // Prevent parent onPress from firing
                handlePress();
              }}
            >
              <Text style={styles.featuredActionText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}