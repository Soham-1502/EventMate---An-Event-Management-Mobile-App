import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { ticketCardStyles } from '../../../assets/styles/TicketCardStyles';
import { formatDate, getEventTypeColor, getEventTypeIcon, formatDBDate } from '../../../lib/utils';

const TicketCard = ({ ticket, onPress, onAddToCalendar, onContactSupport }) => {
  const [showQRModal, setShowQRModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#4CAF50'; // Green
      case 'used':
        return '#9E9E9E'; // Gray
      case 'cancelled':
        return '#F44336'; // Red
      case 'expired':
        return '#FF9800'; // Orange
      default:
        return '#4CAF50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'check-circle';
      case 'used':
        return 'check-circle-2';
      case 'cancelled':
        return 'x-circle';
      case 'expired':
        return 'clock';
      default:
        return 'check-circle';
    }
  };

  // Safe date validation and formatting
  const formatEventDate = (dateString) => {
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

  const formatEventTime = (dateString) => {
    if (!dateString) return 'Time TBD';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Time';
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPurchaseDate = (dateString) => {
    // console.log('Raw purchase date value:', dateString, 'Type:', typeof dateString);
    
    if (!dateString) {
    //   console.log('No dateString provided');
      return 'Unknown';
    }
    
    let date;
    try {
      // Handle multiple timestamp formats
      if (typeof dateString === 'string') {
        let processedDate = dateString;
        
        // Handle format: 2025-08-22 12:43:49.141953+00
        if (processedDate.includes(' ') && processedDate.includes('+')) {
          processedDate = processedDate.replace(' ', 'T');
          // Fix timezone format
          if (processedDate.endsWith('+00')) {
            processedDate = processedDate.replace('+00', '+00:00');
          }
        }
        
        console.log('Processed date string:', processedDate);
        date = new Date(processedDate);
      } else {
        date = new Date(dateString);
      }
      
      console.log('Parsed date object:', date);
      console.log('Is valid date:', !isNaN(date.getTime()));
      
      if (isNaN(date.getTime())) {
        console.log('Date parsing failed for:', dateString);
        return 'Invalid Date';
      }
      
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      console.log('Formatted date:', formatted);
      return formatted;
      
    } catch (error) {
      console.error('Error parsing date:', error, 'Original value:', dateString);
      return 'Parse Error';
    }
  };

  // Safe date comparisons
  const getEventDate = () => {
    if (!ticket.event?.date_start) return null;
    const date = new Date(ticket.event.date_start);
    return isNaN(date.getTime()) ? null : date;
  };

  const eventDate = getEventDate();
  const isTicketActive = ticket.status?.toLowerCase() === 'active';
  const isUpcoming = eventDate ? eventDate > new Date() : false;

  console.log(ticket);
  console.log("Ticket Date:",ticket.purchased_at);

  return (
    <>
      <TouchableOpacity 
        style={[ticketCardStyles.ticketCard, !isTicketActive && ticketCardStyles.inactiveTicket]} 
        onPress={() => onPress && onPress(ticket)}
        activeOpacity={0.7}
      >
        {/* Event Image */}
        <View style={ticketCardStyles.ticketImageContainer}>
          <Image 
            source={{ uri: ticket.event?.banner_url || 'https://via.placeholder.com/300x150' }} 
            style={ticketCardStyles.ticketImage}
            defaultSource={{ uri: 'https://via.placeholder.com/300x150' }}
          />
          {/* Event Type Badge */}
          <View style={[
            ticketCardStyles.eventTypeBadge,
            { backgroundColor: getEventTypeColor(ticket.event?.event_type) }
          ]}>
            <Text style={ticketCardStyles.eventTypeText}>
              {ticket.event?.event_type?.charAt(0).toUpperCase() + (ticket.event?.event_type?.slice(1) || 'Event')}
            </Text>
          </View>
          {/* Status Badge */}
          <View style={[ticketCardStyles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Feather name={getStatusIcon(ticket.status)} size={12} color="white" />
            <Text style={ticketCardStyles.statusBadgeText}>{ticket.status?.toUpperCase() || 'UNKNOWN'}</Text>
          </View>
        </View>

        {/* Ticket Content */}
        <View style={ticketCardStyles.ticketContent}>
          {/* Event Name */}
          <Text style={ticketCardStyles.eventName} numberOfLines={2}>
            {ticket.event?.name || 'Event Name Unavailable'}
          </Text>

          {/* Event Details Row */}
          <View style={ticketCardStyles.eventDetailsRow}>
            <View style={ticketCardStyles.eventDetail}>
              <Feather name="calendar" size={14} color="#666" />
              <View>
                <Text style={ticketCardStyles.eventDetailText}>
                  {formatEventDate(ticket.event?.date_start)}
                </Text>
                <Text style={ticketCardStyles.eventDetailSubtext}>
                  {formatEventTime(ticket.event?.date_start)}
                </Text>
              </View>
            </View>

            <View style={ticketCardStyles.eventDetail}>
              <Feather name="map-pin" size={14} color="#666" />
              <View>
                <Text style={ticketCardStyles.eventDetailText} numberOfLines={1}>
                  {ticket.event?.location || 'Location TBD'}
                </Text>
                <Text style={ticketCardStyles.eventDetailSubtext}>Venue</Text>
              </View>
            </View>
          </View>

          {/* Price and Purchase Info */}
          <View style={ticketCardStyles.priceRow}>
            <View>
              <Text style={ticketCardStyles.priceLabel}>Price Paid</Text>
              <Text style={ticketCardStyles.priceValue}>
                {ticket.event?.price_from && ticket.event.price_from > 0 
                  ? `₹${ticket.event.price_from}` 
                  : "Free"
                }
              </Text>
            </View>
            <View style={ticketCardStyles.purchaseInfo}>
              <Text style={ticketCardStyles.purchaseLabel}>Purchased</Text>
              <Text style={ticketCardStyles.purchaseDate}>
                {formatPurchaseDate(ticket.purchased_at)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={ticketCardStyles.actionButtonsRow}>
            {/* QR Code Button - Only show for active tickets */}
            {isTicketActive && (
              <TouchableOpacity 
                style={ticketCardStyles.actionButton}
                onPress={() => setShowQRModal(true)}
              >
                <Feather name="maximize" size={16} color="#2E7D32" />
                <Text style={ticketCardStyles.actionButtonText}>QR Code</Text>
              </TouchableOpacity>
            )}

            {/* Add to Calendar Button - Only show for upcoming events */}
            {isUpcoming && (
              <TouchableOpacity 
                style={ticketCardStyles.actionButton}
                onPress={() => onAddToCalendar && onAddToCalendar(ticket)}
              >
                <Feather name="calendar" size={16} color="#2E7D32" />
                <Text style={ticketCardStyles.actionButtonText}>Calendar</Text>
              </TouchableOpacity>
            )}

            {/* Help/Support Button - Always available */}
            <TouchableOpacity 
              style={ticketCardStyles.actionButton}
              onPress={() => onContactSupport && onContactSupport(ticket)}
            >
              <Feather name="help-circle" size={16} color="#2E7D32" />
              <Text style={ticketCardStyles.actionButtonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={ticketCardStyles.qrModalOverlay}>
          <View style={ticketCardStyles.qrModalContent}>
            <View style={ticketCardStyles.qrModalHeader}>
              <Text style={ticketCardStyles.qrModalTitle}>Entry QR Code</Text>
              <TouchableOpacity 
                onPress={() => setShowQRModal(false)}
                style={ticketCardStyles.qrCloseButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={ticketCardStyles.qrCodeContainer}>
              <QRCode
                value={ticket.qr_code || ticket.id || 'NO_QR_CODE'}
                size={200}
                backgroundColor="white"
                color="black"
              />
            </View>
            
            <Text style={ticketCardStyles.qrInstructions}>
              Show this QR code at the event entrance for scanning
            </Text>
            
            <Text style={ticketCardStyles.ticketId}>
              Ticket ID: {ticket.id ? `${ticket.id.toString().slice(0, 8)}...` : 'Unknown'}
            </Text>
            
            <Text style={ticketCardStyles.eventNameModal}>
              {ticket.event?.name || 'Event Name Unavailable'}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TicketCard;