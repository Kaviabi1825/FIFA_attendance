import { StyleSheet, View, FlatList, Image, ScrollView } from 'react-native';
import { Text, TouchableRipple, Searchbar, Appbar, useTheme, Divider, List, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import { useState, useEffect } from 'react';
import NotFoundMessage from '../components/NotFoundMessage';

// Define search item types for better organization
type SearchItemType = {
  id: string;
  label: string;
  category: 'order' | 'product' | 'vehicle' | 'bill' | 'supplier';
  details?: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>((params.query as string) || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // More comprehensive and organized search data
  const allSearchItems: SearchItemType[] = [
    { id: '1', label: 'PO no: 112255', category: 'order', details: 'Placed on 05 Jul 2025' },
    { id: '2', label: 'Vest RNS', category: 'product', details: 'In stock: 1,250 pcs' },
    { id: '3', label: 'Briefs', category: 'product', details: 'In stock: 850 pcs' },
    { id: '4', label: 'Vehicle TN57A31254', category: 'vehicle', details: 'Last delivery: 08 Jul 2025' },
    { id: '5', label: 'Bill no: 21', category: 'bill', details: 'Amount: ₹12,500' },
    { id: '6', label: 'Velavan TEX', category: 'supplier', details: 'Active orders: 3' },
    { id: '7', label: 'JV Hosiery', category: 'supplier', details: 'Active orders: 2' },
    { id: '8', label: 'PO no: 112256', category: 'order', details: 'Placed on 07 Jul 2025' },
    { id: '9', label: 'Bill no: 22', category: 'bill', details: 'Amount: ₹8,750' },
    { id: '10', label: 'Vehicle TN58B4532', category: 'vehicle', details: 'Last delivery: 06 Jul 2025' },
  ];
  
  const [filteredItems, setFilteredItems] = useState<SearchItemType[]>([]);

  // Filter items based on search query and active category
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = allSearchItems;
      
      // Filter by search query if it exists
      if (searchQuery.trim()) {
        results = results.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.details && item.details.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Filter by category if not 'all'
      if (activeCategory !== 'all') {
        results = results.filter(item => item.category === activeCategory);
      }
      
      setFilteredItems(results);
      setIsLoading(false);
    }, 300); // Small delay for better UX
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  const handleSearch = () => {
    // Search is handled by the useEffect
  };
  
  const handleItemPress = (item: SearchItemType) => {
    // Navigate based on category
    switch(item.category) {
      case 'order':
        // Navigate to order details
        router.push('/orders');
        break;
      case 'product':
        // Navigate to product details
        router.push('/orders');
        break;
      case 'supplier':
        // Navigate to supplier details
        router.push('/orders');
        break;
      case 'bill':
        // Navigate to bill details
        router.push('/accounts');
        break;
      case 'vehicle':
        // Navigate to vehicle tracking
        router.push('/orders');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#009688' }}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Search" color="white" />
      </Appbar.Header>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search products, orders, etc"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchbar}
          iconColor="#009688"
          autoFocus
        />
      </View>
      
      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'all' && styles.activeChip]} 
          onPress={() => setActiveCategory('all')}
        >
          <Text style={[styles.categoryText, activeCategory === 'all' && styles.activeText]}>All</Text>
        </TouchableRipple>
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'order' && styles.activeChip]} 
          onPress={() => setActiveCategory('order')}
        >
          <Text style={[styles.categoryText, activeCategory === 'order' && styles.activeText]}>Orders</Text>
        </TouchableRipple>
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'product' && styles.activeChip]} 
          onPress={() => setActiveCategory('product')}
        >
          <Text style={[styles.categoryText, activeCategory === 'product' && styles.activeText]}>Products</Text>
        </TouchableRipple>
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'supplier' && styles.activeChip]} 
          onPress={() => setActiveCategory('supplier')}
        >
          <Text style={[styles.categoryText, activeCategory === 'supplier' && styles.activeText]}>Suppliers</Text>
        </TouchableRipple>
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'bill' && styles.activeChip]} 
          onPress={() => setActiveCategory('bill')}
        >
          <Text style={[styles.categoryText, activeCategory === 'bill' && styles.activeText]}>Bills</Text>
        </TouchableRipple>
        <TouchableRipple 
          style={[styles.categoryChip, activeCategory === 'vehicle' && styles.activeChip]} 
          onPress={() => setActiveCategory('vehicle')}
        >
          <Text style={[styles.categoryText, activeCategory === 'vehicle' && styles.activeText]}>Vehicles</Text>
        </TouchableRipple>
      </ScrollView>

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009688" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <NotFoundMessage 
          message={searchQuery ? `No results found for "${searchQuery}"` : "Start typing to search"} 
          buttonText="Clear Search" 
          onPress={() => setSearchQuery('')} 
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableRipple style={styles.searchItem} onPress={() => handleItemPress(item)}>
              <View>
                <Text style={styles.searchItemText}>{item.label}</Text>
                {item.details && <Text style={styles.searchItemDetails}>{item.details}</Text>}
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{item.category}</Text>
                </View>
              </View>
            </TouchableRipple>
          )}
          contentContainerStyle={styles.searchResults}
          ItemSeparatorComponent={() => <Divider />}
        />
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: '#009688',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  activeText: {
    color: 'white',
    fontWeight: '500',
  },
  categoryTag: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#009688',
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    margin: 15,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchResults: {
    padding: 15,
  },
  searchItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchItemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  searchItemDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingRight: 70,
  },
});
