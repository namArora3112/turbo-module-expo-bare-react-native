const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/**
 * Metro config so the local package aep-turbo-core (file:..) can be resolved.
 * Watch parent folder; block parent's react-native and react so the app uses its own (Expo 54 / RN 0.81).
 */
const config = getDefaultConfig(__dirname);
const appRoot = __dirname;
const parentRoot = path.resolve(appRoot, '..');
const parentNodeModules = path.join(parentRoot, 'node_modules');

const escaped = parentNodeModules.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockParentReactNative = new RegExp(escaped + '[/\\\\]react-native[/\\\\].*');
const blockParentReact = new RegExp(escaped + '[/\\\\]react[/\\\\].*');

config.watchFolders = [parentRoot];
config.resolver = config.resolver || {};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  blockParentReactNative,
  blockParentReact,
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-native': path.join(appRoot, 'node_modules', 'react-native'),
  react: path.join(appRoot, 'node_modules', 'react'),
};

module.exports = config;
