// Report Controller
const DJ = require('../models/DJ');
const Song = require('../models/Song'); // Ensure Song model is registered
const Playlist = require('../models/Playlist');
const reportService = require('../services/reportService');

/**
 * Render report page
 */
async function renderReportPage(req, res) {
  try {
    // Get all DJs from database
    const djs = await DJ.find().sort({ name: 1 });
    
    // Get form data from session (for restoration)
    const formData = req.session.reportFilter || {};
    
    // Check if both date and DJ are selected
    const hasFilters = formData.date && formData.djId;
    
    res.render('report', {
      djs: djs,
      formData: formData,
      playlistData: [],
      showPlaylist: hasFilters || false
    });
  } catch (error) {
    console.error('Error rendering report page:', error);
    res.status(500).send('Error loading report page');
  }
}

/**
 * Handle report filter submission
 */
async function handleReportFilter(req, res) {
  try {
    const { reportDate, reportDJ, reportTimeSlot } = req.body;
    
    console.log('Report filter request:', { reportDate, reportDJ, reportTimeSlot });
    
    // Get all DJs
    const djs = await DJ.find().sort({ name: 1 });
    
    // Save filter to session
    req.session.reportFilter = {
      date: reportDate,
      djId: reportDJ,
      timeSlot: reportTimeSlot || 'all'
    };
    
    // Get playlist comparison data
    const timeSlot = reportTimeSlot === 'all' ? null : reportTimeSlot;
    const comparisonData = await reportService.getPlaylistComparison(
      reportDate,
      reportDJ,
      timeSlot
    );
    
    console.log('Comparison data received:', comparisonData ? `Found ${comparisonData.comparison ? comparisonData.comparison.length : 0} items` : 'null');
    
    // Format data for display
    let playlistData = [];
    if (comparisonData && comparisonData.comparison && comparisonData.comparison.length > 0) {
      playlistData = comparisonData.comparison.map(item => ({
        planned: item.planned,
        played: item.played || item.planned,
        match: item.match,
        artist: item.artist,
        previewUrl: item.previewUrl || ''
      }));
      console.log(`Formatted ${playlistData.length} playlist items for display`);
    } else {
      console.log('No playlist data to display');
    }
    
    // Check if both date and DJ are selected
    const hasFilters = reportDate && reportDJ;
    
    res.render('report', {
      djs: djs,
      formData: req.session.reportFilter,
      playlistData: playlistData,
      showPlaylist: hasFilters || false
    });
    
  } catch (error) {
    console.error('Error handling report filter:', error);
    console.error(error.stack);
    const djs = await DJ.find().sort({ name: 1 });
    const hasFilters = req.body.reportDate && req.body.reportDJ;
    res.render('report', {
      djs: djs,
      formData: req.body,
      playlistData: [],
      showPlaylist: hasFilters || false
    });
  }
}

/**
 * Get report data (API endpoint)
 */
async function getReportData(req, res) {
  try {
    const { date, djId, timeSlot } = req.query;
    const comparisonData = await reportService.getPlaylistComparison(
      date,
      djId,
      timeSlot === 'all' ? null : timeSlot
    );
    res.json(comparisonData);
  } catch (error) {
    console.error('Error getting report data:', error);
    res.status(500).json({ error: 'Error fetching report data' });
  }
}

module.exports = {
  renderReportPage,
  handleReportFilter,
  getReportData
};

