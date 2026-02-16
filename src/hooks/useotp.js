"use client";

import { useEffect, useState } from "react";
import {
  sendOtp,
  verifyOtp,
} from "@/services/otp.service";
import { getJsonCookie, setCookie, setJsonCookie, getCookie } from "@/services/cookie";
import {
  sendEmailOtp,
  verifyEmailOtp,
} from "@/services/email.service";

export default function useOtp({ onSuccess, t }) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const otpContext = getJsonCookie("otp_context");

  const isEmail = otpContext?.type === "email";
  const otpPurpose = Number(otpContext?.purpose) || 1;


  const verify = async (otp) => {
    if (!otpContext || otp.length !== 4 || loading) return;

    try {
      setLoading(true);
      setInfoMessage("");

      let response;

      if (isEmail) {
        response = await verifyEmailOtp({
          email: otpContext.email,
          otp,
          purpose: otpPurpose,
        });

        setCookie("email_verified", "true", { maxAge: 60 * 60 * 24 * 7 });
        setCookie("verified_email", otpContext.email, { maxAge: 60 * 60 * 24 * 7 });
      } else {
        response = await verifyOtp({ otp });

        setCookie("mobile_verified", "true", { maxAge: 60 * 60 * 24 * 7 });
        setJsonCookie(
          "verified_mobile",
          {
            country_code: otpContext.country_code,
            mobile_number: otpContext.mobile_number,
          },
          { maxAge: 60 * 60 * 24 * 7 }
        );

        // Debug: log cookie values immediately after setting them
        try {
          console.log("[useOtp] setCookie mobile_verified ->", getCookie("mobile_verified"));
          console.log("[useOtp] otp_mobile ->", getCookie("otp_mobile"));
          console.log("[useOtp] otp_cc ->", getCookie("otp_cc"));
        } catch (e) {
          console.warn("[useOtp] cookie debug failed", e);
        }
      }

      const data = response?.data || {};

      if (data.access_token && data.user_exists === undefined) {
        data.user_exists = true;
      }

      onSuccess?.(data);
    } catch (err) {
      setInfoMessage(
        err?.response?.data?.message || t?.otpInvalid || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };


  const resend = async (via) => {
    if (!otpContext || cooldown > 0 || resending) return;

    try {
      setResending(true);
      setInfoMessage("");

      if (isEmail) {
        await sendEmailOtp({ email: otpContext.email, purpose: otpPurpose });
        setInfoMessage(t?.otpResentEmail || "OTP sent to email");
      } else {
        await sendOtp({ via });
        setInfoMessage(
          via === "whatsapp"
            ? t?.otpResentWhatsapp
            : t?.otpResentSms
        );
      }

      setCooldown(30);
    } catch {
      setInfoMessage(t?.otpResendFailed || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };


  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    verify,
    resend,
    loading,
    resending,
    infoMessage,
    cooldown,
    isEmail,
  };
}
