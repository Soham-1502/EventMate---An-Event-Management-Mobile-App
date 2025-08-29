import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  RefreshControl, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import TicketCard from '../components/mytickets/TicketCard';
import { ticketStyles } from '../../assets/styles/ticketStyles';
import { GetUserTickets } from '../../hooks/TicketsHook';

export default function TicketsPage({ navigation }) {
  const { user } = useUser();
  const { tickets, loading, error, refetch } = GetUserTickets(user?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'expired', 'used'

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Filter and search tickets
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.event?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus !== 'all') {
      matchesFilter = ticket.status?.toLowerCase() === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  }) || [];

  // Sort tickets - active and upcoming first, then by date
  const sortedTickets = filteredTickets.sort((a, b) => {
    const aDate = new Date(a.event?.date_start);
    const bDate = new Date(b.event?.date_start);
    const now = new Date();
    
    // Active tickets first
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    
    // Then by date (upcoming events first)
    if (aDate >= now && bDate < now) return -1;
    if (bDate >= now && aDate < now) return 1;
    
    return aDate - bDate;
  });

  const handleTicketPress = (ticket) => {
    // Navigate to ticket detail screen
    // navigation.navigate('TicketDetail', { ticket });
    Alert.alert(
      'Ticket Details',
      `Event: ${ticket.event?.name}\nStatus: ${ticket.status}\nDate: ${new Date(ticket.event?.date_start).toLocaleDateString()}`,
      [{ text: 'OK' }]
    );
  };

  const handleAddToCalendar = (ticket) => {
    const event = ticket.event;
    const startDate = new Date(event.date_start);
    const endDate = event.date_end ? new Date(event.date_end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
    
    // Format dates for calendar URL
    const formatDateForCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;
    
    Linking.openURL(calendarUrl).catch(() => {
      Alert.alert('Error', 'Could not open calendar app');
    });
  };

  const handleContactSupport = (ticket) => {
    Alert.alert(
      'Contact Support',
      'Need help with your ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Email Support',
          onPress: () => {
            const subject = `Support Request - Ticket ${ticket.id.slice(0, 8)}`;
            const body = `Event: ${ticket.event?.name}\nTicket ID: ${ticket.id}\nIssue: `;
            Linking.openURL(`mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          }
        }
      ]
    );
  };

  const getFilterCount = (status) => {
    if (status === 'all') return tickets?.length || 0;
    return tickets?.filter(ticket => ticket.status?.toLowerCase() === status).length || 0;
  };

  if (loading) {
    return (
      <View style={ticketStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={ticketStyles.loadingText}>Loading your tickets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={ticketStyles.errorContainer}>
        <Feather name="alert-circle" size={48} color="#F44336" />
        <Text style={ticketStyles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={ticketStyles.errorText}>{error}</Text>
        <TouchableOpacity style={ticketStyles.retryButton} onPress={refetch}>
          <Text style={ticketStyles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={ticketStyles.container}>
      <AppHeader />
      
      {/* Search and Filter Section - Fixed */}
      <View style={ticketStyles.searchFilterContainer}>
        {/* Search Bar */}
        <View style={ticketStyles.searchContainer}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={ticketStyles.searchInput}
            placeholder="Search tickets by event name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={ticketStyles.filterContainer}>
          {['all', 'active', 'used', 'expired'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                ticketStyles.filterTab,
                filterStatus === status && ticketStyles.activeFilterTab
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                ticketStyles.filterTabText,
                filterStatus === status && ticketStyles.activeFilterTabText
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {getFilterCount(status) > 0 && (
                  <Text style={ticketStyles.filterCount}> ({getFilterCount(status)})</Text>
                )}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Summary - Fixed */}
      {searchQuery.length > 0 && (
        <View style={ticketStyles.resultsSummary}>
          <Text style={ticketStyles.resultsText}>
            {sortedTickets.length} ticket{sortedTickets.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {/* Tickets List - Only this part refreshes */}
      <FlatList
        data={!tickets || tickets.length === 0 ? [] : sortedTickets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            onPress={handleTicketPress}
            onAddToCalendar={handleAddToCalendar}
            onContactSupport={handleContactSupport}
          />
        )}
        contentContainerStyle={[
          ticketStyles.ticketsList,
          (!tickets || tickets.length === 0 || sortedTickets.length === 0) && ticketStyles.emptyContentContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
        ListEmptyComponent={() => {
          if (!tickets || tickets.length === 0) {
            return (
              <View style={ticketStyles.emptyContainer}>
                <Feather name="credit-card" size={64} color="#ccc" />
                <Text style={ticketStyles.emptyTitle}>No Tickets Yet</Text>
                <Text style={ticketStyles.emptyText}>
                  Your purchased tickets will appear here. Start exploring events to get your first ticket!
                </Text>
                <TouchableOpacity 
                  style={ticketStyles.exploreButton}
                  onPress={() => navigation?.navigate('Events')}
                >
                  <Text style={ticketStyles.exploreButtonText}>Explore Events</Text>
                </TouchableOpacity>
              </View>
            );
          } else if (sortedTickets.length === 0) {
            return (
              <View style={ticketStyles.emptyContainer}>
                <Feather name="search" size={48} color="#ccc" />
                <Text style={ticketStyles.emptyTitle}>No tickets found</Text>
                <Text style={ticketStyles.emptyText}>
                  Try adjusting your search or filter criteria
                </Text>
              </View>
            );
          }
          return null;
        }}
      />
    </View>
  );
}