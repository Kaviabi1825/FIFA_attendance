import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Text, Card, List, Divider, Button, Surface, Avatar, Chip, DataTable, FAB, TextInput, Portal, Modal, IconButton, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionsStore } from '../contexts/transactions';
import BottomNavigation from '../components/BottomNavigation';

export default function ReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { reportType, amount } = params;

  // Use Zustand store for transactions data
  const { transactions, addTransaction, initializeStore } = useTransactionsStore();
  
  // Initialize the store with persisted data
  useEffect(() => {
    console.log('Initializing store');
    initializeStore();
  }, [initializeStore]);
  
  // Debugging: Log when component mounts and what data is in the store
  useEffect(() => {
    console.log('ReportScreen mounted');
    console.log('Store transactions:', transactions);
  }, []);
  
  // Debugging: Log when transactions change
  useEffect(() => {
    console.log('Transactions updated:', transactions.length);
  }, [transactions]);
  
  // Convert store transactions to the format used in the UI
  const uiTransactions = transactions.map(t => ({
    id: t.id,
    date: t.date.toISOString().split('T')[0],
    category: t.category,
    description: t.description,
    amount: '₹' + t.amount.toLocaleString('en-IN'),
    icon: getIconForCategory(t.category)
  }));
  
  // Function to get appropriate icon for each category
  function getIconForCategory(category: string): string {
    switch (category.toLowerCase()) {
      case 'bills': return 'receipt';
      case 'transport': return 'local-gas-station';
      case 'utilities': return 'home-repair-service';
      case 'salary': return 'account-balance-wallet';
      default: return 'receipt';
    }
  }
  
  // Initialize with sample data if store is empty
  // We need to wait for the store to be initialized before adding sample data
  useEffect(() => {
    // Only try to add sample data once
    if (transactions.length === 0) {
      // Add sample data to store
      const sampleData = [
        { type: 'expense' as const, category: 'Bills', amount: 12500, description: 'Monthly bill payment', date: new Date('2023-07-01') },
        { type: 'expense' as const, category: 'Bills', amount: 3200, description: 'Electricity bill', date: new Date('2023-07-03') },
        { type: 'expense' as const, category: 'Bills', amount: 1800, description: 'Internet bill', date: new Date('2023-07-05') },
        { type: 'expense' as const, category: 'Utilities', amount: 950, description: 'Water bill', date: new Date('2023-07-10') },
        { type: 'expense' as const, category: 'Utilities', amount: 2500, description: 'Maintenance charges', date: new Date('2023-07-15') },
        { type: 'expense' as const, category: 'Utilities', amount: 1100, description: 'Gas bill', date: new Date('2023-07-20') },
        { type: 'expense' as const, category: 'Transport', amount: 2350, description: 'Fuel expenses', date: new Date('2023-07-25') },
        { type: 'expense' as const, category: 'Transport', amount: 5000, description: 'Vehicle maintenance', date: new Date('2023-07-27') },
      ];
      
      // Add each sample transaction to the store
      sampleData.forEach(transaction => {
        addTransaction(transaction);
      });
    }
  }, [transactions.length]); // Run when transactions length changes

  // State for add transaction modal
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    typeof reportType === 'string' && reportType.toLowerCase() === 'income' ? 'income' : 'expense'
  );
  const [description, setDescription] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Set category based on report type when component mounts
  useEffect(() => {
    if (typeof reportType === 'string') {
      const capitalizedCategory = reportType.charAt(0).toUpperCase() + reportType.slice(1);
      setCategory(capitalizedCategory);
    }
  }, [reportType]);

  // Color constants for consistent styling
  const EXPENSE_COLOR = '#FF6B8A'; // Modern pink for expenses
  const INCOME_COLOR = '#5B8EF4';  // Modern blue for income

  // Filter data based on category if needed
  // Ensure case-insensitive matching for better reliability
  const filteredData = typeof reportType === 'string' ? 
    uiTransactions.filter((item: { category: string }) => {
      // Convert both to lowercase for comparison
      const itemCategoryLower = item.category.toLowerCase();
      const reportTypeLower = reportType.toLowerCase();
      
      // Special handling for specific report types
      if (reportTypeLower === 'bills') return itemCategoryLower === 'bills';
      if (reportTypeLower === 'transport') return itemCategoryLower === 'transport';
      if (reportTypeLower === 'utilities') return itemCategoryLower === 'utilities';
      if (reportTypeLower === 'salary') return itemCategoryLower === 'salary';
      
      // For other cases, return all transactions
      return true;
    }) : uiTransactions;

  // Calculate total amount
  const totalAmount = filteredData.reduce((sum: number, item: { amount: string }) => {
    const numericAmount = parseFloat(item.amount.replace('₹', '').replace(/,/g, ''));
    return sum + numericAmount;
  }, 0);

  const formattedTotal = '₹' + totalAmount.toLocaleString('en-IN');

  // Pie chart data for expense categories
  const pieChartData = reportType === 'Expenses' ? [
    { name: 'Bills', amount: 17500, color: '#FFD1DC', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Transport', amount: 7350, color: '#EAAFB4', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Utilities', amount: 4550, color: '#B0E0E6', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ] : null;

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    // Create new transaction object
    // Ensure category is properly capitalized to match existing data
    let transactionCategory = category;
    if (!category && typeof reportType === 'string') {
      // Capitalize the first letter of reportType to match existing data
      transactionCategory = reportType.charAt(0).toUpperCase() + reportType.slice(1);
    } else if (!category) {
      transactionCategory = 'Transaction';
    }
    
    // Add new transaction to store
    // Convert the amount to a number as expected by the store
    const numericAmount = parseFloat(transactionAmount) || 0;
    
    addTransaction({
      type: transactionType,
      category: transactionCategory,
      amount: numericAmount,
      description,
      date: new Date(date),
    });
    
    // Close modal and reset form
    setModalVisible(false);
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setTransactionAmount('');
    // Reset category to reportType value
    if (typeof reportType === 'string') {
      const capitalizedCategory = reportType.charAt(0).toUpperCase() + reportType.slice(1);
      setCategory(capitalizedCategory);
    } else {
      setCategory('');
    }
    setDate(new Date());
  };

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009688" barStyle="light-content" />
      {/* Header */}
      <Appbar.Header style={styles.header} elevated>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content 
          title={typeof reportType === 'string' ? reportType : 'Report'} 
          subtitle={typeof amount === 'string' ? amount : formattedTotal} 
          titleStyle={styles.headerTitle} 
        />
        <Appbar.Action icon="filter" color="white" onPress={() => {}} />
        <Appbar.Action icon="calendar-month" color="white" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <Text variant="titleLarge" style={styles.summaryTitle}>{reportType || 'Report'} Summary</Text>
              <Chip icon="calendar" mode="outlined" style={styles.dateChip}>July 2023</Chip>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.summaryDetails} key={uiTransactions.length}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>{amount || formattedTotal}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Entries</Text>
                <Text style={styles.summaryValue}>{filteredData.length}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average</Text>
                <Text style={styles.summaryValue}>₹{Math.round(totalAmount/filteredData.length).toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Pie Chart for Expenses */}
        {reportType === 'Expenses' && pieChartData && (
          <Card style={styles.chartCard}>
            <Card.Title title="Expense Breakdown" />
            <Card.Content style={styles.chartContent}>
              <PieChart
                data={pieChartData}
                width={Dimensions.get('window').width - 60}
                height={200}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </Card.Content>
          </Card>
        )}

        {/* Transactions List */}
        <Card style={styles.transactionsCard}>
          <Card.Title 
            title="Transactions" 
            left={(props) => <Avatar.Icon {...props} icon="receipt" style={{backgroundColor: '#009688'}} />}
          />
          <Divider />
          <Card.Content style={styles.transactionsContent}>
            <DataTable key={uiTransactions.length}>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Description</DataTable.Title>
                <DataTable.Title numeric>Amount</DataTable.Title>
              </DataTable.Header>

              {filteredData.map((item: { id: string; date: string; icon: string; description: string; amount: string }) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.date}</DataTable.Cell>
                  <DataTable.Cell>
                    <View style={styles.descriptionCell}>
                      <MaterialIcons 
                        name={item.icon as keyof typeof MaterialIcons.glyphMap} 
                        size={16} 
                        color="#666" 
                        style={styles.itemIcon} 
                      />
                      <Text>{item.description}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={[styles.amountText, reportType === 'Income' ? styles.incomeText : styles.expenseText]}>
                      {item.amount}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* Export Options */}
        <Surface style={styles.exportContainer} elevation={1}>
          <Button 
            mode="contained" 
            icon="file-pdf-box" 
            style={styles.exportButton}
            buttonColor="#009688"
            onPress={() => {}}
          >
            Export PDF
          </Button>
          <Button 
            mode="contained" 
            icon="share-variant" 
            style={styles.exportButton}
            buttonColor="#4A90E2"
            onPress={() => {}}
          >
            Share
          </Button>
        </Surface>
      </ScrollView>

      {/* Add Button */}

      
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
                  title={`Add New ${typeof reportType === 'string' ? reportType : 'Transaction'}`}
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
                      value={transactionAmount}
                      onChangeText={setTransactionAmount}
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
                      editable={typeof reportType !== 'string' || (reportType !== 'bills' && reportType !== 'transport' && reportType !== 'utilities')}
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
                        onChange={onDateChange}
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
    backgroundColor: '#009688',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  dateChip: {
    backgroundColor: '#E0F2F1',
  },
  divider: {
    marginVertical: 12,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  chartContent: {
    alignItems: 'center',
  },
  transactionsCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  transactionsContent: {
    paddingHorizontal: 0,
  },
  descriptionCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 8,
  },
  amountText: {
    fontWeight: 'bold',
  },
  expenseText: {
    color: '#E75480',
  },
  incomeText: {
    color: '#4A90E2',
  },
  exportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  exportButton: {
    flex: 0.48,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '90%',
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 70, // Position above the bottom navigation
    backgroundColor: '#4A90E2', // Blue color from the Orders screen memory
  },
});
