import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../components/BottomNavigation';

// import assets (static imports help TypeScript and Metro resolve assets)
import generalIcon from '../../../assets/images/general_icon.png';
import materialIcon from '../../../assets/images/material_icon.png';
import machineIcon from '../../../assets/images/machine_icon.png';
import tailorIcon from '../../../assets/images/tailor_icon.png';

export default function MastersScreen() {
  const router = useRouter();

  const navTo = (path: any) => {
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Masters Data" color="white" />
      </Appbar.Header>

      <View style={styles.iconRowContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconItem} onPress={() => navTo('/Masters/General')}>
            <Image source={generalIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>General</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconItem} onPress={() => navTo('/Masters/Material')}>
            <Image source={materialIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>Material</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconItem} onPress={() => navTo('/Masters/Machine')}>
            <Image source={machineIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>Machine</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconItem} onPress={() => navTo('/Masters/Tailor')}>
            <Image source={tailorIcon} style={styles.iconImage} />
            <Text style={styles.iconLabel}>Tailor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Future content or quick links could be placed here */}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#009688' },
  iconRowContainer: { padding: 20 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  iconItem: { alignItems: 'center' },
  iconImage: { width: 34, height: 34 },
  iconLabel: { fontSize:14 , marginTop: 8, color: '#333', fontWeight: '600' },
  content: { padding: 15 },
});
