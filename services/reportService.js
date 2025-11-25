// Report Service - Business Logic
const mongoose = require('mongoose');
const Song = require('../models/Song'); // Ensure Song model is registered
const Playlist = require('../models/Playlist');

/**
 * Get playlist comparison data
 */
async function getPlaylistComparison(date, djId, timeSlot) {
  try {
    if (!date || !djId) {
      console.log('Missing date or djId:', { date, djId });
      return null;
    }
    
    // Convert djId string to ObjectId
    let djObjectId;
    try {
      djObjectId = mongoose.Types.ObjectId.isValid(djId) ? new mongoose.Types.ObjectId(djId) : djId;
    } catch (error) {
      console.error('Invalid djId format:', djId, error);
      return null;
    }
    
    // Ensure date is a Date object
    const queryDate = date instanceof Date ? date : new Date(date);
    
    if (timeSlot && timeSlot !== 'all') {
      // Get specific time slot
      const comparison = await Playlist.getPlaylistComparison(queryDate, djObjectId, timeSlot);
      return comparison;
    } else {
      // Get all time slots - combine them
      const timeSlots = ['Morning', 'Afternoon', 'Evening'];
      const allComparisons = [];
      
      for (const slot of timeSlots) {
        const comparison = await Playlist.getPlaylistComparison(queryDate, djObjectId, slot);
        if (comparison && comparison.comparison) {
          allComparisons.push(...comparison.comparison);
        }
      }
      
      if (allComparisons.length === 0) {
        console.log('No playlists found for:', { date: queryDate, djId: djObjectId });
        return null;
      }
      
      return {
        comparison: allComparisons,
        date: queryDate,
        timeSlot: 'all',
        dj: null // Would need to populate this
      };
    }
  } catch (error) {
    console.error('Error getting playlist comparison:', error);
    return null;
  }
}

/**
 * Calculate mismatches in playlist
 */
function calculateMismatches(playlist) {
  if (!playlist || !playlist.items) {
    return { matches: 0, mismatches: 0, total: 0 };
  }
  
  let matches = 0;
  let mismatches = 0;
  
  playlist.items.forEach(item => {
    if (item.isPlanned && item.isPlayed) {
      matches++;
    } else if (item.isPlanned && !item.isPlayed) {
      mismatches++;
    }
  });
  
  return {
    matches,
    mismatches,
    total: playlist.items.length
  };
}

/**
 * Format report data for display
 */
function formatReportData(rawData) {
  if (!rawData || !rawData.comparison) {
    return [];
  }
  
  return rawData.comparison.map(item => ({
    position: item.position,
    planned: item.planned,
    played: item.played || item.planned,
    match: item.match,
    artist: item.artist,
    previewUrl: item.previewUrl
  }));
}

module.exports = {
  getPlaylistComparison,
  calculateMismatches,
  formatReportData
};

