const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// Suprimir warnings específicos
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração para suprimir warnings de depreciação
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  mangle: {
    ...config.transformer.minifierConfig?.mangle,
    keep_fnames: true,
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
