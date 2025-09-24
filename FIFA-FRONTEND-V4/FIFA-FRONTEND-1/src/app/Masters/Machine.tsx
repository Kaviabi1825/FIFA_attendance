import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, Modal } from 'react-native';
import { Card, Button, TextInput, List } from 'react-native-paper';

export default function Machine({ onAddPress }: { onAddPress?: () => void }) {
  const [machines, setMachines] = useState<any[]>([
    { id: 1, name: 'Juki DDL-8700', model: 'DDL-8700', qty: 5, year: 2018, image: require('../../../assets/images/Img1.jpg') },
    { id: 2, name: 'Brother Overlock', model: '4234D', qty: 3, year: 2020, image: require('../../../assets/images/Img2.webp') },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', model: '', qty: '', year: '' });

  function addMachine() {
    const id = machines.length + 1;
    setMachines([...machines, { id, name: form.name, model: form.model, qty: Number(form.qty), year: Number(form.year), image: require('../../../assets/images/Img3.jpg') }]);
    setShowAdd(false);
    setForm({ name: '', model: '', qty: '', year: '' });
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {machines.map((m) => (
          <Card key={m.id} style={styles.card}>
            <View style={styles.cardRow}>
              <Image source={m.image} style={styles.thumb} />
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <Text style={{ fontWeight: '700' }}>{m.name}</Text>
                <Text style={{ color: '#666' }}>{m.model}</Text>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <Button onPress={() => {}}>Edit</Button>
                <List.Accordion title="More" style={{ width: 160 }}>
                  <List.Item title={`Model: ${m.model}`} />
                  <List.Item title={`Quantity: ${m.qty}`} />
                  <List.Item title={`Year: ${m.year}`} />
                </List.Accordion>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>Add Machine</Text>
            <TextInput label="Name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
            <TextInput label="Model" value={form.model} onChangeText={(v) => setForm({ ...form, model: v })} />
            <TextInput label="Quantity" value={form.qty} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, qty: v })} />
            <TextInput label="Year" value={form.year} keyboardType="numeric" onChangeText={(v) => setForm({ ...form, year: v })} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Button onPress={() => setShowAdd(false)}>Cancel</Button>
              <Button mode="contained" onPress={addMachine} style={{ marginLeft: 8 }}>Save</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 12 },
  card: { marginBottom: 12, padding: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 60, height: 60, borderRadius: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 12, borderRadius: 8 },
});
