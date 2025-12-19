import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import crypto from 'crypto'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

// Security: Validate file magic bytes to prevent file spoofing
const validateFileMagicBytes = (buffer: Buffer, fileType: string): boolean => {
  const magicBytes = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
    'image/gif': [0x47, 0x49, 0x46],
  }

  const expectedBytes = magicBytes[fileType as keyof typeof magicBytes]
  if (!expectedBytes) return false

  for (let i = 0; i < expectedBytes.length; i++) {
    if (buffer[i] !== expectedBytes[i]) {
      return false
    }
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP and GIF allowed' }, { status: 400 })
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 2MB' }, { status: 400 })
    }

    // Validate file size minimum (10KB)
    const minSize = 10 * 1024 // 10KB
    if (file.size < minSize) {
      return NextResponse.json({ error: 'File too small. Minimum size is 10KB' }, { status: 400 })
    }

    // Validate file extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    const fileExtension = path.extname(file.name).toLowerCase().slice(1)
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 })
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate magic bytes (prevents file spoofing)
    if (!validateFileMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'Invalid file content. File does not match its type' }, { status: 400 })
    }

    // Generate secure filename using crypto
    const timestamp = Date.now()
    const randomBytes = crypto.randomBytes(8).toString('hex')
    const filename = `category-${timestamp}-${randomBytes}.${fileExtension}`

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return the URL path
    const imageUrl = `/uploads/categories/${filename}`

    return NextResponse.json({
      url: imageUrl,
      filename: filename,
      size: file.size,
      type: file.type
    }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
