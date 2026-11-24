const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// expo-sqlite's web build includes a .wasm file, which Metro skips by default
config.resolver.assetExts.push("wasm");

module.exports = config;
