import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useLazyQuery } from '@apollo/client';
import { GET_WORK_SUMMARY, GET_ATTENDANCE_REPORT } from '../../lib/queries';
import CrossPlatformDatePicker from '../../components/CrossPlatformDatePicker';

export default function AttendanceReportsScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [staffId, setStaffId] = useState('1001');
  const [startDateObj, setStartDateObj] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDateObj, setEndDateObj] = useState<Date>(new Date());

  const [loadSummary, { data: summaryData, loading: loadingSummary }] = useLazyQuery(GET_WORK_SUMMARY, {
    fetchPolicy: 'network-only',
  });
  const [loadReport, { data: reportData, loading: loadingReport }] = useLazyQuery(GET_ATTENDANCE_REPORT, {
    fetchPolicy: 'network-only',
  });

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  const onRun = async () => {
    if (!staffId || !startDateObj || !endDateObj) return;
    const startDate = formatDate(startDateObj);
    const endDate = formatDate(endDateObj);
    await Promise.all([
      loadSummary({ variables: { staffId, startDate, endDate } }),
      loadReport({ variables: { staffId, startDate, endDate } }),
    ]);
  };

  const setToday = () => {
    const today = new Date();
    setStartDateObj(today);
    setEndDateObj(today);
  };
  const setThisWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const mondayOffset = (day === 0 ? -6 : 1 - day);
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    setStartDateObj(monday);
    setEndDateObj(sunday);
  };
  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDateObj(start);
    setEndDateObj(end);
  };

  const s = summaryData?.getWorkSummary;
  const r = reportData?.getAttendanceReport;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content color="white" title="Attendance Reports" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Filters" />
          <Card.Content>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={{ flex: 1 }} label="Staff ID" value={staffId} onChangeText={setStaffId} />
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker label="Start" value={startDateObj} onChange={setStartDateObj} />
              </View>
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker label="End" value={endDateObj} onChange={setEndDateObj} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Button mode="outlined" onPress={setToday}>Today</Button>
              <Button mode="outlined" onPress={setThisWeek}>This Week</Button>
              <Button mode="outlined" onPress={setThisMonth}>This Month</Button>
              <Button mode="contained" onPress={onRun} loading={loadingSummary || loadingReport}>Run</Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Work Summary" />
          <Card.Content>
            {loadingSummary ? (
              <Text>Loading…</Text>
            ) : s ? (
              <View>
                <Text>Total Hours: {s.totalHours}</Text>
                <Text>Normal Hours: {s.normalHours}</Text>
                <Text>Overtime Hours: {s.overtimeHours}</Text>
              </View>
            ) : (
              <Text>Run to see summary.</Text>
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Report" />
          <Card.Content>
            {loadingReport ? (
              <Text>Loading…</Text>
            ) : r ? (
              <View>
                <Text>Total Records: {r.totalRecords}</Text>
                <Text>Present: {r.presentCount}</Text>
                <Text>Absent: {r.absentCount}</Text>
                <Text>Half Day: {r.halfDayCount}</Text>
                <Text>Leave: {r.leaveCount}</Text>
                <Text>Total Hours: {r.totalHours}</Text>
                <Text>Normal Hours: {r.normalHours}</Text>
                <Text>Overtime Hours: {r.overtimeHours}</Text>
              </View>
            ) : (
              <Text>Run to see report.</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
