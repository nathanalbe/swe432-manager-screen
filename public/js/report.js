// Reports page JavaScript
// Note: Playlist data now comes from server (database) via EJS template
// This file handles client-side interactions only

let playlistData = [];
let comparisonResults = [];
let currentReportDate = null;
let currentDJ = null;
let currentTimeSlot = null;

// Removed hardcoded songDatabase - song info comes from database via server

document.addEventListener('DOMContentLoaded', function() {
  initializeReportPage();
});

function initializeReportPage() {
  // Don't initialize hardcoded data - use server-rendered data from EJS template
  // The table is already populated by the server, so we just need to set up event handlers
  
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('reportDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = today;
    dateInput.setAttribute('min', today);
  }
  
  // Extract playlist data from server-rendered table for client-side operations
  initializePlaylistData();
  
  // Highlight mismatches if table has data
  const tableRows = document.querySelectorAll('#comparisonTable tbody tr');
  if (tableRows.length > 0 && !tableRows[0].querySelector('td[colspan]')) {
    setTimeout(function() {
      highlightMismatches();
    }, 500);
  }
}

// Extract playlist data from server-rendered table (populated by EJS from database)
function initializePlaylistData() {
  const tableRows = document.querySelectorAll('#comparisonTable tbody tr');
  playlistData = [];
  comparisonResults = [];
  
  tableRows.forEach(function(row, index) {
    const cells = row.querySelectorAll('td');
    // Check if this is a data row (not the "Select date and DJ" message)
    if (cells.length >= 4 && !row.querySelector('td[colspan]')) {
      const planned = cells[1].textContent.trim();
      const played = cells[2].textContent.trim();
      const statusCell = cells[3];
      const match = statusCell.textContent.includes('Match');
      
      // Try to extract artist from the preview button's onclick attribute
      const previewButton = row.querySelector('button[onclick]');
      let artist = 'Unknown Artist';
      let previewUrl = '';
      
      if (previewButton) {
        const onclickAttr = previewButton.getAttribute('onclick');
        // Extract artist and previewUrl from onclick="playAudioPreview('planned', 'played', 'artist', 'url')"
        const matches = onclickAttr.match(/playAudioPreview\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"],\s*['"]([^'"]*)['"]\)/);
        if (matches) {
          artist = matches[3] || 'Unknown Artist';
          previewUrl = matches[4] || '';
        }
      }
      
      playlistData.push({
        planned: planned,
        played: played,
        match: match,
        artist: artist,
        previewUrl: previewUrl
      });
      
      if (!match) {
        comparisonResults.push({
          index: index + 1,
          planned: planned,
          played: played,
          status: 'Mismatch'
        });
      }
    }
  });
}

// Table is now populated by server (EJS template), so this function is not needed
// Kept for backward compatibility but should not override server-rendered content
function populateComparisonTable() {
  // Table is already populated by EJS template from database
  // Only extract data if needed for client-side operations
  initializePlaylistData();
}

function handleRowClick(index) {
  const row = document.querySelector(`#comparisonTable tbody tr:nth-child(${index + 1})`);
  if (!row) return;

  const track = playlistData[index];
  if (!track) return;
  
  if (!track.match) {
    window.alert(`Mismatch detected!\n\nPlanned: ${track.planned}\nPlayed: ${track.played}`);
    row.style.backgroundColor = '#ffebee';
    row.style.border = '2px solid red';
    playAudioPreview(track.planned, track.played);
    setTimeout(function() {
      row.style.border = '';
    }, 2000);
  } else {
    window.alert(`Match confirmed: ${track.planned}`);
    playAudioPreview(track.planned, track.played);
  }
}

function highlightMismatches() {
  // Extract data from server-rendered table first
  initializePlaylistData();
  
  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  
  rows.forEach(function(row, index) {
    const track = playlistData[index];
    
    if (track && !track.match) {
      row.classList.add('mismatch-highlight');
      row.style.backgroundColor = '#fff3cd';
      row.style.borderLeft = '4px solid orange';
    }
  });

  showMismatchSummary();
}

function showMismatchSummary() {
  const existingSummary = document.querySelector('#mismatchSummary');
  if (existingSummary) {
    existingSummary.remove();
  }
  
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

function createReportObject() {
  let report = {
    title: "Playlist Comparison Report",
    date: new Date(),
    totalTracks: 0,
    mismatches: 0,
    matches: 0
  };

  console.log(report.title);
  console.log(report.date);

  report.totalTracks = playlistData.length;
  report.mismatches = comparisonResults.length;
  report.matches = playlistData.length - comparisonResults.length;
  report.status = 'completed';
  report.generatedBy = 'Manager Dashboard';

  return report;
}

const reportObj = createReportObject();
console.log('Report Object:', reportObj);

// This function is no longer needed - form submission handles loading via server
// Kept for backward compatibility
function loadPlaylistReport(date, djId, timeSlot) {
  // Form submission will handle this via POST to server
  // Server will render the page with database data
  document.getElementById('reportFilter').submit();
}

// Removed hardcoded time slot data - now using server-rendered data from database
function initializePlaylistDataForTimeSlot(timeSlot) {
  // Data comes from server via EJS template
  // Extract from rendered table if needed
  initializePlaylistData();
}

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

function attachRowEventListeners() {
  // Extract data from server-rendered table
  initializePlaylistData();
  
  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  
  rows.forEach(function(row, index) {
    // Don't clone - just add event listeners to existing rows
    const track = playlistData[index];
    
    if (track) {
      row.addEventListener('click', function() {
        // Get preview URL from the button's onclick attribute or data attribute
        const previewButton = row.querySelector('button[onclick]');
        if (previewButton) {
          // Extract previewUrl from onclick attribute
          const onclickAttr = previewButton.getAttribute('onclick');
          const previewUrlMatch = onclickAttr.match(/['"]([^'"]+)['"]/g);
          const previewUrl = previewUrlMatch && previewUrlMatch.length > 3 ? previewUrlMatch[3].replace(/['"]/g, '') : '';
          playAudioPreview(track.planned, track.played, track.artist || 'Unknown', previewUrl);
        }
      });
      
      row.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f8ff';
        this.style.cursor = 'pointer';
      });
      
      row.addEventListener('mouseout', function() {
        if (!this.classList.contains('mismatch-highlight')) {
          this.style.backgroundColor = '';
        }
      });
    }
  });
}

// Updated to use previewUrl passed from EJS template (from database)
// This function signature matches the one in report.ejs
function playAudioPreview(plannedTrack, playedTrack, artist, previewUrl) {
  const audio = document.getElementById('playlistAudio');
  const currentTrackSpan = document.getElementById('currentTrack');
  const currentArtistSpan = document.getElementById('currentArtist');
  const audioStatus = document.getElementById('audioStatus');
  
  if (!audio || !currentTrackSpan || !currentArtistSpan) {
    console.error('Audio player elements not found');
    return;
  }
  
  currentTrackSpan.textContent = plannedTrack;
  currentArtistSpan.textContent = artist || 'Unknown Artist';
  
  if (previewUrl && previewUrl.trim() !== '') {
    // Load and play the audio preview
    audio.src = previewUrl;
    audio.load();
    
    if (audioStatus) {
      audioStatus.textContent = 'Loading preview...';
      audioStatus.style.color = '#4a90e2';
    }
    
    // Try to play the audio
    audio.play().then(function() {
      if (audioStatus) {
        audioStatus.textContent = '✓ Playing preview';
        audioStatus.style.color = '#51cf66';
      }
    }).catch(function(error) {
      console.log('Audio play failed:', error);
      if (audioStatus) {
        audioStatus.textContent = '⚠ Could not auto-play. Click the play button above.';
        audioStatus.style.color = '#ffc107';
      }
    });
    
    // Update status when audio ends
    audio.addEventListener('ended', function() {
      if (audioStatus) {
        audioStatus.textContent = 'Preview finished';
        audioStatus.style.color = '#7f8c8d';
      }
    }, { once: true });
    
    // Update status on error
    audio.addEventListener('error', function() {
      if (audioStatus) {
        audioStatus.textContent = '✗ Error loading audio preview';
        audioStatus.style.color = '#ff6b6b';
      }
    }, { once: true });
  } else {
    // No preview URL available
    audio.src = '';
    audio.pause();
    if (audioStatus) {
      audioStatus.textContent = '⚠ No preview available for this track';
      audioStatus.style.color = '#ffc107';
    }
  }
}

window.loadPlaylistReport = loadPlaylistReport;
