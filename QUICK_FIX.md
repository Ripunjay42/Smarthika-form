# 🚨 URGENT: Data Not Appearing - Quick Fix

## Your Current Situation
✅ Frontend sending data successfully
❌ Google Sheet is empty
⚠️ Using `mode: 'no-cors'` which hides real errors

## 🎯 3-Step Quick Fix

### Step 1: Run Debug in Apps Script (30 seconds)

1. Open your **Google Apps Script** editor
2. Select the `debugSetup()` function from dropdown
3. Click **Run** ▶️
4. Check the **Execution log** (View > Executions)

**Expected output:**
```
✅ Spreadsheet found: [Your Sheet Name]
✅ Sheet "Farm Form Submissions" found!
```

**If you see:**
```
❌ Sheet "Farm Form Submissions" NOT found
   Available sheets:
   1. "Sheet1"
```

**→ ACTION:** Rename "Sheet1" to "Farm Form Submissions" (exact spelling!)

---

### Step 2: Test Direct Submission (30 seconds)

1. In Apps Script, select `testSubmission()` function
2. Click **Run** ▶️
3. Check your **Google Sheet**

**✅ If test row appears:**
- Script is working!
- Issue is with web deployment

**❌ If no row appears:**
- Check Apps Script logs for errors
- Verify sheet name is exactly: `Farm Form Submissions`

---

### Step 3: Verify Deployment (2 minutes)

1. In Apps Script: **Deploy > Manage deployments**
2. Check your deployment:
   - ✅ "Who has access" = **Anyone** ← CRITICAL!
   - ✅ "Execute as" = **Me**

3. **If "Who has access" is NOT "Anyone":**
   - Click **Edit** (pencil icon)
   - Change to **Anyone**
   - Click **Deploy**
   - **COPY THE NEW URL** (it will change!)
   - Update `.env`:
     ```env
     VITE_GOOGLE_SCRIPT_URL=NEW_URL_HERE
     ```
   - **Restart dev server:**
     ```bash
     npm run dev
     ```

---

## 🔍 Check Deployment Logs

After submitting from your form:

1. Go to Apps Script editor
2. Click **Executions** (left sidebar) or **View > Executions**
3. Look for recent executions
4. Click on any execution to see logs

**What to look for:**
- ✅ "=== NEW REQUEST RECEIVED ===" - Data is reaching the script
- ✅ "Row appended successfully" - Data was saved
- ❌ No executions shown - Data not reaching script (deployment issue)
- ❌ "Sheet not found" - Wrong sheet name

---

## 🎯 Most Common Issues

### Issue #1: "Who has access" not set to "Anyone" (90% of cases)
**Fix:** Deploy > Manage deployments > Edit > Change to "Anyone" > Deploy

### Issue #2: Wrong sheet name
**Fix:** Rename sheet to exactly "Farm Form Submissions" (check for spaces!)

### Issue #3: Old deployment URL
**Fix:** Create new deployment, copy new URL, update .env, restart server

---

## 📊 Your Current URLs

**Apps Script Deployment URL:**
```
https://script.google.com/macros/s/AKfycbx_v7CcCACty8D_NJU76WAqKaQ3P-dujpPgpDJtjhDCs1Frfmjgs_FpTAhkU3XX48Diog/exec
```

**Spreadsheet ID:**
```
1K915AnBXQvuXBLzjCSwMnH8Mmibbq8akG99byeCuwHQ
```

---

## ✅ Verification Checklist

Run through these in order:

1. [ ] Run `debugSetup()` - Sheet found?
2. [ ] Run `testSubmission()` - Row appears?
3. [ ] Deployment "Who has access" = Anyone?
4. [ ] Check Apps Script Executions - Any logs?
5. [ ] Browser console - Request sent to script.google.com?

---

## 🆘 If Still Not Working

Share this info:

1. **Apps Script Execution Logs** (screenshot or copy)
2. **debugSetup() output** (from logs)
3. **Browser console output** (when submitting)
4. **Sheet tab name** (exact name from bottom of Google Sheet)

This will tell us exactly what's wrong!
