import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Card, HelperText, Switch, Text, TextInput, useTheme, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ATTENDANCE_SETTING, GET_ACTIVE_ATTENDANCE_SETTING } from '../../lib/queries';
import { useRouter } from 'expo-router';
import CrossPlatformTimePicker from '../../components/CrossPlatformTimePicker';
import CrossPlatformDatePicker from '../../components/CrossPlatformDatePicker';
import { nowInISTDate } from '../../lib/time';

function isValidTime(v: string | undefined) {
  if (!v) return true;
  return /^\d{2}:\d{2}(:\d{2})?$/.test(v);
}

export default function AttendanceSettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  // For demo, static companyId=1; wire to your auth/settings later
  const companyId = 1;

  const { data, loading: loadingQuery, error, refetch } = useQuery(GET_ACTIVE_ATTENDANCE_SETTING, {
    variables: { companyId, date: undefined },
  });

  const [createSetting, { loading: saving }] = useMutation(CREATE_ATTENDANCE_SETTING, {
    refetchQueries: [
      { query: GET_ACTIVE_ATTENDANCE_SETTING, variables: { companyId, date: undefined } },
    ],
  });

  const current = data?.getActiveAttendanceSetting;

  const [form, setForm] = useState({
    firstShiftStart: '',
    firstShiftEnd: '',
    secondShiftStart: '',
    secondShiftEnd: '',
    thirdShiftStart: '',
    thirdShiftEnd: '',
    fourthShiftStart: '',
    fourthShiftEnd: '',
    fifthShiftStart: '',
    fifthShiftEnd: '',
    sixthShiftStart: '',
    sixthShiftEnd: '',
    validityStart: nowInISTDate(),
    validityEnd: nowInISTDate(),
    isActive: true,
    graceTime: 0,
    autoAbsent: false,
    workingDays: '1111111',
  });

  const [snack, setSnack] = useState<{ visible: boolean; text: string }>({ visible: false, text: '' });

  useEffect(() => {
    if (current) {
      setForm({
        firstShiftStart: current.firstShiftStart ?? '',
        firstShiftEnd: current.firstShiftEnd ?? '',
        secondShiftStart: current.secondShiftStart ?? '',
        secondShiftEnd: current.secondShiftEnd ?? '',
        thirdShiftStart: current.thirdShiftStart ?? '',
        thirdShiftEnd: current.thirdShiftEnd ?? '',
        fourthShiftStart: current.fourthShiftStart ?? '',
        fourthShiftEnd: current.fourthShiftEnd ?? '',
        fifthShiftStart: current.fifthShiftStart ?? '',
        fifthShiftEnd: current.fifthShiftEnd ?? '',
        sixthShiftStart: current.sixthShiftStart ?? '',
        sixthShiftEnd: current.sixthShiftEnd ?? '',
        validityStart: current.validityStart ? new Date(`${current.validityStart}T00:00:00`) : nowInISTDate(),
        validityEnd: current.validityEnd ? new Date(`${current.validityEnd}T00:00:00`) : nowInISTDate(),
        isActive: current.isActive ?? true,
        graceTime: (current as any).graceTime ?? 0,
        autoAbsent: current.autoAbsent ?? false,
        workingDays: current.workingDays ?? '1111111',
      } as any);
    }
  }, [current]);

  const onSave = async () => {
    try {
      const toYmd = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${da}`;
      };

      await createSetting({
        variables: {
          input: {
            companyId,
            ...form,
            // ensure strings for optional fields are either valid or undefined
            firstShiftStart: form.firstShiftStart || null,
            firstShiftEnd: form.firstShiftEnd || null,
            secondShiftStart: form.secondShiftStart || null,
            secondShiftEnd: form.secondShiftEnd || null,
            thirdShiftStart: form.thirdShiftStart || null,
            thirdShiftEnd: form.thirdShiftEnd || null,
            fourthShiftStart: form.fourthShiftStart || null,
            fourthShiftEnd: form.fourthShiftEnd || null,
            fifthShiftStart: form.fifthShiftStart || null,
            fifthShiftEnd: form.fifthShiftEnd || null,
            sixthShiftStart: form.sixthShiftStart || null,
            sixthShiftEnd: form.sixthShiftEnd || null,
            validityStart: form.validityStart ? toYmd(form.validityStart as unknown as Date) : null,
            validityEnd: form.validityEnd ? toYmd(form.validityEnd as unknown as Date) : null,
            // send graceTime in minutes (backend maps to Duration)
            graceTime: Number.isFinite(form.graceTime) ? form.graceTime : 0,
          },
        },
      });
      setSnack({ visible: true, text: 'Settings saved successfully' });
    } catch (e: any) {
      setSnack({ visible: true, text: 'Failed to save settings. Please try again.' });
    }
  };

  const wd = form.workingDays.padEnd(7, '1').slice(0, 7).split('');

  const toggleDay = (idx: number) => {
    const arr = [...wd];
    arr[idx] = arr[idx] === '1' ? '0' : '1';
    setForm({ ...form, workingDays: arr.join('') });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loadingQuery) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading settings…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
        <Card>
          <Card.Title title="Unable to load settings" />
          <Card.Content>
            <Text style={{ marginBottom: 8 }}>
              Could not reach the server or the request failed. Please check your network and try again.
            </Text>
            <Button mode="contained" onPress={() => refetch()}>Retry</Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content color="white" title="Attendance Settings" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16, paddingBottom: 75 }}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Shifts" />
          <Card.Content>
            {[
              ['first', 'First'],
              ['second', 'Second'],
              ['third', 'Third'],
              ['fourth', 'Fourth'],
              ['fifth', 'Fifth'],
              ['sixth', 'Sixth'],
            ].map(([key, label]) => (
              <View key={key} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <CrossPlatformTimePicker
                    label={`${label} Shift Start (HH:mm)`}
                    value={(form as any)[`${key}ShiftStart`]}
                    onChange={(t) => setForm({ ...form, [`${key}ShiftStart`]: t } as any)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CrossPlatformTimePicker
                    label={`${label} Shift End (HH:mm)`}
                    value={(form as any)[`${key}ShiftEnd`]}
                    onChange={(t) => setForm({ ...form, [`${key}ShiftEnd`]: t } as any)}
                  />
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Rules" />
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <TextInput
                style={{ flex: 1 }}
                label="Grace Minutes"
                keyboardType="numeric"
                value={String(form.graceTime)}
                onChangeText={(t) => setForm({ ...form, graceTime: parseInt(t || '0', 10) })}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Auto Absent</Text>
                <Switch
                  value={form.autoAbsent}
                  onValueChange={(v) => setForm({ ...form, autoAbsent: v })}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={{ marginBottom: 8 }}>Working Days (1=Working, 0=Off)</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {days.map((d, idx) => (
                  <Button
                    key={d}
                    mode={wd[idx] === '1' ? 'contained' : 'outlined'}
                    onPress={() => toggleDay(idx)}
                  >
                    {d}
                  </Button>
                ))}
              </View>
              <HelperText type="info">Mask: {form.workingDays}</HelperText>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Validity" />
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker
                  label="Validity Start"
                  value={form.validityStart as unknown as Date}
                  onChange={(d) => setForm({ ...form, validityStart: d } as any)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker
                  label="Validity End"
                  value={form.validityEnd as unknown as Date}
                  onChange={(d) => setForm({ ...form, validityEnd: d } as any)}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text>Active</Text>
              <Switch value={form.isActive} onValueChange={(v) => setForm({ ...form, isActive: v })} style={{ marginLeft: 8 }} />
            </View>
          </Card.Content>
        </Card>

        <Button mode="contained" onPress={onSave} loading={saving} style={{marginBottom: 75 }}>
          Save Settings

        </Button>
      </ScrollView>
      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, text: '' })}
        duration={3000}
      >
        {snack.text}
      </Snackbar>
    </View>
  );
}
