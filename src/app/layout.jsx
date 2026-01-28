import "../styles/globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fb]">
        {children}
      </body>
    </html>
  )
}
