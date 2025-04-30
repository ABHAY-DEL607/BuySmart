/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'drive.usercontent.google.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'upload.wikimedia.org',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'www.jiomart.com',
            port: '',
            pathname: '/**',
          },
         {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.jiomart.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'tse2.mm.bing.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'tse3.mm.bing.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'tse4.mm.bing.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'tse5.mm.bing.net',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'toppng.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.addictioncenter.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

export default nextConfig;
