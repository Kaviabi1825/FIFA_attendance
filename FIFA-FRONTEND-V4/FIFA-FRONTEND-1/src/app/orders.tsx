import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Dialog, FAB, TextInput as PaperInput, Provider as PaperProvider, Portal, RadioButton } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';

// Define TypeScript interfaces for our data structure
interface SizeData {
  size: string;
  dcQty: string;
  completed: string;
}

interface AccessoryData {
  item: string;
  quantity: string;
}

interface OrderData {
  id: string;
  supplier: string;
  dcNo: string;
  style: string;
  poNumber: string;
  priority: 'Normal' | 'Urgent';
  origin: 'Domestic' | 'Foreign';
  dueDate?: string;
  image: any;
  favorite: boolean;
  expanded: boolean;
  sizes: SizeData[];
  accessories: AccessoryData[];
}

export default function OrdersScreen() {
  const router = useRouter();
  const [expandedOrders, setExpandedOrders] = useState<{[key: string]: boolean}>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState('');
  const [updateMode, setUpdateMode] = useState<'add' | 'update'>('add');
  const [currentCompleted, setCurrentCompleted] = useState<string>('');
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  // Date picker states
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [tempDueDate, setTempDueDate] = useState(new Date());
  const [newItem, setNewItem] = useState<{
    supplier: string;
    dcNo: string;
    style: string;
    poNumber: string;
    priority: 'Normal' | 'Urgent';
    origin: 'Domestic' | 'Foreign';
    dueDate?: string;

    sizes: { size: string; dcQty: string }[];
    accessories: { item: string; quantity: string }[];
  }>({
    supplier: '',
    dcNo: '',
    style: '',
    poNumber: '',
    priority: 'Normal',
    origin: 'Domestic',
    dueDate: '',
    sizes: [{ size: '', dcQty: '' }],
    accessories: [{ item: '', quantity: '' }]
  });
  const [orderData, setOrderData] = useState<OrderData[]>([
    {
      id: '1',
      supplier: 'Jv hosiery',
      dcNo: '143000',
      style: 'Vest RNS',
      poNumber: 'PO12345',
      accessories: [],
      priority: 'Normal',
      origin: 'Domestic',
      image: require('../../assets/images/Ord1.jpg'),
      favorite: false,
      expanded: true,
      sizes: [
        { size: '75', dcQty: '750', completed: '450' },
        { size: '80', dcQty: '1500', completed: '800' },
        { size: '85', dcQty: '2300', completed: '650' },
        { size: '90', dcQty: '2300', completed: '650' },
        { size: '95', dcQty: '2300', completed: '650' },
        { size: '100', dcQty: '2300', completed: '650' },
        { size: '105', dcQty: '2300', completed: '650' },
        { size: '110', dcQty: '2300', completed: '650' },
        { size: '115', dcQty: '2300', completed: '650' },
        { size: '120', dcQty: '2300', completed: '650' },
      ]
    },
    {
      id: '2',
      supplier: 'T.k hosiery',
      dcNo: '5618112',
      style: 'FS T-Shirt',
      poNumber: 'PO67890',
      accessories: [],
      priority: 'Urgent',
      origin: 'Domestic',
      image: require('../../assets/images/Ord2.jpg'),
      favorite: false,
      expanded: true,
      sizes: [
        { size: 'S', dcQty: '500', completed: '300' },
        { size: 'M', dcQty: '800', completed: '500' },
        { size: 'L', dcQty: '600', completed: '400' }
      ]
    },
    {
      id: '3',
      supplier: 'T.T Titanic',
      dcNo: '112233',
      style: 'RNS',
      poNumber: 'PO55555',
      accessories: [],
      priority: 'Normal',
      origin: 'Foreign',
      image: require('../../assets/images/Ord3.jpg'),
      favorite: false,
      expanded: false,
      sizes: [
        { size: 'XS', dcQty: '400', completed: '200' },
        { size: 'S', dcQty: '600', completed: '300' }
      ]
    },
    {
      id: '4',
      supplier: 'R.M Textile',
      dcNo: '227791',
      style: 'RNS',
      poNumber: 'PO66666',
      accessories: [],
      priority: 'Urgent',
      origin: 'Domestic',
      image: require('../../assets/images/Ord4.jpg'),
      favorite: false,
      expanded: false,
      sizes: [
        { size: 'M', dcQty: '700', completed: '400' },
        { size: 'L', dcQty: '900', completed: '600' },
        { size: 'XL', dcQty: '500', completed: '300' }
      ]
    }
  ]);

  // Function to handle adding quantity - kept for reference but no longer used in UI
  const handleAddQuantity = (orderId: string, size: string) => {
    // Find the current completed quantity for this size
    const order = orderData.find(o => o.id === orderId);
    const sizeData = order?.sizes.find(s => s.size === size);
    const completed = sizeData?.completed || '0';
    
    setSelectedOrder(orderId);
    setSelectedSize(size);
    setCurrentCompleted(completed);
    setUpdateMode('add');
    setQuantityToAdd('');
    setModalVisible(true);
  };
  
  // Function to handle updating quantity directly
  const handleUpdateQuantity = (orderId: string, size: string) => {
    // Find the current completed quantity for this size
    const order = orderData.find(o => o.id === orderId);
    const sizeData = order?.sizes.find(s => s.size === size);
    const completed = sizeData?.completed || '0';
    
    setSelectedOrder(orderId);
    setSelectedSize(size);
    setCurrentCompleted(completed);
    setUpdateMode('update');
    setQuantityToAdd(completed); // Pre-fill with current value
    setModalVisible(true);
  };

  // Function to save the quantity changes
  const saveQuantityChanges = () => {
    if (!selectedOrder || !selectedSize || !quantityToAdd) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    // Convert to number and validate
    const qty = parseInt(quantityToAdd);
    if (isNaN(qty) || qty < 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    // Update the order data
    setOrderData(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === selectedOrder) {
          return {
            ...order,
            sizes: order.sizes.map(sizeItem => {
              if (sizeItem.size === selectedSize) {
                let newCompleted;
                
                if (updateMode === 'add') {
                  // Add to current quantity
                  const currentCompleted = parseInt(sizeItem.completed);
                  newCompleted = currentCompleted + qty;
                } else {
                  // Set to specific value
                  newCompleted = qty;
                }
                
                return {
                  ...sizeItem,
                  completed: newCompleted.toString()
                };
              }
              return sizeItem;
            })
          };
        }
        return order;
      });
    });

    // Close modal and reset values
    setModalVisible(false);
    setQuantityToAdd('');
    setSelectedOrder(null);
    setSelectedSize(null);
    setCurrentCompleted('');
    
    // Show success message
    const actionText = updateMode === 'add' ? 'added' : 'updated';
    Alert.alert('Success', `Quantity ${actionText} successfully`);
  };

  // Function to add a new size field in the new item form
  const addSizeField = () => {
    setNewItem(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', dcQty: '' }]
    }));
  };

  // Function to remove a size field from the new item form
  const removeSizeField = (index: number) => {
    if (newItem.sizes.length > 1) {
      setNewItem(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  // Function to handle due date selection
  const handleDueDateSelect = (date: Date) => {
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    setNewItem(prev => ({ ...prev, dueDate: formattedDate }));
    setTempDueDate(date); // Ensure temp date is in sync
  };

  // Function to show date picker
  const showDatePicker = () => {
    setShowDueDatePicker(true);
  };

  // Function to update size field values
  const updateSizeField = (index: number, field: 'size' | 'dcQty', value: string) => {
    setNewItem(prev => ({
      ...prev,
      sizes: prev.sizes.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Function to update accessory field values
  const addAccessoryField = () => {
    setNewItem(prev => ({
      ...prev,
      accessories: [...prev.accessories, { item: '', quantity: '' }]
    }));
  };

  const removeAccessoryField = (index: number) => {
    if (newItem.accessories.length > 1) {
      setNewItem(prev => ({
        ...prev,
        accessories: prev.accessories.filter((_, i) => i !== index)
      }));
    }
  };

  const updateAccessoryField = (index: number, field: 'item' | 'quantity', value: string) => {
    setNewItem(prev => ({
      ...prev,
      accessories: prev.accessories.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      )
    }));
  };

  // Function to save the new item
  const saveNewItem = () => {
    // Validate form
    if (!newItem.supplier || !newItem.dcNo || !newItem.style || !newItem.poNumber || !newItem.priority || !newItem.origin) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    // Validate product details
    const validProducts = newItem.sizes.every(size => size.size && size.dcQty);
    const validAccessories = newItem.accessories.every(acc => acc.item && acc.quantity);
    if (!validProducts || !validAccessories) {
      Alert.alert('Error', 'Please fill all material and accessory fields');
      return;
    }

    // Create new order with completed quantities set to 0
    const newOrder: OrderData = {
      id: Date.now().toString(),
      supplier: newItem.supplier,
      dcNo: newItem.dcNo,
      style: newItem.style,
      poNumber: newItem.poNumber,
      priority: newItem.priority,
      origin: newItem.origin,
      dueDate: newItem.dueDate,

      image: require('../../assets/images/Ord1.jpg'), // Default image
      favorite: false,
      expanded: false, // Default to not expanded
      sizes: newItem.sizes.map(s => ({ ...s, completed: '0' })), 
      accessories: newItem.accessories
    };

    // Add to order data
    setOrderData(prev => [...prev, newOrder]);

    // Reset form and close modal
    setNewItem({
      supplier: '',
      dcNo: '',
      style: '',
      poNumber: '',
      priority: 'Normal',
      origin: 'Domestic',
      dueDate: '',

      sizes: [{ size: '', dcQty: '' }],
    accessories: [{ item: '', quantity: '' }]
    });
    setNewItemModalVisible(false);
    // Reset date picker states
    setShowDueDatePicker(false);
    setTempDueDate(new Date());
    
    // Show success message
    Alert.alert('Success', 'New item added successfully');
  };

  // Function to handle multiple delete
  const handleMultipleDelete = () => {
    if (selectedOrders.length > 0) {
      setDeleteConfirmVisible(true);
    }
  };
  
  // Function to cancel selection mode
  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedOrders([]);
  };
  
  // Function to handle card press
  const handleCardPress = (orderId: string) => {
    if (selectionMode) {
      // In selection mode, toggle selection
      setSelectedOrders(prev => {
        if (prev.includes(orderId)) {
          return prev.filter(id => id !== orderId);
        } else {
          return [...prev, orderId];
        }
      });
    } else {
      // Toggle expanded state
      setExpandedOrders(prev => ({
        ...prev,
        [orderId]: !prev[orderId] || false
      }));
    }
  };
  
  // Function to handle long press on card
  const handleCardLongPress = (orderId: string) => {
    // Enter selection mode
    setSelectionMode(true);
    setSelectedOrders([orderId]);
    // Vibration feedback could be added here
  };

  // Function to confirm and delete selected orders
  const confirmDeleteOrder = () => {
    if (selectedOrders.length > 0) {
      setOrderData(prevOrders => prevOrders.filter(order => !selectedOrders.includes(order.id)));
      setDeleteConfirmVisible(false);
      setSelectionMode(false);
      setSelectedOrders([]);
      Alert.alert('Success', `${selectedOrders.length} order(s) removed successfully`);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {selectionMode ? (
            <>
              <TouchableOpacity onPress={cancelSelectionMode} style={styles.backButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{selectedOrders.length} Selected</Text>
              <TouchableOpacity onPress={handleMultipleDelete} style={styles.deleteAllButton}>
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Orders</Text>
              <View style={{ width: 24 }} />
            </>
          )}
        </View>

        {/* Orders List */}
        <ScrollView 
          style={styles.ordersList}
        >
          {orderData.map((order) => (
            <Card 
              key={order.id} 
              style={[styles.card, selectedOrders.includes(order.id) && styles.cardSelected]}
              elevation={selectedOrders.includes(order.id) ? 5 : 3}
              onPress={() => handleCardPress(order.id)}
              onLongPress={() => handleCardLongPress(order.id)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  {order.favorite && (
                    <Ionicons name="star" size={18} color="#FFD700" style={styles.starIcon} />
                  )}
                  <Image source={typeof order.image === 'string' ? {uri: order.image} : order.image} style={styles.orderImage} />
                  <View style={styles.orderInfo}>
                    <Text style={styles.supplierName}>{order.supplier}</Text>
                    <Text style={styles.styleText}>Style: {order.style}</Text>
                    <Text style={[styles.styleText, { color: order.priority === 'Urgent' ? '#FF6B6B' : '#009688' }]}>Priority: {order.priority}</Text>
                    <Text style={[styles.styleText, { color: order.origin === 'Foreign' ? '#4A90E2' : '#009688' }]}>Origin: {order.origin}</Text>
                  </View>
                  <View style={styles.dcNumberContainer}>
                    <Text style={styles.dcLabel}>DC No</Text>
                    <Text style={styles.dcNumber}>{order.dcNo}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    {selectionMode && (
                      <View style={[styles.checkboxContainer, selectedOrders.includes(order.id) && styles.checkboxSelected]}>
                        {selectedOrders.includes(order.id) && (
                          <Ionicons name="checkmark" size={20} color="white" />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>
              
              {expandedOrders[order.id] === true && (
                <Card.Content style={styles.expandedContent}>
                  <View style={styles.divider} />
                  
                  {/* Column Headers */}
                  <View style={styles.detailsHeader}>
                    <Text style={[styles.detailHeaderText, { flex: 0.7 }]}>Product</Text>
                    <Text style={[styles.detailHeaderText, { flex: 1 }]}>Order Qty</Text>
                    <Text style={[styles.detailHeaderText, { flex: 1 }]}>Completed</Text>
                    <Text style={[styles.detailHeaderText, { flex: 0.7 }]}>Action</Text>
                  </View>
                  
                  {/* Size Rows */}
                  {order.sizes && order.sizes.map((sizeData, index) => (
                    <View key={index} style={styles.sizeRow}>
                      <Text style={[styles.sizeText, { flex: 0.7 }]}>{sizeData.size}</Text>
                      <Text style={[styles.qtyText, { flex: 1 }]}>{sizeData.dcQty} pcs</Text>
                      <Text style={[styles.completedText, { flex: 1 }]}>{sizeData.completed} pcs</Text>
                      <View style={{ flex: 0.7, alignItems: 'center' }}>
                        <TouchableOpacity 
                          style={styles.updateQtyButton}
                          onPress={() => handleUpdateQuantity(order.id, sizeData.size || '')}
                        >
                          <MaterialIcons name="edit" size={18} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  
                  {/* Delivery Button */}
                  <Button 
                    mode="contained" 
                    style={styles.deliveryButton}
                    labelStyle={styles.deliveryButtonText}
                    onPress={() => router.push({
                      pathname: '/order-history',
                      params: { orderId: order.id }
                    })}
                  >
                    Delivery
                  </Button>
                </Card.Content>
              )}
            </Card>
          ))}
        </ScrollView>

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setNewItemModalVisible(true)}
          color="white"
        />

        {/* Bottom Navigation */}
        <BottomNavigation />
        
        {/* Quantity Modal */}
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>
              {updateMode === 'add' ? 'Add Quantity' : 'Update Quantity'}
            </Dialog.Title>
            <Dialog.Content>
              {updateMode === 'add' ? (
                <View style={styles.currentQtyContainer}>
                  <Text style={styles.currentQtyLabel}>Current Completed:</Text>
                  <Text style={styles.currentQtyValue}>{currentCompleted} pcs</Text>
                </View>
              ) : null}
              
              <PaperInput
                label={updateMode === 'add' ? 'Quantity to Add' : 'New Completed Quantity'}
                value={quantityToAdd}
                onChangeText={setQuantityToAdd}
                keyboardType="numeric"
                style={styles.quantityInput}
                mode="outlined"
                activeOutlineColor="#009688"
                outlineColor="#DDDDDD"
                theme={{ colors: { primary: '#009688' } }}
              />
              
              {updateMode === 'add' ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>New Total:</Text>
                  <Text style={styles.resultValue}>
                    {isNaN(parseInt(quantityToAdd)) ? currentCompleted : 
                      (parseInt(currentCompleted) + parseInt(quantityToAdd)).toString()} pcs
                  </Text>
                </View>
              ) : null}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setModalVisible(false)} textColor="#666">Cancel</Button>
              <Button 
                onPress={saveQuantityChanges} 
                textColor="#009688"
              >
                {updateMode === 'add' ? 'Add' : 'Update'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Add New Item Modal */}
        <Portal>
          <Dialog
            visible={newItemModalVisible}
            onDismiss={() => setNewItemModalVisible(false)}
            style={styles.newItemDialog}
          >
            <View style={styles.dialogHeaderContainer}>
              <View style={styles.dialogHeaderContent}>
                <MaterialIcons name="add-shopping-cart" size={28} color="white" />
                <Text style={styles.dialogHeaderTitle}>Add New Item</Text>
              </View>
              <TouchableOpacity onPress={() => setNewItemModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <Dialog.ScrollArea style={styles.scrollArea}>
              <ScrollView style={styles.newItemScrollView}>
                <Card style={styles.newItemCard}>
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons name="information-circle" size={22} color="#009688" />
                      <Text style={styles.cardSectionTitle}>Basic Information</Text>
                    </View>
                    
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="business" size={20} color="#009688" style={styles.inputIcon} />
                      <PaperInput
                        label="Supplier Name"
                        value={newItem.supplier}
                        onChangeText={(text) => setNewItem(prev => ({ ...prev, supplier: text }))}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        theme={{ colors: { primary: '#009688' } }}
                      />
                    </View>
                    
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="document-text" size={20} color="#009688" style={styles.inputIcon} />
                      <PaperInput
                        label="DC Number"
                        value={newItem.dcNo}
                        onChangeText={(text) => setNewItem(prev => ({ ...prev, dcNo: text }))}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        keyboardType="numeric"
                        theme={{ colors: { primary: '#009688' } }}
                      />
                    </View>
                    
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="shirt" size={20} color="#009688" style={styles.inputIcon} />
                      <PaperInput
                        label="Style"
                        value={newItem.style}
                        onChangeText={(text) => setNewItem(prev => ({ ...prev, style: text }))}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        theme={{ colors: { primary: '#009688' } }}
                      />
                    </View>

                    <View style={styles.inputWithIcon}>
                      <Ionicons name="document-text" size={20} color="#009688" style={styles.inputIcon} />
                      <PaperInput
                        label="PO Number"
                        value={newItem.poNumber}
                        onChangeText={text => setNewItem(prev => ({ ...prev, poNumber: text }))}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        theme={{ colors: { primary: '#009688' } }}
                      />
                    </View>
                    
                    {/* Priority */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="rocket" size={20} color="#009688" style={styles.inputIcon} />
                      <View style={[styles.input, { justifyContent: 'center', paddingVertical: 12 }]}>
                        <Text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Priority</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                          <TouchableOpacity
                            onPress={() => setNewItem(prev => ({ ...prev, priority: 'Normal' }))}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                          >
                            <RadioButton.Android
                              value="Normal"
                              status={newItem.priority === 'Normal' ? 'checked' : 'unchecked'}
                              onPress={() => setNewItem(prev => ({ ...prev, priority: 'Normal' }))}
                              color="#009688"
                            />
                            <Text>Normal</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setNewItem(prev => ({ ...prev, priority: 'Urgent' }))}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                          >
                            <RadioButton.Android
                              value="Urgent"
                              status={newItem.priority === 'Urgent' ? 'checked' : 'unchecked'}
                              onPress={() => setNewItem(prev => ({ ...prev, priority: 'Urgent' }))}
                              color="#FF6B6B"
                            />
                            <Text>Urgent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Origin */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="globe" size={20} color="#009688" style={styles.inputIcon} />
                      <View style={[styles.input, { justifyContent: 'center', paddingVertical: 12 }]}>
                        <Text style={{ color: '#666', fontSize: 12, marginBottom: 4 }}>Origin</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
                          <TouchableOpacity
                            onPress={() => setNewItem(prev => ({ ...prev, origin: 'Domestic' }))}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                          >
                            <RadioButton.Android
                              value="Domestic"
                              status={newItem.origin === 'Domestic' ? 'checked' : 'unchecked'}
                              onPress={() => setNewItem(prev => ({ ...prev, origin: 'Domestic' }))}
                              color="#009688"
                            />
                            <Text>Domestic</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setNewItem(prev => ({ ...prev, origin: 'Foreign' }))}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                          >
                            <RadioButton.Android
                              value="Foreign"
                              status={newItem.origin === 'Foreign' ? 'checked' : 'unchecked'}
                              onPress={() => setNewItem(prev => ({ ...prev, origin: 'Foreign' }))}
                              color="#4A90E2"
                            />
                            <Text>Foreign</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    
                    {/* Due Date */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons name="calendar" size={20} color="#009688" style={styles.inputIcon} />
                      <View style={{ flex: 1 }}>
                        <PaperInput
                          label="Due Date"
                          value={newItem.dueDate || ''}
                          editable={false}
                          style={styles.input}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: '#009688' } }}
                          right={
                            <PaperInput.Icon 
                              icon="calendar" 
                              color="#009688" 
                              onPress={() => {
                                setTempDueDate(newItem.dueDate ? new Date(newItem.dueDate) : new Date());
                                showDatePicker();
                              }}
                            />
                          }
                        />
                        <TouchableOpacity 
                          style={styles.datePickerTouchable}
                          onPress={() => {
                            setTempDueDate(newItem.dueDate ? new Date(newItem.dueDate) : new Date());
                            showDatePicker();
                          }}
                        />
                      </View>
                    </View>
                  </Card.Content>
                </Card>
                <Card style={[styles.newItemCard, { marginTop: 15 }]}>
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons name="resize" size={22} color="#009688" />
                      <Text style={styles.cardSectionTitle}>Add Material</Text>
                    </View> 
                    {newItem.sizes.map((sizeItem, index) => (
                      <View key={index} style={styles.sizeInputRow}>
                        <View style={styles.sizeNumberBadge}>
                          <Text style={styles.sizeNumberText}>{index + 1}</Text>
                        </View>
                        <PaperInput
                          label="Size"
                          value={sizeItem.size}
                          onChangeText={(text) => updateSizeField(index, 'size', text)}
                          style={styles.sizeInput}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: '#009688' } }}
                        />
                        <PaperInput
                          label="Quantity"
                          value={sizeItem.dcQty}
                          onChangeText={(text) => updateSizeField(index, 'dcQty', text)}
                          style={[styles.qtyInput, { flex: 1, marginRight: 5, textAlign: 'left' }]}
                          keyboardType="numeric"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: '#009688' } }}
                        />
                        <TouchableOpacity 
                          onPress={() => removeSizeField(index)}
                          style={styles.removeButton}
                        >
                          <MaterialIcons name="remove-circle" size={24} color="#FF6B6B" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    
                  </Card.Content>
                </Card>
                
                <Button 
                  mode="contained" 
                  onPress={addSizeField}
                  style={styles.addSizeButton}
                  icon="plus"
                  buttonColor="#009688"
                  contentStyle={styles.addSizeButtonContent}
                >
                  Add Material
                </Button>

                {/* Add Accessories Card */}
                <Card style={[styles.newItemCard, { marginTop: 15 }]}>
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons name="build" size={22} color="#009688" />
                      <Text style={styles.cardSectionTitle}>Add Accessories</Text>
                    </View>
                    {newItem.accessories.map((accItem, index) => (
                      <View key={index} style={styles.sizeInputRow}>
                        <View style={styles.sizeNumberBadge}>
                          <Text style={styles.sizeNumberText}>{index + 1}</Text>
                        </View>
                        <PaperInput
                          label="Item"
                          value={accItem.item}
                          onChangeText={(text) => updateAccessoryField(index, 'item', text)}
                          style={[styles.input, { flex: 1, marginRight: 5 }]}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: '#009688' } }}
                        />
                        <PaperInput
                          label="Quantity"
                          value={accItem.quantity}
                          onChangeText={(text) => updateAccessoryField(index, 'quantity', text)}
                          style={[styles.input, { flex: 1, marginRight: 5, textAlign: 'left' }]}
                          keyboardType="numeric"
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: '#009688' } }}
                        />
                        <TouchableOpacity
                          onPress={() => removeAccessoryField(index)}
                          style={styles.removeButton}
                        >
                          <MaterialIcons name="remove-circle" size={24} color="#FF6B6B" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </Card.Content>
                </Card>

                <Button
                  mode="contained"
                  onPress={addAccessoryField}
                  style={styles.addSizeButton}
                  icon="plus"
                  buttonColor="#009688"
                  contentStyle={styles.addSizeButtonContent}
                >
                  Add Accessories
                </Button>


                
                {/* Extra space at bottom of scroll view */}
                <View style={{ height: 40 }} />
              </ScrollView>
            </Dialog.ScrollArea>
            
            <Dialog.Actions style={styles.newItemDialogActions}>
              <View style={styles.actionButtonsContainer}>
                <Button 
                  onPress={() => setNewItemModalVisible(false)} 
                  textColor="#666"
                  style={styles.cancelButton}
                  labelStyle={styles.buttonLabel}
                  contentStyle={styles.buttonContent}
                >
                  Cancel
                </Button>
                <Button 
                  onPress={saveNewItem} 
                  mode="contained"
                  buttonColor="#009688"
                  style={styles.saveButton}
                  labelStyle={styles.buttonLabel}
                  contentStyle={styles.buttonContent}
                  icon="check"
                >
                  Save
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Due Date Picker */}
        {showDueDatePicker && (
          <DateTimePicker
            value={tempDueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDueDatePicker(false);
              if (selectedDate) {
                handleDueDateSelect(selectedDate);
              }
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Portal>
          <Dialog
            visible={deleteConfirmVisible}
            onDismiss={() => setDeleteConfirmVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Remove Order</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to remove this order?</Text>
              <Text style={styles.warningText}>This action cannot be undone.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteConfirmVisible(false)} textColor="#666">Cancel</Button>
              <Button onPress={confirmDeleteOrder} textColor="#FF6B6B">Remove</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  datePickerTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent'
  },
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: '#009688',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ordersList: {
    flex: 1,
    padding: 10,
    paddingBottom: 70,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#009688',
    backgroundColor: '#E8F5F3',
  },
  cardContent: {
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: -5,
    left: -5,
    zIndex: 1,
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  styleText: {
    fontSize: 14,
    color: '#666',
  },
  dcNumberContainer: {
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
  },
  dcLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dcNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteAllButton: {
    padding: 5,
    width: 40,
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  checkboxSelected: {
    backgroundColor: '#009688',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  expandedContent: {
    paddingTop: 0,
  },
  detailsHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  detailHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009688',
    flex: 1,
    textAlign: 'center',
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  qtyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  completedText: {
    fontSize: 14,
    color: '#009688',
    fontWeight: '500',
    textAlign: 'center',
  },
  updateQtyButton: {
    backgroundColor: '#009688',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryButton: {
    backgroundColor: '#009688',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 5,
  },
  deliveryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dialog: {
    borderRadius: 15,
  },
  dialogTitle: {
    color: '#009688',
    fontWeight: 'bold',
  },
  quantityInput: {
    marginVertical: 10,
  },
  currentQtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  currentQtyLabel: {
    fontSize: 14,
    color: '#666',
  },
  currentQtyValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#009688',
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#F0F9F8',
    borderRadius: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688',
  },
  newItemDialog: {
    borderRadius: 15,
    maxHeight: '95%',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  dialogHeaderContainer: {
    backgroundColor: '#009688',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  dialogHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogHeaderTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    paddingHorizontal: 15,
  },
  newItemScrollView: {
    paddingVertical: 15,
  },
  newItemCard: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
    marginBottom: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 15,
  },
  input: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  newItemDialogActions: {
    paddingVertical: 0,
    paddingHorizontal: 5,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  cancelButton: {
    flex: 3,  
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
  },
  saveButton: {
    flex: 3,
    borderRadius: 20,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContent: {
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  sizeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F9FBFF',
    padding: 10,
    borderRadius: 8,
  },
  sizeNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sizeNumberText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sizeInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'white',
  },
  qtyInput: {
    flex: 1.5,
    marginRight: 10,
    backgroundColor: 'white',
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#FFF0F0',
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSizeButton: {
    marginTop: 25,
    marginBottom: 30,
    alignSelf: 'center',
    width: '60%',
    borderRadius: 25,
    elevation: 3,
  },
  addSizeButtonContent: {
    paddingVertical: 5,
  },
  warningText: {
    color: '#FF6B6B',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
