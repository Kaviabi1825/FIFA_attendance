import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen() {
  const router = useRouter();

  // Handle logout with confirmation
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Implement logout functionality here
            router.replace('/');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          {/* <Ionicons name="notifications-outline" size={24} color="#fff" /> */}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={['#00796B', '#009688', '#4DB6AC']}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageBorder}>
                <View style={styles.profileImage}>
                  <Ionicons name="person" size={50} color="#009688" />
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Murali Tex</Text>
            <View style={styles.roleContainer}>
              <Ionicons name="briefcase-outline" size={16} color="#009688" />
              <Text style={styles.profileRole}>Job Worker</Text>
            </View>
            
            <View style={styles.badgesContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Production</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3+ Years</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, {backgroundColor: '#E0F2F1'}]}>
                <Ionicons name="cube-outline" size={22} color="#009688" />
              </View>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, {backgroundColor: '#FFF3E0'}]}>
                <Ionicons name="time-outline" size={22} color="#FF9800" />
              </View>
              <Text style={[styles.statNumber, {color: '#FF9800'}]}>8</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, {backgroundColor: '#E8F5E9'}]}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={[styles.statNumber, {color: '#4CAF50'}]}>34</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
          
          {/* <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="call-outline" size={20} color="#009688" />
              <Text style={styles.quickActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="mail-outline" size={20} color="#009688" />
              <Text style={styles.quickActionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="share-social-outline" size={20} color="#009688" />
              <Text style={styles.quickActionText}>Share</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/personal-info')}
          >
            <View style={[styles.menuIconContainer, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="person-outline" size={22} color="#009688" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Personal Information</Text>
              <Text style={styles.menuSubText}>Update your personal details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#009688" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/settings')}
          >
            <View style={[styles.menuIconContainer, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="settings-outline" size={22} color="#009688" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Settings</Text>
              <Text style={styles.menuSubText}>App preferences and controls</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#009688" />
          </TouchableOpacity>
          
          <Text style={styles.menuSectionTitle}>Notifications & Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/notifications')}
          >
            <View style={[styles.menuIconContainer, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="notifications-outline" size={22} color="#009688" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuSubText}>Manage your alerts</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#009688" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/help-support')}
          >
            <View style={[styles.menuIconContainer, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="help-circle-outline" size={22} color="#009688" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Help & Support</Text>
              <Text style={styles.menuSubText}>Get assistance and FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#009688" />
          </TouchableOpacity>
          
          <View style={styles.logoutContainer}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#009688',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009688',
    marginVertical: 12,
    paddingLeft: 10,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 100,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  profileImageBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e0f2f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileRole: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  badgeText: {
    color: '#009688',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    color: '#009688',
    fontSize: 12,
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  menuSubText: {
    fontSize: 12,
    color: '#888',
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
