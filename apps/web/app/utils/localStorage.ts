export class LocalStorage<T extends string> {
  map = new Map<T, string>();

  getItem(key: T) {
    if (typeof window === "undefined") return null; // SSR safety
    if (this.map.has(key)) return this.map.get(key);
    const value = localStorage.getItem(key);
    if (value) this.map.set(key, value);
    return value;
  }

  setItem(key: T, value: string) {
    if (typeof window === "undefined") return; // SSR safety
    this.map.set(key, value);
    localStorage.setItem(key, value);
  }

  removeItem(key: T) {
    if (typeof window === "undefined") return; // SSR safety
    this.map.delete(key);
    localStorage.removeItem(key);
  }
}

// Create a custom storage adapter for Zustand
export const LS = () => {
  const storage = new LocalStorage<string>();

  return {
    getItem: (name: string) => {
      const value = storage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: any) => {
      storage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      storage.removeItem(name);
    },
  };
};
