import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { Appbar, Card, List, FAB } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const sampleMaterials = [
  { brand: 'Brand A', style: 'ST-100', name: 'Cotton 180G', image: require('../../../assets/images/Tshirt.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
  { brand: 'Brand B', style: 'ST-200', name: 'Poly 150G', image: require('../../../assets/images/Shirts.png') },
];

export default function MaterialDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = (params as any).name || 'Material';

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title={name} color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {sampleMaterials.map((m, idx) => (
          <Card key={idx} style={[styles.card, { marginBottom: 12 }] }>
            <View style={styles.row}>
              <View style={styles.cardTextWrap}>
                <Text style={{fontWeight:'700'}}>{m.brand}</Text>
                <Text>{m.style}</Text>
                <Text style={{color:'#666'}}>{m.name}</Text>
              </View>
              <Image source={m.image} style={styles.smallImage} />
            </View>

            <List.Accordion title="Show more">
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Size :</Text>
                <Text style={styles.specValue}>S   L</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Color :</Text>
                <Text style={styles.specValue}>Red   Yellow</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Pack :</Text>
                <Text style={styles.specValue}>10   20</Text>
              </View>
            </List.Accordion>
          </Card>
        ))}
      </ScrollView>

  <FAB icon="plus" style={styles.fab} onPress={() => router.push({ pathname: '/Masters/MaterialCreate' } as any)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 }
  ,
  card: { borderRadius: 8, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  cardTextWrap: { flex: 1, paddingRight: 8 },
  smallImage: { width: 80, height: 80, borderRadius: 6 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6 },
  specLabel: { fontWeight: '600' },
  specValue: { color: '#333' },
  fab: { position: 'absolute', right: 16, bottom: 64, backgroundColor: '#009687e9', borderRadius: 50, width:56, height:56, alignItems:'center', justifyContent:'center' }
});
