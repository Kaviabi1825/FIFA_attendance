import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from 'react-native-paper';

type NavigationPath = '/' | '/orders' | '/profile';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname() as NavigationPath;
  const theme = useTheme();
  const primaryColor = theme.colors.primary;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={[styles.navItem, pathname === '/' && styles.activeNavItem]}
        onPress={() => router.push('/')}
      >
        <Ionicons 
          name={pathname === '/' ? "home" : "home-outline"} 
          size={24} 
          color={pathname === '/' ? primaryColor : "#9E9E9E"} 
        />
        <Text style={[styles.navText, pathname === '/' && { color: primaryColor }]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, pathname === '/orders' && styles.activeNavItem]}
        onPress={() => router.push('/orders')}
      >
        <Ionicons 
          name={pathname === '/orders' ? "document-text" : "document-text-outline"} 
          size={24} 
          color={pathname === '/orders' ? primaryColor : "#9E9E9E"} 
        />
        <Text style={[styles.navText, pathname === '/orders' && { color: primaryColor }]}>Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.navItem, pathname === '/profile' && styles.activeNavItem]}
        onPress={() => router.push('/profile' as any)}
      >
        <Ionicons 
          name={pathname === '/profile' ? "person" : "person-outline"} 
          size={24} 
          color={pathname === '/profile' ? primaryColor : "#9E9E9E"} 
        />
        <Text style={[styles.navText, pathname === '/profile' && { color: primaryColor }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeNavItem: {
    borderTopColor: '#009688',
    borderTopWidth: 2,
  },
  navText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 3,
  },
});
