"use client";

export default function OtpCard({
  title,
  subtitle,
  children,
  onSubmit,
  submitText,
  disabled
}) {
  return (
    <div className="page-center">
      <div className="auth-card otp-card">

        {children}

        <button
          disabled={disabled}
          onClick={onSubmit}
          className={`primary-btn ${disabled ? "disabled-btn" : ""}`}
        >
          {submitText}
        </button>

      </div>
    </div>
  );
}
