#!/usr/bin/env node
/**
 * Generate a secure random string for JWT_SECRET and other sensitive values
 * Usage: node generate-secret.js
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 KampusKart Secret Generator\n');
console.log('Generated JWT_SECRET (copy this to your .env file):');
console.log('=' .repeat(64));
console.log(generateSecret(32));
console.log('=' .repeat(64));
console.log('\nMake sure to:');
console.log('1. Copy the above secret to your .env as JWT_SECRET');
console.log('2. Never share this secret');
console.log('3. Use different secrets for different environments');
