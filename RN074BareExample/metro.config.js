const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 * Enables resolution of local package aep-turbo-core (file:..)
 *
 * @type {import('metro-config').MetroConfig}
 */
const appRoot = __dirname;
const parentRoot = path.resolve(appRoot, '..');
const parentNodeModules = path.join(parentRoot, 'node_modules');

// Block only parent's react-native and react so we use app's (0.74); allow parent's @babel/runtime etc.
const escaped = parentNodeModules.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockParentReactNative = new RegExp(escaped + '[/\\\\]react-native[/\\\\].*');
const blockParentReact = new RegExp(escaped + '[/\\\\]react[/\\\\].*');

const config = {
  watchFolders: [parentRoot],
  resolver: {
    blockList: [exclusionList(), blockParentReactNative, blockParentReact],
    extraNodeModules: {
      'react-native': path.join(appRoot, 'node_modules', 'react-native'),
      react: path.join(appRoot, 'node_modules', 'react'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
