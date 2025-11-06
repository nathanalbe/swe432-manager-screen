// JavaScript for Reports page
// Demonstrates: Event handlers, DOM manipulation, loops, conditionals

// Variables (JavaScript Fundamentals - 2 pts)
let playlistData = [];
let comparisonResults = [];
let currentReportDate = null;
let currentDJ = null;
let currentTimeSlot = null;

// Mock song database (Media Component)
// In a real application, these would come from a database
// Using generic track identifiers for mock data
const songDatabase = {
  'PL-001': { artist: 'Artist 1', preview: '' },
  'PL-002': { artist: 'Artist 2', preview: '' },
  'PL-003': { artist: 'Artist 3', preview: '' },
  'PL-004': { artist: 'Artist 4', preview: '' },
  'PL-005': { artist: 'Artist 5', preview: '' },
  'PL-006': { artist: 'Artist 6', preview: '' },
  'PL-007': { artist: 'Artist 7', preview: '' },
  'PL-008': { artist: 'Artist 8', preview: '' },
  'PL-009': { artist: 'Artist 9', preview: '' },
  'PL-010': { artist: 'Artist 10', preview: '' },
  'Morning Track 1': { artist: 'Morning Artist 1', preview: '' },
  'Morning Track 2': { artist: 'Morning Artist 2', preview: '' },
  'Morning Track 3': { artist: 'Morning Artist 3', preview: '' },
  'Morning Track Z': { artist: 'Morning Artist Z', preview: '' },
  'Afternoon Track 1': { artist: 'Afternoon Artist 1', preview: '' },
  'Afternoon Track 2': { artist: 'Afternoon Artist 2', preview: '' },
  'Afternoon Track Y': { artist: 'Afternoon Artist Y', preview: '' },
  'Evening Track 1': { artist: 'Evening Artist 1', preview: '' },
  'Evening Track 2': { artist: 'Evening Artist 2', preview: '' },
  'Evening Track 3': { artist: 'Evening Artist 3', preview: '' },
  'Evening Track X': { artist: 'Evening Artist X', preview: '' }
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeReportPage();
});

/**
 * Initialize the report page
 * Demonstrates: Functions, DOM manipulation, window object
 */
function initializeReportPage() {
  // Initialize sample playlist data
  initializePlaylistData();
  
  // Populate table
  populateComparisonTable();
  
  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('reportDate');
  if (dateInput) {
    dateInput.value = today;
    dateInput.setAttribute('min', today);
  }
  
  // Listener Approach (10 pts) - addEventListener for filter form submission
  const filterForm = document.getElementById('reportFilter');
  if (filterForm) {
    filterForm.addEventListener('submit', function(event) {
      event.preventDefault();
      loadPlaylistReport(
        document.getElementById('reportDate').value,
        document.getElementById('reportDJ').value,
        document.getElementById('reportTimeSlot').value
      );
    });
  }
  
  // Listener Approach - addEventListener for table row clicks (will be attached after table populates)
  // Note: Event listeners are attached in attachRowEventListeners() after table population

  // Window Object (10 pts) - Using setTimeout to highlight mismatches
  // Only highlight if table is already populated
  if (playlistData.length > 0) {
    setTimeout(function() {
      highlightMismatches();
    }, 500);
  }
}

/**
 * Initialize playlist data
 * Demonstrates: Variables, arrays, objects, properties
 */
function initializePlaylistData() {
  // Creating array of objects with mock track identifiers (demonstrates: variables, arrays, object properties)
  // Using generic playlist track IDs (PL-###) for mock data
  playlistData = [
    { planned: 'PL-001', played: 'PL-001', match: true },
    { planned: 'PL-002', played: 'PL-006', match: false },
    { planned: 'PL-003', played: 'PL-003', match: true },
    { planned: 'PL-004', played: 'PL-007', match: false },
    { planned: 'PL-005', played: 'PL-005', match: true }
  ];

  // Loops (2 pts) - forEach loop to process data
  playlistData.forEach(function(track, index) {
    // Comparison Operators (2 pts) - checking if tracks match
    if (track.planned !== track.played) {
      comparisonResults.push({
        index: index + 1,
        planned: track.planned,
        played: track.played,
        status: 'Mismatch'
      });
    }
  });
}

