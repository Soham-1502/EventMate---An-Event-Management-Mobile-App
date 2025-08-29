// app/components/UpcomingEventCard.jsx
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/home.styles';
import { formatDate, getEventTypeColor, getEventTypeIcon } from '../../lib/utils';

export default function UpcomingEventCard({ event, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    } else {
      console.log('Upcoming event pressed:', event.name);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.improvedUpcomingCard} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Event Banner Image with Gradient Overlay */}
      <View style={styles.upcomingImageContainer}>
        <Image
          source={{ uri: event.banner_url }}
          style={styles.upcomingBannerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.upcomingImageGradient}
        />
        
        {/* Event Type Badge on Image */}
        <View style={[
          styles.upcomingImageTypeBadge, 
          { backgroundColor: getEventTypeColor(event.event_type) }
        ]}>
          <Ionicons 
            name={getEventTypeIcon(event.event_type)} 
            size={10} 
            color="white" 
          />
          <Text style={styles.upcomingImageTypeText}>
            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
          </Text>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.upcomingContentContainer}>
        {/* Header with Title and Price */}
        <View style={styles.upcomingTitleRow}>
          <Text style={styles.improvedEventTitle} numberOfLines={2}>
            {event.name}
          </Text>
          
          {/* Price Tag */}
          <View style={styles.upcomingPriceContainer}>
            {event.price_from > 0 ? (
              <View style={styles.paidPriceTag}>
                <Text style={styles.paidPriceText}>${event.price_from}</Text>
              </View>
            ) : (
              <View style={styles.freePriceTag}>
                <Text style={styles.freePriceText}>FREE</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Event Info with Icons */}
        <View style={styles.upcomingInfoContainer}>
          {/* Date */}
          <View style={styles.improvedInfoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#3B82F615' }]}>
              <Ionicons name="calendar-outline" size={14} color="#3B82F6" />
            </View>
            <Text style={styles.improvedInfoText}>
              {formatDate(event.date_start)}
            </Text>
          </View>
          
          {/* Location */}
          <View style={styles.improvedInfoRow}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#10B98115' }]}>
              <Ionicons 
                name={event.is_virtual ? "videocam-outline" : "location-outline"} 
                size={14} 
                color="#10B981" 
              />
            </View>
            <Text style={styles.improvedInfoText} numberOfLines={1}>
              {event.is_virtual ? 'Virtual Event' : event.location}
            </Text>
          </View>
        </View>

        {/* Bottom Row with Action Button */}
        <View style={styles.upcomingBottomRow}>
          <View style={styles.attendeesPreview}>
            <Text style={styles.attendeesText}>
              {Math.floor(Math.random() * 500) + 50}+ attending
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handlePress}
          >
            <Text style={styles.quickActionText}>View</Text>
            <Ionicons name="arrow-forward" size={12} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}