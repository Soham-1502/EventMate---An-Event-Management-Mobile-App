import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, StatusBar} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useUser } from '@clerk/clerk-expo';
import { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "../../assets/styles/eventDetails.styles";
import { defaultTheme } from "../../assets/constants/theme";
import TicketPurchaseModal from "../components/TicketPurchaseModal";
import { BuyTicket } from "../../hooks/TicketsHook";
import { Alert } from "react-native";
import { API_URL } from "../../hooks/APIURL";

export default function EventDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const { from } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  //Tickets Related useStates
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  const handleBack = () => {
    try {
      console.log("From:", from);
  
      if (from === "events") {
        console.log("Settings:", from);
        router.replace("/(tabs)/Events");
      } else if (from === "home") {
        router.replace("/(tabs)");   // ✅ correct way for index.jsx inside (tabs)
      } else {
        router.replace("/(tabs)");   // ✅ fallback to home
      }
    } catch (error) {
      router.replace("/(tabs)");     // ✅ fallback to home
    }
  };

  useEffect(() => {
  async function fetchEvent() {
    try {
      const response = await fetch(`${API_URL}/events/getOne/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Check if data.data exists and is an object
      if (!data || !data.data) {
        throw new Error("Event not found");
      }

      setEvent(data.data);  // data.data is object, not array
      setError(false);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
  if (id) {
    fetchEvent();
  }
}, [id]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" style={styles.loadingIcon} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color="#EF4444" />
        <Text style={styles.errorTitle}>Event Not Found</Text>
        <Text style={styles.errorText}>We couldn't find the event you're looking for.</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startDate = new Date(event.date_start);
  const endDate = new Date(event.date_end);
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to get ticket availability info
  const getTicketAvailabilityInfo = () => {
    const ticketsLeft = event.ticket_stock || 0;
    
    if (ticketsLeft === 0) {
      return {
        status: 'sold-out',
        color: '#EF4444',
        backgroundColor: '#FEF2F2',
        iconColor: '#EF4444',
        text: 'Sold Out',
        subText: 'No tickets available'
      };
    } else if (ticketsLeft < 10) {
      return {
        status: 'low-stock',
        color: '#EF4444',
        backgroundColor: '#FEF2F2',
        iconColor: '#EF4444',
        text: `${ticketsLeft} Left`,
        subText: 'Hurry up! Limited tickets'
      };
    } else {
      return {
        status: 'available',
        color: '#10B981',
        backgroundColor: '#ECFDF5',
        iconColor: '#10B981',
        text: `${ticketsLeft} Available`,
        subText: 'Tickets in stock'
      };
    }
  };

  const ticketInfo = getTicketAvailabilityInfo();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Banner Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.banner_url }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.bannerGradient}
          />
          
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.bookmarkButton} 
                onPress={() => setIsBookmarked(!isBookmarked)}
              >
                <Ionicons 
                  name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                  size={22} 
                  color={isBookmarked ? "#FFD700" : "white"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Event Type Badge */}
          <View style={styles.eventTypeBadge}>
            <Ionicons name="calendar-outline" size={14} color="white" />
            <Text style={styles.eventTypeText}>{event.event_type}</Text>
          </View>

          {/* Event Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text style={styles.heroEventTitle}>{event.name}</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaItem}>
                <Ionicons name="time-outline" size={16} color="#E5E7EB" />
                <Text style={styles.heroMetaText}>{formatDate(startDate)}</Text>
              </View>
              <View style={styles.heroMetaItem}>
                <Ionicons name="location-outline" size={16} color="#E5E7EB" />
                <Text style={styles.heroMetaText}>{event.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentWrapper}>
          
          {/* Quick Info Cards */}
          <View style={styles.quickInfoContainer}>
            {/* Date & Time Card */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="calendar" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formatDate(startDate)}</Text>
                <Text style={styles.infoTime}>{formatTime(startDate)}</Text>
                {endDate.getTime() !== startDate.getTime() && (
                  <Text style={styles.infoSecondary}>Until {formatDate(endDate)}</Text>
                )}
              </View>
            </View>

            {/* Location Card */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="location" size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
                <TouchableOpacity style={styles.directionLink}>
                  <Ionicons name="navigate-outline" size={14} color="#3B82F6" />
                  <Text style={styles.directionText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Card */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIconContainer, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="pricetag" size={20} color="#10B981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ticket Price</Text>
                {event.price_from > 0 ? (
                  <>
                    <Text style={styles.priceValue}>₹{event.price_from}</Text>
                    <Text style={styles.priceNote}>Starting from</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.freeValue}>FREE</Text>
                    <Text style={styles.priceNote}>No cost to attend</Text>
                  </>
                )}
              </View>
            </View>

            {/* Ticket Availability Card */}
            <View style={styles.infoCard}>
              <View style={[styles.infoIconContainer, { backgroundColor: ticketInfo.backgroundColor }]}>
                <Ionicons name="ticket" size={20} color={ticketInfo.iconColor} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ticket Availability</Text>
                <Text style={[
                  styles.ticketAvailabilityValue, 
                  { color: ticketInfo.color }
                ]}>
                  {ticketInfo.text}
                </Text>
                <Text style={[
                  styles.ticketAvailabilityNote,
                  { color: ticketInfo.status === 'available' ? '#6B7280' : ticketInfo.color }
                ]}>
                  {ticketInfo.subText}
                </Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={24} color={defaultTheme.primary} />
              <Text style={styles.sectionTitle}>About This Event</Text>
            </View>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Event Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>247</Text>
              <Text style={styles.statLabel}>Attending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
              <Text style={styles.statNumber}>32</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Organizer Info */}
          <View style={styles.organizerSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={24} color={defaultTheme.primary} />
              <Text style={styles.sectionTitle}>Organizer</Text>
            </View>
            <View style={styles.organizerCard}>
              <View style={styles.organizerAvatar}>
                <Ionicons name="business" size={24} color={defaultTheme.primary} />
              </View>
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>Event Organizer</Text>
                <Text style={styles.organizerRole}>Professional Events</Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="chatbubble-outline" size={18} color={defaultTheme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.floatingContainer}>
        <TouchableOpacity
          style={[
            styles.mainActionButton,
            (event.ticket_stock === 0) && styles.disabledButton
          ]}
          onPress={() => {event.ticket_stock > 0 && setShowPurchaseModal(true)
          }}
          activeOpacity={0.9}
          disabled={event.ticket_stock === 0}
        >
          <LinearGradient
            colors={event.ticket_stock === 0 ? ['#9CA3AF', '#6B7280'] : [defaultTheme.primary, defaultTheme.secondary]}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="ticket-outline" size={20} color="white" />
            <Text style={styles.mainActionText}>
              {event.ticket_stock === 0 ? 'Sold Out' : 
               event.price_from > 0 ? `Book Now - ₹${event.price_from}` : 'Register Free'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TicketPurchaseModal
          visible={showPurchaseModal}
          event={event}
          loading={purchaseLoading}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={async (purchaseData) => {
  setPurchaseLoading(true);
  try {
    console.log("purchase started");
    console.log("Data:", purchaseData.quantity);

    // Send only necessary fields in the purchase request
    const res = await BuyTicket({
      eventId: event.id,
      userId: user.id,             // Use logged-in user ID
      quantity: purchaseData.quantity,
      // No userInfo or extra fields here
    });

    if (res.error) {
      Alert.alert("Purchase Failed", res.error);
    } else if (res.message && res.tickets) {
      setShowPurchaseModal(false); // Close modal on success
      Alert.alert("Purchase Successful!", "Your ticket is booked.");
    } else {
      Alert.alert("Unknown Error", "Please try again.");
    }
  } catch (err) {
    Alert.alert("Error", String(err));
  } finally {
    setPurchaseLoading(false);
  }
}}
        />
      </View>
    </>
  );
}