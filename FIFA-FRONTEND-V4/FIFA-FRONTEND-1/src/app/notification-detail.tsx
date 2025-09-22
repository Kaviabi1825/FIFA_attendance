import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Appbar, useTheme, Card, TextInput, IconButton, Surface } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import NotFoundMessage from '../components/NotFoundMessage';
import { getNotificationById } from '../utils/notifications';

export default function NotificationDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { notificationId } = useLocalSearchParams();
  
  // Get notification by ID from shared data
  const notification = getNotificationById(notificationId as string);
  
  if (!notification) {
    return (
      <View style={styles.container}>
        <NotFoundMessage 
          message="Notification not found" 
          buttonText="Go Back" 
          onPress={() => router.back()} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#009688' }}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Notification" color="white" />
      </Appbar.Header>

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.content}>
          {/* Notification Card */}
          <Card style={styles.notificationCard}>
            <Card.Content>
              <View style={styles.deliveryInfo}>
                <View style={[styles.iconContainer, { backgroundColor: notification.iconColor + '20' }]}>
                  {notification.iconType === 'material' ? (
                    <MaterialIcons name={notification.iconName as any} size={28} color={notification.iconColor} />
                  ) : (
                    <Ionicons name={notification.iconName as any} size={28} color={notification.iconColor} />
                  )}
                </View>
                <View style={styles.deliveryDetails}>
                  <Text style={styles.deliveryTitle}>{notification.title}</Text>
                  <Text style={styles.deliverySubtitle}>{notification.subtitle}</Text>
                  <Text style={styles.deliveryTime}>{notification.time}</Text>
                </View>
              </View>

              {/* Details Section */}
              <View style={styles.driverDetails}>
                <Text style={[styles.detailsHeader, { color: theme.colors.primary }]}>Notification Details</Text>
                
                {notification.details?.driverName && (
                  <Text style={styles.detailLabel}>Driver name : {notification.details.driverName}</Text>
                )}
                
                {notification.details?.contactNo && (
                  <Text style={styles.detailLabel}>Contact No : {notification.details.contactNo}</Text>
                )}
                
                {notification.details?.vehicleNo && (
                  <Text style={styles.detailLabel}>Vehicle No : {notification.details.vehicleNo}</Text>
                )}
                
                {notification.details?.arrivedTime && (
                  <Text style={styles.detailLabel}>Arrived Time : {notification.details.arrivedTime}</Text>
                )}
                
                {notification.details?.orderNo && (
                  <Text style={styles.detailLabel}>Order/Reference No : {notification.details.orderNo}</Text>
                )}
                
                {notification.details?.status && (
                  <Text style={styles.detailLabel}>Status : <Text style={{
                    color: notification.details.status === 'Delivered' ? '#4CAF50' : 
                           notification.details.status === 'Processing' ? '#2196F3' : 
                           notification.details.status === 'Paid' ? '#4CAF50' : '#FF9800'
                  }}>{notification.details.status}</Text></Text>
                )}
                
                {notification.details?.amount && (
                  <Text style={styles.detailLabel}>Amount : <Text style={{ fontWeight: 'bold' }}>{notification.details.amount}</Text></Text>
                )}
                
                {notification.details?.date && (
                  <Text style={styles.detailLabel}>Date : {notification.details.date}</Text>
                )}
              </View>
              
              {/* Additional Info Section */}
              <View style={styles.additionalInfo}>
                <Text style={[styles.detailsHeader, { color: theme.colors.primary }]}>Additional Information</Text>
                <Text style={styles.additionalText}>
                  {notification.id === '1' ? 'The delivery vehicle is expected to arrive at the specified time. Please ensure someone is available to receive the delivery.' : 
                   notification.id === '2' ? 'Your order has been received and is being processed. You will be notified when it ships.' : 
                   notification.id === '3' ? 'Your order has been successfully delivered. Thank you for your business!' : 
                   notification.id === '4' ? 'We have received your payment. An invoice has been sent to your registered email address.' : 
                   notification.id === '5' ? 'New products have been added to the inventory. Check the catalog for details.' : 
                   'System maintenance is scheduled for next week. The system may be unavailable during this period.'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
        
        {/* Message Input */}
        <Surface style={styles.messageContainer} elevation={4}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type here...."
              mode="outlined"
              outlineColor="transparent"
              activeOutlineColor={theme.colors.primary}
            />
            <View style={styles.inputActions}>
              <IconButton
                icon="attachment"
                size={24}
                iconColor="#666"
                onPress={() => {}}
              />
              <IconButton
                icon="camera"
                size={24}
                iconColor="#666"
                onPress={() => {}}
              />
              <IconButton
                icon="send"
                size={24}
                iconColor="white"
                style={{ backgroundColor: '#009688' }}
                onPress={() => {}}
              />
            </View>
          </View>
        </Surface>
      </View>

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
  content: {
    flex: 1,
    padding: 15,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryInfo: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryDetails: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  deliveryTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  driverDetails: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 15,
    marginBottom: 15,
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  additionalInfo: {
    paddingVertical: 10,
  },
  additionalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  messageContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageInput: {
    height: 40,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: '#009688',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
