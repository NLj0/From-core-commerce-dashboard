import { NextRequest } from "next/server"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function sanitizeText(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const widthParam = Number(searchParams.get("width") ?? searchParams.get("w") ?? 120)
  const heightParam = Number(searchParams.get("height") ?? searchParams.get("h") ?? 120)

  const width = clamp(Number.isFinite(widthParam) ? widthParam : 120, 16, 1024)
  const height = clamp(Number.isFinite(heightParam) ? heightParam : 120, 16, 1024)

  const background = searchParams.get("bg") || "#e5e7eb"
  const foreground = searchParams.get("fg") || "#6b7280"
  const queryText = searchParams.get("text") ?? searchParams.get("query") ?? ""

  const label = queryText || `${width} x ${height}`
  const safeLabel = sanitizeText(label)

  const fontSize = Math.max(Math.min(Math.min(width, height) / 5, 32), 10)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${safeLabel}">
  <title>${safeLabel}</title>
  <rect width="100%" height="100%" fill="${background}" />
  <text
    x="50%"
    y="50%"
    alignment-baseline="middle"
    text-anchor="middle"
    font-family="'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    font-size="${fontSize}"
    fill="${foreground}"
  >${safeLabel}</text>
</svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
