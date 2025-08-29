import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SafeScreen from '../components/SafeScreen';
import { defaultTheme } from '../../assets/constants/theme';

export default function TabLayout() {
  return (
    <SafeScreen>
    <Tabs initialRouteName="index"   // 👈 set Home as the default tab
  screenOptions={{ tabBarActiveTintColor: defaultTheme.primary, headerShown:false }}>
      <Tabs.Screen
        name="Events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="calendar-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='people' color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MyTickets"
        options={{
          title: 'MyTickets',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="ticket" color={color} />,
        }}
      />
      <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
    </Tabs>
    </SafeScreen>
  );
}
