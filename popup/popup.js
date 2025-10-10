// Popup functionality for Quick Notes extension
document.addEventListener('DOMContentLoaded', function() {
  const noteInput = document.getElementById('noteInput');
  const saveBtn = document.getElementById('saveBtn');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const dateTimeEl = document.getElementById('dateTime');
  const charCounterEl = document.getElementById('charCounter');
  const MAX_CHARS = 500;

  /**
   * Updates the displayed date/time with current local time
   */
  function updateDateTime() {
    const now = new Date();
    dateTimeEl.textContent = formatNaturalDate(now);
  }
  
  /**
   * Updates the character counter display and enforces character limit
   */
  function updateCharCounter() {
    const length = noteInput.value.length;
    charCounterEl.textContent = `${length}/${MAX_CHARS} characters`;
    
    if (length > MAX_CHARS) {
      charCounterEl.classList.add('over-limit');
      saveBtn.disabled = true;
    } else {
      charCounterEl.classList.remove('over-limit');
      saveBtn.disabled = false;
    }
  }

  // Initialize date/time on popup open
  updateDateTime();

  // Load any existing draft
  chrome.storage.sync.get(['draft'], function(result) {
    if (result.draft) {
      // Enforce character limit even for loaded drafts
      noteInput.value = result.draft.length > MAX_CHARS 
        ? result.draft.substring(0, MAX_CHARS) 
        : result.draft;
      updateCharCounter();
    }
  });

  // Save draft as user types
  noteInput.addEventListener('input', function() {
    // Enforce character limit
    if (noteInput.value.length > MAX_CHARS) {
      noteInput.value = noteInput.value.substring(0, MAX_CHARS);
    }
    chrome.storage.sync.set({ draft: noteInput.value });
    updateCharCounter();
  });

  /**
   * Saves the current note to Chrome storage
   */
  function saveNote() {
    const noteText = noteInput.value.trim();
    if (noteText && noteText.length <= MAX_CHARS) {
      const note = {
        id: Date.now(),
        text: noteText,
        timestamp: new Date().toISOString()
      };

      chrome.storage.sync.get(['notes'], function(result) {
        if (chrome.runtime.lastError) {
          alert('Error saving note: ' + chrome.runtime.lastError.message);
          return;
        }
        
        const notes = result.notes || [];
        notes.unshift(note);
        chrome.storage.sync.set({ notes: notes, draft: '' }, function() {
          if (chrome.runtime.lastError) {
            alert('Error saving note: ' + chrome.runtime.lastError.message);
            return;
          }
          
          // Close the popup on successful save
          window.close();
        });
      });
    }
  }

  // Save note button
  saveBtn.addEventListener('click', saveNote);

  // Keyboard shortcut: Command+Enter (Mac) or Ctrl+Enter (Windows/Linux)
  noteInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveNote();
    }
  });

  // View all notes button
  viewAllBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});
