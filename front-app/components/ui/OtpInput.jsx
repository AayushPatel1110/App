"use client";

import { useRef } from "react";

export default function OtpInput({ length = 4, onChange }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;
    e.target.value = value;

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const otp = inputsRef.current.map((input) => input?.value || "").join("");
    onChange?.(otp);
  };

  return (
    <div className="flex gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="password"
          maxLength={1}
          onChange={(e) => handleChange(e, i)}
          className="w-14 h-14 text-center text-xl border border-gray-200 rounded-xl outline-none focus:border-black"
        />
      ))}
    </div>
  );
}
