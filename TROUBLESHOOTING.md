# 🔍 Google Sheets Integration Troubleshooting Guide

## ✅ Your Current Status

- Frontend shows: "✅ Data saved to: Drive > Farm Form Data > Farm Form Submissions"
- Google Sheet is blank - **Data is not appearing**

This means the frontend is sending data successfully, but it's either:
1. Not reaching Google Apps Script
2. Reaching but failing silently
3. Going to the wrong sheet

---

## 🛠️ Step-by-Step Debugging

### Step 1: Check Apps Script Logs

1. Open your Google Apps Script editor
2. Go to **View > Logs** (or **Execution log**)
3. Submit the form again
4. Check for any error messages in the logs

**What to look for:**
- ❌ "Sheet 'Farm Form Submissions' not found" - Wrong sheet name
- ❌ "No data received" - Data not reaching script
- ✅ "Row appended successfully" - Script is working but wrong sheet

---

### Step 2: Test Apps Script Directly

1. In Apps Script editor, find the `testSubmission()` function at the bottom
2. Click the **Run** button (▶️) next to `testSubmission`
3. Authorize if prompted
4. Check your Google Sheet - **you should see a test row appear**

**If test row appears:**
- ✅ Script is working correctly
- ❌ Problem is with the web deployment or CORS

**If test row doesn't appear:**
- ❌ Check the sheet name matches exactly
- ❌ Check the Spreadsheet ID is correct

---

### Step 3: Verify Deployment Settings

1. In Apps Script, click **Deploy > Manage deployments**
2. Check your active deployment:
   - ✅ Type: **Web app**
   - ✅ Execute as: **Me** (your email)
   - ✅ Who has access: **Anyone**
3. If "Who has access" is not "Anyone", update it:
   - Click **Edit** (pencil icon)
   - Change to **Anyone**
   - Click **Deploy**
   - **Copy the NEW URL** (it will change!)

---

### Step 4: Update Deployment (Create New Version)

The issue might be that you're hitting an old cached version. Create a new deployment:

1. Click **Deploy > New deployment**
2. Select **Web app**
3. Set:
   - Description: "Farm Form v2 - Debug"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and allow permissions
6. **Copy the new Web App URL**
7. Update your `.env` file with the new URL:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/NEW_URL_HERE/exec
   ```
8. **IMPORTANT:** Restart your dev server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

---

### Step 5: Check Sheet Name

1. Open your Google Sheet
2. Look at the tab name at the bottom
3. It should be **EXACTLY**: `Farm Form Submissions`

**Common issues:**
- Extra spaces: `Farm Form Submissions ` (space at end)
- Different case: `farm form submissions` or `FARM FORM SUBMISSIONS`
- Different name: `Sheet1` or `Form Submissions`

**Fix:**
- Either rename the sheet tab to match exactly
- Or update the script to use your actual sheet name:
  ```javascript
  const sheet = spreadsheet.getSheetByName('YOUR_ACTUAL_SHEET_NAME');
  ```

---

### Step 6: Verify Spreadsheet ID

1. Open your Google Sheet
2. Look at the URL:
   ```
   https://docs.google.com/spreadsheets/d/1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ/edit
   ```
3. The ID between `/d/` and `/edit` should be:
   ```
   1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ
   ```
4. Make sure this matches the ID in your Apps Script (line 18)

---

### Step 7: Check Browser Network Tab

1. Open your form in browser
2. Press **F12** to open Developer Tools
3. Go to **Network** tab
4. Submit the form
5. Look for a request to `script.google.com`
6. Click on it and check:
   - **Status**: Should be 200 or show as "(opaque)"
   - **Payload**: Should show your form data

**If no request appears:**
- ❌ Check the `.env` file has the correct URL
- ❌ Restart dev server after updating `.env`

---

### Step 8: Test with CORS Enabled (Temporarily)

To see actual error messages, temporarily enable CORS mode:

1. Open `src/services/googleSheets.js`
2. Change line 21:
   ```javascript
   // FROM:
   mode: 'no-cors',
   
   // TO:
   // mode: 'no-cors',  // Commented out for debugging
   ```
3. Submit the form
4. Check browser console for actual error messages
5. **Note:** The request will fail with CORS error, but you'll see the real error first

---

## 🎯 Most Likely Issues & Solutions

### Issue #1: Sheet Name Mismatch
**Solution:** Rename your sheet tab to exactly `Farm Form Submissions`

### Issue #2: Old Deployment Cached
**Solution:** Create new deployment (Step 4 above)

### Issue #3: Permissions Not Set
**Solution:** Make sure "Who has access" is set to "Anyone" (Step 3 above)

### Issue #4: Wrong Spreadsheet
**Solution:** Verify the Spreadsheet ID in Apps Script matches your sheet URL

---

## 📝 Quick Test Checklist

Run through this checklist:

- [ ] Apps Script has correct Spreadsheet ID: `1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ`
- [ ] Sheet tab name is exactly: `Farm Form Submissions` (check for extra spaces)
- [ ] Ran `testSubmission()` function and test row appeared
- [ ] Web App deployment "Who has access" is set to "Anyone"
- [ ] `.env` file has the latest deployment URL
- [ ] Restarted dev server after updating `.env`
- [ ] Browser console shows no JavaScript errors
- [ ] Network tab shows request going to script.google.com

---

## 🔧 Emergency Debug Script

Add this function to your Apps Script and run it to verify everything:

\`\`\`javascript
function debugSetup() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ');
    Logger.log('✅ Spreadsheet found: ' + spreadsheet.getName());
    
    const sheet = spreadsheet.getSheetByName('Farm Form Submissions');
    if (sheet) {
      Logger.log('✅ Sheet found: ' + sheet.getName());
      Logger.log('   Last row: ' + sheet.getLastRow());
      Logger.log('   Last column: ' + sheet.getLastColumn());
    } else {
      Logger.log('❌ Sheet "Farm Form Submissions" NOT found');
      Logger.log('   Available sheets:');
      spreadsheet.getSheets().forEach(s => {
        Logger.log('   - "' + s.getName() + '"');
      });
    }
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}
\`\`\`

Run this and check the logs for detailed information.

---

## 💡 Next Steps

1. **First**, run the `testSubmission()` function in Apps Script
2. **If test works**, the issue is with deployment - create new deployment
3. **If test fails**, the issue is with sheet name or permissions
4. **Then**, update `.env` with new URL and restart dev server
5. **Finally**, test the form submission again

---

## 📞 Still Not Working?

If none of the above work, share:
1. Apps Script execution logs (View > Logs)
2. Browser console errors
3. Network tab screenshot
4. Exact sheet tab name from your Google Sheet

This will help identify the exact issue!