/**
 * Populate comparison table
 * Demonstrates: DOM manipulation, loops, conditionals
 */
function populateComparisonTable() {
  const tbody = document.querySelector('#comparisonTable tbody');
  if (!tbody) return;

  // Clear existing rows
  tbody.innerHTML = '';

  // Loops (2 pts) - for loop to create table rows
  for (let i = 0; i < playlistData.length; i++) {
    const track = playlistData[i];
    const row = document.createElement('tr');
    
    // Create cells
    const numCell = document.createElement('td');
    numCell.textContent = i + 1;
    
    const plannedCell = document.createElement('td');
    plannedCell.textContent = track.planned;
    
    const playedCell = document.createElement('td');
    playedCell.textContent = track.played;

    // Conditionals (2 pts) - if/else to add styling for mismatches
    if (!track.match) {
      // Logical Operators (2 pts) - using logical NOT (!)
      row.classList.add('mismatch-highlight');
      playedCell.style.color = 'red';
      playedCell.style.fontWeight = 'bold';
    } else {
      playedCell.style.color = 'green';
    }
    
    // Status cell
    const statusCell = document.createElement('td');
    if (track.match) {
      statusCell.textContent = '✓ Match';
      statusCell.style.color = 'green';
    } else {
      statusCell.textContent = '✗ Mismatch';
      statusCell.style.color = 'red';
      statusCell.style.fontWeight = 'bold';
    }
    
    // Preview cell with play button (Media Component)
    const previewCell = document.createElement('td');
    const playButton = document.createElement('button');
    playButton.textContent = '▶ Preview';
    playButton.style.padding = '5px 10px';
    playButton.style.backgroundColor = '#4CAF50';
    playButton.style.color = 'white';
    playButton.style.border = 'none';
    playButton.style.cursor = 'pointer';
    playButton.style.borderRadius = '3px';
    
    // Event listener for preview button (demonstrates: event listeners)
    playButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent row click
      playAudioPreview(track.planned, track.played);
    });
    
    previewCell.appendChild(playButton);

    // Append cells to row
    row.appendChild(numCell);
    row.appendChild(plannedCell);
    row.appendChild(playedCell);
    row.appendChild(statusCell);
    row.appendChild(previewCell);
    
    // Append row to tbody
    tbody.appendChild(row);
  }
}

/**
 * Handle row click
 * Demonstrates: Event handling, DOM manipulation, conditionals, Media Component
 */
function handleRowClick(index) {
  const row = document.querySelector(`#comparisonTable tbody tr:nth-child(${index + 1})`);
  if (!row) return;

  const track = playlistData[index];
  if (!track) return;
  
  // Conditionals (2 pts) - if statement
  if (!track.match) {
    // Window Object - Using alert
    window.alert(`Mismatch detected!\n\nPlanned: ${track.planned}\nPlayed: ${track.played}`);
    
    // DOM manipulation - Modifying element style
    row.style.backgroundColor = '#ffebee';
    row.style.border = '2px solid red';
    
    // Media Component: Show track details (mock data - no audio preview)
    playAudioPreview(track.planned, track.played);
    
    // Window Object - Using setTimeout to reset style
    setTimeout(function() {
      row.style.border = '';
    }, 2000);
  } else {
    window.alert(`Match confirmed: ${track.planned}`);
    // Media Component: Show track details (mock data - no audio preview)
    playAudioPreview(track.planned, track.played);
  }
}

/**
 * Highlight mismatches
 * Demonstrates: DOM manipulation, loops, conditionals, logical operators
 */
function highlightMismatches() {
  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  
  // Loops (2 pts) - forEach loop
  rows.forEach(function(row, index) {
    const track = playlistData[index];
    
    // Logical Operators (2 pts) - using logical AND (&&)
    if (track && !track.match) {
      row.classList.add('mismatch-highlight');
      
      // Modifying DOM Element (10 pts) - Changing style
      row.style.backgroundColor = '#fff3cd';
      row.style.borderLeft = '4px solid orange';
    }
  });

  // Show summary
  showMismatchSummary();
}

/**
 * Show mismatch summary
 * Demonstrates: DOM manipulation, conditionals, comparison operators
 */
