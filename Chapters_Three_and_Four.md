# CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN

## 3.1 Introduction
This chapter presents the system analysis and design of the implemented AcadHub platform. The analysis is grounded strictly in the existing codebase, including the frontend structure, Firebase-backed data layer, authentication and authorization logic, feature modules, utility hooks, configuration files, and deployment setup. The chapter explains the problem context, proposed solution, system requirements, architecture, design models, database design, system flow, and development toolchain.

## 3.2 Analysis of Existing System
From the implemented workflows and user interface patterns, the platform addresses a context where academic project management is often fragmented across informal channels such as email threads, departmental paper archives, and ad hoc supervisor communication. The observed implementation strongly suggests that the system replaces either a predominantly manual process or a partially digital but disconnected process.

In the earlier process context, key limitations include weak discoverability of prior projects, poor traceability of supervision interactions, delayed feedback cycles, and the absence of a standardized verification and moderation mechanism. A further limitation is the lack of unified analytics for institutional insight into submissions, verification rates, and departmental activity.

The existing implementation of AcadHub responds directly to these limitations by introducing integrated role-based workflows, searchable repository access, digital upload and review pipelines, notifications, and analytics dashboards.

## 3.3 Proposed System
The proposed system, as implemented, is a multi-role academic repository and supervision management platform that supports students, lecturers, and administrators through a unified web interface.

The system is designed for the following user groups:

1. Students who register, complete onboarding, upload projects, monitor review feedback, save repository items, and manage personal settings.
2. Lecturers who undergo verification onboarding, supervise student requests, review submissions, add notes and feedback, upload publications, and monitor analytics.
3. Administrators who manage verification requests, user accounts, content moderation reports, and global system settings.

The core objectives of the proposed system are to centralize academic project records, improve supervisory workflow transparency, enforce role-based governance, and provide data-driven insight into research activities.

Compared with less structured manual or semi-digital methods, the implemented platform improves process consistency, data accessibility, review traceability, and operational visibility.

## 3.4 System Requirements

### 3.4.1 Functional Requirements
The functional requirements below are extracted from implemented routes, components, context logic, and Firestore operations.

The system shall provide account registration with role selection for student and lecturer users, followed by login/logout and password recovery flows.

The system shall support onboarding workflows:

1. Student onboarding with degree, institution, department, graduation year, interests, intent, and optional profile photo upload.
2. Lecturer onboarding with academic title, rank, institution, department, expertise areas, and verification document upload.

The system shall provide role-based dashboards:

1. Student dashboard with upload and saved-item metrics.
2. Lecturer dashboard with supervision and review metrics.
3. Admin dashboard with user, project, and verification statistics.

The system shall support project repository functions:

1. Upload of student projects with metadata and file attachments.
2. Edit and resubmission for pending or rejected projects.
3. Search, filter, and pagination for repository browsing.
4. Project detail view with abstract, metadata, trend indicators, and optional file preview/download.
5. Save and unsave project actions.

The system shall support supervision and review processes:

1. Creation and management of supervision requests.
2. Lecturer review decisions (accept/reject) with feedback storage.
3. Internal note/comment support for review workflow.

The system shall support notification management:

1. Real-time notifications for users.
2. Mark-as-read, bulk read update, and delete actions.

The system shall provide administrative governance features:

1. Lecturer verification request approval/rejection.
2. User role and status management.
3. Content moderation through reports.
4. Platform-level settings updates.

The system shall provide analytics views using chart visualizations for trends and distribution.

### 3.4.2 Non-Functional Requirements
Security requirements are implemented through Firebase Authentication and rule-based authorization in Firestore and Storage. Access is controlled by authentication state, ownership checks, and role checks such as student, lecturer, and admin predicates in Firestore rules. Storage rules enforce size and content-type constraints for uploaded files.

Performance characteristics include route-level lazy loading, selective count queries, and query filtering. In several modules, client-side sorting and filtering are intentionally used when avoiding index dependencies.

Scalability is supported by Firebase managed infrastructure for authentication, document storage, and file storage. The collection-driven model supports incremental feature growth, although high-volume scaling would benefit from additional query indexing and further server-side filtering.

Maintainability is supported by a feature-based folder architecture, reusable UI components, centralized context providers, and custom hooks. The implementation is modular, with separation across features, shared components, and configuration.

Usability is supported by role-aware navigation, progressive onboarding, loading indicators, toast notifications, responsive layout behavior, and clear status cues.

