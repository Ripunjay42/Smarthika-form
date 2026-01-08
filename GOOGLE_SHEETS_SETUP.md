# 🌱 Farm Form - Google Sheets Integration Setup

## ✅ Frontend Updated Successfully!

The following files have been created/updated:

1. **`src/services/googleSheets.js`** - Google Sheets API service
2. **`src/components/layout/FormPanel.jsx`** - Updated with submission logic
3. **`.env`** - Environment variables (contains your Google Script URL)
4. **`.env.example`** - Template for environment variables

---

## 📋 Next Steps to Complete Integration

### Step 1: Get Your Spreadsheet ID

1. Open your Google Sheet: **Google Drive > Farm Form Data > Farm Form Submissions**
2. Look at the URL in your browser:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz456.../edit
   ```
3. Copy the long ID between `/d/` and `/edit`

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Copy the complete Apps Script code (provided separately)
4. **IMPORTANT:** Update this line with your Spreadsheet ID:
   ```javascript
   const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
   ```
   
   OR if script is attached to the sheet, use:
   ```javascript
   const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
   ```

5. Make sure sheet name matches:
   ```javascript
   const sheet = spreadsheet.getSheetByName('Farm Form Submissions');
   ```

### Step 3: Deploy the Web App

1. Click **Save** (💾 icon)
2. Click **Deploy > New deployment**
3. Click the gear icon ⚙️ next to "Select type"
4. Select **Web app**
5. Configure:
   - **Description**: "Farm Form Submission API v1"
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Click **Deploy**
7. Click **Authorize access** and follow the prompts
8. **COPY THE WEB APP URL** - You'll need this!

### Step 4: Update Frontend with Web App URL

1. Open `frontend/.env` file (or create it if it doesn't exist)
2. Update the `VITE_GOOGLE_SCRIPT_URL` variable with your Web App URL:
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycby.../exec
   ```

3. **Important**: Never commit the `.env` file to Git (it's already in `.gitignore`)
4. For team members, share the `.env.example` file and they can create their own `.env`

### Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Fill out the farm form completely
3. Navigate to the last module (Vision)
4. Click **"Submit to Google Sheets"**
5. Check your Google Sheet for the new data row!

---

## 🎯 What's Been Implemented

### Form Submission Features:

✅ **Smart Validation** - Checks required fields before submission
✅ **Loading States** - Shows spinner while submitting
✅ **Success Feedback** - Green checkmark and confirmation message
✅ **Error Handling** - Displays errors if submission fails
✅ **Disabled State** - Prevents duplicate submissions
✅ **Complete Data Export** - All 85+ form fields sent to Google Sheets

### Button States:

- **Normal**: "Submit to Google Sheets" (Green)
- **Submitting**: "Submitting..." with spinner (Gray)
- **Success**: "Submitted!" with checkmark (Green)
- **Error**: "Retry Submit" with warning icon (Orange)

---

## 📊 Data Structure Sent to Google Sheets

All form modules are included:

1. **Profile** - Farmer name, contact, labor count
2. **Canvas** - GPS, area, soil, topography, geometry
3. **Heart** - Water source, levels, quality, risks
4. **Arteries** - Pipes, tanks, delivery system
5. **Pulse** - Energy source, voltage, availability
6. **Shelter** - Structure, signal strength
7. **Biology** - Crops, irrigation, water demand
8. **Baseline** - Old pump, retrofit details
9. **Shed** - Equipment ownership, harvest schedule
10. **Vision** - Expansion plans, labor pain, targets

---

## 🔧 Optional Enhancements

### Enable Email Notifications

In your Apps Script, uncomment this line:
```javascript
sendNotificationEmail(data, sheet.getLastRow());
```

Then update the email address:
```javascript
const email = 'your-email@example.com';
```

### Add Secret Key (Security)

For production, add authentication:

1. In Apps Script:
```javascript
const SECRET_KEY = 'your-secret-key-123';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  // Verify secret key
  if (data.secretKey !== SECRET_KEY) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: 'Unauthorized' })
    );
  }
  // ... rest of code
}
```

2. In `googleSheets.js`:
```javascript
body: JSON.stringify({
  ...formData,
  secretKey: 'your-secret-key-123'
}),
```

---

## 🐛 Troubleshooting

### Issue: "Access Denied" error
**Solution:** Make sure "Who has access" is set to "Anyone" in deployment settings

### Issue: Data not appearing in sheet
**Solution:** 
- Check browser console for errors
- Verify Web App URL is correct
- Ensure script has permission to access the sheet
- Check that sheet name matches exactly

### Issue: CORS errors in console
**Solution:** These are normal with `mode: 'no-cors'`. Data is still being saved if request completes.

### Issue: Validation errors
**Solution:** Ensure these required fields are filled:
- Farmer Name (Profile module)
- WhatsApp Number (Profile module)
- Total Area (Canvas module)

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── services/
│   │   └── googleSheets.js          ← NEW: Google Sheets API
│   ├── components/
│   │   └── layout/
│   │       └── FormPanel.jsx        ← UPDATED: Submission logic
│   └── context/
│       └── FormContext.jsx          ← (Already has formData)
```

---

## ✨ Testing Checklist

- [ ] Google Sheet exists at: Drive > Farm Form Data > Farm Form Submissions
- [ ] Apps Script deployed with correct Spreadsheet ID
- [ ] Web App URL copied to `googleSheets.js`
- [ ] Required fields filled in form
- [ ] Submit button shows correct states
- [ ] Data appears in Google Sheet
- [ ] Email notification received (if enabled)

---

## 🎉 You're All Set!

Once you've completed Steps 1-4 above, your Farm Form will automatically save all submissions to your Google Sheet!

**Location**: Google Drive > Farm Form Data > Farm Form Submissions

For questions or issues, check the browser console for detailed error messages.
