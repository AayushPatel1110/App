import axios from "axios";
import { authStore } from "./store/authStore";
import { getDefaultProductKey } from "./pro.service";

export const bootstrapProductAuth = async ({ force = false } = {}) => {
  console.log("\n[bootstrap] Page reloaded - attempting authentication recovery...");
  
  // Check if access token already exists
  const existingAccessToken = authStore.getAccessToken();
  if (existingAccessToken && !force) {
    console.log("    Access token already present - session preserved");
    return existingAccessToken;
  }

  if (force && existingAccessToken) {
    console.log("   Force mode enabled - existing access token will be ignored and re-bootstrapped");
  } else {
    console.log("   No access token in memory - will attempt recovery from cookies");
  }

  try {
    // Get CSRF and refresh token from cookies/storage
    const csrfToken = authStore.getCsrfToken();
    const refreshToken = authStore.getRefreshToken();
    const productKey = getDefaultProductKey();
    
    console.log("\n   Available tokens:");
    console.log(`     CSRF: ${csrfToken ? "FOUND" : "MISSING"}`);
    console.log(`     Refresh: ${refreshToken ? "FOUND" : "MISSING"} (also auto-sent via httpOnly cookie)`);
    console.log(`     Product Key: ${productKey}`);

    // STRATEGY 1: Try /auth/refresh with CSRF + product_key (if available)
    if (csrfToken && productKey) {
      console.log("\n   Strategy 1️⃣: POST /auth/refresh with CSRF header + product_key body");
      
      try {
        const requestBody = {
          product_key: productKey,
        };
        if (refreshToken) {
          requestBody.refresh_token = refreshToken;
          console.log("     Also including refresh_token in body");
        }
        
        console.log("     Request body:", JSON.stringify(requestBody));
        console.log("     CSRF header: " + csrfToken.substring(0, 20) + "...");
        
        const res = await axios.post(
          "https://dev.seaneb.com/api/v1/auth/refresh",
          requestBody,
          {
            withCredentials: true, // httpOnly refresh_token cookie auto-sent
            headers: {
              "x-csrf-token": csrfToken,
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = res?.data?.access_token;
        if (newAccessToken) {
          authStore.setAccessToken(newAccessToken);
          console.log("      SUCCESS: Access token regenerated!");
          return newAccessToken;
        }
      } catch (err) {
        console.warn("      Failed:", err.response?.status, err.response?.data?.error?.code);
      }
    }

    // STRATEGY 2: Try /auth/refresh with just product_key (no CSRF header)
    console.log("\n   Strategy 2️⃣: POST /auth/refresh with product_key (no CSRF)");
    
    try {
      const requestBody = {
        product_key: productKey,
      };
      if (refreshToken) {
        requestBody.refresh_token = refreshToken;
      }
      
      console.log("     Request body:", JSON.stringify(requestBody));
      
      const res = await axios.post(
        "https://dev.seaneb.com/api/v1/auth/refresh",
        requestBody,
        {
          withCredentials: true, // httpOnly refresh_token cookie auto-sent
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = res?.data?.access_token;
      if (newAccessToken) {
        authStore.setAccessToken(newAccessToken);
        
        // Also capture CSRF if server sends it
        if (res.data?.csrf_token) {
          authStore.setCsrfToken(res.data.csrf_token);
          console.log("      CSRF token captured from response");
        }
        
        console.log("      SUCCESS: Access token regenerated!");
        return newAccessToken;
      }
    } catch (err) {
      console.warn("      Failed:", err.response?.status, err.response?.data?.error?.code);
    }

    // STRATEGY 3: Try with empty body (just cookies)
    console.log("\n   Strategy 3️⃣: POST /auth/refresh with empty body (only cookies)");
    
    try {
      const res = await axios.post(
        "https://dev.seaneb.com/api/v1/auth/refresh",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = res?.data?.access_token;
      if (newAccessToken) {
        authStore.setAccessToken(newAccessToken);
        if (res.data?.csrf_token) {
          authStore.setCsrfToken(res.data.csrf_token);
        }
        console.log("      SUCCESS: Access token regenerated!");
        return newAccessToken;
      }
    } catch (err) {
      console.warn("      Failed:", err.response?.status, err.response?.data?.error?.code);
    }

    throw new Error("All bootstrap strategies failed");

  } catch (error) {
    console.error("\n[bootstrap] Recovery failed:");
    console.error(`   Status: ${error?.response?.status}`);
    console.error(`   Error Code: ${error?.response?.data?.error?.code}`);
    console.error(`   Message: ${error?.response?.data?.error?.message || error?.message}`);
    throw error;
  }
};
