# ACADHUB - Academic Project Repository System

ACADHUB is a comprehensive web-based platform designed to streamline the management, submission, and supervision of academic research projects. It serves as a central hub for students to submit their work, lecturers to manage supervision and reviews, and administrators to oversee the institution's academic output.

![ACADHUB Dashboard Preview](public/vite.svg) *Add a screenshot here later*

## ?? Features

### ?? For Students
*   **Project Submission**: Upload BSc Projects, MSc Dissertations, and PhD Theses with support for large file uploads.
*   **Supervisor Selection**: Search and select supervisors from the faculty list.
*   **Dashboard**: Track submission status (Pending, Verified, Returned) and view engagement stats.
*   **Digital Library**: Browse and search the institution's repository of past projects.
*   **Profile Management**: Manage academic details and settings.

### ????? For Lecturers
*   **Supervision Management**: Receive, review, and accept/reject student supervision requests.
*   **Project Review System**: Review, verify, or return student submissions with feedback.
*   **Analytical Dashboard**: Track active students, pending reviews, and publication stats.
*   **Internal Notes**: Add private notes for other faculty members regarding specific projects.
*   **Publication Management**: Upload and manage personal research publications.

### ??? For Administrators
*   **User Management**: Manage user roles (Student, Lecturer, Admin) and account statuses.
*   **Content Moderation**: Review and action reported content.
*   **Verification Requests**: Verify lecturer identities and credentials.
*   **System Analytics**: View high-level stats on user growth and repository usage.

## ??? Tech Stack

*   **Frontend**: React.js (Vite)
*   **Styling**: Tailwind CSS
*   **Backend & Database**: Firebase (Firestore, Storage, Authentication)
*   **State Management**: React Context API
*   **Routing**: React Router DOM v6
*   **Charts**: Chart.js / React-Chartjs-2
*   **Notifications**: Sonner

## ?? Installation & Setup

1.  **Clone the repository**
    `ash
    git clone https://github.com/yourusername/acadhub.git
    cd acadhub
    `

2.  **Install Dependencies**
    `ash
    npm install
    `

3.  **Environment Configuration**
    Create a .env file in the root directory and add your Firebase configuration:
    `env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    `

4.  **Run the Development Server**
    `ash
    npm run dev
    `

5.  **Build for Production**
    `ash
    npm run build
    `

## ?? Security & Rules

*   **Authentication**: Secure login via Firebase Auth.
*   **Role-Based Access Control (RBAC)**: Protected routes ensure users only access features authorized for their role.
*   **Data Security**: Firestore security rules ensure data privacy (e.g., only supervisors and students can edit their specific projects).

## ?? Contributing

1.  Fork the repository
2.  Create your feature branch (git checkout -b feature/AmazingFeature)
3.  Commit your changes (git commit -m 'Add some AmazingFeature')
4.  Push to the branch (git push origin feature/AmazingFeature)
5.  Open a Pull Request

## ?? License

Distributed under the MIT License. See LICENSE for more information.
