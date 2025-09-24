import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Slot } from 'expo-router';
import { attendanceClient } from '../../lib/apollo';

export default function AttendanceLayout() {
  return (
    <ApolloProvider client={attendanceClient}>
      <Slot />
    </ApolloProvider>
  );
}
