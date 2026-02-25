import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ScrollToTop from "./components/common/ScrollToTop";
import { PageLoader } from "./components/common/PageLoader";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LecturerGuard } from "./features/lecturer/components/LecturerGuard";

// Static Imports (Critical Path)
import LandingPage from "./features/landing/LandingPage";
import { LoginPage } from "./features/auth/pages/LoginPage";

// Lazy Imports (Features)
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage").then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import("./features/auth/pages/ForgotPasswordPage").then(module => ({ default: module.ForgotPasswordPage })));

// Student
const StudentOnboardingPage = lazy(() => import("./features/onboarding/pages/StudentOnboardingPage").then(module => ({ default: module.StudentOnboardingPage })));
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const RepositoryPage = lazy(() => import("./features/repository/pages/RepositoryPage").then(module => ({ default: module.RepositoryPage })));
const RepositoryDetailPage = lazy(() => import("./features/repository/pages/RepositoryDetailPage").then(module => ({ default: module.RepositoryDetailPage })));
const UserProfilePage = lazy(() => import("./features/profile/pages/UserProfilePage").then(module => ({ default: module.UserProfilePage })));
const MyUploadsPage = lazy(() => import("./features/uploads/pages/MyUploadsPage").then(module => ({ default: module.MyUploadsPage })));
const UploadProjectPage = lazy(() => import("./features/uploads/pages/UploadProjectPage").then(module => ({ default: module.UploadProjectPage })));
const TrendsPage = lazy(() => import("./features/analytics/pages/TrendsPage").then(module => ({ default: module.TrendsPage })));
const SavedPage = lazy(() => import("./features/library/pages/SavedPage").then(module => ({ default: module.SavedPage })));
const NotificationsPage = lazy(() => import("./features/notifications/pages/NotificationsPage").then(module => ({ default: module.NotificationsPage })));
const SettingsPage = lazy(() => import("./features/settings/pages/SettingsPage").then(module => ({ default: module.SettingsPage })));

// Lecturer
const LecturerOnboardingPage = lazy(() => import("./features/lecturer/pages/LecturerOnboardingPage").then(module => ({ default: module.LecturerOnboardingPage })));
const LecturerDashboardPage = lazy(() => import("./features/lecturer/pages/LecturerDashboardPage").then(module => ({ default: module.LecturerDashboardPage })));
const SupervisionManagementPage = lazy(() => import("./features/lecturer/pages/SupervisionManagementPage").then(module => ({ default: module.SupervisionManagementPage })));
const SupervisionRequestDetailPage = lazy(() => import("./features/lecturer/pages/SupervisionRequestDetailPage").then(module => ({ default: module.SupervisionRequestDetailPage })));
const LecturerPublicationsPage = lazy(() => import("./features/lecturer/pages/LecturerPublicationsPage").then(module => ({ default: module.LecturerPublicationsPage })));
const LecturerAnalyticsPage = lazy(() => import("./features/lecturer/pages/LecturerAnalyticsPage").then(module => ({ default: module.LecturerAnalyticsPage })));
const LecturerRepositoryPage = lazy(() => import("./features/lecturer/pages/LecturerRepositoryPage").then(module => ({ default: module.LecturerRepositoryPage })));
const LecturerRepositoryDetailPage = lazy(() => import("./features/lecturer/pages/LecturerRepositoryDetailPage").then(module => ({ default: module.LecturerRepositoryDetailPage })));
const LecturerProjectReviewPage = lazy(() => import("./features/lecturer/pages/LecturerProjectReviewPage").then(module => ({ default: module.LecturerProjectReviewPage })));
const LecturerNotificationsPage = lazy(() => import("./features/lecturer/pages/LecturerNotificationsPage").then(module => ({ default: module.LecturerNotificationsPage })));
const LecturerSettingsPage = lazy(() => import("./features/lecturer/pages/LecturerSettingsPage").then(module => ({ default: module.LecturerSettingsPage })));
const LecturerUploadPage = lazy(() => import("./features/lecturer/pages/LecturerUploadPage").then(module => ({ default: module.LecturerUploadPage })));

// Admin
const AdminLoginPage = lazy(() => import("./features/auth/pages/AdminLoginPage").then(module => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import("./features/admin/pages/AdminDashboardPage").then(module => ({ default: module.AdminDashboardPage })));
const VerificationRequestsPage = lazy(() => import("./features/admin/pages/VerificationRequestsPage").then(module => ({ default: module.VerificationRequestsPage })));
const UserManagementPage = lazy(() => import("./features/admin/pages/UserManagementPage").then(module => ({ default: module.UserManagementPage })));
const ContentModerationPage = lazy(() => import("./features/admin/pages/ContentModerationPage").then(module => ({ default: module.ContentModerationPage })));
const AdminSettingsPage = lazy(() => import("./features/admin/pages/AdminSettingsPage").then(module => ({ default: module.AdminSettingsPage })));

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
        <Toaster position="top-right" richColors />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
            <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/verification" element={<VerificationRequestsPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/moderation" element={<ContentModerationPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />

        {/* Student Routes */}
        <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Lecturer Routes */}
        <Route path="/onboarding/lecturer" element={<LecturerOnboardingPage />} />
        
        <Route element={<LecturerGuard />}>
            <Route path="/lecturer/dashboard" element={<LecturerDashboardPage />} />
            <Route path="/lecturer/supervision" element={<SupervisionManagementPage />} />
            <Route path="/lecturer/supervision/:requestId" element={<SupervisionRequestDetailPage />} />
            <Route path="/lecturer/publications" element={<LecturerPublicationsPage />} />
            <Route path="/lecturer/analytics" element={<LecturerAnalyticsPage />} />
            <Route path="/lecturer/repository" element={<LecturerRepositoryPage />} />
            <Route path="/lecturer/repository/:id" element={<LecturerRepositoryDetailPage />} />
            <Route path="/lecturer/review/:projectId" element={<LecturerProjectReviewPage />} />
            <Route path="/lecturer/notifications" element={<LecturerNotificationsPage />} />
            <Route path="/lecturer/settings" element={<LecturerSettingsPage />} />
            <Route path="/lecturer/publications/new" element={<LecturerUploadPage />} />
        </Route>
        
        {/* Shared Routes */}
        <Route path="/repository" element={<RepositoryPage />} />
        <Route path="/repository/:id" element={<RepositoryDetailPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/uploads" element={<MyUploadsPage />} />
        <Route path="/uploads/new" element={<UploadProjectPage />} />
        <Route path="/uploads/edit/:id" element={<UploadProjectPage />} /> 
        <Route path="/analytics" element={<TrendsPage />} />
        <Route path="/saved" element={<SavedPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
      </NotificationProvider>
    </AuthProvider>
  </Router>
  );
}


export default App;

