# AcadHub — Updates & Fix Backlog

> **Project:** AcadHub — Nigerian Academic Research Repository  
> **Stack:** React 19 + Vite + Firebase (Auth, Firestore, Storage) + Tailwind CSS  
> **Purpose:** This document tracks all known bugs, architectural issues, and UI improvements to be resolved. Work through sections top-to-bottom — criticals first.

---

## How To Use This File

Each item has:
- **File path** — exact location of the problem
- **What's wrong** — clear description
- **What to do** — the exact fix or approach
- **Status checkbox** — check off as you go

---



- [x] **Vercel SPA routing 404** — `vercel.json` created with `rewrites` rule pointing all paths to `index.html`
- [x] **Vite build optimisation** — `vite.config.js` updated with `manualChunks` to split Firebase, React, and Chart.js into separate bundles

---

## 🔴 Critical Bugs — Fix First

These will cause runtime crashes or broken core features.

---

### C-01 — `setIsSidebarCollapsed` ReferenceError crashes 4 pages

**Files:**
- `src/features/lecturer/pages/LecturerDashboardPage.jsx`
- `src/features/admin/pages/AdminSettingsPage.jsx`
- `src/features/admin/pages/ContentModerationPage.jsx`
- `src/features/admin/pages/UserManagementPage.jsx`

**What's wrong:**  
All four pages pass `toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}` to the `<Sidebar>` component. The `useSidebar` hook does not expose `setIsSidebarCollapsed` — only `toggleSidebar`. This throws a `ReferenceError` the moment any of these pages render and the user interacts with the sidebar.

**What to do:**  
In all four files, replace:
```jsx
// WRONG
toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}

// CORRECT
toggleSidebar={toggleSidebar}
```

---

### C-02 — `inView` capitalisation breaks all scroll animations

**File:** `src/features/landing/components/Features.jsx`

**What's wrong:**  
Inside the `FeatureItem` component, the hook is destructured as:
```js
const { ref, InView } = useInView(...)
```
`InView` is always `undefined` because the correct export is lowercase `inView`. The fade-in/slide-in reveal animations on all three feature cards never fire.

**What to do:**  
Change to:
```js
const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
```
Then use `inView` (lowercase) in the className conditional.

---

### C-03 — Forgot Password never sends an email

**File:** `src/features/auth/pages/ForgotPasswordPage.jsx`

**What's wrong:**  
The `handleSubmit` function is a fake — it runs a `setTimeout` and sets `isSent = true`, but never calls Firebase. Users will see the "Check your email" screen but receive nothing.

