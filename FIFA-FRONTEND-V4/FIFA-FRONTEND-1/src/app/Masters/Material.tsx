import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {items.map((k) => (
            <TouchableOpacity key={k} style={styles.cardWrap}
              onPress={() => router.push({ pathname: `/Masters/MaterialDetail`, params: { name: k } } as any)}>
              <Card style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Card.Cover source={images[k]} />
                <Card.Content>
                  <Text style={styles.cardLabel}>{k}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrap: { width: '48%', marginBottom: 12 },
  cardLabel: { marginTop: 8, fontWeight: '600' },
});
