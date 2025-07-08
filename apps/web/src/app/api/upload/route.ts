import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'profile_pictures',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('[CLOUDINARY_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
