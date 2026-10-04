import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const temporaryDirectory = await mkdtemp(join(tmpdir(), "morai-orders-"));
process.env.ORDERS_FILE = join(temporaryDirectory, "orders.json");
const { createOrder, readOrders, setOrderStatus } = await import("../lib/orders.ts");

after(async () => {
  await rm(temporaryDirectory, { recursive: true, force: true });
});

test("orders are persisted and their status can be updated", async () => {
  const order = await createOrder({
    familyName: "Иванова",
    givenName: "Анна",
    phone: "+7 900 123-45-67",
    items: [{ slug: "sample", name: "Тестовый аромат", quantity: 2, unitPrice: 1500, lineTotal: 3000 }],
    total: 3000,
  });

  assert.equal(order.status, "new");
  assert.equal((await readOrders())[0]?.id, order.id);
  assert.equal(await setOrderStatus(order.id, "processing"), true);
  assert.equal((await readOrders())[0]?.status, "processing");
  assert.equal(await setOrderStatus("missing-order", "done"), false);

  const savedFile = JSON.parse(await readFile(process.env.ORDERS_FILE, "utf8"));
  assert.equal(savedFile[0]?.phone, "+7 900 123-45-67");
});
