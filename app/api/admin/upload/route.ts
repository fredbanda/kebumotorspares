import { NextRequest, NextResponse } from 'next/server'
import { uploadProductImage } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json() as { data: string }
    if (!data) return NextResponse.json({ error: 'No image data' }, { status: 400 })
    const result = await uploadProductImage(data)
    return NextResponse.json({ url: result.secure_url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
