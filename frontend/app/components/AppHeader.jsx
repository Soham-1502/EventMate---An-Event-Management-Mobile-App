// components/AppHeader.jsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/home.styles';          // header styles you created
import { defaultTheme } from '../../assets/constants/theme';
import { router } from 'expo-router';

export default function AppHeader() {
  const { user } = useUser();              // <-- single hook call here
  const avatar = user?.imageUrl;           // Clerk property

  const handleProfileClick = () => {
  router.push({
    pathname: '/settings/edit-profile', // ← Correct path
    params: { from: 'home' }
  });
};

  return (
    <View style={styles.header}>
      {/* left */}
      <View style={styles.headerLeft}>
        <Text style={styles.appTitle}>EventMate</Text>
      </View>

      {/* right */}
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={22} color={defaultTheme.primary} />
          {/* show red dot if you track unread state */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarWrapper}
        onPress={handleProfileClick}>
          {avatar && <Image source={{ uri: avatar }} style={styles.avatarImage} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
