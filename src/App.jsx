import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./features/landing/LandingPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { StudentOnboardingPage } from "./features/onboarding/pages/StudentOnboardingPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { RepositoryPage } from "./features/repository/pages/RepositoryPage";
import { RepositoryDetailPage } from "./features/repository/pages/RepositoryDetailPage";
import { UserProfilePage } from "./features/profile/pages/UserProfilePage";
import { MyUploadsPage } from "./features/uploads/pages/MyUploadsPage";
import { UploadProjectPage } from "./features/uploads/pages/UploadProjectPage";
import { TrendsPage } from "./features/analytics/pages/TrendsPage";
import { SavedPage } from "./features/library/pages/SavedPage";
import { NotificationsPage } from "./features/notifications/pages/NotificationsPage";
import { SettingsPage } from "./features/settings/pages/SettingsPage";
import { LecturerOnboardingPage } from "./features/lecturer/pages/LecturerOnboardingPage";
import { LecturerDashboardPage } from "./features/lecturer/pages/LecturerDashboardPage";
import { SupervisionManagementPage } from "./features/lecturer/pages/SupervisionManagementPage";
import { SupervisionRequestDetailPage } from "./features/lecturer/pages/SupervisionRequestDetailPage";
import { LecturerPublicationsPage } from "./features/lecturer/pages/LecturerPublicationsPage";
import { LecturerAnalyticsPage } from "./features/lecturer/pages/LecturerAnalyticsPage";
import { LecturerRepositoryPage } from "./features/lecturer/pages/LecturerRepositoryPage";
import { LecturerRepositoryDetailPage } from "./features/lecturer/pages/LecturerRepositoryDetailPage";
import { LecturerNotificationsPage } from "./features/lecturer/pages/LecturerNotificationsPage";
import { LecturerSettingsPage } from "./features/lecturer/pages/LecturerSettingsPage";
import { LecturerUploadPage } from "./features/lecturer/pages/LecturerUploadPage";

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Student Routes */}
        <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Lecturer Routes */}
        <Route path="/onboarding/lecturer" element={<LecturerOnboardingPage />} />
        <Route path="/lecturer/dashboard" element={<LecturerDashboardPage />} />
        <Route path="/lecturer/supervision" element={<SupervisionManagementPage />} />
        <Route path="/lecturer/supervision/:requestId" element={<SupervisionRequestDetailPage />} />
        <Route path="/lecturer/publications" element={<LecturerPublicationsPage />} />
        <Route path="/lecturer/analytics" element={<LecturerAnalyticsPage />} />
        <Route path="/lecturer/repository" element={<LecturerRepositoryPage />} />
        <Route path="/lecturer/repository/:id" element={<LecturerRepositoryDetailPage />} />
        <Route path="/lecturer/notifications" element={<LecturerNotificationsPage />} />
        <Route path="/lecturer/settings" element={<LecturerSettingsPage />} />

        <Route path="/lecturer/publications/new" element={<LecturerUploadPage />} />
        
        {/* Shared Routes */}
        <Route path="/repository" element={<RepositoryPage />} />
        <Route path="/repository/:id" element={<RepositoryDetailPage />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/uploads" element={<MyUploadsPage />} />
        <Route path="/uploads/new" element={<UploadProjectPage />} />
        <Route path="/analytics" element={<TrendsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}


export default App;

