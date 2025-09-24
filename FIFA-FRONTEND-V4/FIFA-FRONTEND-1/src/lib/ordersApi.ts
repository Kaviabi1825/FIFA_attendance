// Minimal GraphQL client for Orders backend (ported from project 1)
// Tries multiple possible endpoints to work across emulator, simulator, and LAN

const DEFAULT_HOSTS = [
  (process as any)?.env?.EXPO_PUBLIC_ORDERS_GRAPHQL_URL,
  (process as any)?.env?.REACT_APP_ORDERS_GRAPHQL_URL,
  'http://localhost:8080/graphql',
  'http://192.168.1.112:8080/graphql',
  'http://127.0.0.1:8080/graphql',
  'http://10.0.2.2:8080/graphql', // Android emulator
].filter(Boolean) as string[];

const GRAPHQL_ENDPOINTS = Array.from(new Set(DEFAULT_HOSTS));

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  let lastError: any = null;
  for (const endpoint of GRAPHQL_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      const json = (await response.json()) as GraphQLResponse<T>;
      if (!response.ok) {
        const message = json?.errors?.map((e) => e.message).join('; ') || `HTTP ${response.status} @ ${endpoint}`;
        lastError = new Error(message);
        continue;
      }
      if (json.errors && json.errors.length) {
        const message = json.errors.map((e) => e.message).join('; ');
        throw new Error(message);
      }
      if (!json.data) {
        lastError = new Error(`Empty response from ${endpoint}`);
        continue;
      }
      return json.data;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('Failed to fetch GraphQL endpoint');
}

// ===== GraphQL documents =====
const ORDERS_QUERY = `
  query Orders {
    orders {
      success
      message
      orders {
        orderId
        supplierId
        orderType
        orderService
        companyId
        personId
        customerId
        materialId
        isUrgent
        isForeign
        dueDate
        deliveryDate
        dcNumber
        poNumber
        orderItems {
          itemId
          productName
          productStyle
          productSize
          orderQty
          isAccessories
          status
        }
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: OrderCreateInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        orderId
        supplierId
        dcNumber
        poNumber
        isUrgent
        isForeign
        dueDate
        orderItems {
          itemId
          productStyle
          productSize
          orderQty
          isAccessories
        }
      }
    }
  }
`;

const UPDATE_ORDER_MUTATION = `
  mutation UpdateOrder($id: ID!, $input: OrderCreateInput!) {
    updateOrder(id: $id, input: $input) {
      success
      message
      order { orderId }
    }
  }
`;

const DELETE_ORDER_MUTATION = `
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      success
      message
    }
  }
`;

const CORRECT_ORDER_ITEM_MUTATION = `
  mutation CorrectOrderItem($orderId: ID!, $itemId: ID!, $correctedItem: OrderItemInput!) {
    correctOrderItem(orderId: $orderId, itemId: $itemId, correctedItem: $correctedItem) {
      success
      message
      order { orderId }
    }
  }
`;

// ===== API surface =====
export async function fetchOrders() {
  return graphqlFetch<{ orders: { success: boolean; message?: string; orders: Array<any> } }>(ORDERS_QUERY);
}

export async function createOrder(input: any) {
  return graphqlFetch<{ createOrder: { success: boolean; message?: string; order?: any } }>(
    CREATE_ORDER_MUTATION,
    { input }
  );
}

export async function updateOrder(id: string, input: any) {
  return graphqlFetch<{ updateOrder: { success: boolean; message?: string } }>(UPDATE_ORDER_MUTATION, { id, input });
}

export async function deleteOrder(id: string) {
  return graphqlFetch<{ deleteOrder: { success: boolean; message?: string } }>(DELETE_ORDER_MUTATION, { id });
}

export async function correctOrderItem(orderId: string, itemId: string, correctedItem: any) {
  return graphqlFetch<{ correctOrderItem: { success: boolean; message?: string } }>(
    CORRECT_ORDER_ITEM_MUTATION,
    { orderId, itemId, correctedItem }
  );
}
