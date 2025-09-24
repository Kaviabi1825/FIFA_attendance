import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, Appbar } from 'react-native-paper';
import BottomNavigation from '../../components/BottomNavigation';
import { useRouter } from 'expo-router';

export default function UnitCreate() {
  const router = useRouter();
  const [unitNo, setUnitNo] = useState('');

  const handleSave = () => {
    if (!unitNo) {
      alert('Please provide Unit No.');
      return;
    }

    // Save logic (API call or state update)
    alert(`Unit ${unitNo} added!`);
    router.back(); // go back to Units page
  };

  return (
    <View style={styles.page}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Create Unit" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Unit No.</Text>
        <TextInput
          mode="outlined"
          placeholder="Enter Unit Number"
          value={unitNo}
          onChangeText={setUnitNo}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Save
        </Button>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    paddingBottom: 100,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#009688',
  },
});