function showMismatchSummary() {
  // Remove existing summary
  const existingSummary = document.querySelector('#mismatchSummary');
  if (existingSummary) {
    existingSummary.remove();
  }
  
  // Comparison Operators (2 pts) - comparing array length
  if (comparisonResults.length >= 0) {
    const section = document.querySelector('section');
    if (section) {
      const summaryDiv = document.createElement('div');
      summaryDiv.id = 'mismatchSummary';
      summaryDiv.style.marginTop = '20px';
      summaryDiv.style.padding = '15px';
      summaryDiv.style.backgroundColor = '#fff3cd';
      summaryDiv.style.border = '1px solid #ffc107';
      summaryDiv.style.borderRadius = '5px';
      
      // Conditionals (2 pts) - if/else statement
      if (comparisonResults.length === 0) {
        summaryDiv.innerHTML = `<strong>Summary:</strong> All tracks match! No discrepancies found.`;
        summaryDiv.style.backgroundColor = '#d4edda';
        summaryDiv.style.borderColor = '#28a745';
      } else if (comparisonResults.length === 1) {
        summaryDiv.innerHTML = `<strong>Summary:</strong> 1 mismatch detected in the playlist.`;
      } else {
        summaryDiv.innerHTML = `<strong>Summary:</strong> ${comparisonResults.length} mismatches detected in the playlist.`;
      }
      
      section.appendChild(summaryDiv);
    }
  }
}

/**
 * Custom Object Example (Properties - 10 pts)
 * Demonstrates: Creating custom objects, accessing/modifying properties
 */
function createReportObject() {
  // Creating a custom object
  let report = {
    title: "Playlist Comparison Report",
    date: new Date(),
    totalTracks: 0,
    mismatches: 0,
    matches: 0
  };

  // Accessing object properties
  console.log(report.title);
  console.log(report.date);

  // Modifying object properties
  report.totalTracks = playlistData.length;
  report.mismatches = comparisonResults.length;
  report.matches = playlistData.length - comparisonResults.length;

  // Adding new properties
  report.status = 'completed';
  report.generatedBy = 'Manager Dashboard';

  return report;
}

// Call function to demonstrate custom object creation
const reportObj = createReportObject();
console.log('Report Object:', reportObj);

/**
 * Load playlist report based on date, DJ, and time slot
 * Demonstrates: Form handling, DOM manipulation, conditionals, loops
 * Media Component: Integrates audio player for song preview
 */
function loadPlaylistReport(date, djId, timeSlot) {
  // Store current filter values
  currentReportDate = date;
  currentDJ = djId;
  currentTimeSlot = timeSlot;
  
  // Get DJ name
  const djNames = {
    'dj1': 'DJ Alex',
    'dj2': 'DJ Maya',
    'dj3': 'DJ Rico'
  };
  const djName = djNames[djId] || 'Unknown DJ';
  
  // Generate playlist data based on filters (in real app, this would come from database)
  // Demonstrates: Conditionals, comparison operators
  if (timeSlot === 'all' || !timeSlot) {
    // Load all time slots
    initializePlaylistData();
  } else {
    // Load specific time slot
    initializePlaylistDataForTimeSlot(timeSlot);
  }
  
  // Populate table
  populateComparisonTable();
  
  // Show report info
  showReportInfo(date, djName, timeSlot);
  
  // Re-attach event listeners for new rows
  attachRowEventListeners();
}

/**
 * Initialize playlist data for specific time slot
 * Demonstrates: Functions, conditionals, variables
 */
function initializePlaylistDataForTimeSlot(timeSlot) {
  // Sample data that varies by time slot
  // In real application, this would query a database
  const timeSlotData = {
    'Morning': [
      { planned: 'Morning Track 1', played: 'Morning Track 1', match: true },
      { planned: 'Morning Track 2', played: 'Morning Track 2', match: true },
      { planned: 'Morning Track 3', played: 'Morning Track Z', match: false }
    ],
    'Afternoon': [
      { planned: 'Afternoon Track 1', played: 'Afternoon Track 1', match: true },
      { planned: 'Afternoon Track 2', played: 'Afternoon Track Y', match: false }
    ],
    'Evening': [
      { planned: 'Evening Track 1', played: 'Evening Track 1', match: true },
      { planned: 'Evening Track 2', played: 'Evening Track X', match: false },
      { planned: 'Evening Track 3', played: 'Evening Track 3', match: true }
    ]
  };
  
  playlistData = timeSlotData[timeSlot] || [];
  comparisonResults = [];
  
  // Process data
  playlistData.forEach(function(track, index) {
    if (track.planned !== track.played) {
      comparisonResults.push({
        index: index + 1,
        planned: track.planned,
        played: track.played,
        status: 'Mismatch'
      });
    }
  });
}

