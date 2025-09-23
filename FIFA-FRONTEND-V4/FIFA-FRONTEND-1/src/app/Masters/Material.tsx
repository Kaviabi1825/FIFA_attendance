import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { Appbar, Card, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const images: Record<string, any> = {
  'T-Shirt': require('../../../assets/images/Ord1.jpg'),
  Tracks: require('../../../assets/images/Img2.webp'),
  Trunks: require('../../../assets/images/Img3.jpg'),
  Vest: require('../../../assets/images/Img4.jpg'),
  Shirts: require('../../../assets/images/Img5.jpg'),
  'Jeans Pants': require('../../../assets/images/Img1.jpg'),
};

export default function Material() {
  const router = useRouter();
  const items = Object.keys(images);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Material" color="white" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {items.map((k) => (
            <TouchableOpacity key={k} style={styles.cardWrap} onPress={() => router.push({ pathname: `/Masters/MaterialDetail`, params: { name: k } } as any)}>
              <Card>
                <Card.Cover style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} source={images[k]} />
                <Card.Content>
                  <Text style={styles.cardLabel}>{k}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

  <FAB icon="plus" style={styles.fab} onPress={() => router.push({ pathname: '/Masters/MaterialCreate' } as any)} />
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  content: { padding: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 12 },
  cardLabel: { marginTop: 8, fontWeight: '600' },
  fab: { position: 'absolute', right: 16, bottom: 80, backgroundColor: '#009688', borderRadius : '50%' }
});
