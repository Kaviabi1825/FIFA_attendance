import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Divider, ProgressBar } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';

// Define TypeScript interfaces for our data structure
interface SizeData {
  size: string;
  dcQty: string;
  completed: string;
  balance: string;
}

interface OrderData {
  id: string;
  supplier: string;
  dcNo: string;
  style: string;
  image: string | { uri: string } | number;
  deliveryDate?: string;
  completedPercentage: number;
  paymentStatus?: 'Pending' | 'Complete' | 'Partial';
  sizes: SizeData[];
}

// Define styles first to avoid the "used before declaration" errors
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#009688',
    paddingTop: 50,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    color: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#009688',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: 'white',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
    backgroundColor: 'white',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginBottom: 8,
  },
  expandIcon: {
    marginTop: 8,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    minWidth: '30%',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryChip: {
    height: 28,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  tableContainer: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    color: '#666',
  },
  progressContainer: {
    padding: 16,
    paddingTop: 0,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  paymentChip: {
    height: 28,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  okButton: {
    backgroundColor: '#4A90E2',
  },
  detailButton: {
    backgroundColor: '#009688',
    borderRadius: 20,
    elevation: 2,
  },
});

export default function OrderHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [expandedOrders, setExpandedOrders] = useState<{[key: string]: boolean}>({});
  
  // Handle the orderId parameter from the Orders page
  useEffect(() => {
    if (orderId) {
      // Find which tab contains the order
      const isCurrentOrder = currentOrders.some(order => order.id === orderId);
      const isPastOrder = pastOrders.some(order => order.id === orderId);
      
      // Set the active tab based on where the order is found
      if (isCurrentOrder) {
        setActiveTab('current');
      } else if (isPastOrder) {
        setActiveTab('past');
      }
      
      // Expand the order
      setExpandedOrders(prev => ({
        ...prev,
        [orderId]: true
      }));
      
      // Scroll to the order (this would require a ref, simplified for now)
    }
  }, [orderId]);
  
  // Sample data for current orders
  const currentOrders: OrderData[] = [
    {
      id: '1',
      supplier: 'Jv Hosiery',
      dcNo: '143000',
      style: 'Vest RNS',
      image: require('../../assets/images/Ord1.jpg'),
      deliveryDate: '30-JUN',
      completedPercentage: 48,
      paymentStatus: 'Partial',
      sizes: [
        { size: '70', dcQty: '600', completed: '200', balance: '400' },
        { size: '75', dcQty: '600', completed: '200', balance: '400' },
        { size: '80', dcQty: '600', completed: '200', balance: '400' },
        { size: '85', dcQty: '400', completed: '200', balance: '200' },
        { size: '88', dcQty: '900', completed: '200', balance: '700' },
        { size: '90', dcQty: '800', completed: '200', balance: '600' },
      ]
    },
    {
      id: '2',
      supplier: 'T.K Hosiery',
      dcNo: '143001',
      style: 'Brief',
      image: require('../../assets/images/Ord2.jpg'),
      deliveryDate: '15-JUL',
      completedPercentage: 75,
      paymentStatus: 'Partial',
      sizes: [
        { size: 'S', dcQty: '1000', completed: '750', balance: '250' },
        { size: 'M', dcQty: '1500', completed: '1125', balance: '375' },
        { size: 'L', dcQty: '1200', completed: '900', balance: '300' },
        { size: 'XL', dcQty: '800', completed: '600', balance: '200' },
      ]
    },
  ];

  // Sample data for past orders
  const pastOrders: OrderData[] = [
    {
      id: '3',
      supplier: 'T.T Titanic',
      dcNo: '142980',
      style: 'Dhoti',
      image: require('../../assets/images/Ord3.jpg'),
      deliveryDate: '10-JUN',
      completedPercentage: 100,
      paymentStatus: 'Complete',
      sizes: [
        { size: 'Standard', dcQty: '2000', completed: '2000', balance: '0' },
      ]
    },
    {
      id: '4',
      supplier: 'R.M Textile',
      dcNo: '142950',
      style: 'T-Shirt',
      image: require('../../assets/images/Ord4.jpg'),
      deliveryDate: '05-JUN',
      completedPercentage: 100,
      paymentStatus: 'Complete',
      sizes: [
        { size: 'S', dcQty: '500', completed: '500', balance: '0' },
        { size: 'M', dcQty: '800', completed: '800', balance: '0' },
        { size: 'L', dcQty: '600', completed: '600', balance: '0' },
        { size: 'XL', dcQty: '400', completed: '400', balance: '0' },
      ]
    },
  ];

  // Function to toggle order expansion
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Function to render order card
  const renderOrderCard = (order: OrderData) => {
    const isExpanded = expandedOrders[order.id] || false;
    
    return (
      <Card 
        key={order.id} 
        style={styles.orderCard}
        onPress={() => toggleOrderExpansion(order.id)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.supplierInfo}>
            <Image 
              source={typeof order.image === 'string' ? {uri: order.image} : order.image} 
              style={styles.orderImage} 
            />
            <View>
              <Text style={styles.supplierName}>{order.supplier}</Text>
              <Text style={styles.orderDetail}>DC No: {order.dcNo}</Text>
              <Text style={styles.orderDetail}>Style: {order.style}</Text>
              {order.deliveryDate && (
                <Text style={styles.orderDetail}>Delivery Date: {order.deliveryDate}</Text>
              )}
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
              style={styles.expandIcon}
            />
          </View>
        </View>
        
        {/* Summary view (always visible) */}
        <View style={styles.orderSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Qty</Text>
            <Text style={styles.summaryValue}>
              {order.sizes.reduce((sum, size) => sum + parseInt(size.dcQty), 0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryValue}>{order.completedPercentage}%</Text>
          </View>
          {order.paymentStatus && (
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Payment</Text>
              <Chip 
                style={[styles.summaryChip, { 
                  backgroundColor: order.paymentStatus === 'Complete' ? '#4CAF50' : '#FFC107' 
                }]}
                textStyle={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}
              >
                {order.paymentStatus}
              </Chip>
            </View>
          )}
        </View>
        
        {/* Expanded details */}
        {isExpanded && (
          <View>
            <Divider style={styles.divider} />
            
            {/* Size and Quantity Table */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Size</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>T.Qty</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Completed</Text>
                <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Balance</Text>
              </View>
              
              {order.sizes.map((sizeData, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{sizeData.size}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{sizeData.dcQty}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{sizeData.completed}</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>{sizeData.balance}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                Completed: {order.completedPercentage} %
              </Text>
              <ProgressBar 
                progress={order.completedPercentage / 100} 
                color={order.completedPercentage === 100 ? '#4CAF50' : '#2196F3'} 
                style={styles.progressBar} 
              />
            </View>
            
            {/* Removed View Full Details button */}
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
            Current Orders
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'current' ? (
          currentOrders.map(order => renderOrderCard(order))
        ) : (
          pastOrders.map(order => renderOrderCard(order))
        )}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}
