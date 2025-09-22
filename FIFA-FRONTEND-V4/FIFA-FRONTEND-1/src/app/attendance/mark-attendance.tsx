import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Card, HelperText, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { CHECK_IN, CHECK_OUT, GET_ATTENDANCE, CREATE_ATTENDANCE, GET_ACTION_LOGS } from '../../lib/queries';
import { useRouter } from 'expo-router';
import CrossPlatformDatePicker from '../../components/CrossPlatformDatePicker';
import { nowInISTDate, nowISTIsoSeconds } from '../../lib/time';
import { Platform } from 'react-native';

export default function MarkAttendanceScreen() {
  const theme = useTheme();
  const router = useRouter();

  // Form state
  const [companyId, setCompanyId] = useState('1');
  const [personId, setPersonId] = useState('');
  const [staffId, setStaffId] = useState('1');
  const [dateObj, setDateObj] = useState<Date>(nowInISTDate());
  // Auto-detect device; do not show input to user
  const detectedDevice = Platform.select({ web: 'web', ios: 'ios', android: 'android', default: 'unknown' }) as string;
  // Additional details used during auto-create on first check-in
  const [shiftNo, setShiftNo] = useState<string>(''); // numeric (1..6)
  const [remarks, setRemarks] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [noOfPieces, setNoOfPieces] = useState<string>('');
  const [noOfShift, setNoOfShift] = useState<string>('');

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  const date = formatDate(dateObj);

  const { data, refetch, loading: loadingAttendance, error } = useQuery(GET_ATTENDANCE, {
    variables: { staffId, date },
    skip: !staffId || !date,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching attendance:', error);
    }
  });

  // Fetch action logs for timer and button toggle
  const { data: logsData, refetch: refetchLogs } = useQuery(GET_ACTION_LOGS, {
    variables: { staffId, date },
    skip: !staffId || !date,
    fetchPolicy: 'network-only',
  });

  const [checkIn, { loading: cinLoading }] = useMutation(CHECK_IN, {
    onCompleted: () => { refetch(); refetchLogs(); },
    onError: (error) => {
      console.error('Error during check-in:', error);
    }
  });
  
  const [checkOut, { loading: coutLoading }] = useMutation(CHECK_OUT, {
    onCompleted: () => refetch(),
    onError: (error) => {
      console.error('Error during check-out:', error);
    }
  });

  const [createAttendance, { loading: creating }] = useMutation(CREATE_ATTENDANCE, {
    onCompleted: () => { refetch(); refetchLogs(); },
    onError: (error) => {
      console.error('Error creating attendance:', error);
    }
  });

  const nowIso = () => new Date().toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss

  const onCheckIn = async () => {
    // If no attendance row exists yet, create one with rich details
    const existing = data?.getAttendance;
    if (!existing) {
      const input = {
        companyId: companyId ? parseInt(companyId, 10) : null,
        personId: personId ? parseInt(personId, 10) : null,
        staffId,
        date,
        // Initial status: ABSENT. Backend will update after check-in based on logs.
        status: 'ABSENT',
        // Provide shiftNo so backend can derive working hours window from settings
        shiftNo: shiftNo ? parseInt(shiftNo, 10) : null,
        remarks: remarks || null,
        notes: notes || null,
        isHoliday: isHoliday ,
        noOfPieces: noOfPieces ? parseInt(noOfPieces, 10) : null,
        noOfShift: noOfShift ? parseInt(noOfShift, 10) : null,
        // No times here; for ABSENT backend will clear times. Check-in will set first check-in time.
      } as any;
      try {
        await createAttendance({ variables: { input } });
      } catch (e) {
        console.error('Create before check-in failed:', e);
        // Continue to check-in attempt regardless; backend may still handle logging.
      }
    }
    // Now perform check-in (logs to Mongo and updates SQL if row exists)
    await checkIn({
      variables: {
        input: {
          companyId: companyId ? parseInt(companyId, 10) : null,
          personId: personId ? parseInt(personId, 10) : null,
          staffId,
          date,
          timeStamp: nowISTIsoSeconds(),
          device: detectedDevice,
        },
      },
    });
  };

  const onCheckOut = async () => {
    await checkOut({
      variables: {
        input: {
          companyId: companyId ? parseInt(companyId, 10) : null,
          personId: personId ? parseInt(personId, 10) : null,
          staffId,
          date,
          timeStamp: nowISTIsoSeconds(),
          device: detectedDevice,
        },
      },
    });
    await Promise.all([refetch(), refetchLogs()]);
  };

  // No manual create/update UI; creation is automatic on first check-in.

  const a = data?.getAttendance;
  const logs = logsData?.getActionLogs || [];

  // Compute worked seconds and running state from logs
  const { workedSeconds, runningSince } = useMemo(() => {
    let lastCheckIn: Date | null = null;
    let total = 0;
    for (const log of logs) {
      const ts = new Date(log.timeStamp.replace(' ', 'T'));
      if (log.action === 'CHECK_IN') {
        lastCheckIn = ts;
      } else if (log.action === 'CHECK_OUT' && lastCheckIn) {
        total += Math.max(0, Math.floor((ts.getTime() - lastCheckIn.getTime()) / 1000));
        lastCheckIn = null;
      }
    }
    return { workedSeconds: total, runningSince: lastCheckIn };
  }, [logs]);

  const [tick, setTick] = useState(0);
  React.useEffect(() => {
    if (!runningSince) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [runningSince]);

  const displaySeconds = workedSeconds + (runningSince ? Math.floor((Date.now() - runningSince.getTime()) / 1000) : 0);
  const hh = String(Math.floor(displaySeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((displaySeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(displaySeconds % 60).padStart(2, '0');
  const timeStr = `${hh}:${mm}:${ss}`;

  // Live IST clock string
  const [nowIst, setNowIst] = useState<string>('');
  React.useEffect(() => {
    const tick = () => {
      const d = nowInISTDate();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setNowIst(`${y}-${m}-${da} ${h}:${mi}:${s} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Build sessions from action logs: CHECK_IN .. CHECK_OUT pairs
  type Session = { start: Date; end?: Date; startDevice?: string; endDevice?: string; startBy?: string; endBy?: string };
  const sessions: Session[] = useMemo(() => {
    const out: Session[] = [];
    let current: Session | null = null;
    for (const lg of logs) {
      const ts = new Date(lg.timeStamp.replace(' ', 'T'));
      if (lg.action === 'CHECK_IN') {
        // If there's an unclosed current, push it as open then start new
        if (current) out.push(current);
        current = { start: ts, startDevice: lg.device, startBy: lg.createdBy };
      } else if (lg.action === 'CHECK_OUT') {
        if (current) {
          current.end = ts;
          current.endDevice = lg.device;
          current.endBy = lg.createdBy;
          out.push(current);
          current = null;
        } else {
          // Orphan checkout; ignore or treat as zero-length
          // ignore for now
        }
      }
    }
    if (current) out.push(current); // keep last open session
    return out;
  }, [logs]);

  const fmtTime = (d?: Date) => {
    if (!d) return '--:--';
    const h = String(d.getHours()).padStart(2, '0');
    const m2 = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m2}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content color="white" title="Mark Attendance" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Identify" />
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={{ flex: 1 }} label="Company ID" keyboardType="numeric" value={companyId} onChangeText={setCompanyId} />
              <TextInput style={{ flex: 1 }} label="Person ID (optional)" keyboardType="numeric" value={personId} onChangeText={setPersonId} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput style={{ flex: 1 }} label="Staff ID" value={staffId} onChangeText={setStaffId} />
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker label="Date" value={dateObj} onChange={setDateObj} />
              </View>
            </View>
            <HelperText type="info" visible style={{ marginTop: 8 }}>
              Device: {detectedDevice.toUpperCase()} | Timezone: IST (Asia/Kolkata)
            </HelperText>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Actions" />
          <Card.Content>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 6,
                  borderColor: runningSince ? '#2ecc71' : '#e74c3c',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 22, fontWeight: '600' }}>{timeStr}</Text>
              </View>
              <Text style={{ marginTop: 8, opacity: 0.8 }}>Now: {nowIst}</Text>
            </View>
            {runningSince ? (
              <Button mode="contained" onPress={onCheckOut} loading={coutLoading} buttonColor="#e74c3c">
                Check-Out
              </Button>
            ) : (
              <Button mode="contained" onPress={onCheckIn} loading={cinLoading} buttonColor="#2ecc71">
                Check-In
              </Button>
            )}
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Work Details (Optional)" />
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={{ flex: 1 }} label="Shift No" keyboardType="numeric" value={shiftNo} onChangeText={setShiftNo} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput style={{ flex: 1 }} label="No. of Pieces" keyboardType="numeric" value={noOfPieces} onChangeText={setNoOfPieces} />
              <TextInput style={{ flex: 1 }} label="No. of Shift" keyboardType="numeric" value={noOfShift} onChangeText={setNoOfShift} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput style={{ flex: 1 }} label="Remarks" value={remarks} onChangeText={setRemarks} />
              <TextInput style={{ flex: 1 }} label="Notes" value={notes} onChangeText={setNotes} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ marginRight: 8 }}>Holiday</Text>
              <Switch value={isHoliday} onValueChange={setIsHoliday} />
            </View>
            <HelperText type="info" visible>
              On first Check In, we auto-create the attendance row (status derived by backend). If no checkout happens, it will remain HALF_DAY; if late or no logs, it will be ABSENT. When actual hours reach expected, backend marks PRESENT.
            </HelperText>
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Today" />
          <Card.Content>
            {loadingAttendance ? (
              <Text>Loading...</Text>
            ) : a ? (
              <View>
                <Text>Status: {a.status}</Text>
                <Text>Check-In: {a.checkInTime ?? '-'}</Text>
                <Text>Check-Out: {a.checkOutTime ?? '-'}</Text>
                <Text>Actual Hours: {a.actualWorkHours ?? '-'}</Text>
                <Text>Planned Hours: {a.plannedWorkHours ?? '-'}</Text>
              </View>
            ) : (
              <Text>No record yet.</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={{ marginTop: 12 }}>
          <Card.Title title="Sessions" />
          <Card.Content>
            {sessions.length === 0 ? (
              <Text>No sessions.</Text>
            ) : (
              <View>
                {sessions.map((s, idx) => (
                  <Card key={`sess-${idx}`} style={{ marginBottom: 8 }}>
                    <Card.Content>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>
                          {fmtTime(s.start)} → {fmtTime(s.end)}
                        </Text>
                        {!s.end ? (
                          <Text style={{ color: '#2ecc71' }}>Running</Text>
                        ) : null}
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, opacity: 0.8 }}>
                        <Text>In: {(s.startDevice || '-').toUpperCase()}</Text>
                        <Text>Out: {(s.endDevice || (s.end ? '-' : ''))?.toUpperCase?.() || (s.end ? '-' : '')}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
