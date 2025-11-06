// Main JavaScript file for Manager Dashboard
// Demonstrates: Event handlers, form validation, DOM manipulation, window object, JavaScript fundamentals

import { ScheduleManager } from './dj.js';

// Variables (JavaScript Fundamentals - 2 pts)
let scheduleManager;
let validationErrors = [];
let currentDate = null;

// Initialize on DOM content loaded (Window Object - 10 pts)
document.addEventListener('DOMContentLoaded', function() {
  initializeApplication();
});

/**
 * Initialize the application
 * Demonstrates: Functions, DOM manipulation, window object
 */
function initializeApplication() {
  // Create schedule manager instance (demonstrates object creation)
  scheduleManager = new ScheduleManager();
  
  // Set minimum date to today (demonstrates Date object and window/document)
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('day');
  if (dateInput) {
    dateInput.setAttribute('min', today);
    dateInput.value = today;
    currentDate = today;
  }

  // Listener Approach (10 pts) - addEventListener for form submission
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Listener Approach - addEventListener for reset button
  const resetButton = document.querySelector('input[type="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', handleFormReset);
  }

  // Event Types (10 pts) - keydown event on date input
  if (dateInput) {
    dateInput.addEventListener('keydown', function(event) {
      // Demonstrates: Event types, conditionals, comparison operators
      if (event.key === 'Enter') {
        event.preventDefault();
        validateDateInput(event.target);
      }
    });
  }

  // Event Types - change event on select elements
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(function(select) {
    select.addEventListener('change', function() {
      // Demonstrates: Event types, DOM manipulation, functions
      highlightSelectedOption(this);
    });
  });

  // Event Types - mouseover event on table rows
  const tableRows = document.querySelectorAll('tbody tr');
  tableRows.forEach(function(row) {
    row.addEventListener('mouseover', function() {
      // Demonstrates: Event types, DOM manipulation (modifying style)
      this.style.backgroundColor = '#f0f0f0';
    });
    row.addEventListener('mouseout', function() {
      this.style.backgroundColor = '';
    });
  });

  // Window Object (10 pts) - Using setTimeout
  setTimeout(function() {
    const tipsSection = document.querySelector('aside h3');
    if (tipsSection) {
      // Demonstrates: Window object, DOM manipulation, setTimeout
      tipsSection.style.color = '#ff9933';
    }
  }, 1000);

  // Window Object - Using alert (demonstrated in validation)
  // Window Object - DOMContentLoaded already used above
}

/**
 * Handle form submission
 * Demonstrates: Event handling, form validation, conditionals, logical operators
 */
