import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TextInput as PaperTextInput } from 'react-native-paper';

// Utility to format a JS Date to "HH:mm" string (24-hour format)
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Utility to parse an existing HH:mm string to Date (today)
const parseTime = (value?: string | null): Date => {
  const now = new Date();
  if (!value) return now;
  const [hours, minutes] = value.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return now;
  }
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export type CrossPlatformTimePickerProps = {
  label: string;
  value?: string | null; // expects something like "09:00"
  onChange: (value: string) => void;
  setNowOnPress?: boolean;
  disabled?: boolean;
};

const CrossPlatformTimePicker: React.FC<CrossPlatformTimePickerProps> = ({
  label,
  value,
  onChange,
  setNowOnPress,
  disabled = false,
}) => {
  const [show, setShow] = React.useState(false);
  const [pickerValue, setPickerValue] = React.useState<Date>(parseTime(value));

  React.useEffect(() => {
    setPickerValue(parseTime(value));
  }, [value]);

  const onConfirm = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== 'ios') setShow(false);
    if (date) {
      setPickerValue(date);
      onChange(formatTime(date));
    }
  };

  // Web: render native HTML time input for reliable UX
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {/* @ts-ignore: Using native HTML input for web */}
        <input
          type="time"
          value={value || ''}
          onChange={(e: any) => {
            const v = e.target.value as string; // "HH:mm"
            onChange(v);
          }}
          disabled={disabled}
          style={styles.htmlInput as any}
        />
      </View>
    );
  }

  return (
    <View>
      <PaperTextInput
        mode="outlined"
        label={label}
        value={value || ''}
        editable={false}
        disabled={disabled}
        right={
          <PaperTextInput.Icon
            icon="clock"
            onPress={() => {
              if (disabled) return;
              if (setNowOnPress) {
                const now = new Date();
                setPickerValue(now);
                onChange(formatTime(now));
              } else {
                setShow(true);
              }
            }}
          />
        }
        onPressIn={() => {
          if (disabled) return;
          if (setNowOnPress) {
            const now = new Date();
            setPickerValue(now);
            onChange(formatTime(now));
          } else {
            setShow(true);
          }
        }}
      />
      {show && (
        <DateTimePicker
          value={pickerValue}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onConfirm}
        />
      )}
    </View>
  );
};

export default CrossPlatformTimePicker;

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { marginBottom: 4, fontWeight: '500' },
  htmlInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: 'white',
  },
});
