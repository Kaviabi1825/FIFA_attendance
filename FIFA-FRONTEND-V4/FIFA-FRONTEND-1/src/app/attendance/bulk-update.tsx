import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Card, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import { UPDATE_ATTENDANCE_STATUS_BULK } from '../../lib/queries';

// Simple CSV helper: staffId,date(YYYY-MM-DD),newStatus per line
// Example:
// 1001,2025-09-15,PRESENT
// 1002,2025-09-15,ABSENT

export default function AttendanceBulkUpdateScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [csv, setCsv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [mutate] = useMutation(UPDATE_ATTENDANCE_STATUS_BULK);

  const parseCsv = (): Array<{ staffId: number; date: string; newStatus: string }> => {
    const lines = csv
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);
    const items: Array<{ staffId: number; date: string; newStatus: string }> = [];
    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 3) {
        throw new Error(`Invalid line (need 3 columns): "${line}"`);
      }
      const [staffStr, date, status] = parts;
      const staffId = Number(staffStr);
      if (!Number.isFinite(staffId)) {
        throw new Error(`Invalid staffId: "${staffStr}"`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`Invalid date (expected YYYY-MM-DD): "${date}"`);
      }
      if (!status) {
        throw new Error(`Invalid status on line: "${line}"`);
      }
      items.push({ staffId, date, newStatus: status });
    }
    return items;
  };

  const onSubmit = async () => {
    setErrorText(null);
    setResult(null);
    try {
      setSubmitting(true);
      const updates = parseCsv();
      const { data } = await mutate({ variables: { updates } });
      const count = data?.updateAttendanceStatusBulk ?? 0;
      setResult(`${count} records updated successfully.`);
    } catch (e: any) {
      setErrorText(e?.message || 'Failed to update records.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content color="white" title="Bulk Status Update" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="CSV Input" />
          <Card.Content>
            <HelperText type="info">Format: staffId,date(YYYY-MM-DD),newStatus per line</HelperText>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={10}
              placeholder="1001,2025-09-15,PRESENT\n1002,2025-09-15,ABSENT"
              value={csv}
              onChangeText={setCsv}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Button mode="contained" onPress={onSubmit} loading={submitting}>Submit</Button>
              <Button mode="outlined" onPress={() => { setCsv(''); setResult(null); setErrorText(null); }}>Clear</Button>
            </View>
            {result && (
              <Text style={{ marginTop: 12, color: 'green' }}>{result}</Text>
            )}
            {errorText && (
              <Text style={{ marginTop: 12, color: 'red' }}>{errorText}</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
