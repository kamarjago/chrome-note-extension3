# Quick Notes Chrome Extension

A cross-device note-taking Chrome extension with quick capture and comprehensive management.

## Features

- Quick note capture through popup interface
- Keyboard shortcut support (Command+Enter on Mac, Ctrl+Enter on Windows/Linux)
- Comprehensive notes management page
- Cross-device synchronization via Chrome sync storage
- Clean and intuitive user interface

## Installation

### Load as Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Select the extension directory
5. The Quick Notes extension should now appear in your extensions list

## Usage

- Click the extension icon to open the quick note popup
- Type your note and save it by:
  - Clicking the "Save Note" button, or
  - Pressing **Command+Enter** (Mac) or **Ctrl+Enter** (Windows/Linux)
- Click "View All Notes" to open the notes management page
- In the notes management page, you can view, delete individual notes, or clear all notes

## Project Structure

```
chrome-note-extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup/                 # Popup interface
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── options/               # Notes management page
│   ├── options.html
│   ├── options.css
│   └── options.js
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Technologies

- Chrome Extension Manifest V3
- Chrome Storage API (sync storage)
- HTML5, CSS3, JavaScript (ES6+)

## License

MIT License - see LICENSE file for details
