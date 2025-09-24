import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, TouchableRipple, Appbar, Card, Avatar, useTheme, Button } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';

export default function AttendanceScreen() {
  const router = useRouter();
  const theme = useTheme();

  // Attendance options
  const attendanceOptions = [
    {
      id: '1',
      title: 'Mark Attendance',
      icon: 'event-available',
      iconType: 'material',
      route: '../attendance/mark-attendance',
      color: '#4A90E2',
    },
    {
      id: '2',
      title: 'View Attendance',
      icon: 'calendar-today',
      iconType: 'material',
      route: '/attendance/details',
      color: '#50C878',
    },
    {
      id: '3',
      title: 'Reports',
      icon: 'description',
      iconType: 'material',
      route: '/attendance/reports',
      color: '#FF6B6B',
    },
    {
      id: '4',
      title: 'Settings',
      icon: 'settings-outline',
      iconType: 'ionicon',
      route: '/attendance/settings',
      color: '#FFD166',
    },
    {
      id: '5',
      title: 'Bulk Update',
      icon: 'system-update-alt',
      iconType: 'material',
      route: '/attendance/bulk-update',
      color: '#7E57C2',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#009688' }}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Attendance" color="white" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Staff Summary Cards */}
        <Card style={styles.summaryContainer}>
          <Card.Title title="Staff Summary" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.summaryCardsRow}>
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: '#4A90E2' }]}>
                  <MaterialIcons name="people" size={24} color="white" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryNumber}>24</Text>
                  <Text style={styles.summaryLabel}>Total Staff</Text>
                </View>
              </View>
              
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: '#50C878' }]}>
                  <MaterialIcons name="check-circle" size={24} color="white" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryNumber}>20</Text>
                  <Text style={styles.summaryLabel}>Present</Text>
                </View>
              </View>
              
              <View style={styles.summaryCard}>
                <View style={[styles.summaryIconContainer, { backgroundColor: '#FF6B6B' }]}>
                  <MaterialIcons name="cancel" size={24} color="white" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryNumber}>4</Text>
                  <Text style={styles.summaryLabel}>Absent</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Attendance Options */}
        <Card style={styles.summaryContainer}>
          <Card.Title title="Attendance Options" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.optionsGrid}>
              {attendanceOptions.map((option) => (
                <TouchableRipple
                  key={option.id}
                  style={styles.optionCard}
                  onPress={() => router.push(option.route as any)}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                      {option.iconType === 'ionicon' ? (
                        <Ionicons name={option.icon as any} size={28} color="white" />
                      ) : (
                        <MaterialIcons name={option.icon as any} size={28} color="white" />
                      )}
                    </View>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                  </View>
                </TouchableRipple>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity List */}
        <Card style={styles.summaryContainer}>
          <Card.Title title="Recent Activity" titleStyle={styles.cardTitle} />
          <Card.Content>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.activityCard}>
                <View style={styles.activityRow}>
                  <Avatar.Text size={40} label="JS" style={{ backgroundColor: '#4A90E2' }} />
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityName}>John Smith</Text>
                    <Text style={styles.activityTime}>Today, 9:30 AM</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#50C878' }]}>
                    <Text style={styles.statusText}>Present</Text>
                  </View>
                </View>
                {item < 3 && <View style={{ height: 1, backgroundColor: '#E0E0E0', marginTop: 12 }} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

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
  content: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryContainer: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  summaryCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    width: '30%',
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTextContainer: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  optionsContainer: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    elevation: 1,
  },
  optionContent: {
    padding: 15,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  activityContainer: {
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  activityCard: {
    paddingVertical: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDetails: {
    flex: 1,
    marginLeft: 10,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 12,
  },
});
