// Manager Dashboard JavaScript

import { ScheduleManager } from './dj.js';

let scheduleManager;
let validationErrors = [];

document.addEventListener('DOMContentLoaded', function() {
  scheduleManager = new ScheduleManager();
  
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('day');
  if (dateInput) {
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const resetButton = document.querySelector('input[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', handleFormReset);
  }

  if (dateInput) {
    dateInput.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  }

  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(function(select) {
    select.addEventListener('change', function() {
      this.style.backgroundColor = '#e6f3ff';
    });
  });

  const tableRows = document.querySelectorAll('tbody tr');
  tableRows.forEach(function(row) {
    row.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f0f0f0';
    });
    row.addEventListener('mouseout', function() {
      this.style.backgroundColor = '';
    });
  });

  setTimeout(function() {
    const tipsSection = document.querySelector('aside h3');
    if (tipsSection) {
      tipsSection.style.color = '#ff9933';
    }
  }, 1000);
});

function handleFormSubmit(event) {
  event.preventDefault();
  validationErrors = [];
  
  const date = document.getElementById('day').value;
  const morning = document.getElementById('morning').value;
  const afternoon = document.getElementById('afternoon').value;
  const evening = document.getElementById('evening').value;

  let isValid = true;

  if (!date || date === '') {
    validationErrors.push('Date is required');
    isValid = false;
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      validationErrors.push('Date cannot be in the past');
      isValid = false;
    }
  }

  if (!morning || morning === '') {
    validationErrors.push('Morning slot must have a DJ assigned');
    isValid = false;
  }

  if (!afternoon || afternoon === '') {
    validationErrors.push('Afternoon slot must have a DJ assigned');
    isValid = false;
  }

  if (!evening || evening === '') {
    validationErrors.push('Evening slot must have a DJ assigned');
    isValid = false;
  }

  if (morning && afternoon && evening) {
    if (morning === afternoon && morning !== '') {
      validationErrors.push('A DJ cannot be assigned to both Morning and Afternoon slots');
      isValid = false;
    }
    if (morning === evening && morning !== '') {
      validationErrors.push('A DJ cannot be assigned to both Morning and Evening slots');
      isValid = false;
    }
    if (afternoon === evening && afternoon !== '') {
      validationErrors.push('A DJ cannot be assigned to both Afternoon and Evening slots');
      isValid = false;
    }
  }

  if (!isValid) {
    displayValidationErrors();
    window.alert('Please fix the validation errors before submitting');
    return false;
  }

  saveAssignments(date, morning, afternoon, evening);
  showSuccessMessage();
  
  return false;
}

function displayValidationErrors() {
  const existingErrors = document.querySelectorAll('.error-message');
  existingErrors.forEach(function(error) {
    error.remove();
  });

  const form = document.querySelector('form');
  let errorContainer = document.getElementById('error-container');
  
  if (!errorContainer) {
    errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px';
    errorContainer.style.padding = '10px';
    errorContainer.style.border = '1px solid red';
    errorContainer.style.backgroundColor = '#ffe6e6';
    form.insertBefore(errorContainer, form.firstChild);
  }

  errorContainer.innerHTML = '<strong>Validation Errors:</strong><ul>';
  
  validationErrors.forEach(function(error) {
    const listItem = document.createElement('li');
    listItem.textContent = error;
    errorContainer.querySelector('ul').appendChild(listItem);
  });
  
  errorContainer.innerHTML += '</ul>';
}

function showSuccessMessage() {
  const existingMessages = document.querySelectorAll('.success-message');
  existingMessages.forEach(function(msg) {
    msg.remove();
  });

  const form = document.querySelector('form');
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = 'Assignments saved successfully!';
  successMsg.style.color = 'green';
  successMsg.style.marginTop = '10px';
  successMsg.style.padding = '10px';
  successMsg.style.border = '1px solid green';
  successMsg.style.backgroundColor = '#e6ffe6';
  
  form.appendChild(successMsg);

  setTimeout(function() {
    successMsg.remove();
  }, 3000);
}

function saveAssignments(date, morning, afternoon, evening) {
  scheduleManager.addAssignment(date, 'Morning', morning);
  scheduleManager.addAssignment(date, 'Afternoon', afternoon);
  scheduleManager.addAssignment(date, 'Evening', evening);

  updateAssignmentTable(morning, afternoon, evening);
}

function updateAssignmentTable(morning, afternoon, evening) {
  const morningDJ = scheduleManager.getDJ(morning);
  const afternoonDJ = scheduleManager.getDJ(afternoon);
  const eveningDJ = scheduleManager.getDJ(evening);

  const morningCell = document.querySelector('tbody tr:nth-child(1) td:nth-child(2)');
  const afternoonCell = document.querySelector('tbody tr:nth-child(2) td:nth-child(2)');
  const eveningCell = document.querySelector('tbody tr:nth-child(3) td:nth-child(2)');

  if (morningCell && morningDJ) {
    morningCell.textContent = morningDJ.name;
    morningCell.style.color = '#0066cc';
    morningCell.style.fontWeight = 'bold';
  }

  if (afternoonCell && afternoonDJ) {
    afternoonCell.textContent = afternoonDJ.name;
    afternoonCell.style.color = '#0066cc';
    afternoonCell.style.fontWeight = 'bold';
  }

  if (eveningCell && eveningDJ) {
    eveningCell.textContent = eveningDJ.name;
    eveningCell.style.color = '#0066cc';
    eveningCell.style.fontWeight = 'bold';
  }
}

function handleFormReset(event) {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.remove();
  }

  const successMessages = document.querySelectorAll('.success-message');
  successMessages.forEach(function(msg) {
    msg.remove();
  });

  const tableCells = document.querySelectorAll('tbody td:nth-child(2)');
  tableCells.forEach(function(cell) {
    cell.textContent = '---';
    cell.style.color = '';
    cell.style.fontWeight = '';
  });

  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(function(select) {
    select.style.backgroundColor = '';
  });
}

// Custom object example
function createManagerObject() {
  let manager = {
    name: "Station Manager",
    role: "Manager",
    permissions: ["assign", "view", "report"],
    assignmentsCount: 0
  };

  console.log(manager.name);
  console.log(manager.role);

  manager.assignmentsCount = 5;
  manager.lastActive = new Date();
  manager.department = "Radio Operations";
  manager.status = "active";

  return manager;
}

const managerObj = createManagerObject();
console.log('Manager Object:', managerObj);
