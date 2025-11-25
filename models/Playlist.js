// Playlist Model - Mongoose Schema
const mongoose = require('mongoose');

// Import Song model to ensure it's registered before population
// This is required for Mongoose to populate the songId references
require('./Song');

// Embedded schema for playlist items
const playlistItemSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  position: {
    type: Number,
    required: true,
    min: 1
  },
  isPlanned: {
    type: Boolean,
    default: true
  },
  isPlayed: {
    type: Boolean,
    default: false
  }
}, {
  _id: true // Give each item an _id
});

const playlistSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ['Morning', 'Afternoon', 'Evening'],
    trim: true
  },
  djId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DJ',
    required: true
  },
  items: [playlistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes
playlistSchema.index({ date: 1, timeSlot: 1, djId: 1 });
playlistSchema.index({ date: 1 });

// Static method to get playlist with populated songs
playlistSchema.statics.getPlaylist = function(date, djId, timeSlot) {
  // Parse the input date to get year, month, day
  let year, month, day;
  
  if (typeof date === 'string') {
    // Handle date string like "2025-11-25"
    const parts = date.split('-');
    if (parts.length === 3) {
      // Parse directly from string to avoid timezone issues
      year = parseInt(parts[0]);
      month = parseInt(parts[1]) - 1; // Month is 0-indexed in JavaScript
      day = parseInt(parts[2]);
    } else {
      // For other date string formats, parse and use UTC methods
      const d = new Date(date);
      year = d.getUTCFullYear();
      month = d.getUTCMonth();
      day = d.getUTCDate();
    }
  } else {
    // For Date objects, use UTC methods to avoid timezone issues
    const d = date instanceof Date ? date : new Date(date);
    year = d.getUTCFullYear();
    month = d.getUTCMonth();
    day = d.getUTCDate();
  }
  
  // Create a wide date range that covers the entire day plus timezone variations
  // Dates might be stored at different UTC times (e.g., 5 AM UTC = midnight EST, 5 PM UTC = noon EST)
  // Search from 36 hours before to 36 hours after to catch all variations
  const startOfDay = new Date(Date.UTC(year, month, day - 1, 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month, day + 1, 23, 59, 59, 999));
  
  const query = {
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    djId: djId,
    timeSlot: timeSlot
  };
  
  console.log('Playlist query:', {
    inputDate: date,
    parsedDate: `${year}-${month + 1}-${day}`,
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
    djId: djId ? djId.toString() : 'null',
    timeSlot: timeSlot
  });
  
  return this.findOne(query)
  .populate('djId', 'name')
  .populate('items.songId', 'title artist previewUrl')
  .sort({ 'items.position': 1 });
};

// Static method to get playlist comparison data
playlistSchema.statics.getPlaylistComparison = async function(date, djId, timeSlot) {
  try {
    const playlist = await this.getPlaylist(date, djId, timeSlot);
    
    if (!playlist) {
      console.log('No playlist found for:', { date, djId, timeSlot });
      return null;
    }
    
    if (!playlist.items || playlist.items.length === 0) {
      console.log('Playlist found but has no items:', playlist._id);
      return null;
    }
    
    console.log(`Found playlist with ${playlist.items.length} items`);
    
    // Format for comparison display
    const comparison = playlist.items.map(item => {
      const song = item.songId;
      // Determine if there's a match
      // Match means: isPlanned is true AND isPlayed is true AND the song exists
      const isMatch = item.isPlanned && item.isPlayed && song;
      
      // If not played, show "Not played" instead of null
      const playedSong = item.isPlayed ? (song ? song.title : 'Unknown') : 'Not played';
      
      return {
        position: item.position,
        planned: song ? song.title : 'Unknown',
        played: playedSong,
        match: isMatch,
        songId: song ? (song._id || item.songId) : item.songId,
        artist: song ? song.artist : 'Unknown',
        previewUrl: song && song.previewUrl ? song.previewUrl : ''
      };
    });
    
    return {
      playlist: playlist,
      comparison: comparison,
      date: playlist.date,
      timeSlot: playlist.timeSlot,
      dj: playlist.djId
    };
  } catch (error) {
    console.error('Error in getPlaylistComparison:', error);
    throw error;
  }
};

module.exports = mongoose.model('Playlist', playlistSchema);

