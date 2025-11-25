// Seed Database Script
// Populates MongoDB with initial data for development/testing

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../models/db');
const DJ = require('../models/DJ');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const Assignment = require('../models/Assignment');

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    // Connect to database
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await DJ.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});
    await Assignment.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Seed DJs
    console.log('👤 Seeding DJs...');
    const djs = await DJ.insertMany([
      { name: 'DJ Alex', experienceYears: 5 },
      { name: 'DJ Maya', experienceYears: 3 },
      { name: 'DJ Rico', experienceYears: 7 }
    ]);
    console.log(`✅ Created ${djs.length} DJs`);
    
    // Seed Songs with real song titles and preview URLs
    // Using publicly available audio files for demonstration
    // In production, replace with actual preview URLs from Spotify API, Apple Music API, or host your own files
    console.log('🎵 Seeding Songs...');
    
    // Preview URLs - using SoundHelix sample audio (publicly available)
    // These are working audio files that will play in the browser
    const audioUrls = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3'
    ];
    
    // Real song titles and artists for a more realistic playlist
    const songs = await Song.insertMany([
      { title: 'Blinding Lights', artist: 'The Weeknd', previewUrl: audioUrls[0] },
      { title: 'Watermelon Sugar', artist: 'Harry Styles', previewUrl: audioUrls[1] },
      { title: 'Levitating', artist: 'Dua Lipa', previewUrl: audioUrls[2] },
      { title: 'Good 4 U', artist: 'Olivia Rodrigo', previewUrl: audioUrls[3] },
      { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', previewUrl: audioUrls[4] },
      { title: 'Industry Baby', artist: 'Lil Nas X', previewUrl: audioUrls[5] },
      { title: 'Heat Waves', artist: 'Glass Animals', previewUrl: audioUrls[6] },
      { title: 'Sunrise Serenade', artist: 'Morning Drive', previewUrl: audioUrls[7] },
      { title: 'Coffee & News', artist: 'Early Birds', previewUrl: audioUrls[8] },
      { title: 'Wake Up Call', artist: 'Morning Mix', previewUrl: audioUrls[9] },
      { title: 'Breakfast Beats', artist: 'Rise & Shine', previewUrl: audioUrls[10] },
      { title: 'Midday Vibes', artist: 'Afternoon Radio', previewUrl: audioUrls[11] },
      { title: 'Lunch Break', artist: 'Daytime Hits', previewUrl: audioUrls[12] },
      { title: 'Afternoon Drive', artist: 'Commute Classics', previewUrl: audioUrls[13] },
      { title: 'Evening Rush', artist: 'Sunset Sounds', previewUrl: audioUrls[14] },
      { title: 'Night Shift', artist: 'Evening Mix', previewUrl: audioUrls[15] },
      { title: 'Prime Time', artist: 'Peak Hours', previewUrl: audioUrls[16] },
      { title: 'Late Night', artist: 'Night Owls', previewUrl: audioUrls[17] },
      { title: 'As It Was', artist: 'Harry Styles', previewUrl: audioUrls[18] },
      { title: 'About Damn Time', artist: 'Lizzo', previewUrl: audioUrls[19] },
      { title: 'Running Up That Hill', artist: 'Kate Bush', previewUrl: audioUrls[20] },
      { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', previewUrl: audioUrls[21] },
      { title: 'Shake It Off', artist: 'Taylor Swift', previewUrl: audioUrls[22] },
      { title: 'Take Five', artist: 'Dave Brubeck', previewUrl: audioUrls[23] },
      { title: 'Strobe', artist: 'Deadmau5', previewUrl: audioUrls[24] },
      { title: 'Jolene', artist: 'Dolly Parton', previewUrl: audioUrls[25] },
      { title: 'Lose Yourself', artist: 'Eminem', previewUrl: audioUrls[26] },
      { title: 'Ho Hey', artist: 'The Lumineers', previewUrl: audioUrls[27] },
      { title: 'Blame It', artist: 'Jamie Foxx', previewUrl: audioUrls[28] },
      { title: 'Smells Like Teen Spirit', artist: 'Nirvana', previewUrl: audioUrls[29] }
    ]);
    console.log(`✅ Created ${songs.length} songs`);
    
    // Use November 25, 2025 for sample playlists
    const today = new Date('2025-11-25');
    today.setHours(12, 0, 0, 0); // Set to noon to match assignment creation logic
    
    // Seed Sample Playlists
    console.log('📋 Seeding Playlists...');
    
    // Morning playlist for DJ Alex
    const morningPlaylist = await Playlist.create({
      date: today,
      timeSlot: 'Morning',
      djId: djs[0]._id, // DJ Alex
      items: [
        { songId: songs[7]._id, position: 1, isPlanned: true, isPlayed: true },  // Sunrise Serenade (match)
        { songId: songs[8]._id, position: 2, isPlanned: true, isPlayed: true },  // Coffee & News (match)
        { songId: songs[10]._id, position: 3, isPlanned: true, isPlayed: false }  // Breakfast Beats (mismatch - planned but not played)
      ]
    });
    
    // Afternoon playlist for DJ Maya
    const afternoonPlaylist = await Playlist.create({
      date: today,
      timeSlot: 'Afternoon',
      djId: djs[1]._id, // DJ Maya
      items: [
        { songId: songs[11]._id, position: 1, isPlanned: true, isPlayed: true },  // Midday Vibes (match)
        { songId: songs[13]._id, position: 2, isPlanned: true, isPlayed: false } // Afternoon Drive (mismatch - planned but not played)
      ]
    });
    
    // Evening playlist for DJ Rico
    const eveningPlaylist = await Playlist.create({
      date: today,
      timeSlot: 'Evening',
      djId: djs[2]._id, // DJ Rico
      items: [
        { songId: songs[14]._id, position: 1, isPlanned: true, isPlayed: true },  // Evening Rush (match)
        { songId: songs[17]._id, position: 2, isPlanned: true, isPlayed: false }, // Late Night (mismatch - planned but not played)
        { songId: songs[16]._id, position: 3, isPlanned: true, isPlayed: true }   // Prime Time (match)
      ]
    });
    
    // General playlist with matches and mismatches (for report testing)
    const generalPlaylist = await Playlist.create({
      date: today,
      timeSlot: 'Morning',
      djId: djs[0]._id,
      items: [
        { songId: songs[0]._id, position: 1, isPlanned: true, isPlayed: true },  // Blinding Lights (match)
        { songId: songs[5]._id, position: 2, isPlanned: true, isPlayed: false }, // Industry Baby (mismatch - planned Watermelon Sugar but played Industry Baby)
        { songId: songs[2]._id, position: 3, isPlanned: true, isPlayed: true },  // Levitating (match)
        { songId: songs[6]._id, position: 4, isPlanned: true, isPlayed: false }, // Heat Waves (mismatch - planned Good 4 U but played Heat Waves)
        { songId: songs[4]._id, position: 5, isPlanned: true, isPlayed: true }   // Stay (match)
      ]
    });
    
    console.log(`✅ Created ${await Playlist.countDocuments()} playlists`);
    
    // Seed Sample Assignments
    console.log('📅 Seeding Assignments...');
    const assignments = await Assignment.insertMany([
      {
        date: today,
        timeSlot: 'Morning',
        djId: djs[0]._id // DJ Alex
      },
      {
        date: today,
        timeSlot: 'Afternoon',
        djId: djs[1]._id // DJ Maya
      },
      {
        date: today,
        timeSlot: 'Evening',
        djId: djs[2]._id // DJ Rico
      }
    ]);
    console.log(`✅ Created ${assignments.length} assignments`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${djs.length} DJs`);
    console.log(`   - ${songs.length} Songs`);
    console.log(`   - ${await Playlist.countDocuments()} Playlists`);
    console.log(`   - ${assignments.length} Assignments`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seed function
seedDatabase();

