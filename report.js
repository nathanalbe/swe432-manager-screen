// Reports page JavaScript

let playlistData = [];
let comparisonResults = [];
let currentReportDate = null;
let currentDJ = null;
let currentTimeSlot = null;

const songDatabase = {
  'PL-001': { artist: 'Artist 1', preview: '' },
  'PL-002': { artist: 'Artist 2', preview: '' },
  'PL-003': { artist: 'Artist 3', preview: '' },
  'PL-004': { artist: 'Artist 4', preview: '' },
  'PL-005': { artist: 'Artist 5', preview: '' },
  'PL-006': { artist: 'Artist 6', preview: '' },
  'PL-007': { artist: 'Artist 7', preview: '' },
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

document.addEventListener('DOMContentLoaded', function() {
  initializeReportPage();
});

function initializeReportPage() {
  initializePlaylistData();
  populateComparisonTable();
  
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('reportDate');
  if (dateInput) {
    dateInput.value = today;
    dateInput.setAttribute('min', today);
  }
  
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

  if (playlistData.length > 0) {
    setTimeout(function() {
      highlightMismatches();
    }, 500);
  }
}

function initializePlaylistData() {
  playlistData = [
    { planned: 'PL-001', played: 'PL-001', match: true },
    { planned: 'PL-002', played: 'PL-006', match: false },
    { planned: 'PL-003', played: 'PL-003', match: true },
    { planned: 'PL-004', played: 'PL-007', match: false },
    { planned: 'PL-005', played: 'PL-005', match: true }
  ];

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

function populateComparisonTable() {
  const tbody = document.querySelector('#comparisonTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  for (let i = 0; i < playlistData.length; i++) {
    const track = playlistData[i];
    const row = document.createElement('tr');
    
    const numCell = document.createElement('td');
    numCell.textContent = i + 1;
    
    const plannedCell = document.createElement('td');
    plannedCell.textContent = track.planned;
    
    const playedCell = document.createElement('td');
    playedCell.textContent = track.played;

    if (!track.match) {
      row.classList.add('mismatch-highlight');
      playedCell.style.color = 'red';
      playedCell.style.fontWeight = 'bold';
    } else {
      playedCell.style.color = 'green';
    }
    
    const statusCell = document.createElement('td');
    if (track.match) {
      statusCell.textContent = '✓ Match';
      statusCell.style.color = 'green';
    } else {
      statusCell.textContent = '✗ Mismatch';
      statusCell.style.color = 'red';
      statusCell.style.fontWeight = 'bold';
    }
    
    const previewCell = document.createElement('td');
    const playButton = document.createElement('button');
    playButton.textContent = '▶ Preview';
    playButton.style.padding = '5px 10px';
    playButton.style.backgroundColor = '#4CAF50';
    playButton.style.color = 'white';
    playButton.style.border = 'none';
    playButton.style.cursor = 'pointer';
    playButton.style.borderRadius = '3px';
    
    playButton.addEventListener('click', function(e) {
      e.stopPropagation();
      playAudioPreview(track.planned, track.played);
    });
    
    previewCell.appendChild(playButton);

    row.appendChild(numCell);
    row.appendChild(plannedCell);
    row.appendChild(playedCell);
    row.appendChild(statusCell);
    row.appendChild(previewCell);
    
    tbody.appendChild(row);
  }
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

function loadPlaylistReport(date, djId, timeSlot) {
  currentReportDate = date;
  currentDJ = djId;
  currentTimeSlot = timeSlot;
  
  const djNames = {
    'dj1': 'DJ Alex',
    'dj2': 'DJ Maya',
    'dj3': 'DJ Rico'
  };
  const djName = djNames[djId] || 'Unknown DJ';
  
  if (timeSlot === 'all' || !timeSlot) {
    initializePlaylistData();
  } else {
    initializePlaylistDataForTimeSlot(timeSlot);
  }
  
  populateComparisonTable();
  showReportInfo(date, djName, timeSlot);
  attachRowEventListeners();
}

function initializePlaylistDataForTimeSlot(timeSlot) {
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
  const rows = document.querySelectorAll('#comparisonTable tbody tr');
  
  rows.forEach(function(row, index) {
    const newRow = row.cloneNode(true);
    row.parentNode.replaceChild(newRow, row);
    
    newRow.addEventListener('click', function() {
      const track = playlistData[index];
      if (track) {
        playAudioPreview(track.planned, track.played);
      }
    });
    
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

function playAudioPreview(plannedTrack, playedTrack) {
  const audio = document.getElementById('playlistAudio');
  const currentTrackSpan = document.getElementById('currentTrack');
  const currentArtistSpan = document.getElementById('currentArtist');
  
  const songInfo = songDatabase[plannedTrack] || songDatabase[playedTrack] || { 
    artist: 'Unknown Artist', 
    preview: '' 
  };
  
  if (songInfo.preview) {
    audio.src = songInfo.preview;
    currentTrackSpan.textContent = plannedTrack;
    currentArtistSpan.textContent = songInfo.artist;
    audio.play().catch(function(error) {
      console.log('Audio play failed:', error);
    });
  } else {
    currentTrackSpan.textContent = plannedTrack;
    currentArtistSpan.textContent = songInfo.artist || 'Mock Artist';
    audio.src = '';
    audio.pause();
    const audioInfo = document.getElementById('audioInfo');
    if (audioInfo) {
      audioInfo.style.backgroundColor = '#fff3cd';
      setTimeout(function() {
        audioInfo.style.backgroundColor = '#f0f0f0';
      }, 2000);
    }
  }
}

window.loadPlaylistReport = loadPlaylistReport;
