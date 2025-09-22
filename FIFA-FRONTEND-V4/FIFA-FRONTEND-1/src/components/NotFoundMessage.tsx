import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';

type NotFoundMessageProps = {
  message: string;
  buttonText: string;
  onPress: () => void;
};

export default function NotFoundMessage({ message, buttonText, onPress }: NotFoundMessageProps) {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <TouchableRipple 
        style={[styles.button, { backgroundColor: '#009688' }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
