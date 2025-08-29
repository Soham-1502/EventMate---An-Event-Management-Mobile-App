import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../../assets/styles/home.styles';
import AppHeader from '../components/AppHeader';
import { GetUserTickets, useUserTickets } from '../../hooks/TicketsHook';
import { useUser } from '@clerk/clerk-expo';

export default function CommunityPage() {
  const {user} = useUser();
  const { tickets, loading, error, refetch } = GetUserTickets(user?.id);
  console.log("Current Tickets State from Community:", { tickets, loading, error });
  return (
    <>
      <AppHeader/>
    <View style={styles.container}>
      <View style={styles.noFeaturedEventsContainer}>
        <Text style={styles.noFeaturedEventsText}>
            Community Page is Coming Soon...
        </Text>
      </View>
    </View>
    </>
  );
}
