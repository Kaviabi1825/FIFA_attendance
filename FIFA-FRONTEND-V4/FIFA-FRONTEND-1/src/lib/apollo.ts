import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { Platform } from 'react-native';

// Dual GraphQL setup: Orders (8080) and Attendance (9090)
// Environment overrides (set in app config or CI):
//  - EXPO_PUBLIC_ORDERS_GRAPHQL_URL
//  - EXPO_PUBLIC_ATTENDANCE_GRAPHQL_URL
// Platform-aware fallbacks:
//  - Android device/emulator: use LAN IP
//  - Web/iOS: localhost

const envOrdersUrl = (process as any)?.env?.EXPO_PUBLIC_ORDERS_GRAPHQL_URL as string | undefined;
const envAttendanceUrl = (process as any)?.env?.EXPO_PUBLIC_ATTENDANCE_GRAPHQL_URL as string | undefined;

const DEFAULT_LAN_IP = '192.168.1.112'; // change via EXPO env if needed
const LAN_IP = ((process as any)?.env?.EXPO_PUBLIC_LAN_IP as string) || DEFAULT_LAN_IP;

const ORDERS_FALLBACK = Platform.OS === 'android'
  ? `http://${LAN_IP}:8080/graphql`
  : 'http://localhost:8080/graphql';
const ATTENDANCE_FALLBACK = Platform.OS === 'android'
  ? `http://${LAN_IP}:9090/graphql`
  : 'http://localhost:9090/graphql';

export const ORDERS_GRAPHQL_URL = envOrdersUrl || ORDERS_FALLBACK;
export const ATTENDANCE_GRAPHQL_URL = envAttendanceUrl || ATTENDANCE_FALLBACK;

// eslint-disable-next-line no-console
console.log('[Apollo] Orders GraphQL URL ->', ORDERS_GRAPHQL_URL);
// eslint-disable-next-line no-console
console.log('[Apollo] Attendance GraphQL URL ->', ATTENDANCE_GRAPHQL_URL);

const ordersLink = new HttpLink({ uri: ORDERS_GRAPHQL_URL });
const attendanceLink = new HttpLink({ uri: ATTENDANCE_GRAPHQL_URL });

export const ordersClient = new ApolloClient({
  link: ordersLink,
  cache: new InMemoryCache(),
});

export const attendanceClient = new ApolloClient({
  link: attendanceLink,
  cache: new InMemoryCache(),
});

// If you need a single client facade later, you can create link-splitting
// based on operationName or context to route to orders/attendance.
