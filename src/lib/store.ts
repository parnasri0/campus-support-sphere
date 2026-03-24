// Simple localStorage-based store utility
const CURRENT_USER = {
  id: "user-1",
  email: "student@campus.edu",
  name: "Student",
};

export function getCurrentUser() {
  return CURRENT_USER;
}

export function getItems<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function addItem<T>(key: string, item: T) {
  const items = getItems<T>(key);
  items.unshift(item);
  setItems(key, items);
}

export function updateItem<T extends { id: string }>(key: string, id: string, updates: Partial<T>) {
  const items = getItems<T>(key);
  const updated = items.map(item => item.id === id ? { ...item, ...updates } : item);
  setItems(key, updated);
  return updated;
}

export function generateId() {
  return crypto.randomUUID();
}
