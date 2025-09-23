import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

export default function MaterialCreate() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [errors, setErrors] = useState<any>({});

  function validate() {
    const e: any = {};
    if (!name) e.name = 'Name required';
    if (!brand) e.brand = 'Brand required';
    if (!style) e.style = 'Style required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSave() {
    if (!validate()) return;
    // TODO: persist to backend
    router.back();
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Create Material" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput label="Material Name" value={name} onChangeText={setName} />
        <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

        <TextInput label="Brand" value={brand} onChangeText={setBrand} />
        <HelperText type="error" visible={!!errors.brand}>{errors.brand}</HelperText>

        <TextInput label="Style" value={style} onChangeText={setStyle} />
        <HelperText type="error" visible={!!errors.style}>{errors.style}</HelperText>

        <Button mode="contained" onPress={onSave} style={{ marginTop: 12 }}>Save</Button>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 }
});