/**
 * Show report information header
 * Demonstrates: DOM manipulation, template literals
 */
function showReportInfo(date, djName, timeSlot) {
  let reportInfoDiv = document.getElementById('reportInfo');
  
  if (!reportInfoDiv) {
    reportInfoDiv = document.createElement('div');
    reportInfoDiv.id = 'reportInfo';
    reportInfoDiv.style.marginBottom = '20px';
    reportInfoDiv.style.padding = '15px';
    reportInfoDiv.style.backgroundColor = '#e6f3ff';
    reportInfoDiv.style.border = '1px solid #0066cc';
    reportInfoDiv.style.borderRadius = '5px';
    
    const section = document.querySelector('section');
    const comparisonDiv = document.getElementById('playlistComparison');
    section.insertBefore(reportInfoDiv, comparisonDiv);
  }
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeSlotText = timeSlot === 'all' ? 'All Time Slots' : timeSlot;
  
  reportInfoDiv.innerHTML = `
    <h3 style="margin-top: 0;">Report Information</h3>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>DJ:</strong> ${djName}</p>
    <p><strong>Time Slot:</strong> ${timeSlotText}</p>
  `;
}

/**
 * Attach event listeners to table rows for audio preview
 * Demonstrates: Event listeners, DOM manipulation, Media Component integration
 */
function attachRowEventListeners() {
  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  
  // Remove existing listeners by replacing with new ones
  rows.forEach(function(row, index) {
    // Remove old click handler
    const newRow = row.cloneNode(true);
    row.parentNode.replaceChild(newRow, row);
    
    // Add click handler for audio preview (Media Component)
    newRow.addEventListener('click', function() {
      const track = playlistData[index];
      if (track) {
        // Media Component: Play audio preview
        playAudioPreview(track.planned, track.played);
      }
    });
    
    // Keep hover effects
    newRow.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f0f8ff';
      this.style.cursor = 'pointer';
    });
    
    newRow.addEventListener('mouseout', function() {
      if (!this.classList.contains('mismatch-highlight')) {
        this.style.backgroundColor = '';
      }
    });
  });
}

/**
 * Play audio preview for selected track
 * Demonstrates: Media Component, DOM manipulation, object properties
 */
function playAudioPreview(plannedTrack, playedTrack) {
  const audio = document.getElementById('playlistAudio');
  const currentTrackSpan = document.getElementById('currentTrack');
  const currentArtistSpan = document.getElementById('currentArtist');
  
  // Get song info from database (demonstrates: object properties access)
  const songInfo = songDatabase[plannedTrack] || songDatabase[playedTrack] || { 
    artist: 'Unknown Artist', 
    preview: '' 
  };
  
  // Media Component: Update audio source
  if (songInfo.preview) {
    audio.src = songInfo.preview;
    currentTrackSpan.textContent = plannedTrack;
    currentArtistSpan.textContent = songInfo.artist;
    
    // Play audio (Media Component)
    // Note: With mock data, preview URLs are empty, so this will not play
    audio.play().catch(function(error) {
      console.log('Audio play failed (mock data - no preview available):', error);
      // No alert needed for mock data - visual feedback is sufficient
    });
  } else {
    // Fallback if no preview available (mock data - no actual audio files)
    currentTrackSpan.textContent = plannedTrack;
    currentArtistSpan.textContent = songInfo.artist || 'Mock Artist';
    audio.src = '';
    audio.pause();
    // Show info message instead of alert for better UX with mock data
    const audioInfo = document.getElementById('audioInfo');
    if (audioInfo) {
      audioInfo.style.backgroundColor = '#fff3cd';
      setTimeout(function() {
        audioInfo.style.backgroundColor = '#f0f0f0';
      }, 2000);
    }
  }
}

// Make function available globally for inline event handler
window.loadPlaylistReport = loadPlaylistReport;

