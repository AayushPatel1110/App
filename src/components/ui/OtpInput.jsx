"use client";

import { useRef, useState } from "react";

export default function OtpInput({
  length = 4,
  onComplete,
  disabled = false
}) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const filled = otp.every(v => v);

  const onChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (next.every(v => v)) {
      onComplete?.(next.join(""));
    }
  };

  const onKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otp-box">
      {otp.map((v, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          value={v}
          maxLength={1}
          onChange={e => onChange(e.target.value, i)}
          onKeyDown={e => onKeyDown(e, i)}
          className="otp-input"
          inputMode="numeric"
          disabled={disabled}
        />
      ))}
    </div>
  );
}
