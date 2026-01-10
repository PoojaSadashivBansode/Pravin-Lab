/**
 * ===========================================
 *     MAKE ADMIN SCRIPT - Promote User
 * ===========================================
 * 
 * Run this script to make a user an admin.
 * 
 * Usage:
 *   node scripts/makeAdmin.js your-email@example.com
 * 
 * @author Pravin Lab Team
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ============================================
// USER SCHEMA (simplified for this script)
// ============================================
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String
});

const User = mongoose.model('User', userSchema);

// ============================================
// MAIN FUNCTION
// ============================================
async function makeAdmin() {
  // Get email from command line arguments
  const email = process.argv[2];

  if (!email) {
    console.log('\n❌ Error: Please provide an email address');
    console.log('\n📖 Usage: node scripts/makeAdmin.js <email>');
    console.log('   Example: node scripts/makeAdmin.js john@example.com\n');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('\n🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    console.log(`\n🔍 Looking for user: ${email}`);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`\n❌ User not found with email: ${email}`);
      console.log('   Make sure the user has registered first.\n');
      process.exit(1);
    }

    // Check if already admin
    if (user.role === 'admin') {
      console.log(`\n✅ User "${user.name}" is already an admin!\n`);
      process.exit(0);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log('\n✅ SUCCESS! User promoted to admin:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:  ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role:  admin`);
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 Now login and go to /admin to access the admin panel!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
makeAdmin();