**What to do:**  
Replace the handler with a real Firebase call:
```js
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebase';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await sendPasswordResetEmail(auth, email);
    setIsSent(true);
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🟠 Architectural Issues — Fix Before Next Deploy

These won't crash the app immediately but create security holes, performance problems, or incorrect data.

---

### A-01 — No route guards on student or admin routes

**File:** `src/App.jsx`

**What's wrong:**  
Only lecturer routes are protected by `<LecturerGuard>`. Every student route (`/dashboard`, `/uploads`, `/saved`, etc.) and every admin route (`/admin/dashboard`, `/admin/users`, etc.) has zero authentication or role checks. A logged-out user or a student can type `/admin/dashboard` in the URL bar and see the page (or at least attempt to load it).

**What to do:**  
Create two new guard components:

`src/features/auth/components/AuthGuard.jsx` — redirects to `/login` if `!currentUser`

`src/features/auth/components/AdminGuard.jsx` — redirects to `/` if `currentUser.role !== 'admin'`

Then wrap routes in `App.jsx`:
```jsx
// Student routes
<Route element={<AuthGuard />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/uploads" element={<MyUploadsPage />} />
  {/* ...etc */}
</Route>

// Admin routes
<Route element={<AdminGuard />}>
  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
  {/* ...etc */}
</Route>
```

---

### A-02 — Vertex AI (Gemini) called directly from the browser

**File:** `src/features/repository/pages/RepositoryDetailPage.jsx`

**What's wrong:**  
The AI Insights tab calls `getAI(app, { backend: new VertexAIBackend() })` directly in the React component. This means the Firebase app config (including project credentials) is exposed client-side and the AI quota can be exhausted by anyone who inspects the network requests. Your own architecture document states all AI calls should go through Firebase Cloud Functions.

**What to do:**  
1. Create a Cloud Function `generateProjectInsight(projectId)` that accepts a project ID, fetches the abstract server-side, calls Gemini, and returns the result
2. In `RepositoryDetailPage`, replace the direct AI call with:
```js
import { getFunctions, httpsCallable } from 'firebase/functions';
const functions = getFunctions();
const generateInsight = httpsCallable(functions, 'generateProjectInsight');
const result = await generateInsight({ projectId: id });
setAiInsight(result.data.insight);
```

---

### A-03 — Double Firestore fetch on every login

**File:** `src/features/auth/pages/LoginPage.jsx`

**What's wrong:**  
`LoginPage` calls `login()` from `AuthContext`, which already fetches the user's Firestore document and stores the role in state. Then immediately after, `LoginPage` fetches the exact same document again to read the role for redirect logic. This is two Firestore reads when one suffices.

**What to do:**  
`AuthContext.login()` already returns `combinedUser` with `.role` attached. Use that directly:
```js
const userCredential = await login(email, password);
// userCredential.user has role merged in from AuthContext
const role = userCredential.role;
if (role === 'lecturer') navigate('/lecturer/dashboard');
else if (role === 'admin') navigate('/admin/dashboard');
else navigate('/dashboard');
```
Remove the secondary `getDoc` call from `LoginPage`.

---

### A-04 — `@faker-js/faker` and `axios` in production dependencies

**File:** `package.json`

**What's wrong:**  
- `@faker-js/faker` (used only in `src/utils/seeder.js`, a dev-only data seeder) is listed under `dependencies`. It ships to production and adds ~2MB to the bundle.
- `axios` is listed under `dependencies` but is never imported anywhere in the application. Firebase SDK and native `fetch` are used for all HTTP calls.

**What to do:**  
```json
// Move faker to devDependencies
"devDependencies": {
  "@faker-js/faker": "^9.9.0",
  ...
}

// Remove axios entirely
// Run: npm uninstall axios
```

---

### A-05 — Unverified lecturers are invisible to admins

**File:** `src/features/admin/pages/UserManagementPage.jsx`

**What's wrong:**  
After fetching all users, this line silently removes unverified lecturers from the list:
```js
.filter(u => !(u.role === 'lecturer' && u.verificationStatus !== 'verified'))
```
Pending and rejected lecturers are completely hidden from the admin User Management page, making them unmanageable from there. Admins should be able to see and manage all users regardless of verification status.

**What to do:**  
Remove the filter entirely. Add a verification status badge column to the table so admins can see the status at a glance. The separate Verification Requests page handles the approval workflow — User Management should show everyone.

---

## 🟡 Logic & Data Bugs

---

### L-01 — Repository tabs are additive, not switching

**File:** `src/features/repository/pages/RepositoryDetailPage.jsx`

**What's wrong:**  
The Abstract section renders unconditionally outside of any tab check. The `full-doc` and `trends` sections render *in addition to* the abstract when selected, not *instead of* it. There is also no exclusive `overview` content block, so the Overview tab shows nothing unique.

**What to do:**  
Wrap all tab content in a single conditional block:
```jsx
{activeTab === 'overview' && (
  <AbstractSection project={project} />
)}
{activeTab === 'full-doc' && (
  <DocumentViewer project={project} />
)}
{activeTab === 'trends' && (
  <TrendsSection project={project} chartData={chartData} />
)}
{activeTab === 'ai-insights' && (
  <AIInsightsSection ... />
)}
```
Move the abstract JSX inside the `overview` block.

---

### L-02 — View count is never incremented

**File:** `src/features/repository/pages/RepositoryDetailPage.jsx`

**What's wrong:**  
`handleDownload` increments the `downloads` field in Firestore. There is no equivalent for `views`. The views counter on every project will stay at 0 forever even though the stats card and My Uploads page display it.

**What to do:**  
Add a view increment in the `useEffect` that fetches the project:
```js
// After confirming docData.exists()
if (currentUser && docData.data().studentId !== currentUser.uid) {
  // Don't count the author's own views
  updateDoc(docRef, { views: increment(1) });
}
```
Import `increment` from `firebase/firestore`.

---

### L-03 — Chart dark mode uses wrong condition

**File:** `src/features/lecturer/pages/LecturerAnalyticsPage.jsx`

**What's wrong:**  
```js
grid: { color: isSidebarCollapsed ? '#f3f4f6' : '#374151' }
```
`isSidebarCollapsed` is a boolean about the sidebar state, not the theme. The chart grid lines will be the wrong colour in almost every scenario.

**What to do:**  
```js
const isDark = document.documentElement.classList.contains('dark');
// Then in chart options:
grid: { color: isDark ? '#374151' : '#f3f4f6' }
```
Or better, pass the `theme` value from `useTheme()` hook which already exists in the project.

---

### L-04 — Notification toast fires on page refresh for recent notifications

**File:** `src/context/NotificationContext.jsx`

**What's wrong:**  
The `isFirstLoad` ref is set to `false` inside the first snapshot callback, but the 60-second recency check (`now - created < 60000`) means notifications created in the last minute will still trigger a toast on refresh. Users who reload the page shortly after receiving a notification will see it pop up again.

**What to do:**  
Track which notification IDs have already been toasted using a `Set` stored in a ref, so each notification ID only ever toasts once per session regardless of timing:
```js
const toastedIds = useRef(new Set());

// Inside docChanges loop:
if (change.type === 'added' && !toastedIds.current.has(change.doc.id)) {
  if (!isFirstLoad.current) {
    // show toast
    toastedIds.current.add(change.doc.id);
  }
}
// After first snapshot:
isFirstLoad.current = false;
// Pre-populate toastedIds with existing notification IDs
snapshot.docs.forEach(d => toastedIds.current.add(d.id));
```

---

## 🔵 UI / Styling Issues

---

### U-01 — Invalid Tailwind class `mt-26` breaks photo label layout

**File:** `src/features/onboarding/pages/StudentOnboardingPage.jsx`

**What's wrong:**  
```jsx
<span className="text-xs text-gray-500 mt-2 block text-center mt-26">Upload Photo</span>
```
`mt-26` is not a Tailwind utility (Tailwind's spacing scale goes `mt-24`, `mt-28` — there is no `mt-26`). It will be ignored, and the duplicate `mt-2` will apply instead, placing the label too close to the avatar circle.

**What to do:**  
Remove `mt-26`. Use `mt-3` or the correct value that visually positions the label below the avatar:
```jsx
<span className="text-xs text-gray-500 mt-3 block text-center">Upload Photo</span>
```

---

### U-02 — Two conflicting Prism.js CSS themes imported simultaneously

**File:** `src/features/landing/components/CodeWindow.jsx`

**What's wrong:**  
Both `prism-tomorrow.css` (dark theme) and `prism-coy.css` (light theme) are imported. These inject conflicting global styles — token colours from both themes fight each other depending on CSS load order. The component's own comments acknowledge the problem but leave it unresolved.

**What to do:**  
Remove the `prism-coy.css` import entirely. The code window is intentionally styled with a dark background (`bg-white dark:bg-[#0d1117]`), and `prism-tomorrow.css` provides good contrast. If a light-mode code window is genuinely needed later, handle it by dynamically swapping the stylesheet using the `useTheme` hook rather than importing both.

---

### U-03 — Supervision Request Detail AI sidebar is entirely hardcoded

**File:** `src/features/lecturer/pages/SupervisionRequestDetailPage.jsx`

**What's wrong:**  
The right-side "AI Review Assistant" panel displays hardcoded values: a fixed `85/100` novelty score, static keyword chips, and placeholder text that never changes regardless of which request is being viewed. The "Post Comment" button has no `onClick` handler. This panel looks functional but is purely decorative.

**What to do:**  
Two options — pick one:

**Option A (Quick fix):** Add a visible `// Coming Soon` badge to the panel header and disable the Post Comment button with a tooltip. This is honest about the feature status.

**Option B (Full fix):** Wire the comment textarea to a state variable and implement the `handlePostComment` function to write to a `supervision_notes` subcollection under `supervision_requests/{requestId}/notes`, mirroring the existing notes pattern in `LecturerRepositoryDetailPage`.

---

### U-04 — Sort dropdown in Repository page is non-functional

**File:** `src/features/repository/pages/RepositoryPage.jsx`

**What's wrong:**  
The "Sort: Best Match" button renders and opens visually but has no state, no `onChange`, and no effect on the `filteredProjects` array. Users who click it expecting to sort by date, views, or downloads will see nothing change.

**What to do:**  
Add sort state and wire it to the filtered/sorted output:
```js
const [sortBy, setSortBy] = useState('newest');

const sortedProjects = [...filteredProjects].sort((a, b) => {
  if (sortBy === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
  if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
  return 0;
});
```
Replace the static button with a `<select>` bound to `sortBy`.

---

### U-05 — `tailwind.config.js` SVG pattern has malformed `viewBox`

**File:** `tailwind.config.js`

**What's wrong:**  
```js
"url(\"data:image/svg+xml,...viewBox='0 0 40'...\")"
```
`viewBox` requires four values (`min-x min-y width height`). `0 0 40` is only three values — `height` is missing. The pattern will not render correctly in Safari and some Chromium versions.

**What to do:**  
```js
// Change viewBox='0 0 40' to viewBox='0 0 40 40'
```

---

## 📋 New Features — Recommended Next Steps

These are not bugs but missing features that would significantly improve the platform.

---

### F-01 — Add `AuthGuard` and `AdminGuard` components *(see A-01 above)*

### F-02 — Implement project deletion in `MyUploadsPage`

The delete button renders but has no `onClick`. Add a confirmation dialog and `deleteDoc` call. Only allow deletion when `status !== 'verified'` (already enforced in the UI conditionally).

### F-03 — Add pagination or infinite scroll to `SupervisionManagementPage`

Currently fetches all supervision requests with no limit. As data grows this will slow down significantly. Add `limit(20)` with a "Load More" button using `startAfter` cursor pagination.

### F-04 — Replace `window.confirm` / `window.alert` with proper modal dialogs

Used in `LecturerRepositoryDetailPage`, `UserManagementPage`, `SupervisionRequestDetailPage`, and `MyUploadsPage`. These are blocking, unstyled, and inconsistent with the rest of the UI. Create a shared `<ConfirmDialog>` component using a portal.

### F-05 — Add Firebase indexes for composite queries

Several `query()` calls with both `where` and `orderBy` will fail silently in production without Firestore composite indexes. The console will show index creation links — follow them for:
- `projects` — `studentId` + `createdAt`
- `supervision_requests` — `lecturerId` + `status` + `createdAt`
- `notifications` — `recipientId` + `createdAt`

---

## 🗂 File Change Summary

| File | Action | Reason |
|---|---|---|
| `vercel.json` | ✅ Created | SPA routing fix |
| `vite.config.js` | ✅ Updated | Bundle splitting |
| `LecturerDashboardPage.jsx` | 🔧 Fix C-01 | `setIsSidebarCollapsed` ref error |
| `AdminSettingsPage.jsx` | 🔧 Fix C-01 | `setIsSidebarCollapsed` ref error |
| `ContentModerationPage.jsx` | 🔧 Fix C-01 | `setIsSidebarCollapsed` ref error |
| `UserManagementPage.jsx` | 🔧 Fix C-01 + A-05 | Ref error + hidden users |
| `Features.jsx` | 🔧 Fix C-02 | `InView` capitalisation |
| `ForgotPasswordPage.jsx` | 🔧 Fix C-03 | Wire up Firebase reset email |
| `App.jsx` | 🔧 Fix A-01 | Add `AuthGuard` + `AdminGuard` |
| `RepositoryDetailPage.jsx` | 🔧 Fix A-02 + L-01 + L-02 | AI client-side, tab logic, view count |
| `LoginPage.jsx` | 🔧 Fix A-03 | Remove double Firestore fetch |
| `package.json` | 🔧 Fix A-04 | Move faker, remove axios |
| `LecturerAnalyticsPage.jsx` | 🔧 Fix L-03 | Dark mode chart condition |
| `NotificationContext.jsx` | 🔧 Fix L-04 | Toast deduplication |
| `StudentOnboardingPage.jsx` | 🔧 Fix U-01 | Invalid `mt-26` class |
| `CodeWindow.jsx` | 🔧 Fix U-02 | Remove conflicting Prism CSS |
| `SupervisionRequestDetailPage.jsx` | 🔧 Fix U-03 | Mark AI panel as coming soon |
| `RepositoryPage.jsx` | 🔧 Fix U-04 | Wire sort dropdown |
| `tailwind.config.js` | 🔧 Fix U-05 | Malformed SVG viewBox |

---

*Last updated by Claude — March 2026*
