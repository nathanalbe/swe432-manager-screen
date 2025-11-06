// Module: DJ and Assignment classes
// Demonstrates: Classes, modules, object properties

/**
 * DJ Class - Represents a radio DJ
 * Demonstrates: Classes, constructor, properties, methods
 */
class DJ {
  constructor(id, name, experienceYears = 0) {
    this.id = id;
    this.name = name;
    this.experienceYears = experienceYears;
    this.assignedSlots = [];
  }

  // Method to assign a time slot
  assignSlot(slotName, date) {
    if (this.assignedSlots.length === 0) {
      this.assignedSlots = [];
    }
    this.assignedSlots.push({ slot: slotName, date: date });
  }

  // Method to get total assignments
  getTotalAssignments() {
    return this.assignedSlots.length;
  }

  // Method to check if available for a slot
  isAvailable(date, slotName) {
    // Check if DJ is already assigned to this slot on this date
    for (let i = 0; i < this.assignedSlots.length; i++) {
      if (this.assignedSlots[i].date === date && this.assignedSlots[i].slot === slotName) {
        return false;
      }
    }
    return true;
  }
}

/**
 * Assignment Class - Represents a DJ assignment to a time slot
 * Demonstrates: Classes, properties, object-oriented programming
 */
class Assignment {
  constructor(date, timeSlot, djId, djName) {
    this.date = date;
    this.timeSlot = timeSlot;
    this.djId = djId;
    this.djName = djName;
    this.createdAt = new Date();
  }

  // Method to get formatted date string
  getFormattedDate() {
    const dateObj = new Date(this.date);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Method to get assignment details
  getDetails() {
    return `${this.djName} assigned to ${this.timeSlot} on ${this.getFormattedDate()}`;
  }
}

/**
 * ScheduleManager Class - Manages DJ assignments
 * Demonstrates: Classes, properties, methods, object manipulation
 */
class ScheduleManager {
  constructor() {
    this.assignments = [];
    this.djs = new Map();
    
    // Initialize DJs (demonstrates object creation and properties)
    this.djs.set('dj1', new DJ('dj1', 'DJ Alex', 5));
    this.djs.set('dj2', new DJ('dj2', 'DJ Maya', 3));
    this.djs.set('dj3', new DJ('dj3', 'DJ Rico', 7));
  }

  // Method to add assignment
  addAssignment(date, timeSlot, djId) {
    const dj = this.djs.get(djId);
    if (!dj) {
      return false;
    }

    // Check for conflicts (demonstrates comparison operators and conditionals)
    if (!dj.isAvailable(date, timeSlot)) {
      return false;
    }

    // Create new assignment
    const assignment = new Assignment(date, timeSlot, djId, dj.name);
    this.assignments.push(assignment);
    dj.assignSlot(timeSlot, date);
    
    return assignment;
  }

  // Method to get assignments for display
  getAssignmentsByDate(date) {
    const results = [];
    for (let i = 0; i < this.assignments.length; i++) {
      if (this.assignments[i].date === date) {
        results.push(this.assignments[i]);
      }
    }
    return results;
  }

  // Method to get DJ by ID
  getDJ(djId) {
    return this.djs.get(djId);
  }
}

// Export classes for use in other modules
export { DJ, Assignment, ScheduleManager };

