# Extension Loading Instructions

## Prerequisites
- Google Chrome browser (version 88 or later for Manifest V3 support)

## Loading the Extension

Follow these steps to load the Quick Notes extension in Chrome:

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome
2. Navigate to `chrome://extensions/` or:
   - Click the three-dot menu (⋮) in the top right
   - Select "More tools" → "Extensions"

### Step 2: Enable Developer Mode
1. Look for the "Developer mode" toggle in the top right corner
2. Click it to enable Developer mode
3. You should see additional buttons appear ("Load unpacked", "Pack extension", etc.)

### Step 3: Load the Extension
1. Click the "Load unpacked" button
2. Navigate to your local extension directory (where you cloned/downloaded this repository)
3. Select the `chrome-note-extension` folder
4. Click "Select Folder" (or "Open" depending on your OS)

### Step 4: Verify Installation
After loading, you should see:
- ✓ "Quick Notes" extension card in the extensions list
- ✓ Extension version: 1.0.0
- ✓ Status: "Enabled"
- ✓ No errors or warnings displayed
- ✓ Extension icon visible in the Chrome toolbar

## Testing the Extension

### Test 1: Popup Interface
1. Click the Quick Notes icon in the Chrome toolbar
2. Verify the popup window opens (300px wide, showing note input area)
3. Type a test note
4. Click "Save Note"
5. Verify the note is saved (should show "Note saved!" alert)

### Test 2: Options/Notes Management Page
1. Click "View All Notes" button in the popup, OR
2. Right-click the extension icon → "Options"
3. Verify the notes management page opens in a new tab
4. Verify all saved notes are displayed with timestamps
5. Test deleting a note
6. Test "Clear All Notes" functionality

### Test 3: Storage Sync
1. Save a few notes
2. Open the Chrome DevTools (F12)
3. Go to Application → Storage → Chrome Storage → Sync
4. Verify notes are stored in sync storage
5. (Optional) If signed into Chrome, verify sync across devices

## Troubleshooting

### Extension Won't Load
- Check that all required files are present
- Verify manifest.json is valid JSON
- Check browser console for error messages

### Popup Doesn't Open
- Verify popup/popup.html exists
- Check that action is properly configured in manifest.json
- Look for JavaScript errors in the popup's DevTools

### Storage Not Working
- Verify "storage" permission is in manifest.json
- Check browser console for permission errors
- Ensure Chrome storage quota isn't exceeded (sync: 102,400 bytes)

## Extension Structure Verification

Run this command to verify all files are present:
```bash
cd <path-to-extension-directory>
ls -R
```

Expected output:
```
.:
.gitignore  icons  INSTALLATION.md  LICENSE  manifest.json  options  popup  README.md

./icons:
icon128.png  icon16.png  icon32.png  icon48.png

./options:
options.css  options.html  options.js

./popup:
popup.css  popup.html  popup.js
```

## Manifest V3 Features Used

- **Storage API**: Uses `chrome.storage.sync` for cross-device synchronization
- **Action API**: Replaces the deprecated browser_action with the action API
- **Options Page**: Provides a dedicated page for note management
- **Permissions**: Minimal permissions (only "storage" required)

## Development Notes

- The extension uses Manifest V3 (required for new Chrome extensions)
- Storage sync has a quota limit of 102,400 bytes
- Each item in sync storage is limited to 8,192 bytes
- No background service worker needed for this simple extension
- No content scripts required (no webpage interaction)
