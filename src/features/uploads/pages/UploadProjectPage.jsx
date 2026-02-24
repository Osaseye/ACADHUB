import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { db, storage } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Sidebar } from '../../../components/layout/Sidebar';
import { useSidebar } from '../../../hooks/useSidebar';

export const UploadProjectPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { isSidebarCollapsed, toggleSidebar } = useSidebar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [file, setFile] = useState(null);
    const [supervisors, setSupervisors] = useState([]);
    const [isLoadingSupervisors, setIsLoadingSupervisors] = useState(true);
    const [existingFileUrl, setExistingFileUrl] = useState(null);
    const [existingFileName, setExistingFileName] = useState(null);

    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        type: 'BSc Project',
        department: '',
        year: new Date().getFullYear(),
        supervisor: '', // This will hold the ID now, or we can use supervisorId
        supervisorId: '',
        supervisorName: '',
        coAuthors: '',
        keywords: ''
    });

    // Fetch Supervisors and Prefill Department
    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const q = query(collection(db, "users"), where("role", "==", "lecturer"));
                const querySnapshot = await getDocs(q);
                const fetchedSupervisors = [];
                querySnapshot.forEach((doc) => {
                    fetchedSupervisors.push({ id: doc.id, ...doc.data() });
                });
                setSupervisors(fetchedSupervisors);
            } catch (error) {
                console.error("Error fetching supervisors:", error);
                toast.error("Failed to load supervisors.");
            } finally {
                setIsLoadingSupervisors(false);
            }
        };

        fetchSupervisors();

        if (currentUser?.department) {
            setFormData(prev => ({ ...prev, department: currentUser.department }));
        }
    }, [currentUser]);

    // Fetch Project Data if Editing
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;
            
            setIsLoadingData(true);
            try {
                const docRef = doc(db, "projects", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Verify ownership
                    if (currentUser && data.studentId !== currentUser.uid && currentUser.role !== 'admin') {
                        toast.error("You are not authorized to edit this project.");
                        navigate('/uploads');
                        return;
                    }

                    setFormData({
                        title: data.title || '',
                        abstract: data.abstract || '',
                        type: data.type || 'BSc Project',
                        department: data.department || '',
                        year: data.year || new Date().getFullYear(),
                        supervisor: data.supervisorId || '',
                        supervisorId: data.supervisorId || '',
                        supervisorName: data.supervisorName || '',
                        coAuthors: data.coAuthors || '',
                        keywords: data.keywords || ''
                    });
                    
                    setExistingFileUrl(data.fileUrl);
                    setExistingFileName(data.fileName);
                } else {
                    toast.error("Project not found");
                    navigate('/uploads');
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                toast.error("Failed to load project details");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (currentUser) {
            fetchProjectData();
        }
    }, [id, currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'supervisor' || name === 'supervisorId') {
            const selectedSupervisor = supervisors.find(s => s.id === value);
            setFormData(prev => ({ 
                ...prev, 
                supervisor: value,
                supervisorId: value,
                supervisorName: selectedSupervisor ? (selectedSupervisor.displayName || selectedSupervisor.email) : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("You must be logged in to upload a project.");
            return;
        }

        if (!file && !isEditing) {
            toast.error("Please select a project file to upload.");
            return;
        }

        if (!formData.supervisorId) {
             toast.error("Please select a supervisor.");
             return;
        }

        setIsSubmitting(true);
        
        try {
            let downloadUrl = existingFileUrl;
            let fileName = existingFileName;

            // 1. Upload file to Firebase Storage if new file selected
            if (file) {
                const fileRef = ref(storage, `project_files/${currentUser.uid}/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(fileRef, file);
                downloadUrl = await getDownloadURL(snapshot.ref);
                fileName = file.name;
            }

            if (isEditing) {
                // UPDATE Existing Project
                const projectRef = doc(db, "projects", id);
                await updateDoc(projectRef, {
                    ...formData,
                    fileUrl: downloadUrl,
                    fileName: fileName,
                    status: 'Pending', // Reset status to Pending on resubmission
                    updatedAt: serverTimestamp(),
                    // Clear previous verification data
                    verifiedBy: null,
                    verifiedAt: null,
                    lecturerFeedback: null 
                });
                
                // Notify Supervisor again
                await addDoc(collection(db, "notifications"), {
                    recipientId: formData.supervisorId,
                    type: "project_review",
                    title: "Project Resubmission",
                    message: `${currentUser.displayName || "Student"} has updated/resubmitted project "${formData.title}".`,
                    read: false,
                    createdAt: serverTimestamp(),
                    link: `/lecturer/review/${id}`
                });

                toast.success("Project updated and resubmitted for review!");

            } else {
                // CREATE New Project
                const projectRef = await addDoc(collection(db, "projects"), {
                    ...formData,
                    fileUrl: downloadUrl,
                    fileName: fileName || file.name,
                    studentId: currentUser.uid,
                    studentName: currentUser.displayName || "Unknown Student",
                    institution: currentUser.institution || "Unknown Institution",
                    status: 'Pending',
                    createdAt: serverTimestamp(),
                    views: 0,
                    downloads: 0
                });

                // Create Notification for Supervisor
                if (formData.supervisorId) {
                    await addDoc(collection(db, "notifications"), {
                        recipientId: formData.supervisorId,
                        type: "project_review",
                        title: "New Project Submission",
                        message: `${currentUser.displayName || "A student"} has submitted a project "${formData.title}" for your review.`,
                        read: false,
                        createdAt: serverTimestamp(),
                        link: `/lecturer/review/${projectRef.id}`
                    });
                }
                toast.success("Project submitted for review successfully!");
            }

            navigate('/uploads');
        } catch (error) {
            console.error("Error saving project: ", error);
            toast.error("Failed to save project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans transition-colors duration-200">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                toggleSidebar={toggleSidebar} 
            />

            <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <Link to="/uploads" className="hover:text-primary transition-colors">My Uploads</Link>
                            </li>
                            <li className="flex items-center">
                                <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                                <span className="text-text-light dark:text-white" aria-current="page">New Project</span>
                            </li>
                        </ol>
                    </nav>

                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm">
                        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                            <h1 className="text-xl font-bold text-text-light dark:text-white">
                                {isEditing ? 'Edit Project' : 'Upload New Project'}
                            </h1>
                            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                                Share your research with the academic community. All submissions undergo a review process.
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Section 1: Project Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-text-light dark:text-white uppercase tracking-wider border-b border-border-light dark:border-border-dark pb-2">
                                    Project Information
                                </h3>
                                
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        placeholder="e.g. Analysis of Traffic Congestion in Lagos Metropolis"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                            Degree Type *
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        >
                                            <option>BSc Project</option>
                                            <option>MSc Dissertation</option>
                                            <option>PhD Thesis</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                            Department *
                                        </label>
                                        <select
                                            id="department"
                                            name="department"
                                            required
                                            value={formData.department}
                                            disabled={!!currentUser?.department} // Disable if prefilled from profile
                                            onChange={handleChange}
                                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select Department...</option>
                                            <option>Computer Science</option>
                                            <option>Economics</option>
                                            <option>Engineering</option>
                                            <option>Agriculture</option>
                                            <option>Medicine</option>
                                            <option>Law</option>
                                            <option>Business Administration</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="abstract" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                        Abstract / Description *
                                    </label>
                                    <textarea
                                        id="abstract"
                                        name="abstract"
                                        rows="6"
                                        required
                                        value={formData.abstract}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        placeholder="Provide a brief summary of your research methodology and findings..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Section 2: Authorship & Metadata */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-text-light dark:text-white uppercase tracking-wider border-b border-border-light dark:border-border-dark pb-2">
                                    Authorship & Metadata
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="year" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                            Completion Year *
                                        </label>
                                        <input
                                            type="number"
                                            id="year"
                                            name="year"
                                            required
                                            min="1990"
                                            max={new Date().getFullYear()}
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="supervisorId" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                            Supervisor *
                                        </label>
                                        <select
                                            id="supervisorId"
                                            name="supervisorId"
                                            required
                                            value={formData.supervisorId || ""}
                                            onChange={handleChange}
                                            disabled={isLoadingSupervisors || supervisors.length === 0}
                                            className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow disabled:opacity-50"
                                        >
                                            <option value="">
                                                {isLoadingSupervisors 
                                                    ? "Loading Supervisors..." 
                                                    : supervisors.length === 0 
                                                        ? "No Supervisors Available" 
                                                        : "Select Supervisor..."
                                                }
                                            </option>
                                            {supervisors.map(supervisor => (
                                                <option key={supervisor.id} value={supervisor.id}>
                                                    {supervisor.displayName || supervisor.email}
                                                </option>
                                            ))}
                                        </select>
                                        {supervisors.length === 0 && !isLoadingSupervisors && (
                                            <p className="text-xs text-red-500 mt-1">
                                                No supervisors available. You cannot submit a project without a supervisor.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="coAuthors" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                        Co-Authors (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="coAuthors"
                                        name="coAuthors"
                                        value={formData.coAuthors}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        placeholder="Separate names with commas"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="keywords" className="block text-sm font-medium text-text-light dark:text-white mb-1">
                                        Keywords
                                    </label>
                                    <input
                                        type="text"
                                        id="keywords"
                                        name="keywords"
                                        value={formData.keywords}
                                        onChange={handleChange}
                                        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        placeholder="e.g. Machine Learning, Healthcare, Nigeria (Comma separated)"
                                    />
                                </div>
                            </div>

                            {/* Section 3: Document Upload */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-text-light dark:text-white uppercase tracking-wider border-b border-border-light dark:border-border-dark pb-2">
                                    Document Upload
                                </h3>
                                
                                <label className="block border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-8 text-center bg-gray-50 dark:bg-[#161b22] hover:bg-gray-100 dark:hover:bg-[#1f242c] transition-colors cursor-pointer group">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                        accept=".pdf,.docx"
                                    />
                                    <div className="mx-auto h-12 w-12 text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-text-light dark:text-white">
                                        {file ? file.name : "Click to upload or drag and drop"}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                                        PDF, DOCX up to 10MB
                                    </p>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
                                <Link 
                                    to="/uploads"
                                    className="px-4 py-2 border border-border-light dark:border-border-dark rounded-md shadow-sm text-sm font-medium text-text-light dark:text-text-dark bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d] focus:outline-none transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || (supervisors.length === 0 && !isLoadingSupervisors)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        isEditing ? 'Update Project' : 'Submit Project'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};