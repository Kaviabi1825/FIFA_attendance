import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Badge, Button, Card, Searchbar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [showMoreIcons, setShowMoreIcons] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  
  // Total number of ads
  const totalAds = 5;

  const toggleMoreIcons = () => {
    setShowMoreIcons(!showMoreIcons);
  };

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
  };
  
  const onSearch = () => {
    // Pass the search query to the search screen
    router.push({
      pathname: '/search',
      params: { query: searchQuery }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#009688' }]}>
        <View style={styles.userInfo}>
        </View>
        <TouchableRipple
          style={styles.notificationIcon}
          onPress={() => router.push('/notifications')}
          borderless
          rippleColor="rgba(255, 255, 255, 0.2)"
        >
          <View>
            <Ionicons name="notifications" size={24} color="white" />
            <Badge style={styles.badge} size={16}>3</Badge>
          </View>
        </TouchableRipple>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
          onSubmitEditing={onSearch}
          onIconPress={onSearch}
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Murali Tex</Text>
        
        {/* Cards Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <Card 
              style={[styles.card, { backgroundColor: theme.colors.secondary }]}
              onPress={() => router.push('/accounts')}
            >
              <Card.Content style={styles.cardContent}>
                <Ionicons name="wallet-outline" size={24} color="white" />
                <Text style={styles.cardText}>Accounts</Text>
              </Card.Content>
            </Card>
            <Card 
              style={[styles.card, { backgroundColor: theme.colors.tertiary }]}
              onPress={() => {}}
            >
              <Card.Content style={styles.cardContent}>
                <Ionicons name="list-outline" size={24} color="white" />
                <Text style={styles.cardText}>Masters</Text>
              </Card.Content>
            </Card>
          </View>
          
          <View style={styles.row}>
            <Card 
              style={[styles.card, { backgroundColor: '#4A90E2' }]}
              onPress={() => router.push('/order-history')}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="document-text" size={24} color="white" />
                  <Badge style={styles.cardBadge}>New</Badge>
                </View>
                <Text style={styles.cardText}>Order History</Text>
              </Card.Content>
            </Card>
            <Card 
              style={[styles.card, { backgroundColor: '#FFD166' }]}
              onPress={() => {}}
            >
              <Card.Content style={styles.cardContent}>
                <Ionicons name="contract" size={24} color="white" />
                <Text style={styles.cardText}>Sub Contract</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Icons Row */}
        <View style={styles.iconsContainer}>
          <View style={styles.iconsRow}>
            <TouchableRipple style={styles.iconItem} onPress={() => router.push('/attendance')}>
              <View style={styles.iconItemContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialIcons name="event-available" size={24} color="#1976D2" />
                </View>
                <Text style={styles.iconText}>Attendance</Text>
              </View>
            </TouchableRipple>
            
            <TouchableRipple style={styles.iconItem} onPress={() => {}}>
              <View style={styles.iconItemContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#FFF8E1' }]}>
                  <Ionicons name="call" size={24} color="#FFA000" />
                </View>
                <Text style={styles.iconText}>Support</Text>
              </View>
            </TouchableRipple>
            
            <TouchableRipple style={styles.iconItem} onPress={() => {}}>
              <View style={styles.iconItemContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="bus" size={24} color="#7B1FA2" />
                </View>
                <Text style={styles.iconText}>Transport</Text>
              </View>
            </TouchableRipple>
            
            <TouchableRipple style={styles.iconItem} onPress={() => {}}>
              <View style={styles.iconItemContent}>
                <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="cart" size={24} color="#2E7D32" />
                </View>
                <Text style={styles.iconText}>Shop</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>

        {/* <Button 
          mode="contained" 
          onPress={toggleMoreIcons} 
          style={styles.toggleButton}
        >
          {showMoreIcons ? 'Show Less' : 'Show More'}
        </Button> */}

        <View style={styles.divider} />
        
        {/* Advertisement Carousel */}
        <View style={styles.adContainer}>
          <Text style={styles.adTitle}>Special Offers</Text>
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.adScrollContainer}
            onScroll={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(contentOffsetX / 295); // 280 width + 15 margin
              if (newIndex !== currentAdIndex) {
                setCurrentAdIndex(newIndex);
              }
            }}
            scrollEventThrottle={16} // for smooth updates
            pagingEnabled={false}
            decelerationRate="fast"
          >
            <TouchableRipple style={styles.adItem} onPress={() => {}}>
              <View>
                <Image 
                  source={require('../../assets/images/Img1.jpg')} 
                  style={styles.adImage} 
                  resizeMode="cover"
                />
                <View style={styles.adOverlay}>
                  <Text style={styles.adText}>50% OFF</Text>
                  <Text style={styles.adSubtext}>Limited Time</Text>
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple style={styles.adItem} onPress={() => {}}>
              <View>
                <Image 
                  source={require('../../assets/images/Img2.webp')} 
                  style={styles.adImage} 
                  resizeMode="cover"
                />
                <View style={styles.adOverlay}>
                  <Text style={styles.adText}>New Arrivals</Text>
                  <Text style={styles.adSubtext}>Check Now</Text>
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple style={styles.adItem} onPress={() => {}}>
              <View>
                <Image 
                  source={require('../../assets/images/Img3.jpg')} 
                  style={styles.adImage} 
                  resizeMode="cover"
                />
                <View style={styles.adOverlay}>
                  <Text style={styles.adText}>Flash Sale</Text>
                  <Text style={styles.adSubtext}>Today Only</Text>
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple style={styles.adItem} onPress={() => {}}>
              <View>
                <Image 
                  source={require('../../assets/images/Img4.jpg')} 
                  style={styles.adImage} 
                  resizeMode="cover"
                />
                <View style={styles.adOverlay}>
                  <Text style={styles.adText}>Free Shipping</Text>
                  <Text style={styles.adSubtext}>On Orders {'>'}₹500</Text>
                </View>
              </View>
            </TouchableRipple>
            <TouchableRipple style={styles.adItem} onPress={() => {}}>
              <View>
                <Image 
                  source={require('../../assets/images/Img5.jpg')} 
                  style={styles.adImage} 
                  resizeMode="cover"
                />
                <View style={styles.adOverlay}>
                  <Text style={styles.adText}>Clearance</Text>
                  <Text style={styles.adSubtext}>Up to 70% Off</Text>
                </View>
              </View>
            </TouchableRipple>
          </ScrollView>
          
          {/* Pagination Indicators */}
          <View style={styles.paginationContainer}>
            {Array.from({ length: totalAds }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  index === currentAdIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#009688',
    paddingTop: 50,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 5,
  },
  notificationIcon: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    margin: 15,
  },
  searchbar: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 20,
  },
  gridContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBadge: {
    position: 'absolute',
    top: -10,
    right: -20,
    backgroundColor: '#FF3B30',
    color: 'white',
    fontSize: 10,
  },
  featuredSection: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    color: '#4A90E2',
    fontSize: 14,
  },
  iconsContainer: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  iconItemContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },

  toggleButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  adContainer: {
    marginBottom: 20,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 10,
  },
  adScrollContainer: {
    paddingRight: 15,
  },
  adItem: {
    width: 280,
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 15,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  adOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  adText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adSubtext: {
    color: 'white',
    fontSize: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#009688',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
