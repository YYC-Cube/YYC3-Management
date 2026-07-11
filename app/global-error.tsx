"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", padding: "1rem" }}>
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
              应用发生严重错误
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
              抱歉，应用遇到了不可恢复的错误。请尝试刷新页面。
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1rem", overflow: "auto" }}>
                {error.message}
              </pre>
            )}
            <button
              onClick={reset}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
