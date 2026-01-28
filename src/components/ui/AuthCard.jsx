"use client"

export default function AuthCard({
  children,
  header = null,
  width = 420,
  square = false,
}) {
  const cardSize = typeof width === "number" ? `${width}px` : width

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div
        className="bg-white border border-gray-200 relative"
        style={{
          width: cardSize,
          height: square ? cardSize : "auto",
          borderRadius: "20px",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {header}
        {children}
      </div>
    </div>
  )
}
