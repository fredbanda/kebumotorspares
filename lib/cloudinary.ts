import { v2 as cloudinary } from 'cloudinary'

const configured = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export async function uploadProductImage(file: string) {
  if (!configured) throw new Error('Cloudinary is not configured. Add the Cloudinary environment variables to enable uploads.')
  return cloudinary.uploader.upload(file, {
    upload_preset: 'kebumotorspares',
    folder: 'kebumotorspares/products',
    resource_type: 'image',
  })
}
