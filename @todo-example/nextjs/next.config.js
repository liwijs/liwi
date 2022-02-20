import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  webpack: (config) => {
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

export default withPlugins([withTM(['@todo-example/modules'])], nextConfig);
