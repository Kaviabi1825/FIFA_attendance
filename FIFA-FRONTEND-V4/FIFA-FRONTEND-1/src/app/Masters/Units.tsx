import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, TouchableOpacity } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import BottomNavigation from '../../components/BottomNavigation';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');
const UNIT_HEIGHT = height * 0.45;
const FOCUS_OFFSET = -UNIT_HEIGHT * 0.15;

const originalUnits = [
  { id: '1', name: 'Unit 1', image: require('../../../assets/images/Ord1.jpg') },
  { id: '2', name: 'Unit 2', image: require('../../../assets/images/Img2.webp') },
  { id: '3', name: 'Unit 3', image: require('../../../assets/images/Img3.jpg') },
];

// Create looped array with Unit 3 on top
const units = [
  originalUnits[2], // Unit 3
  ...originalUnits, // Unit 1, Unit 2, Unit 3
];

export default function Units() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<Animated.FlatList>(null);
  const [centerIndex, setCenterIndex] = useState(1); // index of Unit 1 initially
  const router = useRouter();

  // Scroll to initial center item (Unit 1)
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: UNIT_HEIGHT, // second item in array
        animated: false,
      });
    }, 0);
  }, []);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / UNIT_HEIGHT);
    setCenterIndex(index);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Units" color="white" />
      </Appbar.Header>
      <Animated.FlatList
        ref={flatListRef}
        data={units}
        keyExtractor={(item, idx) => item.id + '-' + idx}
        showsVerticalScrollIndicator={false}
        snapToInterval={UNIT_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        contentContainerStyle={{  paddingTop: height * 0.33 + FOCUS_OFFSET, paddingBottom: height * 0.15}}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * UNIT_HEIGHT,
            index * UNIT_HEIGHT,
            (index + 1) * UNIT_HEIGHT,
          ];
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.75, 1.1, 0.75],
            extrapolate: 'clamp',
          });
          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          const isCenter = index === centerIndex;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => isCenter && router.push(`/Masters/masters`)}
            >
              <Animated.View style={[styles.unitCard, { transform: [{ scale }], opacity }]}>
                <Image source={item.image} style={styles.unitImage} />
                <Text style={styles.unitLabel}>{item.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/Masters/UnitCreate')} />

      {/* <BottomNavigation /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', position: 'relative' },
  unitCard: {
    height: UNIT_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitImage: { width: '60%', height: '60%', borderRadius: 12 },
  unitLabel: { marginTop: 12, fontWeight: '600', fontSize: 18 },
  header: { backgroundColor: '#009688' },
  fab: {
    position: 'absolute',
    right: 26,
    bottom: 84, // lift above bottom navigation
    backgroundColor: '#009687e9',
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 6,
  },
});
