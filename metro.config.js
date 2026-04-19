const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['require', 'react-native', 'browser', 'import'];

module.exports = config;