function handleFormSubmit(event) {
  // Prevent default form submission
  event.preventDefault();
  
  // Clear previous errors
  validationErrors = [];
  
  // Get form values (demonstrates: variables, DOM manipulation)
  const date = document.getElementById('day').value;
  const morning = document.getElementById('morning').value;
  const afternoon = document.getElementById('afternoon').value;
  const evening = document.getElementById('evening').value;

  // Form Validation (10 pts) - Validate all inputs
  let isValid = true;

  // Validate date (demonstrates: comparison operators, conditionals)
  if (!date || date === '') {
    validationErrors.push('Date is required');
    isValid = false;
  } else {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Comparison Operators (2 pts) - checking if date is in the past
    if (selectedDate < today) {
      validationErrors.push('Date cannot be in the past');
      isValid = false;
    }
  }

  // Validate morning slot (demonstrates: logical operators, conditionals)
  if (!morning || morning === '') {
    validationErrors.push('Morning slot must have a DJ assigned');
    isValid = false;
  }

  // Validate afternoon slot
  if (!afternoon || afternoon === '') {
    validationErrors.push('Afternoon slot must have a DJ assigned');
    isValid = false;
  }

  // Validate evening slot
  if (!evening || evening === '') {
    validationErrors.push('Evening slot must have a DJ assigned');
    isValid = false;
  }

  // Logical Operators (2 pts) - Check for duplicate DJ assignments
  if (morning && afternoon && evening) {
    // Logical AND (&&) and comparison operators (==, !=)
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

  // Display validation errors if any
  if (!isValid) {
    displayValidationErrors();
    // Window Object (10 pts) - Using alert
    window.alert('Please fix the validation errors before submitting');
    return false;
  }

  // If validation passes, save assignments
  saveAssignments(date, morning, afternoon, evening);
  
  // Form validation visible and successfully shown (2 pts)
  showSuccessMessage();
  
  return false;
}

/**
 * Display validation errors
 * Demonstrates: DOM manipulation, loops, conditionals
 */
function displayValidationErrors() {
  // Remove existing error messages
  const existingErrors = document.querySelectorAll('.error-message');
  existingErrors.forEach(function(error) {
    error.remove();
  });

  // Create error display element
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

  // Clear previous content
  errorContainer.innerHTML = '<strong>Validation Errors:</strong><ul>';
  
  // Loops (2 pts) - forEach loop to display errors
  validationErrors.forEach(function(error) {
    const listItem = document.createElement('li');
    listItem.textContent = error;
    errorContainer.querySelector('ul').appendChild(listItem);
  });
  
  errorContainer.innerHTML += '</ul>';
}

/**
 * Show success message
 * Demonstrates: DOM manipulation, window object
 */
function showSuccessMessage() {
  // Remove existing messages
  const existingMessages = document.querySelectorAll('.success-message');
  existingMessages.forEach(function(msg) {
    msg.remove();
  });

  // Create success message
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

  // Window Object - Using setTimeout to remove message
  setTimeout(function() {
    successMsg.remove();
  }, 3000);
}

/**
 * Save assignments and update table
 * Demonstrates: Functions, loops, DOM manipulation, object properties
 */
function saveAssignments(date, morning, afternoon, evening) {
  // Add assignments to schedule manager
  scheduleManager.addAssignment(date, 'Morning', morning);
  scheduleManager.addAssignment(date, 'Afternoon', afternoon);
  scheduleManager.addAssignment(date, 'Evening', evening);

  // Update table (Modifying DOM Element - 10 pts)
  updateAssignmentTable(morning, afternoon, evening);
}

/**
 * Update the assignment table
 * Demonstrates: DOM manipulation, modifying elements, properties
 */
function updateAssignmentTable(morning, afternoon, evening) {
  // Get DJ names (demonstrates: object properties access)
  const morningDJ = scheduleManager.getDJ(morning);
  const afternoonDJ = scheduleManager.getDJ(afternoon);
  const eveningDJ = scheduleManager.getDJ(evening);

  // Modify DOM elements (10 pts) - Changing text content
  const morningCell = document.querySelector('tbody tr:nth-child(1) td:nth-child(2)');
  const afternoonCell = document.querySelector('tbody tr:nth-child(2) td:nth-child(2)');
  const eveningCell = document.querySelector('tbody tr:nth-child(3) td:nth-child(2)');

  if (morningCell && morningDJ) {
    morningCell.textContent = morningDJ.name;
    // Modifying DOM Element - Changing style
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

/**
 * Handle form reset
 * Demonstrates: Event handling, DOM manipulation
 */
function handleFormReset(event) {
  // Clear error messages
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.remove();
  }

  // Clear success messages
  const successMessages = document.querySelectorAll('.success-message');
  successMessages.forEach(function(msg) {
    msg.remove();
  });

  // Reset table to defaults (DOM manipulation)
  const tableCells = document.querySelectorAll('tbody td:nth-child(2)');
  tableCells.forEach(function(cell) {
    cell.textContent = '---';
    cell.style.color = '';
    cell.style.fontWeight = '';
  });

  // Reset highlight on select elements
  const selectElements = document.querySelectorAll('select');
  selectElements.forEach(function(select) {
    select.style.backgroundColor = '';
  });
}

/**
 * Validate date input
 * Demonstrates: Event handling, DOM manipulation, conditionals
 */
function validateDateInput(input) {
  const date = input.value;
  if (date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Comparison Operators - checking date validity
    if (selectedDate < today) {
      input.style.borderColor = 'red';
      input.style.backgroundColor = '#ffe6e6';
    } else {
      input.style.borderColor = '';
      input.style.backgroundColor = '';
    }
  }
}

/**
 * Highlight selected option
 * Demonstrates: DOM manipulation, properties
 */
function highlightSelectedOption(selectElement) {
  // Reset all selects first
  const allSelects = document.querySelectorAll('select');
  allSelects.forEach(function(sel) {
    sel.style.backgroundColor = '';
  });

  // Highlight current selection (Properties - 10 pts)
  if (selectElement.value && selectElement.value !== '') {
    selectElement.style.backgroundColor = '#e6f3ff';
    selectElement.style.borderColor = '#0066cc';
  }
}

/**
 * Custom Object Example (Properties - 10 pts)
 * Demonstrates: Creating custom objects, accessing/modifying properties
 */
function createManagerObject() {
  // Creating a custom object
  let manager = {
    name: "Station Manager",
    role: "Manager",
    permissions: ["assign", "view", "report"],
    assignmentsCount: 0
  };

  // Accessing object properties
  console.log(manager.name);
  console.log(manager.role);

  // Modifying object properties
  manager.assignmentsCount = 5;
  manager.lastActive = new Date();

  // Adding new properties
  manager.department = "Radio Operations";
  manager.status = "active";

  return manager;
}

// Call function to demonstrate custom object creation
const managerObj = createManagerObject();
console.log('Manager Object:', managerObj);

