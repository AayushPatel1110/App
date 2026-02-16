// product.service.js

import { authStore } from "./store/authStore";
import api from "./api";
import { getCookie, setCookie } from "./cookie";

// Default app-wide product context
const PRODUCT_KEY = process.env.NEXT_PUBLIC_PRODUCT_KEY || "property";
const PRODUCT_NAME = process.env.NEXT_PUBLIC_PRODUCT_NAME || "Property";
const PRODUCT_COOKIE_KEY = "product_key";
const PRODUCT_LOCAL_KEY = "product_key";
let inMemoryProductKey = "";
const LEGACY_PRODUCT_KEYS = new Set(["seaneb", "dummy pro", "dummy-pro", "dummy_pro"]);
const normalizeKey = (key) => String(key || "").trim().toLowerCase();
const isLegacyKey = (key) => LEGACY_PRODUCT_KEYS.has(normalizeKey(key));

const getStoredProductKey = () => {
  if (inMemoryProductKey) {
    if (!isLegacyKey(inMemoryProductKey)) return inMemoryProductKey;
    inMemoryProductKey = "";
  }

  const cookieKey = String(getCookie(PRODUCT_COOKIE_KEY) || "").trim();
  if (cookieKey && !isLegacyKey(cookieKey)) {
    inMemoryProductKey = cookieKey;
    return cookieKey;
  }

  if (typeof window !== "undefined") {
    const localKey = String(window.localStorage.getItem(PRODUCT_LOCAL_KEY) || "").trim();
    if (localKey && !isLegacyKey(localKey)) {
      inMemoryProductKey = localKey;
      return localKey;
    }
  }

  return "";
};

export const setDefaultProductKey = (key) => {
  const productKey = String(key || "").trim();
  if (!productKey || isLegacyKey(productKey)) return;

  inMemoryProductKey = productKey;
  setCookie(PRODUCT_COOKIE_KEY, productKey, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRODUCT_LOCAL_KEY, productKey);
  }
};

export const getDefaultProductKey = () => {
  const key = getStoredProductKey() || PRODUCT_KEY;
  if (typeof window !== "undefined") {
    // Keep browser storage consistent to prevent old keys from resurfacing after reload.
    setDefaultProductKey(key);
  }
  console.log(` Product Key: ${key}`);
  return key;
};

export const getDefaultProductName = () => PRODUCT_NAME;

const createDefaultProduct = async () => {
  const productKey = getDefaultProductKey();
  try {
    console.log(`\n [Products Service] No products found. Creating default '${productKey}' product...`);
    const res = await api.post("/products", {
      product_key: productKey,
      product_name: PRODUCT_NAME,
    });

    console.log(" [Products Service] Default product creation response:", res?.status, res?.data);
    return true;
  } catch (err) {
    const status = err?.response?.status;

    // Treat conflict as success-like: product already exists.
    if (status === 409) {
      console.warn(" [Products Service] Default product already exists (409)");
      return true;
    }

    console.error(" [Products Service] Failed to create default product:", err?.response?.data || err?.message);
    return false;
  }
};

export const getProducts = async () => {
  // GET /api/v1/products - Protected endpoint (requires access_token)
  try {
    console.log("\n [Products Service] Fetching product list...");
    
    const token = authStore.getAccessToken();
    if (!token) {
      console.warn(" No access token available");
      return [];
    }

    console.log("    Access token found (length=" + token.length + ")");
    const productKey = getDefaultProductKey();
    console.log(`   Making request: GET /products?product_key=${productKey}`);

    // Use the authenticated 'api' instance which has:
    // - Automatic Authorization header injection
    // - Response interceptor for automatic token refresh on 401
    // - All other request/response middleware
    const res = await api.get("/products", {
      params: {
        product_key: productKey
      }
    });

    // API returns array directly: [{ product_id, product_key, product_name }, ...]
    let data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];

    // Auto-bootstrap one default product for freshly logged-in users.
    if (data.length === 0) {
      const created = await createDefaultProduct();

      if (created) {
        const refetch = await api.get("/products", {
          params: {
            product_key: productKey,
          },
        });
        data = Array.isArray(refetch.data) ? refetch.data : refetch.data?.data ?? [];
      }
    }

    const firstKey = String(data?.[0]?.product_key || "").trim();
    if (firstKey) {
      setDefaultProductKey(firstKey);
    }
    
    console.log("\n [Products Service] Successfully fetched products:");
    console.log(`   Total items: ${data.length}`);
    
    if (data.length > 0) {
      console.log("   Sample:", data[0]);
    }
    
    return data;
  } catch (err) {
    console.error("\n [Products Service] Fetch failed:");
    console.error(`   Status: ${err?.response?.status}`);
    console.error(`   Message: ${err?.message}`);
    console.error(`   Data: ${JSON.stringify(err?.response?.data || {})}`);

    // If 401 persists after refresh attempt, authentication is truly invalid
    if (err?.response?.status === 401) {
      console.warn("\n️ Got 401 after auto-refresh - session may be expired");
      console.warn("   → Endpoint call: /products");
      console.warn("   → Cause: Token refresh failed or session expired after 6 hours");
      console.warn("   → Action: User needs to login again");
    }
    
    return [];
  }
};
