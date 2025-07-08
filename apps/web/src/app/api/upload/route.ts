import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Upload API called');
  console.log(req.method);
  if (req.method !== 'POST') return res.status(405).end();

  const { imageBase64 } = req.body;

  try {
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'profile_pictures',
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
}

export const runtime = 'nodejs'; // Optional, to ensure Node runtime

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    console.log('Upload API called');
    console.log(req.method);
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: 'profile_pictures',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('[CLOUDINARY_UPLOAD_ERROR]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
