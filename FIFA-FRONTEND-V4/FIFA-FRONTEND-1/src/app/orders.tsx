import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  FAB,
  TextInput as PaperInput,
  Provider as PaperProvider,
  Portal,
  RadioButton, 
} from "react-native-paper";
import BottomNavigation from "../components/BottomNavigation";
// ... use consolidated import below
import { fetchOrders, createOrder as apiCreateOrder, correctOrderItem as apiCorrectOrderItem, deleteOrder as apiDeleteOrder, updateOrder as apiUpdateOrder } from "../lib/ordersApi";

// Define TypeScript interfaces for our data structure
interface SizeData {
  size: string;
  dcQty: string;
  completed: string;
  itemId?: string;
}

interface AccessoryData {
  item: string;
  quantity: string;
}

interface OrderData {
  id: string;
  supplier: string;
  dcNo: string;
  style: string;
  poNumber: string;
  priority: "Normal" | "Urgent";
  origin: "Domestic" | "Foreign";
  dueDate?: string;
  image: any;
  favorite: boolean;
  expanded: boolean;
  sizes: SizeData[];
  accessories: AccessoryData[];
}

// Simple in-memory cache to avoid refetching during the app session
let ordersCache: OrderData[] | null = null;

export default function OrdersScreen() {
  const router = useRouter();
  const [expandedOrders, setExpandedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
    undefined
  );
  const [selectedOrderQty, setSelectedOrderQty] = useState<number>(0);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [updateMode, setUpdateMode] = useState<"add" | "update">("add");
  const [currentCompleted, setCurrentCompleted] = useState<string>("");
  const [newItemModalVisible, setNewItemModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [confirmLeaveVisible, setConfirmLeaveVisible] = useState(false);

// const handleSave = () => {
//   const newErrors = {};
//   if (!supplierName.trim()) newErrors.supplierName = 'Supplier is required';
//   if (!dcNo.trim()) newErrors.dcNo = 'DC Number is required';
//   if (!style.trim()) newErrors.style = 'Style is required';

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//     setValidationTriggered(true);
//     return; // stop save
//   }

//   // proceed to save the order
// };




  const [errors, setErrors] = useState({});
  const [validationTriggered, setValidationTriggered] = useState(false);





  // Date picker states
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [tempDueDate, setTempDueDate] = useState(new Date());
  const initialNewItem: {
    supplier: string;
    dcNo: string;
    style: string;
    poNumber: string;
    priority: "Normal" | "Urgent";
    origin: "Domestic" | "Foreign";
    dueDate?: string;

    sizes: { size: string; dcQty: string }[];
    accessories: { item: string; quantity: string }[];
  } = {
    supplier: "",
    dcNo: "",
    style: "",
    poNumber: "",
    priority: "Normal",
    origin: "Domestic",
    dueDate: "",
    sizes: [{ size: "", dcQty: "" }],
    accessories: [{ item: "", quantity: "" }],
  };

  const [newItem, setNewItem] = useState<typeof initialNewItem>(initialNewItem);

  // Inline field validation errors for create order dialog
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [ordersReloadCounter, setOrdersReloadCounter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // Load from backend (replace demo data when available) using Apollo
  // Load from backend (replace demo data when available)
  useEffect(() => {
    (async () => {
      setOrdersLoading(true);
      try {
        if (ordersCache) {
          const byIdCache: Record<string, OrderData> = {};
          ordersCache.forEach((m) => (byIdCache[String(m.id)] = m));
          const uniqueCache = Object.values(byIdCache);
          setOrderData(uniqueCache);
          setOrdersLoading(false);
          return;
        }
  const data = await fetchOrders();
        const apiOrders = data.orders?.orders || [];
        if (apiOrders.length > 0) {
          const mapped: OrderData[] = apiOrders.map((o: any, idx: number) => ({
            id: String(o.orderId ?? idx + 1),
            supplier: o.supplierId ? `Supplier ${o.supplierId}` : "Supplier",
            dcNo: o.dcNumber || "",
            style: o.orderItems?.[0]?.productStyle || "",
            poNumber: o.poNumber || "",
            priority: o.isUrgent ? ("Urgent" as const) : ("Normal" as const),
            origin: o.isForeign ? ("Foreign" as const) : ("Domestic" as const),
            dueDate: o.dueDate || undefined,
            image: require("../../assets/images/Ord1.jpg"),
            favorite: false,
            expanded: false,
            sizes: (o.orderItems || []).map((it: any) => ({
              size: String(it.productSize ?? ""),
              dcQty: String(it.orderQty ?? "0"),
              completed: String(it.completeQty ?? "0"),
              itemId: String(it.itemId ?? ""),
            })),
            accessories: [],
          }));
          // dedupe by orderId just in case
          const byId: Record<string, OrderData> = {};
          mapped.forEach((m) => (byId[String(m.id)] = m));
          const unique = Object.values(byId);
          setOrderData(unique);
          ordersCache = unique;
        }
      } catch (err) {
        console.warn('fetchOrders failed:', err);
        // Silently keep demo data on failure
      } finally {
        setOrdersLoading(false);
        // indicate refresh complete if using pull-to-refresh
        setRefreshing(false);
      }
    })();
  }, [ordersReloadCounter]);

  // Using fetch-based createOrder helper

  // Function to handle adding quantity - kept for reference but no longer used in UI
  const handleAddQuantity = (orderId: string, size: string) => {
    const order = orderData.find((o) => o.id === orderId);
    const sizeData = order?.sizes.find((s) => s.size === size);
    const completed = sizeData?.completed || "0";

    setSelectedOrder(orderId);
    setSelectedSize(size);
    setSelectedItemId(sizeData?.itemId);
    setSelectedOrderQty(parseInt(sizeData?.dcQty || "0") || 0);
    setCurrentCompleted(completed);
    setUpdateMode("add");
    setQuantityToAdd("");
    setModalVisible(true);
  };

  // Function to handle updating quantity directly
  const handleUpdateQuantity = (orderId: string, size: string) => {
    const order = orderData.find((o) => o.id === orderId);
    const sizeData = order?.sizes.find((s) => s.size === size);
    const completed = sizeData?.completed || "0";

    setSelectedOrder(orderId);
    setSelectedSize(size);
    setSelectedItemId(sizeData?.itemId);
    setSelectedOrderQty(parseInt(sizeData?.dcQty || "0") || 0);
    setCurrentCompleted(completed);
    setUpdateMode("update");
    setQuantityToAdd(completed);
    setModalVisible(true);
  };

  const updateLocalCompleted = (newValue: number) => {
    setOrderData((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== selectedOrder) return order;
        return {
          ...order,
          sizes: order.sizes.map((sizeItem) => {
            if (sizeItem.size !== selectedSize) return sizeItem;
            return { ...sizeItem, completed: String(newValue) };
          }),
        };
      })
    );
  };

  // Function to save the quantity changes with constraints and backend update
  const saveQuantityChanges = () => {
    if (!selectedOrder || !selectedSize || quantityToAdd === "") {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    const qty = parseInt(quantityToAdd);
    if (isNaN(qty) || qty < 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    const prevCompleted = parseInt(currentCompleted || "0") || 0;
    const orderQty = selectedOrderQty || 0;
    const nextCompleted = updateMode === "add" ? prevCompleted + qty : qty;

    if (nextCompleted > orderQty) {
      Alert.alert(
        "Invalid quantity",
        "Completed quantity cannot exceed the order quantity."
      );
      return;
    }

    const proceed = () => {
      updateLocalCompleted(nextCompleted);
      setModalVisible(false);
      setQuantityToAdd("");
      const sOrderId = selectedOrder;
      const sItemId = selectedItemId;
      const newVal = nextCompleted;
      setTimeout(async () => {
        try {
          if (sOrderId && sItemId) {
            await apiCorrectOrderItem(sOrderId, sItemId, {
              completeQty: newVal,
            });
          }
        } catch (e) {
          // ignore API error, UI already updated
        }
      }, 0);
      Alert.alert(
        "Success",
        `Quantity ${updateMode === "add" ? "added" : "updated"} successfully`
      );
      setSelectedOrder(null);
      setSelectedSize(null);
      setSelectedItemId(undefined);
      setCurrentCompleted("");
    };

    if (updateMode === "update" && qty < prevCompleted) {
      Alert.alert(
        "Confirm Reduction",
        `Do you want to reduce the count to '${qty}'?`,
        [
          { text: "No", style: "cancel" },
          { text: "Yes", style: "destructive", onPress: proceed },
        ]
      );
      return;
    }

    proceed();
  };

  // Function to add a new size field in the new item form
  const addSizeField = () => {
    setNewItem((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", dcQty: "" }],
    }));
    // clear top-level sizes error if present
    if (validationTriggered && fieldErrors.sizes) {
      setFieldErrors((prev: any) => ({ ...prev, sizes: undefined }));
    }
  };

  // Function to remove a size field from the new item form
  const removeSizeField = (index: number) => {
    if (newItem.sizes.length > 1) {
      setNewItem((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index),
      }));
    }
  };

  // Function to handle due date selection (enforce > today at pick time)
  const handleDueDateSelect = (date: Date) => {
    const today = new Date();
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (dateOnly <= todayOnly) {
      Alert.alert("Invalid due date", "Due date must be after today.");
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];
    setNewItem((prev) => ({ ...prev, dueDate: formattedDate }));
    if (validationTriggered && fieldErrors.dueDate) {
      setFieldErrors((prev: any) => ({ ...prev, dueDate: undefined }));
    }
    setTempDueDate(date);
  };

  // Function to show date picker
  const showDatePicker = () => {
    setShowDueDatePicker(true);
  };

  // Function to update size field values
  const updateSizeField = (
    index: number,
    field: "size" | "dcQty",
    value: string
  ) => {
    setNewItem((prev) => ({
      ...prev,
      sizes: prev.sizes.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
    if (validationTriggered) {
      setFieldErrors((prev: any) => {
        const next = { ...prev };
        // clear per-index size/quantity errors
        if (next[`size_${index}`]) next[`size_${index}`] = undefined;
        if (next[`dcQty_${index}`]) next[`dcQty_${index}`] = undefined;
        // clear top-level sizes error
        if (next.sizes) next.sizes = undefined;
        return next;
      });
    }
  };

  // Function to update accessory field values
  const addAccessoryField = () => {
    setNewItem((prev) => ({
      ...prev,
      accessories: [...prev.accessories, { item: "", quantity: "" }],
    }));
  };

  const removeAccessoryField = (index: number) => {
    if (newItem.accessories.length > 1) {
      setNewItem((prev) => ({
        ...prev,
        accessories: prev.accessories.filter((_, i) => i !== index),
      }));
    }
  };

  const updateAccessoryField = (
    index: number,
    field: "item" | "quantity",
    value: string
  ) => {
    setNewItem((prev) => ({
      ...prev,
      accessories: prev.accessories.map((acc, i) =>
        i === index ? { ...acc, [field]: value } : acc
      ),
    }));
  };

  const validateCreateOrder = (): boolean => {
    let errors: any = {};
    // Supplier
    if (!newItem.supplier) errors.supplier = "Supplier Name is required*";
    // DC Number: required first, then numeric check
    if (!newItem.dcNo) errors.dcNo = "DC Number is required*";
    else if (!/^[0-9]+$/.test(newItem.dcNo)) errors.dcNo = "Should be numeric";
    // Style
    if (!newItem.style) errors.style = "Style is required*";
    // PO Number: required first, then numeric check
    if (!newItem.poNumber) errors.poNumber = "PO Number is required*";
    else if (!/^[0-9]+$/.test(newItem.poNumber))
      errors.poNumber = "Should be numeric";
    // Priority / Origin
    if (!newItem.priority) errors.priority = "Priority is required*";
    if (!newItem.origin) errors.origin = "Origin is required*";
    // Due date: required only once
    if (!newItem.dueDate) errors.dueDate = "Due date is required*";
    else {
      const today = new Date();
      const due = new Date(newItem.dueDate);
      const dateOnly = new Date(
        due.getFullYear(),
        due.getMonth(),
        due.getDate()
      );
      const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      if (dateOnly <= todayOnly)
        errors.dueDate = "Due date must be after today";
    }
    // Validate at least one item and category
    if (
      !newItem.sizes.length ||
      !newItem.sizes[0].size ||
      !newItem.sizes[0].dcQty
    ) {
      errors.sizes = "Enter at least one item and quantity";
    } else {
      newItem.sizes.forEach((size, idx) => {
        if (!size.size) errors[`size_${idx}`] = "Size is required*";
        if (!size.dcQty) errors[`dcQty_${idx}`] = "Quantity is required*";
      });
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to save the new item
  const saveNewItem = async () => {
    setValidationTriggered(true);
    if (!validateCreateOrder()) return;

    const newOrder: OrderData = {
      id: Date.now().toString(),
      supplier: newItem.supplier,
      dcNo: newItem.dcNo,
      style: newItem.style,
      poNumber: newItem.poNumber,
      priority: newItem.priority,
      origin: newItem.origin,
      dueDate: newItem.dueDate,
      image: require("../../assets/images/Ord1.jpg"),
      favorite: false,
      expanded: false,
      sizes: newItem.sizes.map((s) => ({ ...s, completed: "0" })),
      accessories: newItem.accessories,
    };

    setSavingOrder(true);
    try {
      const res = await apiCreateOrder({
        supplierId: 1,
        dcNumber: newItem.dcNo,
        poNumber: newItem.poNumber,
        isUrgent: newItem.priority === "Urgent",
        isForeign: newItem.origin === "Foreign",
        dueDate: newItem.dueDate,
        items: newItem.sizes.map((s) => ({
          productStyle: newItem.style,
          productSize: s.size,
          orderQty: parseInt(s.dcQty) || 0,
          isAccessories: false,
        })),
      });

      // If backend returns created order, map it and append uniquely
      const created = res?.createOrder?.order;
      if (created) {
        const mapped: OrderData = {
          id: String(created.orderId ?? Date.now()),
          supplier: created.supplierId ? `Supplier ${created.supplierId}` : newItem.supplier || 'Supplier',
          dcNo: created.dcNumber || newItem.dcNo,
          style: (created.orderItems && created.orderItems[0]?.productStyle) || newItem.style,
          poNumber: created.poNumber || newItem.poNumber,
          priority: created.isUrgent ? ('Urgent' as const) : ('Normal' as const),
          origin: created.isForeign ? ('Foreign' as const) : ('Domestic' as const),
          dueDate: created.dueDate || newItem.dueDate,
          image: require('../../assets/images/Ord1.jpg'),
          favorite: false,
          expanded: false,
          sizes: (created.orderItems || []).map((it: any) => ({
            size: String(it.productSize ?? ''),
            dcQty: String(it.orderQty ?? '0'),
            completed: '0',
            itemId: String(it.itemId ?? ''),
          })),
          accessories: newItem.accessories || [],
        };

        setOrderData((prev) => {
          // dedupe by id
          const existing = prev.find((p) => p.id === mapped.id);
          const next = existing ? prev.map((p) => (p.id === mapped.id ? mapped : p)) : [...prev, mapped];
          ordersCache = next;
          return next;
        });
      }
    } catch (e) {
      console.warn('createOrder failed:', e);
      // fallback: do nothing (optionally show error)
    } finally {
      setSavingOrder(false);
    }

  setNewItem(initialNewItem);
  setFieldErrors({});
  setValidationTriggered(false);
    setNewItemModalVisible(false);
    setShowDueDatePicker(false);
    setTempDueDate(new Date());
    Alert.alert("Success", "New order created");
  };

  const requestCloseNewItemDialog = () => {
    setConfirmLeaveVisible(true);
  };
  const confirmLeave = () => {
    setConfirmLeaveVisible(false);
    setFieldErrors({});
    setNewItem(initialNewItem);
    setNewItemModalVisible(false);
  };

  // Function to handle multiple delete
  const handleMultipleDelete = async () => {
    if (selectedOrders.length > 0) {
      setDeleteConfirmVisible(true);
    }
  };

  // Function to cancel selection mode
  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedOrders([]);
    setExpandedOrders({});
  };

  // Function to handle card press
  const handleCardPress = (orderId: string) => {
    if (selectionMode) {
      setSelectedOrders((prev) => {
        if (prev.includes(orderId)) {
          const next = prev.filter((id) => id !== orderId);
          if (next.length === 0) {
            // exit selection mode when nothing is selected
            setSelectionMode(false);
          }
          return next;
        } else {
          return [...prev, orderId];
        }
      });
    } else {
      setExpandedOrders((prev) => {
        const currently = !!prev[orderId];
        return { ...prev, [orderId]: !currently };
      });
    }
  };

  // Function to handle long press on card
  const handleCardLongPress = (orderId: string) => {
    setSelectionMode(true);
    setSelectedOrders([orderId]);
  };

  // Function to confirm and delete selected orders
  const confirmDeleteOrder = async () => {
    if (selectedOrders.length === 0) return;
  const ids = [...selectedOrders];
  setDeleting(true);
    try {
      // call backend delete first
      await Promise.all(ids.map((id) => apiDeleteOrder(id)));

      // clear cache so useEffect will fetch fresh data
      ordersCache = null;
      setOrdersReloadCounter((c) => c + 1);

      setExpandedOrders((prev) => {
        const next = { ...prev };
        ids.forEach((id) => delete next[id]);
        return next;
      });
      setSelectionMode(false);
      setSelectedOrders([]);
      Alert.alert("Success", `${ids.length} order(s) removed successfully`);
      setDeleteConfirmVisible(false);
    } catch (e) {
      console.warn('deleteOrder failed, falling back to optimistic remove', e);
      // optimistic fallback
      setOrderData((prevOrders) => prevOrders.filter((order) => !ids.includes(order.id)));
      setExpandedOrders((prev) => {
        const next = { ...prev };
        ids.forEach((id) => delete next[id]);
        return next;
      });
      setSelectionMode(false);
      setSelectedOrders([]);
      Alert.alert('Notice', 'Delete attempted but server may not have been updated. The item was removed locally.');
      setDeleteConfirmVisible(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {selectionMode ? (
            <>
              <TouchableOpacity
                onPress={cancelSelectionMode}
                style={styles.backButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedOrders.length} Selected
              </Text>
              <TouchableOpacity
                onPress={handleMultipleDelete}
                style={styles.deleteAllButton}
              >
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Orders</Text>
              <View style={{ width: 24 }} />
            </>
          )}
        </View>

        {/* Orders List */}
          <ScrollView
            style={styles.ordersList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  ordersCache = null;
                  setOrdersReloadCounter((c) => c + 1);
                }}
              />
            }
          >
          {ordersLoading ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            orderData.map((order) => (
              <Card
              key={order.id}
              style={[
                styles.card,
                selectedOrders.includes(order.id) && styles.cardSelected,
              ]}
              elevation={selectedOrders.includes(order.id) ? 5 : 3}
              onPress={() => handleCardPress(order.id)}
              onLongPress={() => handleCardLongPress(order.id)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  {order.favorite && (
                    <Ionicons
                      name="star"
                      size={18}
                      color="#FFD700"
                      style={styles.starIcon}
                    />
                  )}
                  <Image
                    source={
                      typeof order.image === "string"
                        ? { uri: order.image }
                        : order.image
                    }
                    style={styles.orderImage}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.supplierName}>{order.supplier}</Text>
                    <Text style={styles.styleText}>Style: {order.style}</Text>
                    <Text
                      style={[
                        styles.styleText,
                        {
                          color:
                            order.priority === "Urgent" ? "#FF6B6B" : "#009688",
                        },
                      ]}
                    >
                      Priority: {order.priority}
                    </Text>
                    <Text
                      style={[
                        styles.styleText,
                        {
                          color:
                            order.origin === "Foreign" ? "#4A90E2" : "#009688",
                        },
                      ]}
                    >
                      Origin: {order.origin}
                    </Text>
                  </View>
                  <View style={styles.dcNumberContainer}>
                    <Text style={styles.dcLabel}>DC No</Text>
                    <Text style={styles.dcNumber}>{order.dcNo}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    {selectionMode && (
                      <View
                        style={[
                          styles.checkboxContainer,
                          selectedOrders.includes(order.id) &&
                            styles.checkboxSelected,
                        ]}
                      >
                        {selectedOrders.includes(order.id) && (
                          <Ionicons name="checkmark" size={20} color="white" />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>

              {expandedOrders[order.id] === true && (
                <Card.Content style={styles.expandedContent}>
                  <View style={styles.divider} />

                  {/* Column Headers */}
                  <View style={styles.detailsHeader}>
                    <Text style={[styles.detailHeaderText, { flex: 0.7 }]}>
                      Product
                    </Text>
                    <Text style={[styles.detailHeaderText, { flex: 1 }]}>
                      Order Qty
                    </Text>
                    <Text style={[styles.detailHeaderText, { flex: 1 }]}>
                      Completed
                    </Text>
                    <Text style={[styles.detailHeaderText, { flex: 0.7 }]}>
                      Action
                    </Text>
                  </View>

                  {/* Size Rows */}
                  {order.sizes &&
                    order.sizes.map((sizeData, index) => (
                      <View key={index} style={styles.sizeRow}>
                        <Text style={[styles.sizeText, { flex: 0.7 }]}>
                          {sizeData.size}
                        </Text>
                        <Text style={[styles.qtyText, { flex: 1 }]}>
                          {sizeData.dcQty} pcs
                        </Text>
                        <Text style={[styles.completedText, { flex: 1 }]}>
                          {sizeData.completed} pcs
                        </Text>
                        <View style={{ flex: 0.7, alignItems: "center" }}>
                          <TouchableOpacity
                            style={styles.updateQtyButton}
                            onPress={() =>
                              handleUpdateQuantity(
                                order.id,
                                sizeData.size || ""
                              )
                            }
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                  {/* Delivery Button */}
                  <Button
                    mode="contained"
                    style={styles.deliveryButton}
                    labelStyle={styles.deliveryButtonText}
                    onPress={() =>
                      router.push({
                        pathname: "/order-history",
                        params: { orderId: order.id },
                      })
                    }
                  >
                    Delivery
                  </Button>
                </Card.Content>
              )}
              </Card>
            ))
          )}
        </ScrollView>

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            setFieldErrors({});
            setNewItem(initialNewItem);
            setNewItemModalVisible(true);
          }}
          color="white"
        />

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Quantity Modal */}
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>
              {updateMode === "add" ? "Add Quantity" : "Update Quantity"}
            </Dialog.Title>
            <Dialog.Content>
              {updateMode === "add" ? (
                <View style={styles.currentQtyContainer}>
                  <Text style={styles.currentQtyLabel}>Current Completed:</Text>
                  <Text style={styles.currentQtyValue}>
                    {currentCompleted} pcs
                  </Text>
                </View>
              ) : null}

              <PaperInput
                label={
                  updateMode === "add"
                    ? "Quantity to Add"
                    : "New Completed Quantity"
                }
                value={quantityToAdd}
                onChangeText={setQuantityToAdd}
                keyboardType="numeric"
                style={styles.quantityInput}
                mode="outlined"
                activeOutlineColor="#009688"
                outlineColor="#DDDDDD"
                theme={{ colors: { primary: "#009688" } }}
              />

              {updateMode === "add" ? (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>New Total:</Text>
                  <Text style={styles.resultValue}>
                    {isNaN(parseInt(quantityToAdd))
                      ? currentCompleted
                      : (
                          parseInt(currentCompleted) + parseInt(quantityToAdd)
                        ).toString()}{" "}
                    pcs
                  </Text>
                </View>
              ) : null}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setModalVisible(false)} textColor="#666">
                Cancel
              </Button>
              <Button onPress={saveQuantityChanges} textColor="#009688">
                {updateMode === "add" ? "Add" : "Update"}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Add New Item Modal */}
        <Portal>
          <Dialog
            visible={newItemModalVisible}
            onDismiss={requestCloseNewItemDialog}
            style={styles.newItemDialog}
          >
            <View style={styles.dialogHeaderContainer}>
              <View style={styles.dialogHeaderContent}>
                <MaterialIcons
                  name="add-shopping-cart"
                  size={28}
                  color="white"
                />
                <Text style={styles.dialogHeaderTitle}>Create New Order</Text>
              </View>
              <TouchableOpacity
                onPress={requestCloseNewItemDialog}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Dialog.ScrollArea style={styles.scrollArea}>
              <ScrollView style={styles.newItemScrollView}>
                <Card style={styles.newItemCard}>
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons
                        name="information-circle"
                        size={22}
                        color="#009688"
                      />
                      <Text style={styles.cardSectionTitle}>
                        Basic Information
                      </Text>
                    </View>

                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="business"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <PaperInput
                          label="Supplier Name"
                          value={newItem.supplier}
                          onChangeText={(text) => {
                            setNewItem((prev) => ({ ...prev, supplier: text }));
                            if (validationTriggered && fieldErrors.supplier) {
                              setFieldErrors((prev: any) => ({ ...prev, supplier: undefined }));
                            }
                          }}
                          style={styles.input}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: "#009688" } }}
                        />
                        {fieldErrors.supplier && (
                          <Text style={styles.warningText}>
                            {fieldErrors.supplier}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="document-text"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <PaperInput
                        label="DC Number"
                        value={newItem.dcNo}
                        onChangeText={(text) => {
                          if (/^[0-9]*$/.test(text))
                            setNewItem((prev) => ({ ...prev, dcNo: text }));
                          if (validationTriggered && fieldErrors.dcNo) {
                            setFieldErrors((prev: any) => ({ ...prev, dcNo: undefined }));
                          }
                        }}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        keyboardType="numeric"
                        theme={{ colors: { primary: "#009688" } }}
                      />
                    </View>
                    {fieldErrors.dcNo && (
                      <Text style={styles.warningText}>{fieldErrors.dcNo}</Text>
                    )}

                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="shirt"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <PaperInput
                          label="Style"
                          value={newItem.style}
                          onChangeText={(text) => {
                            setNewItem((prev) => ({ ...prev, style: text }));
                            if (validationTriggered && fieldErrors.style) {
                              setFieldErrors((prev: any) => ({ ...prev, style: undefined }));
                            }
                          }}
                          style={styles.input}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: "#009688" } }}
                        />
                        {fieldErrors.style && (
                          <Text style={styles.warningText}>
                            {fieldErrors.style}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="document-text"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <PaperInput
                        label="PO Number"
                        value={newItem.poNumber}
                        onChangeText={(text) => {
                          if (/^[0-9]*$/.test(text))
                            setNewItem((prev) => ({ ...prev, poNumber: text }));
                          if (validationTriggered && fieldErrors.poNumber) {
                            setFieldErrors((prev: any) => ({ ...prev, poNumber: undefined }));
                          }
                        }}
                        style={styles.input}
                        mode="outlined"
                        activeOutlineColor="#009688"
                        outlineColor="#DDDDDD"
                        keyboardType="numeric"
                        theme={{ colors: { primary: "#009688" } }}
                      />
                    </View>
                    {fieldErrors.poNumber && (
                      <Text style={styles.warningText}>
                        {fieldErrors.poNumber}
                      </Text>
                    )}

                    {/* Priority */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="rocket"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <View
                        style={[
                          styles.input,
                          { justifyContent: "center", paddingVertical: 12 },
                        ]}
                      >
                        <Text
                          style={{
                            color: "#666",
                            fontSize: 12,
                            marginBottom: 4,
                          }}
                        >
                          Priority
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 15,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              setNewItem((prev) => ({
                                ...prev,
                                priority: "Normal",
                              }))
                            }
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <RadioButton.Android
                              value="Normal"
                              status={
                                newItem.priority === "Normal"
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                setNewItem((prev) => ({
                                  ...prev,
                                  priority: "Normal",
                                }))
                              }
                              color="#009688"
                            />
                            <Text>Normal</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              setNewItem((prev) => ({
                                ...prev,
                                priority: "Urgent",
                              }))
                            }
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <RadioButton.Android
                              value="Urgent"
                              status={
                                newItem.priority === "Urgent"
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                setNewItem((prev) => ({
                                  ...prev,
                                  priority: "Urgent",
                                }))
                              }
                              color="#FF6B6B"
                            />
                            <Text>Urgent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Origin */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="globe"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <View
                        style={[
                          styles.input,
                          { justifyContent: "center", paddingVertical: 12 },
                        ]}
                      >
                        <Text
                          style={{
                            color: "#666",
                            fontSize: 12,
                            marginBottom: 4,
                          }}
                        >
                          Origin
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 15,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              setNewItem((prev) => ({
                                ...prev,
                                origin: "Domestic",
                              }))
                            }
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <RadioButton.Android
                              value="Domestic"
                              status={
                                newItem.origin === "Domestic"
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                setNewItem((prev) => ({
                                  ...prev,
                                  origin: "Domestic",
                                }))
                              }
                              color="#009688"
                            />
                            <Text>Domestic</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              setNewItem((prev) => ({
                                ...prev,
                                origin: "Foreign",
                              }))
                            }
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <RadioButton.Android
                              value="Foreign"
                              status={
                                newItem.origin === "Foreign"
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                setNewItem((prev) => ({
                                  ...prev,
                                  origin: "Foreign",
                                }))
                              }
                              color="#4A90E2"
                            />
                            <Text>Foreign</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Due Date */}
                    <View style={styles.inputWithIcon}>
                      <Ionicons
                        name="calendar"
                        size={20}
                        color="#009688"
                        style={styles.inputIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <PaperInput
                          label="Due Date"
                          value={newItem.dueDate || ""}
                          editable={false}
                          style={styles.input}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: "#009688" } }}
                          right={
                            <PaperInput.Icon
                              icon="calendar"
                              color="#009688"
                              onPress={() => {
                                setTempDueDate(
                                  newItem.dueDate
                                    ? new Date(newItem.dueDate)
                                    : new Date()
                                );
                                showDatePicker();
                              }}
                            />
                          }
                        />
                        <TouchableOpacity
                          style={[styles.datePickerTouchable, { zIndex: 9999 }]}
                          onPress={() => {
                            setTempDueDate(
                              newItem.dueDate
                                ? new Date(newItem.dueDate)
                                : new Date()
                            );
                            showDatePicker();
                          }}
                        />
                        {fieldErrors.dueDate && (
                          <View style={{ marginTop: 4 }}>
                            <Text style={styles.warningText}>
                              {fieldErrors.dueDate}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* duplicate dueDate message removed - single message shown above */}
                  </Card.Content>
                </Card>
                <Card style={[styles.newItemCard, { marginTop: 10 }]}>
                  {" "}
                  {/* reduced top margin */}
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons name="resize" size={22} color="#009688" />
                      <Text style={styles.cardSectionTitle}>Add Item</Text>
                    </View>
                    {newItem.sizes.map((sizeItem, index) => (
                      <View key={index} style={styles.sizeInputRow}>
                        <View style={styles.sizeNumberBadge}>
                          <Text style={styles.sizeNumberText}>{index + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <PaperInput
                            label="Size"
                            value={sizeItem.size}
                            onChangeText={(text) =>
                              updateSizeField(index, "size", text)
                            }
                            style={styles.sizeInput}
                            mode="outlined"
                            activeOutlineColor="#009688"
                            outlineColor="#DDDDDD"
                            theme={{ colors: { primary: "#009688" } }}
                          />
                          {fieldErrors[`size_${index}`] && (
                            <Text style={styles.warningText}>
                              {fieldErrors[`size_${index}`]}
                            </Text>
                          )}
                        </View>
                        <View style={{ flex: 1.5 }}>
                          <PaperInput
                            label="Quantity"
                            value={sizeItem.dcQty}
                            onChangeText={(text) => {
                              if (/^[0-9]*$/.test(text))
                                updateSizeField(index, "dcQty", text);
                            }}
                            style={[
                              styles.qtyInput,
                              { flex: 1, marginRight: 5, textAlign: "left" },
                            ]}
                            keyboardType="numeric"
                            activeOutlineColor="#009688"
                            outlineColor="#DDDDDD"
                            theme={{ colors: { primary: "#009688" } }}
                          />
                          {fieldErrors[`dcQty_${index}`] && (
                            <Text style={styles.warningText}>
                              {fieldErrors[`dcQty_${index}`]}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => removeSizeField(index)}
                          style={styles.removeButton}
                        >
                          <MaterialIcons
                            name="remove-circle"
                            size={24}
                            color="#FF6B6B"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {fieldErrors.sizes && (
                      <Text style={styles.warningText}>
                        {fieldErrors.sizes}
                      </Text>
                    )}
                  </Card.Content>
                </Card>

                <Button
                  mode="contained"
                  onPress={addSizeField}
                  style={styles.addSizeButton}
                  icon="plus"
                  buttonColor="#009688"
                  contentStyle={styles.addSizeButtonContent}
                >
                  Add Item
                </Button>

                {/* Add Accessories Card */}
                <Card style={[styles.newItemCard, { marginTop: 10 }]}>
                  {" "}
                  {/* reduced top margin */}
                  <Card.Content>
                    <View style={styles.cardTitleContainer}>
                      <Ionicons name="build" size={22} color="#009688" />
                      <Text style={styles.cardSectionTitle}>
                        Add Accessories
                      </Text>
                    </View>
                    {newItem.accessories.map((accItem, index) => (
                      <View key={index} style={styles.sizeInputRow}>
                        <View style={styles.sizeNumberBadge}>
                          <Text style={styles.sizeNumberText}>{index + 1}</Text>
                        </View>
                        <PaperInput
                          label="Item"
                          value={accItem.item}
                          onChangeText={(text) =>
                            updateAccessoryField(index, "item", text)
                          }
                          style={[styles.input, { flex: 1, marginRight: 5 }]}
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: "#009688" } }}
                        />
                        <PaperInput
                          label="Quantity"
                          value={accItem.quantity}
                          onChangeText={(text) =>
                            updateAccessoryField(index, "quantity", text)
                          }
                          style={[
                            styles.input,
                            { flex: 1, marginRight: 5, textAlign: "left" },
                          ]}
                          keyboardType="numeric"
                          mode="outlined"
                          activeOutlineColor="#009688"
                          outlineColor="#DDDDDD"
                          theme={{ colors: { primary: "#009688" } }}
                        />
                        <TouchableOpacity
                          onPress={() => removeAccessoryField(index)}
                          style={styles.removeButton}
                        >
                          <MaterialIcons
                            name="remove-circle"
                            size={24}
                            color="#FF6B6B"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </Card.Content>
                </Card>

                <Button
                  mode="contained"
                  onPress={addAccessoryField}
                  style={styles.addSizeButton}
                  icon="plus"
                  buttonColor="#009688"
                  contentStyle={styles.addSizeButtonContent}
                >
                  Add Accessories
                </Button>

                {/* Extra space at bottom of scroll view */}
                <View style={{ height: 30 }} />
              </ScrollView>
            </Dialog.ScrollArea>

            <Dialog.Actions style={styles.newItemDialogActions}>
              <View style={styles.actionButtonsContainer}>
                <Button
                  onPress={requestCloseNewItemDialog}
                  textColor="#666"
                  style={styles.cancelButton}
                  labelStyle={styles.buttonLabel}
                  contentStyle={styles.buttonContent}
                >
                  Cancel
                </Button>
                <Button
                  onPress={saveNewItem}
                  mode="contained"
                  buttonColor="#009688"
                  style={styles.saveButton}
                  labelStyle={styles.buttonLabel}
                  contentStyle={styles.buttonContent}
                  icon="check"
                  loading={savingOrder}
                  disabled={savingOrder}
                >
                  {savingOrder ? 'Saving...' : 'Save'}
                </Button>
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog
            visible={confirmLeaveVisible}
            onDismiss={() => setConfirmLeaveVisible(false)}
            style={[styles.dialog, { zIndex: 99999, elevation: 50 }]} // top-most
          >
            <Dialog.Title style={styles.dialogTitle}>Confirm</Dialog.Title>
            <Dialog.Content>
              <Text>
                Entered data will be lost! Are you sure you want to go back?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmLeaveVisible(false)}>No</Button>
              <Button onPress={confirmLeave}>Yes</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* ✅ Confirmation dialog rendered AFTER create order */}
        {/* <Portal>
          <Dialog
            visible={confirmLeaveVisible}
            onDismiss={() => setConfirmLeaveVisible(false)}
            style={[styles.dialog, { zIndex: 99999, elevation: 50 }]} // top-most
          >
            <Dialog.Title style={styles.dialogTitle}>Confirm</Dialog.Title>
            <Dialog.Content>
              <Text>
                Entered data will be lost! Are you sure you want to go back?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmLeaveVisible(false)}>No</Button>
              <Button onPress={confirmLeave}>Yes</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal> */}

        {/* Due Date Picker */}
        {showDueDatePicker && (
          <DateTimePicker
            value={tempDueDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDueDatePicker(false);
              if (selectedDate) {
                handleDueDateSelect(selectedDate);
              }
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Portal>
          <Dialog
            visible={deleteConfirmVisible}
            onDismiss={() => {
              if (!deleting) setDeleteConfirmVisible(false);
            }}
            style={styles.dialog}
          >
            <Dialog.Title style={styles.dialogTitle}>Remove Order</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to remove this order?</Text>
              <Text style={styles.warningText}>
                This action cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  if (!deleting) setDeleteConfirmVisible(false);
                }}
                textColor="#666"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button onPress={confirmDeleteOrder} textColor="#FF6B6B" disabled={deleting}>
                {deleting ? (
                  <ActivityIndicator size="small" color="#FF6B6B" />
                ) : (
                  'Remove'
                )}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  datePickerTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    overflow: "visible",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#009688",
    paddingTop: 45 /* reduced to trim extra whitespace */,
    paddingBottom: 12,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: "#009688",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  ordersList: {
    flex: 1,
    padding: 10,
    paddingBottom: 70,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#009688",
    backgroundColor: "#E8F5F3",
  },
  cardContent: {
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  starIcon: {
    position: "absolute",
    top: -5,
    left: -5,
    zIndex: 1,
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  styleText: {
    fontSize: 14,
    color: "#666",
  },
  dcNumberContainer: {
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 6,
  },
  dcLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  dcNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteAllButton: {
    padding: 5,
    width: 40,
    alignItems: "center",
  },
  checkboxContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#009688",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  checkboxSelected: {
    backgroundColor: "#009688",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  expandedContent: {
    paddingTop: 0,
  },
  detailsHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  detailHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#009688",
    flex: 1,
    textAlign: "center",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sizeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  qtyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  completedText: {
    fontSize: 14,
    color: "#009688",
    fontWeight: "500",
    textAlign: "center",
  },
  updateQtyButton: {
    backgroundColor: "#009688",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryButton: {
    backgroundColor: "#009688",
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 5,
  },
  deliveryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dialog: {
    borderRadius: 15,
    overflow: "visible",
  },
  dialogTitle: {
    color: "#009688",
    fontWeight: "bold",
  },
  quantityInput: {
    marginVertical: 10,
  },
  currentQtyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  currentQtyLabel: {
    fontSize: 14,
    color: "#666",
  },
  currentQtyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#009688",
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: "#F0F9F8",
    borderRadius: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009688",
  },
  newItemDialog: {
    borderRadius: 15,
    maxHeight:
      "92%" /* slightly reduced to avoid extra top whitespace perception */,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
  },
  dialogHeaderContainer: {
    backgroundColor: "#009688",
    padding: 12 /* reduced from 15 to trim top whitespace */,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  dialogHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dialogHeaderTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollArea: {
    paddingHorizontal: 12 /* reduced */,
  },
  newItemScrollView: {
    paddingVertical: 10 /* reduced */,
  },
  newItemCard: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "white",
    marginBottom: 10,
    overflow: "hidden",
    borderLeftWidth: 4,
    borderLeftColor: "#009688",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16 /* reduced */,
  },
  cardSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 15,
  },
  input: {
    flex: 1,
    marginBottom: 12 /* reduced */,
    backgroundColor: "white",
  },
  newItemDialogActions: {
    paddingVertical: 0,
    paddingHorizontal: 5,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 5,
  },
  cancelButton: {
    flex: 3,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 20,
  },
  saveButton: {
    flex: 3,
    borderRadius: 20,
    elevation: 3,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContent: {
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  sizeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12 /* reduced */,
    backgroundColor: "#F9FBFF",
    padding: 10,
    borderRadius: 8,
  },
  sizeNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sizeNumberText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
  },
  sizeInput: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "white",
  },
  qtyInput: {
    flex: 1.5,
    marginRight: 10,
    backgroundColor: "white",
  },
  removeButton: {
    padding: 5,
    backgroundColor: "#FFF0F0",
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  addSizeButton: {
    marginTop: 20 /* reduced */,
    marginBottom: 24 /* reduced */,
    alignSelf: "center",
    width: "60%",
    borderRadius: 25,
    elevation: 3,
  },
  addSizeButtonContent: {
    paddingVertical: 5,
  },
  warningText: {
    color: "#FF6B6B",
    marginTop: 10,
    fontStyle: "italic",
  },
});
