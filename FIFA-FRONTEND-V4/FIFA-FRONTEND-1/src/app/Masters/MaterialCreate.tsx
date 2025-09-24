import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Appbar, TextInput, Button, HelperText, Card, TouchableRipple } from 'react-native-paper';
import { useRouter } from 'expo-router';
// import { createMaterial } from '../../../src/app/mastersApi';
// BottomNavigation removed to avoid duplicate footer inside Masters

export default function MaterialCreate() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [imageKey, setImageKey] = useState<string>('Tshirt');
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sampleImages: Record<string, any> = {
    Tshirt: require('../../../assets/images/Tshirt.png'),
    Shirts: require('../../../assets/images/Shirts.png'),
    Trunks: require('../../../assets/images/Trunks.png')
  };

  function validate() {
    const e: any = {};
    if (!name) e.name = 'Name required';
    if (!brand) e.brand = 'Brand required';
    if (!style) e.style = 'Style required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // function onSave() {
  //   if (!validate()) return;
  //   setLoading(true);
  //   setSaveError(null);
  //   createMaterial({ name, brand, style, image: imageKey })
  //     .then((res) => {
  //       const ok = (res as any)?.createMaterial?.success;
  //       if (!ok) {
  //         setSaveError((res as any)?.createMaterial?.message || 'Failed to save');
  //       } else {
  //         router.back();
  //       }
  //     })
  //     .catch((err) => setSaveError(err?.message || String(err)))
  //     .finally(() => setLoading(false));
  // }

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

        <Card style={{ marginTop: 12, padding: 8 }}>
          <Text style={{ marginBottom: 8 }}>Select Image</Text>
          <View style={{ flexDirection: 'row' }}>
            {Object.keys(sampleImages).map((k) => (
              <TouchableRipple key={k} onPress={() => setImageKey(k)} style={{ marginRight: 8, padding: 4, borderRadius: 6, borderWidth: imageKey === k ? 2 : 0, borderColor: '#009688' }}>
                <Card.Cover source={sampleImages[k]} style={{ width: 60, height: 60 }} />
              </TouchableRipple>
            ))}
          </View>
        </Card>

  <Button mode="contained" onPress={() => console.log('Save pressed')} style={{ marginTop: 12, backgroundColor: '#009688' }} labelStyle={{ color: 'white' }} loading={loading} disabled={loading}>Save</Button>
    {saveError ? <Text style={{ color: 'red', marginTop: 8 }}>{saveError}</Text> : null}
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 }
});
