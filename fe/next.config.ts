import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */

	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
		],
	},

	rewrites: async () => {
		return [
			{
				source: '/',
				destination: '/message',
			},
		];
	},

	env: {
		BACKEND_URL: process.env.BACKEND_URL,
	},
};

export default nextConfig;
