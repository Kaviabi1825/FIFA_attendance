import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function General() {
  const router = useRouter();
  const [unitNo] = useState('MZ-100');
  const [unitName] = useState('Murali Tex Co.');
  const [buildingNo] = useState('12A');
  const [streetName] = useState('Industrial Road');
  const [district] = useState('Chennai');
  const [streetCode] = useState('600001');
  const [businessType, setBusinessType] = useState('Garments');
  const [sqFeet] = useState('12000');
  const [workers] = useState('120');
  const [location, setLocation] = useState<string | null>(null);
  const [editedType, setEditedType] = useState<string | null>(null);

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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Read-only box with unit info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoRow}><Text style={{fontWeight:'600'}}>Unit No.</Text>  MZ-100</Text>
          <Text style={styles.infoRow}><Text style={{fontWeight:'600'}}>Unit Name</Text>  Murali Tex Co.</Text>
          <Text style={styles.infoRow}><Text style={{fontWeight:'600'}}>Building No.</Text>  12A</Text>
          <Text style={styles.infoRow}><Text style={{fontWeight:'600'}}>Street Name</Text>  Industrial Road</Text>
          <Text style={styles.infoRow}><Text style={{fontWeight:'600'}}>District</Text>  Chennai</Text>
        </View>


        <View style={styles.capacityBox}>
          <Text style={{fontWeight:'700'}}>Unit Capacity</Text>
          <Text>Sq Feet : 12000</Text>
        </View>

        {/* Business type dropdown - editable */}
        <View style={{ marginTop: 12 }}>
          <Text style={{fontWeight:'600'}}>Business Type</Text>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <TouchableOpacity onPress={() => setEditedType('Job Work')} style={{ padding: 10, backgroundColor: editedType === 'Job Work' ? '#B2DFDB' : '#fff', borderRadius:6, marginRight: 8 }}>
              <Text>Job Work</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditedType('Garments')} style={{ padding: 10, backgroundColor: editedType === 'Garments' ? '#B2DFDB' : '#fff', borderRadius:6 }}>
              <Text>Garments</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          mode="contained"
          onPress={() => { alert('Saved (demo)'); setEditedType(null); }}
          disabled={!editedType}
          style={{ marginTop: 20, backgroundColor: editedType ? '#009688' : '#99c6c2ff' }}
          labelStyle={{ color: 'white' }}
        >
          Save
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 },
  input: { marginBottom: 12 },
  sectionTitle: { fontWeight: '600', color: '#45c7baff', marginTop: 12, marginBottom: 6 }
  , infoBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, elevation: 1 },
  infoRow: { paddingVertical: 6 },
  capacityBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' }
});
