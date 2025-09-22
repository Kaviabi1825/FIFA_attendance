import React, { useState } from 'react';
import { Platform, View, Button, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
}

const formatISODate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CrossPlatformDatePicker: React.FC<Props> = ({ label = 'Select Date', value, onChange, disabled }) => {
  const [show, setShow] = useState(false);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {/* @ts-ignore: Using native HTML input for web */}
        <input
          type="date"
          value={formatISODate(value)}
          onChange={(e: any) => {
            const newDate = new Date(e.target.value + 'T00:00:00');
            if (!isNaN(newDate.getTime())) onChange(newDate);
          }}
          disabled={disabled}
          style={styles.htmlInput as any}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Button title={label} onPress={() => setShow(true)} disabled={disabled} />
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
      <Text style={styles.selectedText}>Selected: {value.toDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { marginBottom: 4, fontWeight: '500' },
  selectedText: { marginTop: 6 },
  htmlInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});

export default CrossPlatformDatePicker;
