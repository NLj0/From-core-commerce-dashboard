import { NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile, unlink } from "fs/promises"
import { randomUUID } from "crypto"
import path from "path"

export const runtime = "nodejs"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ALLOWED_VIDEO_TYPE = "video/mp4"

const uploadsRoot = path.join(process.cwd(), "public", "uploads", "products")
const videoDir = path.join(uploadsRoot, "videos")

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true })
}

function buildSafePath(relativeUrl: string) {
  const normalized = path
    .normalize(relativeUrl)
    .replace(/^\.\.(\\|\/)/g, "")
    .replace(/^\//, "")
  return path.join(process.cwd(), "public", normalized)
}

async function deleteFileByUrl(url: string) {
  if (!url.startsWith("/uploads/")) return
  const filePath = buildSafePath(url)
  try {
    await unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn("Failed to delete file", filePath, error)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const uploadType = (request.nextUrl.searchParams.get("type") || "image").toLowerCase()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (uploadType === "video") {
      if (file.type !== ALLOWED_VIDEO_TYPE) {
        return NextResponse.json({ error: "Only MP4 videos are allowed" }, { status: 400 })
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: "Video exceeds the 50MB limit" }, { status: 400 })
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Unsupported image format" }, { status: 400 })
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: "Image exceeds the 5MB limit" }, { status: 400 })
      }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadsDir = uploadType === "video" ? videoDir : uploadsRoot
    await ensureDir(uploadsDir)

    const originalName = file.name || (uploadType === "video" ? "video.mp4" : "upload")
    const fallbackExt = uploadType === "video" ? "mp4" : "png"
    const extension = originalName.includes(".") ? originalName.split(".").pop() : fallbackExt
    const filename = `${Date.now()}-${randomUUID()}.${extension}`
    const filePath = path.join(uploadsDir, filename)

    await writeFile(filePath, buffer)

    const relativePath = uploadType === "video" ? `/uploads/products/videos/${filename}` : `/uploads/products/${filename}`

    return NextResponse.json({ url: relativePath })
  } catch (error) {
    console.error("Upload error", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 })
    }

    await deleteFileByUrl(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete upload", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