## 3.5 System Architecture
The architecture implemented is a client-centered serverless web architecture.

At the frontend layer, the system uses React with route-based page composition and context-driven global state. At the application service layer, the system uses Firebase SDK operations directly from the frontend for authentication, Firestore document operations, storage uploads, and analytics integration. At the data and policy layer, Firestore and Storage security rules serve as authorization middleware equivalents.

The architecture can be categorized as:

1. Client-server in operational communication flow.
2. Serverless backend implementation through Firebase managed services.
3. Monolithic frontend codebase with feature modularization.

### Frontend Architecture
The frontend structure is organized by features under src/features, with each domain encapsulating pages and related logic. Shared UI components are located under src/components/ui and layout/common modules provide reusable navigation and utility behaviors.

Routing is centralized in App.jsx using React Router, with extensive lazy imports for non-critical paths and explicit route paths for student, lecturer, and admin modules.

### Backend Structure (As Implemented)
No separate backend folder, Express server, controller layer, or custom REST API layer exists in this codebase. Backend functionality is implemented through Firebase managed services consumed from the client SDK. Consequently, route control, CRUD operations, and role restrictions are enforced through frontend logic plus Firebase security rules.

### Database Structure
The database uses Google Firestore collections with document-oriented schema patterns. Core collections include users, projects, notifications, saved_items, supervision_requests, verification_requests, reports, settings, and publications, with notes as a subcollection under projects.

### Request Flow
A typical request flow is:

1. User triggers action from UI component.
2. Component handler calls Firebase SDK operation.
3. Firestore/Storage rules validate identity, role, and ownership.
4. Data is persisted or rejected.
5. Context/listener updates UI and toast feedback communicates outcome.

### Technology Selection Rationale
React was selected for component-based UI engineering and route-based SPA behavior. Firebase was selected to provide integrated authentication, NoSQL data storage, file storage, and analytics without dedicated server management. Tailwind CSS supports rapid and consistent interface development. Chart.js enables visual analytics representation. Vite provides lightweight, fast build tooling.

## 3.6 System Design Models

### 3.6.1 Use Case Model (Textual Representation)
The Student actor performs registration, onboarding, project upload, repository browsing, save actions, profile management, and notification interactions.

The Lecturer actor performs onboarding and verification submission, supervision management, project review and feedback, publication upload, repository access, settings management, and analytics monitoring.

The Admin actor performs privileged login, lecturer verification processing, user management, moderation actions, and platform settings configuration.

All actors participate in authentication and role-constrained navigation.

### 3.6.2 Class Model (Logical Domain Classes from Data Structures)
The inferred class model from Firestore entities includes User, Project, Notification, SavedItem, SupervisionRequest, VerificationRequest, Report, Setting, Publication, and ProjectNote.

User is associated with many Projects as author or supervisor, many Notifications as recipient, many SavedItems, and many SupervisionRequests as either requester or assigned lecturer.

Project has many ProjectNotes and stores references to User identities (studentId, supervisorId).

SavedItem stores many-to-one links from user to project.

Report references a moderated target through targetCollection and targetId.

### 3.6.3 Sequence Model (Login Workflow)
The login sequence implemented is as follows. The user submits credentials. AuthContext invokes Firebase signInWithEmailAndPassword. On successful authentication, the system reads the user profile document from Firestore and merges role/profile metadata into context state. The user is redirected according to role-specific logic. Route guards and role-aware UI then conditionally expose protected pages.

### 3.6.4 Activity Model (Project Submission and Review)
The student completes upload form fields, selects supervisor, and submits file. The file is uploaded to Firebase Storage and URL is returned. Project metadata is created or updated in Firestore with pending workflow status. A notification is issued to the intended reviewer. The lecturer reviews and records decision with feedback. If accepted, status changes to verified; if rejected, feedback is shown to student for revision and resubmission.

### 3.6.5 ER Model Description
The users collection is a parent entity for multiple dependent collections via foreign-reference fields. Projects reference users by studentId and supervisorId. Supervision requests reference both student and lecturer user IDs. Notifications reference recipient IDs. Saved items bridge users and projects. Verification requests and reports reference user-generated records requiring administrative action. Project notes are nested under individual project documents.

## 3.7 Database Design
Firestore collections and field patterns are summarized below as relational-style table descriptions for report clarity.

