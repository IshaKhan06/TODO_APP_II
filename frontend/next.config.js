/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
<<<<<<< HEAD
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
=======
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
>>>>>>> 21aef9fe3d6445b0de1bfdd065775ec2a2aeffcd
  },
};

module.exports = nextConfig