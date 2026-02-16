import api from "./api";
import { getDefaultProductKey } from "./pro.service";


const formatDob = (dob) => {
  if (!dob) return null;

  // Already YYYY-MM-DD
  if (dob.split("-")[0]?.length === 4) {
    return dob;
  }

  // Convert DD-MM-YYYY → YYYY-MM-DD
  const [dd, mm, yyyy] = dob.split("-");
  if (!dd || !mm || !yyyy) return null;

  return `${yyyy}-${mm}-${dd}`;
};


export const signupUser = (data = {}) => {
  const {
    countryCode,
    country_code,
    mobileNumber,
    mobile_number,
    firstName,
    first_name,
    lastName,
    last_name,
    email,
    dob,
    seanebId,
    seaneb_id,
    placeId,
    place_id,
    gender,
    productKey,
    product_key,
  } = data;

  const finalCountryCode = country_code ?? countryCode;
  const finalMobile = mobile_number ?? mobileNumber;
  const finalFirstName = first_name ?? firstName;
  const finalLastName = last_name ?? lastName;
  const finalSeanebId = seaneb_id ?? seanebId;
  const finalPlaceId = place_id ?? placeId;

  const requestedProductKey = product_key ?? productKey;
  const finalProductKey = requestedProductKey ?? getDefaultProductKey();

  const finalEmail = email?.trim() || "";
  const finalGender = gender?.toLowerCase() || "";
  const finalDob = formatDob(dob);


  if (!finalCountryCode || !finalMobile) {
    return Promise.reject(
      new Error("Missing mobile verification data")
    );
  }

  if (!finalPlaceId) {
    return Promise.reject(new Error("City not selected"));
  }

  if (!finalEmail) {
    return Promise.reject(new Error("Email is required"));
  }

  if (!finalGender) {
    return Promise.reject(new Error("Gender is required"));
  }

  if (!finalDob) {
    return Promise.reject(new Error("Invalid date of birth"));
  }


  const payload = {
    country_code: String(finalCountryCode).trim(),
    mobile_number: String(finalMobile).trim(),
    first_name: finalFirstName?.trim() || "",
    last_name: finalLastName?.trim() || "",
    email: finalEmail.toLowerCase(),
    dob: finalDob,
    seaneb_id: finalSeanebId?.trim() || "",
    place_id: String(finalPlaceId).trim(),
    gender: finalGender,
    product_key: finalProductKey,
  };

  console.log("signupUser payload:", JSON.stringify(payload, null, 2));

  const isProductNotFound = (err) => {
    const status = err?.response?.status;
    const code = err?.response?.data?.error?.code;
    const message =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      "";

    return (
      status === 404 &&
      (code === "PRODUCT_NOT_FOUND" ||
        String(message).toLowerCase().includes("product not found"))
    );
  };

  const fallbackKeys = [
    ...new Set([getDefaultProductKey(), finalProductKey].filter(Boolean).map((k) => String(k).trim())),
  ];

  const trySignup = async () => {
    let lastError;

    for (const key of fallbackKeys) {
      try {
        const tryPayload = { ...payload, product_key: key };
        console.log(`[signupUser] trying with product_key=${key}`);
        return await api.post("/user/signup", tryPayload);
      } catch (err) {
        lastError = err;
        if (!isProductNotFound(err)) {
          throw err;
        }
      }
    }

    throw lastError;
  };

  return trySignup();
};
