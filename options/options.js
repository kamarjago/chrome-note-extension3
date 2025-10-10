// Options page functionality for Quick Notes extension
document.addEventListener('DOMContentLoaded', function() {
  const notesList = document.getElementById('notesList');
  const emptyState = document.getElementById('emptyState');
  const clearAllBtn = document.getElementById('clearAllBtn');

  /**
   * Formats a date object into natural language format
   * @param {Date} date - The date object to format
   * @returns {string} Formatted date string (e.g., "Monday, January 1st, 2025 - 3:45 pm")
   */
  function formatNaturalDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Get ordinal suffix
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      suffix = 'st';
    } else if (day === 2 || day === 22) {
      suffix = 'nd';
    } else if (day === 3 || day === 23) {
      suffix = 'rd';
    }
    
    // Format time
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    
    return `${dayOfWeek}, ${month} ${day}${suffix}, ${year} - ${hours}:${minutes} ${ampm}`;
  }

  /**
   * Loads and displays all notes from Chrome storage
   */
  function loadNotes() {
    chrome.storage.sync.get(['notes'], function(result) {
      const notes = result.notes || [];
      
      if (notes.length === 0) {
        notesList.innerHTML = '';
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
        displayNotes(notes);
      }
    });
  }

  /**
   * Displays notes in the list
   * @param {Array} notes - Array of note objects to display
   */
  function displayNotes(notes) {
    notesList.innerHTML = '';
    
    notes.forEach(function(note) {
      const noteItem = document.createElement('div');
      noteItem.className = 'note-item';
      
      const noteHeader = document.createElement('div');
      noteHeader.className = 'note-header';
      
      const timestamp = document.createElement('span');
      timestamp.className = 'note-timestamp';
      timestamp.textContent = formatNaturalDate(new Date(note.timestamp));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'note-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function() {
        deleteNote(note.id);
      });
      
      noteHeader.appendChild(timestamp);
      noteHeader.appendChild(deleteBtn);
      
      const noteText = document.createElement('div');
      noteText.className = 'note-text';
      noteText.textContent = note.text;
      
      noteItem.appendChild(noteHeader);
      noteItem.appendChild(noteText);
      notesList.appendChild(noteItem);
    });
  }

  /**
   * Deletes a specific note from storage
   * @param {number} noteId - The ID of the note to delete
   */
  function deleteNote(noteId) {
    chrome.storage.sync.get(['notes'], function(result) {
      const notes = result.notes || [];
      const updatedNotes = notes.filter(function(note) {
        return note.id !== noteId;
      });
      
      chrome.storage.sync.set({ notes: updatedNotes }, function() {
        loadNotes();
      });
    });
  }

  // Clear all notes
  clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete all notes? This cannot be undone.')) {
      chrome.storage.sync.set({ notes: [] }, function() {
        loadNotes();
      });
    }
  });

  // Initial load
  loadNotes();
});
