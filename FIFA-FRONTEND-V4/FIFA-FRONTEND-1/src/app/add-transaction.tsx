import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Appbar,
  Card,
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  Snackbar,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionsStore } from '../contexts/transactions';

const EXPENSE_COLOR = '#BF1029';
const INCOME_COLOR = '#056517';

export default function AddTransactionScreen() {
  const router = useRouter();

  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSave = () => {
    // Validate mandatory fields
    if (!category.trim()) {
      setSnackbarMessage('Category is required');
      setSnackbarVisible(true);
      return;
    }

    
    try {
      // Persist the new transaction in the zustand store
      useTransactionsStore.getState().addTransaction({
        type: transactionType,
        category: category.trim(),
        amount: 0,
        description: '',
        date: new Date(date), // Ensure we have a fresh Date object
      });

      // Show success message and navigate back after a short delay
      setSnackbarMessage('Transaction saved successfully!');
      setSnackbarVisible(true);
      
      // Navigate back to previous screen 
      // after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Error saving transaction:', error);
      setSnackbarMessage('Failed to save transaction. Please try again.');
      setSnackbarVisible(true);
    }
  };

  const onDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#009688' }} elevated>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Add Transaction" titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Basic Information */}
        <Card style={styles.sectionCard}>
          {/* <Card.Title title="Basic Information" titleStyle={styles.sectionTitle} /> */}
          <Card.Content>
            {/* Transaction Type */}
            <Text style={styles.inputLabel}>Transaction Type</Text>
            <SegmentedButtons
              value={transactionType}
              onValueChange={(value) => setTransactionType(value as 'expense' | 'income')}
              buttons={[
                {
                  value: 'expense',
                  label: 'Expense',
                  style: {
                    backgroundColor: transactionType === 'expense' ? EXPENSE_COLOR : undefined,
                  },
                  labelStyle: {
                    color: transactionType === 'expense' ? 'white' : undefined,
                  },
                },
                {
                  value: 'income',
                  label: 'Income',
                  style: {
                    backgroundColor: transactionType === 'income' ? INCOME_COLOR : undefined,
                  },
                  labelStyle: {
                    color: transactionType === 'income' ? 'white' : undefined,
                  },
                },
              ]}
              style={styles.segmented}
            />

          </Card.Content>
        </Card>

        {/* Details */}
        <Card style={styles.sectionCard}>
          <Card.Title title={`Add ${transactionType === 'expense' ? 'Expense' : 'Income'}`} titleStyle={styles.sectionTitle} />
          <Card.Content>


            {/* Category */}
            <TextInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              mode="outlined"
              style={styles.input}
            />

            {/* Date
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
              <DateTimePicker value={date} onChange={onDateChange} mode="date" display="default" />
            )} */}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.footerButton}
          textColor="#009688"
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.footerButton}
          buttonColor="#009688"
        >
          Save
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          if (snackbarMessage === 'Transaction saved successfully!') {
            // Return to the previous screen once the snackbar disappears
            router.back();
          }
        }}
        duration={1500}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionCard: { marginBottom: 16, borderRadius: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 8 },
  input: { marginBottom: 16 },
  dateButton: { marginBottom: 16 },
  segmented: { marginBottom: 16 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  footerButton: { flex: 1, marginHorizontal: 4 },
});
