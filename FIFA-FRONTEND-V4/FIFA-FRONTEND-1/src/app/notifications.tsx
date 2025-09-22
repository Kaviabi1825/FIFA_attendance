import { StyleSheet, View, FlatList } from 'react-native';
import { Text, TouchableRipple, Searchbar, Appbar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import { useState } from 'react';
import { notifications, NotificationType } from '../utils/notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Search and filter notifications
  const filterNotifications = (items: NotificationType[], query: string) => {
    if (!query) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.subtitle.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Group notifications by type
  const newNotifications = filterNotifications(notifications.filter(item => item.type === 'new'), searchQuery);
  const thisWeekNotifications = filterNotifications(notifications.filter(item => item.type === 'this_week'), searchQuery);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#009688' }}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Notification" color="white" />
        <Appbar.Action icon="bell" color="white" onPress={() => {}} />
      </Appbar.Header>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search notifications"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />
      </View>

      <FlatList
        data={[
          { title: 'New', data: newNotifications },
          { title: 'This Week', data: thisWeekNotifications }
        ]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.map((notification) => (
              <TouchableRipple 
                key={notification.id} 
                style={styles.notificationItem}
                onPress={() => {
                  router.push({
                    pathname: '/notification-detail',
                    params: { notificationId: notification.id }
                  });
                }}
              >
                <View style={styles.notificationItemContent}>
                  <View style={[styles.iconContainer, { backgroundColor: notification.iconColor + '20' }]}>
                    {notification.iconType === 'material' ? (
                      <MaterialIcons name={notification.iconName as any} size={24} color={notification.iconColor} />
                    ) : (
                      <Ionicons name={notification.iconName as any} size={24} color={notification.iconColor} />
                    )}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationSubtitle}>{notification.subtitle}</Text>
                  </View>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#009688',
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bellIcon: {
    padding: 5,
  },
  searchContainer: {
    margin: 15,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009688',
    marginVertical: 10,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  notificationItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
});
