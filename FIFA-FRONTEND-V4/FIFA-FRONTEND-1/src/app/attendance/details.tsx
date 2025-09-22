import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions, Platform } from 'react-native';
import { Appbar, Button, Card, DataTable, Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useLazyQuery } from '@apollo/client';
import { GET_ATTENDANCE_BY_STAFF_PAGINATED } from '../../lib/queries';
import CrossPlatformDatePicker from '../../components/CrossPlatformDatePicker';

export default function AttendanceDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 640; // phones
  const isMedium = width >= 640 && width < 1024; // tablets

  const [staffId, setStaffId] = useState('1001');
  const [startDateObj, setStartDateObj] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDateObj, setEndDateObj] = useState<Date>(new Date());
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [loadPage, { data, loading }] = useLazyQuery(GET_ATTENDANCE_BY_STAFF_PAGINATED, {
    fetchPolicy: 'network-only',
  });

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  };

  const onSearch = async (resetPage = true) => {
    const pageToLoad = resetPage ? 0 : page;
    const startDate = formatDate(startDateObj);
    const endDate = formatDate(endDateObj);
    await loadPage({ variables: { staffId, startDate, endDate, page: pageToLoad, size } });
    if (resetPage) setPage(0);
  };

  const setToday = () => {
    const today = new Date();
    setStartDateObj(today);
    setEndDateObj(today);
  };
  const setThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
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

  useEffect(() => {
    // initial load
    onSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const res = data?.getAttendanceByStaffPaginated;
  const rows = React.useMemo(() => {
    const list = [...(res?.content ?? [])];
    list.sort((a: any, b: any) => {
      // Prefer createdOn desc if available
      const aCreated = a.createdOn ?? null;
      const bCreated = b.createdOn ?? null;
      if (aCreated && bCreated) {
        return new Date(bCreated).getTime() - new Date(aCreated).getTime();
      }
      // Fallback: by date then checkInTime
      const aKey = `${a.date || ''}T${a.checkInTime || '00:00:00'}`;
      const bKey = `${b.date || ''}T${b.checkInTime || '00:00:00'}`;
      return new Date(bKey).getTime() - new Date(aKey).getTime();
    });
    return list;
  }, [res?.content]);

  const onPrev = async () => {
    if (page <= 0) return;
    const newPage = page - 1;
    setPage(newPage);
    const startDate = formatDate(startDateObj);
    const endDate = formatDate(endDateObj);
    await loadPage({ variables: { staffId, startDate, endDate, page: newPage, size } });
  };

  const onNext = async () => {
    const totalPages = res?.totalPages ?? 0;
    const newPage = page + 1;
    if (newPage >= totalPages) return;
    setPage(newPage);
    const startDate = formatDate(startDateObj);
    const endDate = formatDate(endDateObj);
    await loadPage({ variables: { staffId, startDate, endDate, page: newPage, size } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content color="white" title="Attendance Details" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16, paddingBottom: 90 }}>
        <Card style={{ marginBottom: 12 }}>
          <Card.Title title="Filters" />
          <Card.Content>
            <View style={{ flexDirection: isSmall ? 'column' : 'row', gap: 8 }}>
              <TextInput
                style={{ flex: 1, minHeight: 48 }}
                label="Staff ID"
                value={staffId}
                onChangeText={setStaffId}
              />
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker label="Start" value={startDateObj} onChange={setStartDateObj} />
              </View>
              <View style={{ flex: 1 }}>
                <CrossPlatformDatePicker label="End" value={endDateObj} onChange={setEndDateObj} />
              </View>
            </View>
            <View style={{ flexDirection: isSmall ? 'column' : 'row', gap: 8, marginTop: 12 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button mode="outlined" onPress={setToday}>Today</Button>
                <Button mode="outlined" onPress={setThisWeek}>This Week</Button>
                <Button mode="outlined" onPress={setThisMonth}>This Month</Button>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                <Button style={{ flex: 1 }} mode="contained" onPress={() => onSearch(true)} loading={loading}>Search</Button>
                <TextInput
                  style={{ width: isSmall ? 120 : 100 }}
                  label="Page Size"
                  keyboardType="numeric"
                  value={String(size)}
                  onChangeText={(t) => setSize(parseInt(t || '10', 10))}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Results" />
          <Card.Content>
            {isSmall ? (
              <View>
                {rows.map((row: any, idx: number) => (
                  <Card key={`${row.staffId}-${row.date}-${idx}`} style={{ marginBottom: 10 }}>
                    <Card.Content>
                      <Text style={{ fontWeight: '600', marginBottom: 6 }}>{row.date}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>In</Text><Text>{row.checkInTime ?? '-'}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Out</Text><Text>{row.checkOutTime ?? '-'}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Actual Hrs</Text><Text>{row.actualWorkHours ?? '-'}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Status</Text><Text>{row.status}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title numeric>In</DataTable.Title>
                  <DataTable.Title numeric>Out</DataTable.Title>
                  <DataTable.Title numeric>Actual Hrs</DataTable.Title>
                  <DataTable.Title>Status</DataTable.Title>
                </DataTable.Header>
                {rows.map((row: any, idx: number) => (
                  <DataTable.Row key={`${row.staffId}-${row.date}-${idx}`}>
                    <DataTable.Cell>{row.date}</DataTable.Cell>
                    <DataTable.Cell numeric>{row.checkInTime ?? '-'}</DataTable.Cell>
                    <DataTable.Cell numeric>{row.checkOutTime ?? '-'}</DataTable.Cell>
                    <DataTable.Cell numeric>{row.actualWorkHours ?? '-'}</DataTable.Cell>
                    <DataTable.Cell>{row.status}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Button mode="outlined" onPress={onPrev} disabled={loading || page <= 0}>Prev</Button>
              <Text>Page {page + 1} / {res?.totalPages ?? 1}</Text>
              <Button mode="outlined" onPress={onNext} disabled={loading || (page + 1) >= (res?.totalPages ?? 1)}>Next</Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