### Users
Primary key: uid (document ID).

Typical fields include email, role, displayName, institution, department, onboardingCompleted, verificationStatus, isVerified, status, createdAt, updatedAt, profile metadata, and specialization fields.

### Projects
Primary key: projectId.

Typical fields include title, abstract, type, department, year, studentId, studentName, supervisorId, supervisorName, institution, status, lecturerFeedback, fileUrl, fileName, keywords, createdAt, downloads, views, citations, and verification metadata.

### Project Notes (Subcollection)
Primary key: noteId under projects/{projectId}/notes.

Typical fields include authorId, content, createdAt, and note type.

### Supervision Requests
Primary key: requestId.

Typical fields include studentId, lecturerId, status, topic/proposal data, and timestamps.

### Notifications
Primary key: notificationId.

Typical fields include recipientId or userId, title, message, link, createdAt, read/isRead flags, and notification type.

### Saved Items
Primary key: itemId.

Typical fields include userId, projectId, projectTitle, and savedAt.

### Verification Requests
Primary key: requestId.

Typical fields include userId, evidence references, and decision status fields.

### Reports
Primary key: reportId.

Typical fields include reporter details, reason, severity, status, targetCollection, targetId, and createdAt.

### Publications
Primary key: publicationId.

Typical fields include lecturerId, title, venue, date, file information, and timestamps.

### Settings
Primary key: settingId (for example general settings document).

Typical fields include maintenanceMode, registrationOpen, aiModel, and plagiarismThreshold.

### Keys and Relationships
Document IDs are primary keys. Foreign-key behavior is implemented as reference fields (for example studentId, supervisorId, userId, projectId) rather than relational constraints. Relationships are enforced by application logic and Firebase security rules.

### Normalization Level
As a Firestore NoSQL implementation, strict 3NF evaluation is not fully applicable. The design combines normalized identity records (users) with controlled denormalization in project documents (such as studentName and supervisorName) for read efficiency and UI performance.

## 3.8 System Flow and Algorithms

### 3.8.1 Authentication Flow
Authentication uses Firebase Auth with role enrichment from Firestore. The algorithm is:

1. Authenticate email and password.
2. Fetch corresponding users document.
3. Merge role/profile into context state.
4. Redirect based on role.
5. Enforce additional route checks (for example lecturer verification status).

### 3.8.2 Project Upload and Review Flow
The upload and review flow is:

1. Validate required metadata and supervisor selection.
2. Upload file to Firebase Storage.
3. Save project metadata in Firestore with initial status.
4. Emit reviewer notification.
5. Reviewer records accept/reject with feedback.
6. Student receives status and revises where necessary.

### 3.8.3 Notification Flow
Notification flow uses query listeners:

1. Subscribe to notifications where recipient matches current user.
2. Sort and render notifications.
3. Compute unread counts.
4. Support individual and batch read updates.
5. Delete items as requested.

### 3.8.4 Validation and Rule Logic
Validation is implemented at both interface and data-policy levels. UI validation enforces form completeness, minimum selections, and expected field types. Firestore and Storage rules enforce authenticated access, ownership, role constraints, and restricted field updates. Storage rules further enforce upload size and file-type limits.

## 3.9 Development Tools
The system was implemented using JavaScript and JSX within a React single-page architecture.

The primary frameworks and libraries include React, React Router, Firebase SDK, Tailwind CSS, Chart.js, react-chartjs-2, date-fns, and sonner.

Build and development configuration is handled by Vite. Linting is configured with ESLint.

Deployment configuration is implemented for Vercel hosting. Environment variables are managed with VITE-prefixed configuration keys and consumed via import.meta.env.

Version control is managed with Git.

---

# CHAPTER FOUR: SYSTEM IMPLEMENTATION AND RESULTS

## 4.1 Introduction
This chapter explains how the designed system was implemented in practice and discusses observed results from the implemented modules. It covers environment setup, frontend and backend realization, database implementation, testing strategy, result analysis, and deployment configuration.

## 4.2 Development Environment
The implementation environment consists of a modern JavaScript web stack and managed cloud services.

Hardware requirements for development and testing include a standard development workstation with multi-core CPU, at least 8 GB memory, and stable internet access for Firebase and deployment operations.

Software tools include Node.js and npm, React, Vite, Firebase services, Tailwind CSS tooling, ESLint, and Git.

The observed development operating system from the workspace context is Windows.

