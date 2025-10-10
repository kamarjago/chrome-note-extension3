// Popup functionality for Quick Notes extension
document.addEventListener('DOMContentLoaded', function() {
  const noteInput = document.getElementById('noteInput');
  const saveBtn = document.getElementById('saveBtn');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const dateTimeEl = document.getElementById('dateTime');
  const charCounterEl = document.getElementById('charCounter');
  const MAX_CHARS = 500;

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
