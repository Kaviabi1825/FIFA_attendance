import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Modal as RNModal, Platform, ScrollView, StatusBar, StyleSheet, View, Alert, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Appbar, Button, Card, Divider, FAB, IconButton, Modal, SegmentedButtons, Surface, Text, TextInput, TouchableRipple, Snackbar } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';
import { useTransactionsStore } from '../contexts/transactions';

export default function AccountsScreen() {
  const router = useRouter();
  const transactions = useTransactionsStore((s) => s.transactions);
  const [activeTab, setActiveTab] = useState<'EXPENSES' | 'INCOME'>('EXPENSES');
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Bill line item states
  const [billLineItemModalVisible, setBillLineItemModalVisible] = useState(false);
  const [billLineItemDescription, setBillLineItemDescription] = useState('');
  const [billLineItemAmount, setBillLineItemAmount] = useState('');
  const [billLineItemDate, setBillLineItemDate] = useState(new Date());
  
  // Card category totals state
  const [billsTotal, setBillsTotal] = useState(125400); // Initial value from hardcoded amount
  const [transportTotal, setTransportTotal] = useState(45000);
  const [rentTotal, setRentTotal] = useState(80000);
  const [salaryTotal, setSalaryTotal] = useState(320000);
  const [incomeTotal, setIncomeTotal] = useState(560000);
  
  // Date picker state for bill line items
  const [showBillLineItemDatePicker, setShowBillLineItemDatePicker] = useState(false);
  
  // State to track which category modal is open
  const [activeCategoryModal, setActiveCategoryModal] = useState('');
  
  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('This Month');
  const [filterApplied, setFilterApplied] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showFilterStartDatePicker, setShowFilterStartDatePicker] = useState(false);
  const [showFilterEndDatePicker, setShowFilterEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const [filterStartDate, setFilterStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [filterEndDate, setFilterEndDate] = useState(new Date());
  
  // Snackbar state
  // Function to navigate to report for a specific category
  const navigateToReport = (category: string, amount?: string) => {
    // For now, we'll just show an alert with the category
    // In a real implementation, this would navigate to a detailed report page
    Alert.alert('View Details', `Showing details for ${category} category`);
    router.push({
      pathname: '/report',
      params: { category, amount }
    });
  };
  

  
  // Refs to track if component is mounted
  const isMounted = useRef(true);

  // Color constants for consistent styling
  const EXPENSE_COLOR = '#BF1029'; // Modern pink for expenses
  const INCOME_COLOR = '#056517';  // Modern blue for income

  // Chart data for expenses and income
  const chartData = {
    labels: ['Expenses', 'Income'],
    datasets: [
      {
        data: [231400, 311600], // Expenses: 2,31,400 (Bills + Transport + Utilities), Income: 3,11,600
        colors: [
          (opacity = 1) => EXPENSE_COLOR,
          (opacity = 1) => INCOME_COLOR
        ]
      }
    ]
  };



  // Handle bar chart press
  const handleBarPress = (index: number) => {
    const category = chartData.labels[index];
    const amount = index === 0 ? '₹2,31,400' : '₹3,11,600';
    navigateToReport(category, amount);
  };

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    // Here you would typically save the transaction to your database
    // For now, we'll just close the modal and reset the form
    setModalVisible(false);
    resetForm();

    // Show success message or update the UI
    setSnackbarMessage(`Successfully added ${transactionType === 'expense' ? 'expense' : 'income'}: ₹${amount}`);
    setSnackbarVisible(true);
    console.log('Transaction added:', {
      type: transactionType,
      description,
      amount,
      category,
      date
    });
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date());
    setTransactionType('expense');
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle date picker for both platforms
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always close the picker immediately on mobile
    if (Platform.OS !== 'web') {
      setShowFilterStartDatePicker(false);
      setShowFilterEndDatePicker(false);
    }
    
    // Only update if a date was selected (on Android, cancel returns undefined)
    if (selectedDate) {
      if (datePickerMode === 'start' || (Platform.OS === 'web' && showFilterStartDatePicker)) {
        setFilterStartDate(selectedDate);
        // Show feedback on mobile
        if (Platform.OS !== 'web') {
          setTimeout(() => {
            if (isMounted.current) {
              setSnackbarMessage(`Start date set to: ${selectedDate.toLocaleDateString()}`);
              setSnackbarVisible(true);
            }
          }, 300);
        }
      } else if (datePickerMode === 'end' || (Platform.OS === 'web' && showFilterEndDatePicker)) {
        setFilterEndDate(selectedDate);
        // Show feedback on mobile
        if (Platform.OS !== 'web') {
          setTimeout(() => {
            if (isMounted.current) {
              setSnackbarMessage(`End date set to: ${selectedDate.toLocaleDateString()}`);
              setSnackbarVisible(true);
            }
          }, 300);
        }
      }
    }
    
    // Reset picker mode on mobile
    if (Platform.OS !== 'web') {
      setDatePickerMode('start');
    }
    
    // On web, we need to manually close the picker
    if (Platform.OS === 'web') {
      if (showFilterStartDatePicker) setShowFilterStartDatePicker(false);
      if (showFilterEndDatePicker) setShowFilterEndDatePicker(false);
    }
  };
  
  // Open date picker with the appropriate mode
  const openDatePicker = (mode: 'start' | 'end') => {
    // First set the mode
    setDatePickerMode(mode);
    
    if (Platform.OS === 'web') {
      // On web, show the appropriate picker inline
      if (mode === 'start') {
        setShowFilterStartDatePicker(true);
        setShowFilterEndDatePicker(false);
      } else {
        setShowFilterStartDatePicker(false);
        setShowFilterEndDatePicker(true);
      }
    } else {
      // On mobile, show the appropriate picker as a modal
      if (mode === 'start') {
        setShowFilterStartDatePicker(true);
        setShowFilterEndDatePicker(false);
      } else {
        setShowFilterStartDatePicker(false);
        setShowFilterEndDatePicker(true);
      }
      
      // On Android, we need to ensure the modal is visible
      if (Platform.OS === 'android') {
        console.log(`Opening ${mode} date picker on Android`);
      }
    }
  };
  
  // Apply filter based on selected period
  const applyFilter = (period: 'This Week' | 'This Month' | 'Last Month' | 'Custom') => {
    try {
      console.log(`Applying filter: ${period}`);
      
      const today = new Date();
      let start = new Date();
      let end = new Date();
      
      switch(period) {
        case 'This Week':
          // Set start to beginning of current week (Sunday)
          start.setDate(today.getDate() - today.getDay());
          start.setHours(0, 0, 0, 0);
          break;
        case 'This Month':
          // Set start to beginning of current month
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          break;
        case 'Last Month':
          // Set start to beginning of last month
          start.setMonth(today.getMonth() - 1);
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          // Set end to end of last month
          end.setDate(0); // Last day of previous month
          end.setHours(23, 59, 59, 999);
          break;
        case 'Custom':
          // Use the custom date range
          start = new Date(filterStartDate);
          end = new Date(filterEndDate);
          
          // Validate date range
          if (start > end) {
            if (Platform.OS === 'web') {
              alert('Start date cannot be after end date');
            } else {
              Alert.alert('Invalid Date Range', 'Start date cannot be after end date');
            }
            return;
          }
          break;
      }
      
      // First update the filter period
      setFilterPeriod(period);
      setFilterApplied(true);
      
      // Close modal
      setFilterModalVisible(false);
      
      // Show feedback after a delay to ensure modal is closed
      setTimeout(() => {
        if (isMounted.current) {
          setSnackbarMessage(`Filter applied: ${period}`);
          setSnackbarVisible(true);
          
          console.log('Filter applied:', {
            period,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
          });
          
          // Here you would actually filter the transactions based on the date range
          // For example:
          // const filteredTransactions = allTransactions.filter(t => {
          //   const txDate = new Date(t.date);
          //   return txDate >= start && txDate <= end;
          // });
          // setTransactions(filteredTransactions);
        }
      }, Platform.OS === 'web' ? 100 : 800);
    } catch (error) {
      console.error('Error applying filter:', error);
      if (isMounted.current) {
        setSnackbarMessage('Error applying filter');
        setSnackbarVisible(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009688" barStyle="light-content" />
      {/* Header */}
      <Appbar.Header style={styles.header} elevated>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Accounts" color="white" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="dots-vertical" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.content}>

        {/* Filter Section */}
        <Surface style={styles.filterContainer} elevation={1}>
          <View style={styles.filterTextContainer}>
            <MaterialIcons name="filter-list" size={20} color="#009688" />
            <Text style={styles.filterText}>Filter By</Text>
          </View>
          <TouchableRipple
            onPress={() => {
              console.log('Filter button pressed');
              // Reset any active pickers
              setShowFilterStartDatePicker(false);
              setShowFilterEndDatePicker(false);
              setDatePickerMode('start');
              // Show the filter modal
              setFilterModalVisible(true);
            }}
            style={[styles.datePickerButton, { borderWidth: 1, borderColor: '#009688', borderRadius: 4 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, justifyContent: 'center' }}>
              <MaterialIcons name="calendar-today" size={18} color="#009688" style={{ marginRight: 8 }} />
              <Text style={{ color: '#009688' }}>{filterPeriod}{filterApplied ? ' ✓' : ''}</Text>
            </View>
          </TouchableRipple>
        </Surface>

        {/* Bar Chart */}
        <Card style={styles.chartContainer} elevation={4}>
          <Card.Title 
            title="Expenses vs Income" 
            titleStyle={styles.chartTitle} 
            // subtitle="Tap on bars for details"
            subtitleStyle={styles.chartSubtitle}
          />
          <Card.Content>
            <View style={styles.chartWrapper}>
              {/* <Text style={styles.chartInstructions}>Tap on a bar to view details</Text> */}
              <View style={styles.chartAlignmentFix}>
                <BarChart
                  data={chartData}
                  width={Dimensions.get('window').width - 80}
                  height={220}
                  yAxisLabel="₹"
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#f8f9fa',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(60, 60, 60, ${opacity})`,
                    style: {
                      borderRadius: 16,
                      padding: 10,
                    },
                    barPercentage: 0.8,
                    propsForLabels: {
                      fontSize: 14,
                      fontWeight: 'bold',
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  fromZero
                  showBarTops
                  withCustomBarColorFromData
                  flatColor
                />
              </View>
              <View style={styles.chartButtonsContainer}>
                <TouchableRipple 
                  onPress={() => handleBarPress(0)} 
                  style={[styles.chartButton, { backgroundColor: EXPENSE_COLOR }]}
                  borderless
                >
                  <Text style={styles.chartButtonText}>View Expenses</Text>
                </TouchableRipple>
                <TouchableRipple 
                  onPress={() => handleBarPress(1)} 
                  style={[styles.chartButton, { backgroundColor: INCOME_COLOR }]}
                  borderless
                >
                  <Text style={styles.chartButtonText}>View Income</Text>
                </TouchableRipple>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.legendContainer}>
              {/* <TouchableRipple onPress={() => navigateToReport('Expenses', '₹2,31,400')} style={styles.legendItemWrapper}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: EXPENSE_COLOR }]} />
                  <Text style={styles.legendText}>Expenses (₹2,31,400)</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#666" style={{marginLeft: 4}} />
                </View>
              </TouchableRipple> */}
              {/* <TouchableRipple onPress={() => navigateToReport('Income', '₹3,11,600')} style={styles.legendItemWrapper}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: INCOME_COLOR }]} />
                  <Text style={styles.legendText}>Income (₹3,11,600)</Text>
                  <MaterialIcons name="chevron-right" size={16} color="#666" style={{marginLeft: 4}} />
                </View>
              </TouchableRipple> */}
            </View>
          </Card.Content>
        </Card>

        {/* Tab Navigation */}
        <Surface style={styles.tabContainer} elevation={2}>
          <TouchableRipple
            style={[styles.tabButton, activeTab === 'EXPENSES' ? styles.activeTab : {}]}
            onPress={() => setActiveTab('EXPENSES')}
            rippleColor="rgba(0, 150, 136, 0.2)"
            borderless
          >
            <View style={styles.tabButtonContent}>
              <MaterialIcons 
                name="trending-down" 
                size={20} 
                color={activeTab === 'EXPENSES' ? 'white' : '#666'} 
                style={styles.tabIcon} 
              />
              <Text style={[styles.tabText, activeTab === 'EXPENSES' ? styles.activeTabText : {}]}>EXPENSES</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            style={[styles.tabButton, activeTab === 'INCOME' ? styles.activeTab : {}]}
            onPress={() => setActiveTab('INCOME')}
            rippleColor="rgba(0, 150, 136, 0.2)"
            borderless
          >
            <View style={styles.tabButtonContent}>
              <MaterialIcons 
                name="trending-up" 
                size={20} 
                color={activeTab === 'INCOME' ? 'white' : '#666'} 
                style={styles.tabIcon} 
              />
              <Text style={[styles.tabText, activeTab === 'INCOME' ? styles.activeTabText : {}]}>INCOME</Text>
            </View>
          </TouchableRipple>
        </Surface>

        {/* Category Cards */}
        {activeTab === 'EXPENSES' ? (
          <>
            <View style={styles.categoryContainer}>
              {/* Bills */}
              <Card 
                style={styles.categoryCard}
                elevation={4}
                onPress={() => navigateToReport('bills')}
              >
                <Card.Content style={styles.modernCardContent}>
                  <View style={styles.iconCircleCategory}>
                    <MaterialIcons name="receipt" size={24} color="#BF1029" />
                  </View>
                  <Text style={styles.categoryTitle}>Bills</Text>
                  <Text style={styles.categoryAmount}>₹ {billsTotal.toLocaleString()}</Text>
                  <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#4A90E2" />
                  </View>
                  {/* Plus icon for adding line items to bills */}
                  <TouchableOpacity 
                    style={{ alignSelf: 'center', marginTop: 8 }}
                    onPress={() => {
                      // Show modal for adding line item
                      setActiveCategoryModal('bills');
                      setBillLineItemModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
                  </TouchableOpacity>
                </Card.Content>
              </Card>
              
              {/* Transport */}
              <Card 
                style={styles.categoryCard}
                elevation={4}
                onPress={() => navigateToReport('transport')}

              >
                <Card.Content style={styles.modernCardContent}>
                  <View style={styles.iconCircleCategory}>
                    <MaterialIcons name="directions-car" size={24} color="#BF1029" />
                  </View>
                  <Text style={styles.categoryTitle}>Transport</Text>
                  <Text style={styles.categoryAmount}>₹ {transportTotal.toLocaleString()}</Text>
                  <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#4A90E2" />
                  </View>
                  {/* Plus icon for adding line items to transport */}
                  <TouchableOpacity 
                    style={{ alignSelf: 'center', marginTop: 8 }}
                    onPress={() => {
                      // Show modal for adding line item
                      setActiveCategoryModal('transport');
                      setBillLineItemModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
                  </TouchableOpacity>
                </Card.Content>
              </Card>

              {/* Salary */}
              <Card 
                style={styles.categoryCard}
                elevation={4}
                onPress={() => navigateToReport('salary')}

              >
                <Card.Content style={styles.modernCardContent}>
                  <View style={styles.iconCircleCategory}>
                    <MaterialIcons name="payments" size={24} color="#BF1029" />
                  </View>
                  <Text style={styles.categoryTitle}>Salary</Text>
                  <Text style={styles.categoryAmount}>₹ {salaryTotal.toLocaleString()}</Text>
                  <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#4A90E2" />
                  </View>
                  {/* Plus icon for adding line items to salary */}
                  <TouchableOpacity 
                    style={{ alignSelf: 'center', marginTop: 8 }}
                    onPress={() => {
                      // Show modal for adding line item
                      setActiveCategoryModal('salary');
                      setBillLineItemModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
                  </TouchableOpacity>
                </Card.Content>
              </Card>

              {/* Utilities */}
              <Card 
                style={styles.categoryCard}
                elevation={4}
                onPress={() => navigateToReport('utilities')}

              >
                <Card.Content style={styles.modernCardContent}>
                  <View style={styles.iconCircleCategory}>
                    <MaterialIcons name="lightbulb" size={24} color="#BF1029" />
                  </View>
                  <Text style={styles.categoryTitle}>Utilities</Text>
                  <Text style={styles.categoryAmount}>₹ {rentTotal.toLocaleString()}</Text>
                  <View style={styles.viewDetailsRow}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#4A90E2" />
                  </View>
                  {/* Plus icon for adding line items to utilities */}
                  <TouchableOpacity 
                    style={{ alignSelf: 'center', marginTop: 8 }}
                    onPress={() => {
                      // Show modal for adding line item
                      setActiveCategoryModal('utilities');
                      setBillLineItemModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
                  </TouchableOpacity>
                </Card.Content>
              </Card>

              {/* Dynamic expense categories */}
              {transactions
                .filter((t) => t.type === 'expense')
                .filter((t) => !['Bills','Transport','Salary','Utilities'].includes(t.category))
                .map((t) => (
                  <Card key={t.id} style={styles.categoryCard} elevation={4} >
                    <Card.Content style={styles.modernCardContent}>
                      <View style={styles.iconCircleCategory}>
                        <MaterialIcons name="label" size={24} color="#BF1029" />
                      </View>
                      <Text style={styles.categoryTitle}>{t.category}</Text>
                      <Text style={styles.categoryAmount}>₹ {t.amount.toLocaleString()}</Text>
                    </Card.Content>
                  </Card>
                ))}
            </View>
          </>
        ) : (
          <View style={styles.categoryContainer}>
            {/* Sales */}
            <Card 
              style={styles.categoryCard}
              elevation={4}
              onPress={() => navigateToReport('sales')}

            >
              <Card.Content style={styles.modernCardContent}>
                <View style={styles.iconCircleCategory}>
                  <MaterialIcons name="money" size={24} color="#056517" />
                </View>
                <Text style={styles.categoryTitle}>Sales</Text>
                <Text style={styles.categoryAmount}>₹ {incomeTotal.toLocaleString()}</Text>
                <View style={styles.viewDetailsRow}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#4A90E2" />
                </View>
                {/* Plus icon for adding line items to sales */}
                <TouchableOpacity 
                  style={{ alignSelf: 'center', marginTop: 8 }}
                  onPress={() => {
                    // Show modal for adding line item
                    setActiveCategoryModal('sales');
                    setBillLineItemModalVisible(true);
                  }}
                >
                  <MaterialIcons name="add-circle" size={24} color="#4A90E2" />
                </TouchableOpacity>
              </Card.Content>
            </Card>

            {/* Dynamic income categories */}
            {transactions
              .filter((t) => t.type === 'income')
              .filter((t) => !['Sales'].includes(t.category))
              .map((t) => (
                <Card key={t.id} style={styles.categoryCard} elevation={4} >
                  <Card.Content style={styles.modernCardContent}>
                    <View style={styles.iconCircleCategory}>
                      <MaterialIcons name="label" size={24} color="#056517" />
                    </View>
                    <Text style={styles.categoryTitle}>{t.category}</Text>
                    <Text style={styles.categoryAmount}>₹ {t.amount.toLocaleString()}</Text>
                  </Card.Content>
                </Card>
              ))}
          </View>
        )}
        
        {/* Weekly Summary Card */}
        <Card style={{ margin: 16, borderRadius: 12, elevation: 2 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' }}>Weekly Summary</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Income</Text>
                <Text style={{ fontSize: 16, color: INCOME_COLOR, fontWeight: '500' }}>₹25,400</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: '#e0e0e0' }} />
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Expenses</Text>
                <Text style={{ fontSize: 16, color: EXPENSE_COLOR, fontWeight: '500' }}>₹18,750</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: '#e0e0e0' }} />
              {/* <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#333', marginBottom: 4, fontWeight: 'bold' }}>Net Total</Text>
                <Text style={{ fontSize: 16, color: '#009688', fontWeight: 'bold' }}>₹6,650</Text>
              </View> */}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.fabContainer}>
        <FAB
          style={[styles.fab, { margin: 2,}]}
          icon="plus"
          color="white"
          onPress={() => {
            // Open modal with transaction form
            router.push('/add-transaction');
          }}
        />
      </View>
      
      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#4A90E2' }}
      >
        {snackbarMessage}
      </Snackbar>

      {/* Bill Line Item Modal */}
      <Modal
        visible={billLineItemModalVisible}
        onDismiss={() => {
          setBillLineItemModalVisible(false);
          setBillLineItemDescription('');
          setBillLineItemAmount('');
          setBillLineItemDate(new Date());
          setActiveCategoryModal('');
        }}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.modalCard}>
          <Card.Title 
            title={`Add ${activeCategoryModal.charAt(0).toUpperCase() + activeCategoryModal.slice(1)} Line Item`} 
            titleStyle={{ color: '#4A90E2', fontWeight: 'bold' }}
          />
          <Card.Content>
            <TouchableOpacity 
              onPress={() => setShowBillLineItemDatePicker(true)}
              style={[styles.input, { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}
            >
              <Text>{billLineItemDate.toLocaleDateString('en-GB')}</Text>
              <MaterialIcons name="calendar-today" size={24} color="#4A90E2" />
            </TouchableOpacity>
            {showBillLineItemDatePicker && (
              <DateTimePicker
                value={billLineItemDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowBillLineItemDatePicker(false);
                  if (selectedDate) {
                    setBillLineItemDate(selectedDate);
                  }
                }}
              />
            )}
            <TextInput
              label="Description"
              value={billLineItemDescription}
              onChangeText={setBillLineItemDescription}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <TextInput
              label="Amount"
              value={billLineItemAmount}
              onChangeText={setBillLineItemAmount}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Button
                mode="outlined"
                onPress={() => {
                  setBillLineItemModalVisible(false);
                  setBillLineItemDescription('');
                  setBillLineItemAmount('');
                  setBillLineItemDate(new Date());
                  setActiveCategoryModal('');
                }}
                style={{ flex: 0.48 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  // Validate and save
                  if (!billLineItemDescription.trim() || !billLineItemAmount.trim()) {
                    setSnackbarMessage('Please fill in all fields');
                    setSnackbarVisible(true);
                    return;
                  }
                  
                  const amount = parseFloat(billLineItemAmount);
                  if (isNaN(amount) || amount <= 0) {
                    setSnackbarMessage('Please enter a valid amount');
                    setSnackbarVisible(true);
                    return;
                  }
                  
                  // Update the correct category total based on active category
                  switch(activeCategoryModal) {
                    case 'bills':
                      setBillsTotal((prevTotal: number) => prevTotal + amount);
                      break;
                    case 'transport':
                      setTransportTotal((prevTotal: number) => prevTotal + amount);
                      break;
                    case 'salary':
                      setSalaryTotal((prevTotal: number) => prevTotal + amount);
                      break;
                    case 'utilities':
                      setRentTotal((prevTotal: number) => prevTotal + amount);
                      break;
                    case 'sales':
                      setIncomeTotal((prevTotal: number) => prevTotal + amount);
                      break;
                    default:
                      // Default to bills if no category is set
                      setBillsTotal((prevTotal: number) => prevTotal + amount);
                  }
                  
                  // Here you would save the data to your store or backend
                  console.log('Saving bill line item:', { 
                    date: billLineItemDate,
                    description: billLineItemDescription, 
                    amount 
                  });
                  
                  // Reset and close modal
                  setBillLineItemModalVisible(false);
                  setBillLineItemDescription('');
                  setBillLineItemAmount('');
                  setBillLineItemDate(new Date());
                  
                  setSnackbarMessage('Bill line item added successfully');
                  setSnackbarVisible(true);
                }}
                style={{ flex: 0.48, backgroundColor: '#009688' }}
              >
                Save
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>

      {/* Filter Modal */}
      <RNModal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.filterModalContent}>
            {/* Header with close button */}
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filter Transactions</Text>
              <TouchableOpacity 
                onPress={() => {
                  console.log('Close button pressed');
                  setFilterModalVisible(false);
                }}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            {/* Period selection */}
            <Text style={styles.filterSectionLabel}>Select Period</Text>
            
            <View style={styles.periodButtonsContainer}>
              <TouchableOpacity 
                style={[styles.periodButton, filterPeriod === 'This Week' && styles.activePeriodButton]}
                onPress={() => applyFilter('This Week')}
              >
                <Text style={[styles.periodButtonText, filterPeriod === 'This Week' && styles.activePeriodButtonText]}>This Week</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.periodButton, filterPeriod === 'This Month' && styles.activePeriodButton]}
                onPress={() => applyFilter('This Month')}
              >
                <Text style={[styles.periodButtonText, filterPeriod === 'This Month' && styles.activePeriodButtonText]}>This Month</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.periodButton, filterPeriod === 'Last Month' && styles.activePeriodButton]}
                onPress={() => applyFilter('Last Month')}
              >
                <Text style={[styles.periodButtonText, filterPeriod === 'Last Month' && styles.activePeriodButtonText]}>Last Month</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dividerLine} />
            
            {/* Custom date range */}
            <Text style={styles.filterSectionLabel}>Custom Date Range</Text>
            
            <View style={styles.dateFieldContainer}>
              <Text style={styles.dateFieldLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateField}
                onPress={() => openDatePicker('start')}
              >
                <Text style={styles.dateFieldText}>{filterStartDate.toLocaleDateString()}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#009688" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateFieldContainer}>
              <Text style={styles.dateFieldLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateField}
                onPress={() => openDatePicker('end')}
              >
                <Text style={styles.dateFieldText}>{filterEndDate.toLocaleDateString()}</Text>
                <MaterialIcons name="calendar-today" size={20} color="#009688" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => applyFilter('Custom')}
            >
              <Text style={styles.applyButtonText}>Apply Custom Range</Text>
            </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </RNModal>
      
      {/* Date pickers - unified implementation with platform-specific props */}
      {Platform.OS === 'web' ? (
        // Web implementation - inline pickers
        <>
          {showFilterStartDatePicker && (
            <DateTimePicker
              value={filterStartDate}
              mode="date"
              onChange={handleDateChange}
              style={{ width: 200, height: 40 }}
            />
          )}
          
          {showFilterEndDatePicker && (
            <DateTimePicker
              value={filterEndDate}
              mode="date"
              onChange={handleDateChange}
              style={{ width: 200, height: 40 }}
            />
          )}
        </>
      ) : (
        // Mobile implementation - modal pickers
        <>
          {showFilterStartDatePicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={filterStartDate}
              mode="date"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
          
          {showFilterEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={filterEndDate}
              mode="date"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </>
      )}
      
      {/* Add Transaction Modal */}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
          theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView>
              <Card style={[styles.modalCard, { backgroundColor: '#F5F7FA' }]}>
                <Card.Title 
                  title="Add New Transaction" 
                  titleStyle={{ color: '#4A90E2', fontWeight: 'bold' }}
                  right={(props) => (
                    <IconButton 
                      {...props} 
                      icon="close" 
                      iconColor="#4A90E2"
                      onPress={() => setModalVisible(false)} 
                    />
                  )}
                />
                
                {/* Basic Information Card */}
                <Card style={styles.sectionCard}>
                  <Card.Title title="Basic Information" titleStyle={styles.sectionTitle} />
                  <Card.Content>
                    {/* Transaction Type */}
                    <Text style={styles.inputLabel}>Transaction Type</Text>
                    <SegmentedButtons
                      value={transactionType}
                      onValueChange={(value) => setTransactionType(value as 'expense' | 'income')}
                      buttons={[
                        { value: 'expense', label: 'Expense', style: { backgroundColor: transactionType === 'expense' ? EXPENSE_COLOR : undefined }, labelStyle: { color: transactionType === 'expense' ? 'white' : undefined } },
                        { value: 'income', label: 'Income', style: { backgroundColor: transactionType === 'income' ? INCOME_COLOR : undefined }, labelStyle: { color: transactionType === 'income' ? 'white' : undefined } },
                      ]}
                      style={styles.segmentedButtons}
                    />
                    
                    {/* Description */}
                    <TextInput
                      label="Description"
                      value={description}
                      onChangeText={setDescription}
                      mode="outlined"
                      style={styles.input}
                    />
                  </Card.Content>
                </Card>
                
                {/* Details Card */}
                <Card style={styles.sectionCard}>
                  <Card.Title title="Transaction Details" titleStyle={styles.sectionTitle} />
                  <Card.Content>
                    {/* Amount */}
                    <TextInput
                      label="Amount"
                      value={amount}
                      onChangeText={setAmount}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                    
                    {/* Category */}
                    <TextInput
                      label="Category"
                      value={category}
                      onChangeText={setCategory}
                      mode="outlined"
                      style={styles.input}
                    />
                    
                    {/* Date */}
                    <Text style={styles.inputLabel}>Date</Text>
                    <Button 
                      mode="outlined" 
                      onPress={() => setShowDatePicker(true)}
                      style={styles.dateButton}
                      icon="calendar"
                    >
                      {date.toLocaleDateString()}
                    </Button>
                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) setDate(selectedDate);
                        }}
                      />
                    )}
                  </Card.Content>
                </Card>
                
                <Card.Content>
                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <Button 
                      mode="outlined" 
                      onPress={() => setModalVisible(false)}
                      style={[styles.actionButton, styles.cancelButton]}
                    >
                      Cancel
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={handleAddTransaction}
                      style={[styles.actionButton, { backgroundColor: '#4A90E2' }]}
                    >
                      Add Transaction
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#009688',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // New filter modal styles
  filterModalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  filterSectionLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  periodButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  periodButton: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  activePeriodButton: {
    backgroundColor: '#009688',
  },
  periodButtonText: {
    color: '#333',
    fontSize: 14,
  },
  activePeriodButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  dateFieldContainer: {
    marginBottom: 15,
  },
  dateFieldLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateFieldText: {
    color: '#333',
    fontSize: 15,
  },
  applyButton: {
    backgroundColor: '#009688',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Keep existing styles
  filterButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  filterButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  datePickerWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    marginBottom: 4,
    color: '#555',
    fontSize: 14,
  },
  customDateButton: {
    marginBottom: 8,
  },
  applyCustomButton: {
    marginTop: 16,
  },
  // These styles are intentionally removed to fix duplicate properties
  // The existing modalContainer and modalCard styles are used instead
  centeredCardContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  centeredCard: {
    width: '80%',
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    margin: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#009688',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  filterTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  datePickerButton: {
    borderColor: '#009688',
    borderRadius: 8,
  },
  chartContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: 'white',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  chartAlignmentFix: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  chartInstructions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  chartButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  chartButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    flex: 0.48,
    alignItems: 'center',
  },
  chartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  legendItemWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  totalContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  totalContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  totalTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009688',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    width: '48%',
    backgroundColor: 'white',
  },
  modernCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  iconCircleCategory: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsText: {
    color: '#4A90E2',
    marginRight: 4,
    fontSize: 14,
  },
  currencySymbolSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 2,
  },
  categoryAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewReportButton: {
    alignItems: 'center',
    marginBottom: 8,
  },
  viewReportText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  fab: {
    backgroundColor: '#4A90E2', // Blue color from the Orders screen memory
    borderRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 100,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    zIndex: 100,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 0,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalCard: {
    borderRadius: 16,
    elevation: 0,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  cancelButton: {
    borderColor: '#ccc',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  sectionCard: {
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
