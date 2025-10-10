// Options page functionality for Quick Notes extension
document.addEventListener('DOMContentLoaded', function() {
  const notesList = document.getElementById('notesList');
  const emptyState = document.getElementById('emptyState');
  const clearAllBtn = document.getElementById('clearAllBtn');

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
