import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';

const Transport: React.FC = () => {
  const router = useRouter();
  const orders = [
    { id: 1, title: 'Order #1234', completed: 80, total: 100 },
    { id: 2, title: 'Order #5678', completed: 50, total: 120 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header} elevated>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Transport" color="white" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.section1}>
          <Text style={styles.sideTitle}>Today</Text>
          <View style={styles.heroColumn}>
            {/* In Card */}
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCard}>
                <Image source={require('../../assets/images/logo1.png')} style={styles.heroImage} resizeMode="cover" />
                <Text style={styles.heroText}>In</Text>
                <Ionicons name="arrow-forward-circle" size={28} color="#009688" style={styles.heroArrowRight} />
              </View>
            </View>
            {/* Out Card */}
            <View style={styles.heroCardContainer}>
              <View style={styles.heroCard}>
                <Ionicons name="arrow-back-circle" size={28} color="#009688" style={styles.heroArrowLeft} />
                <Image source={require('../../assets/images/logo2.png')} style={styles.heroImage} resizeMode="cover" />
                <Text style={styles.heroText}>Out</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 2: Orders */}
        <View style={styles.section2}>
          <Text style={styles.sideTitle}>Orders</Text>
          {orders.map(order => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{order.title}</Text>
                <Ionicons name="cube-outline" size={22} color="#009688" />
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardDetails}>Completed: </Text>
                <Text style={styles.cardValue}>{order.completed}</Text>
                <Text style={styles.cardDetails}> / {order.total}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardDetails}>Remaining: </Text>
                <Text style={styles.cardValue}>{order.total - order.completed}</Text>
              </View>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Start Shipping</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#009688',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section1: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: -30,
    marginBottom: 20,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 12,
    marginTop: 50,
  },
  heroColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    gap: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroCardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: '#E0F2F1',
    borderRadius: 16,
    width: 110,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  heroImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginBottom: 10,
  },
  heroText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
    marginTop: 4,
  },
  heroArrowRight: {
    position: 'absolute',
    right: -18,
    top: '50%',
    marginTop: -14,
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  heroArrowLeft: {
    position: 'absolute',
    left: -18,
    top: '50%',
    marginTop: -14,
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  section2: {
    flex: 1,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardDetails: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 15,
    color: '#009688',
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  bookNowButton: {
    backgroundColor: '#009688',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
    marginTop: 10,
    elevation: 2,
  },
  bookNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Transport;