The server environment is serverless. There is no custom self-hosted application server in the repository. Runtime backend responsibilities are provided through Firebase managed services.

## 4.3 System Implementation

### 4.3.1 Frontend Implementation
Frontend implementation follows a feature-modular architecture under src/features, supported by shared component libraries and reusable hooks.

Routing is centralized in App.jsx and includes role-segmented route groups for student, lecturer, and admin functions. Performance optimization is achieved through React.lazy and Suspense for many non-critical pages.

State management is hybrid:

1. Global state through AuthContext and NotificationContext.
2. Local component state for forms, filters, loaders, tabs, and interaction state.

UI implementation includes:

1. Auth workflows (login, register, admin login, forgot password).
2. Onboarding wizards for student and lecturer users.
3. Dashboard pages for all roles.
4. Repository list/detail and save actions.
5. Upload and edit forms with file handling.
6. Notification interfaces and settings pages.
7. Analytics dashboards using Chart.js visualizations.

### 4.3.2 Backend Implementation
No standalone backend folder, REST API, controller classes, or middleware modules are present in this implementation. Backend behavior is provided through direct Firebase SDK calls in feature components and context modules.

Authentication logic is implemented in AuthContext.jsx, which handles registration, login, logout, user refresh, role retrieval, and auth-state synchronization.

Access control middleware equivalents are implemented in two layers:

1. Route-level guard components such as LecturerGuard.
2. Firebase Firestore and Storage rules for authoritative role and ownership enforcement.

Error handling is implemented with try/catch blocks, loading states, and user feedback through toast notifications.

### 4.3.3 Database Implementation
Database implementation uses Firebase Firestore (document database) and Firebase Storage (file assets).

No ORM is used. Data access is via Firebase modular SDK operations such as addDoc, setDoc, updateDoc, deleteDoc, getDoc, getDocs, onSnapshot, and query constraints.

The schema is implemented as collection-based entities with flexible document fields and reference IDs. Migration tooling is not present because Firestore schema evolution occurs through application-level changes.

Security is enforced through firestore.rules and storage.rules with helper functions for identity and role checks.

## 4.4 System Testing
No dedicated automated unit-test or integration-test directories are present in the current repository snapshot. Consequently, implementation evidence indicates predominantly manual and scenario-driven functional testing.

Unit testing was not formally implemented in the current codebase.

Integration testing is represented through end-to-end use of connected modules, including authentication-context integration, Firestore persistence, role-based route access, file upload, and notification updates.

System testing is reflected in workflow-level validation of student upload lifecycle, lecturer review actions, admin verification and moderation flows, and notification behavior.

### 4.4.1 Test Case Table

| Test ID | Test Scenario | Input / Action | Expected Result | Result Basis in Implementation |
|---|---|---|---|---|
| TC-01 | Student Registration | Register with valid academic-style email and password | Account created, role assigned, onboarding redirect | RegisterPage plus AuthContext register flow |
| TC-02 | Lecturer Onboarding Submission | Complete lecturer profile and upload verification file | User document updated, verification status pending | LecturerOnboardingPage and users updateDoc |
| TC-03 | Role-Based Admin Access | Login through admin path with non-admin account | Access blocked with error and forced logout path | AdminLoginPage role check |
| TC-04 | Student Project Upload | Submit metadata and project file | File upload succeeds, project document created, notification sent | UploadProjectPage storage and Firestore actions |
| TC-05 | Lecturer Project Approval | Approve pending project in review page | Project status updated to verified | LecturerProjectReviewPage update logic |
| TC-06 | Lecturer Project Rejection | Reject with feedback | Status set to rejected, feedback stored and visible | Reviewer workflow and detail feedback section |
| TC-07 | Save/Unsave Repository Item | Toggle save icon | saved_items document created or deleted | RepositoryPage and RepositoryDetailPage |
| TC-08 | Notification Read Management | Mark single and bulk notifications as read | Read flags updated and unread count reduced | Notifications pages and NotificationContext |
| TC-09 | Firestore Rule Enforcement | Attempt unauthorized write | Request denied by security rules | firestore.rules role/ownership restrictions |
| TC-10 | Storage Rule Enforcement | Upload invalid type or oversized file | Upload rejected by storage rule checks | storage.rules constraints |
| TC-11 | Admin Verification Decision | Approve or reject lecturer verification request | verificationStatus and isVerified updated accordingly | VerificationRequestsPage update flows |
| TC-12 | Content Moderation Action | Resolve or remove reported item | Report status updated and content removed when chosen | ContentModerationPage actions |

