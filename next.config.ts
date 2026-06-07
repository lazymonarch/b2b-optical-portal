import type { NextConfig } from "next";

const serverGlobal = globalThis as typeof globalThis & {
  localStorage?: Storage;
};

if (
  typeof window === "undefined" &&
  (!serverGlobal.localStorage || typeof serverGlobal.localStorage.getItem !== "function")
) {
  const memoryStorage = new Map<string, string>();

  Object.defineProperty(serverGlobal, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => memoryStorage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memoryStorage.set(key, value);
      },
      removeItem: (key: string) => {
        memoryStorage.delete(key);
      },
      clear: () => {
        memoryStorage.clear();
      },
      key: (index: number) => Array.from(memoryStorage.keys())[index] ?? null,
      get length() {
        return memoryStorage.size;
      },
    },
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
