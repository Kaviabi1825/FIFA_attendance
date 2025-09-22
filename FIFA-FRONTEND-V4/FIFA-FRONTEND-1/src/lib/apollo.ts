import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { Platform } from 'react-native';

// Prefer environment override via Expo (set EXPO_PUBLIC_GRAPHQL_URL)
// Fallbacks:
// - Android device: use LAN IP (align with backend CORS allowlist)
// - Web/iOS: localhost
const envUrl = (process as any)?.env?.EXPO_PUBLIC_GRAPHQL_URL as string | undefined;
const FALLBACK_ANDROID = 'http://192.168.1.112:9090/graphql';
const FALLBACK_DEFAULT = 'http://localhost:9090/graphql';
const GRAPHQL_URL = envUrl || (Platform.OS === 'android' ? FALLBACK_ANDROID : FALLBACK_DEFAULT);

// eslint-disable-next-line no-console
console.log('[Apollo] GraphQL URL ->', GRAPHQL_URL);

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

// Optional: attach auth headers if needed later
const authLink = new ApolloLink((operation: any, forward: any) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
