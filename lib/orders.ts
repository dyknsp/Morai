import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type OrderStatus = "new" | "processing" | "done";

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  familyName: string;
  givenName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
};

const ordersFile = process.env.ORDERS_FILE || join(process.cwd(), "data", "orders.json");
let mutationQueue: Promise<void> = Promise.resolve();

async function readFileOrders(): Promise<Order[]> {
  try {
    const contents = await readFile(ordersFile, "utf8");
    const orders: unknown = JSON.parse(contents);
    if (!Array.isArray(orders)) throw new Error("Orders file must contain a JSON array");
    return orders as Order[];
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function writeFileOrders(orders: Order[]) {
  await mkdir(dirname(ordersFile), { recursive: true });
  const temporaryFile = `${ordersFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(orders, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
  await rename(temporaryFile, ordersFile);
}

async function withMutation<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation);
  mutationQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function readOrders(): Promise<Order[]> {
  await mutationQueue;
  return (await readFileOrders()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order> {
  return withMutation(async () => {
    const completeOrder: Order = {
      ...order,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    const orders = await readFileOrders();
    orders.unshift(completeOrder);
    await writeFileOrders(orders);
    return completeOrder;
  });
}

export function setOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  return withMutation(async () => {
    const orders = await readFileOrders();
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) return false;
    order.status = status;
    await writeFileOrders(orders);
    return true;
  });
}
