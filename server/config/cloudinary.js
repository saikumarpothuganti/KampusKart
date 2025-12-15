import cloudinary from 'cloudinary';

let cloudinaryInitialized = false;

// Lazy initialization - runs when first upload is attempted, AFTER dotenv.config()
const initCloudinary = () => {
  if (cloudinaryInitialized) return true;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const isConfigured =
    cloudName && cloudName !== 'test' && apiKey && apiKey !== 'test' && apiSecret && apiSecret !== 'test';

  if (process.env.NODE_ENV === 'production' && !isConfigured) {
    console.error('❌ FATAL: Cloudinary must be configured in production!');
    if (!cloudName || cloudName === 'test') console.error('  - CLOUDINARY_CLOUD_NAME');
    if (!apiKey || apiKey === 'test') console.error('  - CLOUDINARY_API_KEY');
    if (!apiSecret || apiSecret === 'test') console.error('  - CLOUDINARY_API_SECRET');
    return false;
  }

  if (isConfigured) {
    cloudinary.v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log('[Cloudinary] ✅ Configured successfully');
    cloudinaryInitialized = true;
    return true;
  } else {
    console.log('[Cloudinary] ⚠️ NOT configured - uploads will fail');
    return false;
  }
};

// FINAL FIX STARTS HERE 🔥🔥🔥
const uploadToCloudinary = (buffer, publicId, resourceType = 'auto', isPDF = false) => {
  // Initialize Cloudinary on first upload
  if (!initCloudinary()) {
    const error = new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
    console.error('[Cloudinary] ❌', error.message);
    return Promise.reject(error);
  }

  return new Promise((resolve, reject) => {
    // Force PDFs to use raw upload and pdf format, ignore resourceType
    const uploadOptions = isPDF
      ? {
          public_id: publicId,
          resource_type: 'raw',
          type: 'upload',
          access_mode: 'public',
          format: 'pdf',
        }
      : {
          public_id: publicId,
          resource_type: resourceType,
          type: 'upload',
          access_mode: 'public',
        };

    const stream = cloudinary.v2.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          reject(error);
        } else {
          console.log(`[Cloudinary] ✅ Uploaded to ${publicId}:`, result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};
// FINAL FIX ENDS HERE 🔥🔥🔥

export default uploadToCloudinary;
