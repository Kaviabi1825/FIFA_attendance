import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

export default function General() {
  const router = useRouter();
  const [unitNo, setUnitNo] = useState('');
  const [unitName, setUnitName] = useState('');
  const [buildingNo, setBuildingNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [district, setDistrict] = useState('');
  const [streetCode, setStreetCode] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [sqFeet, setSqFeet] = useState('');
  const [workers, setWorkers] = useState('');
  const [location, setLocation] = useState<string | null>(null);

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      },
      (err) => {
        setLocation('Unable to fetch');
      }
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="General" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput label="Unit No." value={unitNo} onChangeText={setUnitNo} style={styles.input} />
        <TextInput label="Unit Name" value={unitName} onChangeText={setUnitName} style={styles.input} />
        <TextInput label="Building No." value={buildingNo} onChangeText={setBuildingNo} style={styles.input} />
        <TextInput label="Street Name" value={streetName} onChangeText={setStreetName} style={styles.input} />
        <TextInput label="District" value={district} onChangeText={setDistrict} style={styles.input} />
        <TextInput label="Street Code" value={streetCode} onChangeText={setStreetCode} style={styles.input} />
        <TextInput label="Business Type" value={businessType} onChangeText={setBusinessType} style={styles.input} />

        <Text style={styles.sectionTitle}>Unit Capacity</Text>
        <TextInput label="Sq Feet" value={sqFeet} onChangeText={setSqFeet} style={styles.input} keyboardType="numeric" />
        <TextInput label="Workers Count" value={workers} onChangeText={setWorkers} style={styles.input} keyboardType="numeric" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Button mode="contained" onPress={fetchLocation}>Location</Button>
          <Text>{location || 'No location'}</Text>
        </View>

        <Button mode="contained" style={{ marginTop: 20 }} onPress={() => {
          // Basic validation
          const missing = [];
          if (!unitNo) missing.push('Unit No.');
          if (!unitName) missing.push('Unit Name');
          if (missing.length) {
            alert('Missing: ' + missing.join(', '));
            return;
          }
          alert('Saved (demo)');
        }}>Save</Button>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 },
  input: { marginBottom: 12 },
  sectionTitle: { fontWeight: '600', color: '#009688', marginTop: 12, marginBottom: 6 }
});