## 4.5 Results and Discussion
The implemented system produces a complete multi-role workflow for academic project management. Students are able to register, onboard, upload and manage projects, browse repository content, and receive update notifications. Lecturers can manage supervision interactions, review student submissions with feedback, and publish research outputs. Administrators can enforce governance through verification decisions, moderation, and user-level oversight.

Performance behavior is satisfactory for typical academic use volume, supported by lazy loading, managed cloud services, and selective querying patterns. The use of real-time listeners improves responsiveness for notifications and selected management views.

Security is strengthened through explicit Firestore and Storage rule sets, role-based guards, and ownership checks. This reduces unauthorized access risk at the data layer.

The implementation demonstrates strengths in modular organization, role-based process fidelity, and integrated cloud service utilization. Limitations include absence of an independent backend service layer, no formal automated testing suite in the repository, and dependence on client-side filtering in some views.

### 4.5.1 Implementation Screens (Firebase-images)
The following figures are drawn directly from the Firebase-images folder as visual evidence of the implemented system interfaces.

**Figure 4.1: Interface Screenshot 1**

![Figure 4.1](./Firebase-images/Screenshot%20(1).png)

**Figure 4.2: Interface Screenshot 2**

![Figure 4.2](./Firebase-images/Screenshot%20(2).png)

**Figure 4.3: Interface Screenshot 3**

![Figure 4.3](./Firebase-images/Screenshot%20(3).png)

**Figure 4.4: Interface Screenshot 4**

![Figure 4.4](./Firebase-images/Screenshot%20(4).png)

**Figure 4.5: Interface Screenshot 5**

![Figure 4.5](./Firebase-images/Screenshot%20(5).png)

**Figure 4.6: Interface Screenshot 6**

![Figure 4.6](./Firebase-images/Screenshot%20(6).png)

**Figure 4.7: Interface Screenshot 7**

![Figure 4.7](./Firebase-images/Screenshot%20(7).png)

**Figure 4.8: Interface Screenshot 8**

![Figure 4.8](./Firebase-images/Screenshot%20(8).png)

**Figure 4.9: Interface Screenshot 9**

![Figure 4.9](./Firebase-images/Screenshot%20(9).png)

**Figure 4.10: Interface Screenshot 10**

![Figure 4.10](./Firebase-images/Screenshot%20(10).png)

**Figure 4.11: Interface Screenshot 11**

![Figure 4.11](./Firebase-images/Screenshot%20(11).png)

**Figure 4.12: Interface Screenshot 12**

![Figure 4.12](./Firebase-images/Screenshot%20(12).png)

**Figure 4.13: Interface Screenshot 13**

![Figure 4.13](./Firebase-images/Screenshot%20(13).png)

**Figure 4.14: Interface Screenshot 14**

![Figure 4.14](./Firebase-images/Screenshot%20(14).png)

**Figure 4.15: Interface Screenshot 15**

![Figure 4.15](./Firebase-images/Screenshot%20(15).png)

**Figure 4.16: Interface Screenshot 16**

![Figure 4.16](./Firebase-images/Screenshot%20(16).png)

**Figure 4.17: Interface Screenshot 17**

![Figure 4.17](./Firebase-images/Screenshot%20(17).png)

**Figure 4.18: Interface Screenshot 18**

![Figure 4.18](./Firebase-images/Screenshot%20(18).png)

## 4.6 Deployment
Deployment configuration in the repository indicates Vercel usage.

The project contains .vercel/project.json with project identifiers and a .vercelignore file excluding sensitive and non-deployment assets such as environment files, node_modules, dist, and git metadata.

Production build and serving are configured through Vite scripts in package.json.

Environment management is implemented through VITE-prefixed variables consumed in Firebase initialization. The app depends on these variables for API key, auth domain, project ID, storage bucket, messaging sender ID, app ID, and measurement ID.

No explicit CI/CD workflow file is present in the repository snapshot. Deployment appears to rely on managed platform build and release behavior.

---

## Concluding Note
The two chapters above are fully aligned with the present implementation artifacts and avoid unimplemented assumptions. Where traditional backend or ORM layers are absent, this has been explicitly stated and interpreted under the serverless architecture adopted in the project.
