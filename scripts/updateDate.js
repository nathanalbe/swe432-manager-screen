// Update existing playlists and assignments to November 25th, 2025
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../models/db');
const Playlist = require('../models/Playlist');
const Assignment = require('../models/Assignment');

async function updateDates() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    // Set target date to November 25, 2025 at noon (to match assignment creation logic)
    const targetDate = new Date('2025-11-25T12:00:00');
    
    console.log('📅 Updating dates to:', targetDate.toISOString());
    
    // Update all playlists
    const playlistResult = await Playlist.updateMany(
      {},
      { $set: { date: targetDate } }
    );
    console.log(`✅ Updated ${playlistResult.modifiedCount} playlists`);
    
    // Update all assignments
    const assignmentResult = await Assignment.updateMany(
      {},
      { $set: { date: targetDate } }
    );
    console.log(`✅ Updated ${assignmentResult.modifiedCount} assignments`);
    
    console.log('\n🎉 Date update completed successfully!');
    
    // Verify the update
    const playlists = await Playlist.find().limit(1);
    const assignments = await Assignment.find().limit(1);
    
    if (playlists.length > 0) {
      console.log('\n📊 Sample playlist date:', playlists[0].date);
    }
    if (assignments.length > 0) {
      console.log('📊 Sample assignment date:', assignments[0].date);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error updating dates:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateDates();

