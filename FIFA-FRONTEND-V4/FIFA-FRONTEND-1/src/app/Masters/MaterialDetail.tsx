import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { Appbar, Card, List } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

const sampleMaterials = [
  { brand: 'Brand A', style: 'ST-100', name: 'Cotton 180G', image: require('../../../assets/images/Tshirt.png') },
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
          <Card key={idx} style={{ marginBottom: 12}}>
            <Card.Title title={`${m.brand} - ${m.style}`} subtitle={m.name} />
            <Card.Cover source={m.image} />
            <List.Accordion title="Show more">
              <List.Item title="S - Red - Pack 10" />
              <List.Item title="M - Blue - Pack 8" />
            </List.Accordion>
          </Card>
        ))}
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
