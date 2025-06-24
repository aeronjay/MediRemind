const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure SQLite database files are properly handled
config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');

module.exports = config;
