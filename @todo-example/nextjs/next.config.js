import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';
// import yoRcConfig from '../../.yo-rc.json';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // eslint code checking is done outside nextjs
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript code checking is done outside nextjs
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: true,
    images: {
      unoptimized: true,
    },
  },
  webpack: (config, context) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = config.resolve.extensions.flatMap((ext) => [
      `.web${ext}`,
      ext,
    ]);

    return config;
  },
};

export default withPlugins(
  [
    withTM([
      'extended-json',
      'liwi',
      'liwi-types',
      'liwi-store',
      'liwi-resources',
      'liwi-subscribe-store',
      'liwi-mongo',
      'liwi-resources-client',
      'liwi-resources-server',
      '@todo-example/modules',
      'liwi-mongo-example',
      'liwi-resources-direct-client',
      'liwi-resources-void-client',
      'liwi-resources-websocket-client',
      'liwi-resources-websocket-server',
      'react-liwi',
      '@todo-example/nextjs',
      '@todo-example/server',

      // requires react-native-web
      'react-alp-connection-state',
    ]),
  ],
  nextConfig,
);
