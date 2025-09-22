// Shared notifications data and helpers outside of app/ so expo-router won't treat it as a route
import { ImageSourcePropType } from 'react-native';

export type NotificationType = {
  id: string;
  type: 'new' | 'this_week';
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
  iconName?: string;
  iconType?: 'ionicon' | 'material';
  iconColor?: string;
  time: string;
  hasDetails: boolean;
  details?: {
    driverName?: string;
    contactNo?: string;
    vehicleNo?: string;
    arrivedTime?: string;
    orderNo?: string;
    status?: string;
    amount?: string;
    date?: string;
  };
};

export const notifications: NotificationType[] = [
  {
    id: '1',
    type: 'new',
    title: 'Vehicle Arrives at 1:00 pm',
    subtitle: 'For Delivery is Arrived Soon',
    iconName: 'time',
    iconType: 'ionicon',
    iconColor: '#4A90E2',
    time: '12:00 pm',
    hasDetails: true,
    details: {
      driverName: 'Rocky Bhai',
      contactNo: '9149849348',
      vehicleNo: 'TN57A31254',
      arrivedTime: '01:00 pm',
    },
  },
  {
    id: '2',
    type: 'new',
    title: 'New Order Received',
    subtitle: 'Your order is being processed',
    iconName: 'cube',
    iconType: 'ionicon',
    iconColor: '#2196F3',
    time: '10:30 am',
    hasDetails: true,
    details: {
      orderNo: 'ORD123456',
      status: 'Processing',
      amount: '₹12,500',
      date: '09 Jul 2025',
    },
  },
  {
    id: '3',
    type: 'new',
    title: 'Order Delivered',
    subtitle: 'Your order has been delivered',
    iconName: 'checkmark-circle',
    iconType: 'ionicon',
    iconColor: '#4CAF50',
    time: 'Yesterday',
    hasDetails: true,
    details: {
      orderNo: 'ORD123455',
      status: 'Delivered',
      amount: '₹8,750',
      date: '08 Jul 2025',
    },
  },
  {
    id: '4',
    type: 'this_week',
    title: 'Payment Received',
    subtitle: 'Your payment was successful',
    iconName: 'wallet',
    iconType: 'ionicon',
    iconColor: '#FF9800',
    time: '2 days ago',
    hasDetails: true,
    details: {
      orderNo: 'INV987654',
      status: 'Paid',
      amount: '₹25,000',
      date: '07 Jul 2025',
    },
  },
  {
    id: '5',
    type: 'this_week',
    title: 'New Products Available',
    subtitle: 'Check out our new inventory',
    iconName: 'pricetag',
    iconType: 'ionicon',
    iconColor: '#9C27B0',
    time: '3 days ago',
    hasDetails: true,
    details: {
      orderNo: 'PROD-2023-456',
      status: 'In Stock',
      amount: '₹5,200',
      date: '06 Jul 2025',
    },
  },
  {
    id: '6',
    type: 'this_week',
    title: 'System Maintenance',
    subtitle: 'Scheduled downtime next week',
    iconName: 'construct',
    iconType: 'ionicon',
    iconColor: '#607D8B',
    time: '5 days ago',
    hasDetails: true,
    details: {
      status: 'Scheduled',
      date: '15 Jul 2025',
    },
  },
];

export const getNotificationById = (id: string) =>
  notifications.find((n) => n.id === id);
