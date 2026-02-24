import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { db, storage } from "../../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NIGERIAN_UNIVERSITIES } from "../../../data/universities";

// Steps
const STEP_PROFILE = 1;
const STEP_EXPERTISE = 2;
const STEP_PREFERENCES = 3;

export const LecturerOnboardingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(STEP_PROFILE);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationFile, setVerificationFile] = useState(null);
    const [formData, setFormData] = useState({
        // Profile Data
        title: "",
        rank: "",
        institution: "",
        department: "Computer Science", // Default for demo
        staffId: "",
        // Expertise Data
        expertise: [],
        publicationsLink: "",
        // Preferences Data
        acceptingStudents: true
    });

    // Auto-fill Institution based on email (similar to student)
    useEffect(() => {
        if (location.state?.email) {
            const email = location.state.email;
            const domain = email.split("@")[1];
            if (domain) {
                // Heuristics for Nigerian Schools mapped to our list
                const searchTerms = [
                    { key: "babcock", term: "Babcock University" },
                    { key: "covenant", term: "Covenant University" },
                    { key: "unilag", term: "University of Lagos" },
                    { key: "ui.edu.ng", term: "University of Ibadan" },
                    { key: "unn.edu.ng", term: "University of Nigeria" },
                    { key: "abu.edu.ng", term: "Ahmadu Bello University" },
                    { key: "oau.edu.ng", term: "Obafemi Awolowo University" },
                    { key: "lasu.edu.ng", term: "Lagos State University" },
                    { key: "futa.edu.ng", term: "Federal University of Technology, Akure" },
                    { key: "futminna.edu.ng", term: "Federal University of Technology, Minna" },
                    { key: "unilorin.edu.ng", term: "University of Ilorin" },
                    { key: "uniben.edu", term: "University of Benin" }
                ];

                let matchedUni = "";
                for (const item of searchTerms) {
                    if (domain.includes(item.key)) {
                        matchedUni = NIGERIAN_UNIVERSITIES.find(u => u.includes(item.term));
                        break;
                    }
                }
                
                if (matchedUni) {
                    setFormData(prev => ({ ...prev, institution: matchedUni }));
                    toast.info(`Institution detected: ${matchedUni}`);
                }
            }
        }
    }, [location.state]);

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setVerificationFile(e.target.files[0]);
        }
    };

    const toggleExpertise = (tag) => {
        setFormData(prev => {
            const expertise = prev.expertise.includes(tag)
                ? prev.expertise.filter(t => t !== tag)
                : [...prev.expertise, tag];
            return { ...prev, expertise };
        });
    };

    const handleNext = async () => {
        if (currentStep === STEP_PROFILE) {
            if (!formData.title || !formData.rank || !formData.institution || !formData.department) {
                toast.error("Please complete your professional details.");
                return;
            }
            setCurrentStep(STEP_EXPERTISE);
        } else if (currentStep === STEP_EXPERTISE) {
            if (formData.expertise.length < 1) {
                toast.error("Please select at least one area of expertise.");
                return;
            }
            setCurrentStep(STEP_PREFERENCES);
        } else if (currentStep === STEP_PREFERENCES) {
             // Final submission
             if (!verificationFile) {
                toast.error("Please upload a valid ID or verification document.");
                return;
             }
             
             setIsSubmitting(true);
             try {
                if (!currentUser) throw new Error("No user logged in.");

                // 1. Upload Verification Document
                let verificationUrl = "";
                if (verificationFile) {
                    const storageRef = ref(storage, `verification_documents/${currentUser.uid}/${Date.now()}_${verificationFile.name}`);
                    const snapshot = await uploadBytes(storageRef, verificationFile);
                    verificationUrl = await getDownloadURL(snapshot.ref);
                }

                // 2. Update Firestore
                const userRef = doc(db, "users", currentUser.uid);
                
                const dataToUpdate = {
                    title: formData.title,
                    rank: formData.rank,
                    institution: formData.institution,
                    department: formData.department,
                    staffId: formData.staffId,
                    expertise: formData.expertise,
                    publicationsLink: formData.publicationsLink,
                    acceptingStudents: formData.acceptingStudents,
                    verificationUrl: verificationUrl,
                    verificationStatus: 'pending', // Admins need to verify
                    role: 'lecturer', // Enforce role
                    onboardingCompleted: true,
                    updatedAt: new Date()
                };

                await updateDoc(userRef, dataToUpdate);

                toast.success("Profile setup complete! Welcome aboard.");
                setTimeout(() => navigate("/lecturer/dashboard"), 1500);

             } catch (error) {
                console.error("Onboarding Error:", error);
                toast.error(`Failed to save profile: ${error.message}`);
             } finally {
                setIsSubmitting(false);
             }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // --- Hardcoded Data for UI ---
    const csExpertise = [
        "Machine Learning", "Natural Language Processing", "Computer Vision",
        "Distributed Systems", "Cryptography", "Cloud Computing", "HRI", "Robotics"
    ];

    const mathExpertise = [
        "Stochastic Processes", "Bayesian Inference", "Convex Optimization"
    ];

    return (
        <div className="bg-background-light dark:bg-[#0d1117] min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            {/* Header - Standardized with Student Onboarding */}
            <nav className="w-full bg-white dark:bg-[#161b22] border-b border-border-light dark:border-border-dark py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img src="/icon.png" alt="AcadHub Logo" className="w-8 h-8 object-contain" />
                    <span className="font-bold text-xl tracking-tight text-text-light dark:text-white">AcadHub</span>
                </div>
                <div className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hidden sm:block">
                    Lecturer Onboarding
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                    
                    {/* Stepper Component (Inspired by User HTML) */}
                    <div className="w-full max-w-md mb-12">
                        <div className="flex items-center justify-between relative">
                            {/* Background Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
                            
                            {/* Active Progress Line */}
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full origin-left transition-all duration-500"
                                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                            ></div>

                            {/* Step 1: Profile */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300
                                    ${currentStep > 1 
                                        ? "bg-primary text-white shadow-primary/20" 
                                        : currentStep === 1
                                            ? "bg-white dark:bg-[#161b22] border-2 border-primary text-primary ring-4 ring-primary/10"
                                            : "bg-white dark:bg-[#161b22] border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                                    }`}>
                                    {currentStep > 1 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "1"}
                                </div>
                                <span className={`text-xs font-medium absolute top-10 w-32 text-center transition-colors ${currentStep >= 1 ? "text-primary dark:text-white" : "text-slate-400"}`}>
                                    Profile Setup
                                </span>
                            </div>

                            {/* Step 2: Expertise */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300
                                    ${currentStep > 2 
                                        ? "bg-primary text-white shadow-primary/20" 
                                        : currentStep === 2
                                            ? "bg-white dark:bg-[#161b22] border-2 border-primary text-primary ring-4 ring-primary/10"
                                            : "bg-white dark:bg-[#161b22] border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                                    }`}>
                                    {currentStep > 2 ? <span className="material-symbols-outlined text-sm font-bold">check</span> : "2"}
                                </div>
                                <span className={`text-xs font-medium absolute top-10 w-32 text-center transition-colors ${currentStep >= 2 ? "text-primary dark:text-white" : "text-slate-400"}`}>
                                    Research Expertise
                                </span>
                            </div>

                            {/* Step 3: Preferences/Verification */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300
                                    ${currentStep === 3
                                            ? "bg-white dark:bg-[#161b22] border-2 border-primary text-primary ring-4 ring-primary/10"
                                            : "bg-white dark:bg-[#161b22] border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                                    }`}>
                                    3
                                </div>
                                <span className={`text-xs font-medium absolute top-10 w-32 text-center transition-colors ${currentStep >= 3 ? "text-primary dark:text-white" : "text-slate-400"}`}>
                                    Verify
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="w-full">
                        {/* ---------------- STEP 1: PROFILE ---------------- */}
                        {currentStep === STEP_PROFILE && (
                            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-10 text-slate-900 dark:text-white">
                                    <span className="text-primary font-semibold tracking-wide uppercase text-xs mb-2 block">Step 1 of 3</span>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Professional Profile</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Let's set up your academic identity.</p>
                                </div>

                                <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                            <select 
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={formData.title}
                                                onChange={(e) => updateData("title", e.target.value)}
                                            >
                                                <option value="">Select Title</option>
                                                <option value="Dr">Dr.</option>
                                                <option value="Prof">Prof.</option>
                                                <option value="Mr">Mr.</option>
                                                <option value="Mrs">Mrs.</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Academic Rank</label>
                                            <select 
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                value={formData.rank}
                                                onChange={(e) => updateData("rank", e.target.value)}
                                            >
                                                <option value="">Select Rank</option>
                                                <option value="Asst_Lecturer">Assistant Lecturer</option>
                                                <option value="Lecturer_II">Lecturer II</option>
                                                <option value="Lecturer_I">Lecturer I</option>
                                                <option value="Snr_Lecturer">Senior Lecturer</option>
                                                <option value="Assoc_Prof">Associate Professor</option>
                                                <option value="Professor">Professor</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Institution</label>
                                        <div className="relative group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">school</span>
                                            <select 
                                                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer hover:border-primary/50"
                                                value={formData.institution}
                                                onChange={(e) => updateData("institution", e.target.value)}
                                            >
                                                <option value="">Select Institution</option>
                                                {/* If current institution is custom/legacy, show it as an option */}
                                                {formData.institution && !NIGERIAN_UNIVERSITIES.includes(formData.institution) && (
                                                    <option value={formData.institution}>{formData.institution}</option>
                                                )}
                                                {NIGERIAN_UNIVERSITIES.map((uni) => (
                                                    <option key={uni} value={uni}>
                                                        {uni}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="e.g. Computer Sciences"
                                            value={formData.department}
                                            onChange={(e) => updateData("department", e.target.value)}
                                        />
                                    </div>
                                    
                                    <button 
                                        onClick={handleNext}
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                                    >
                                        Next Step
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ---------------- STEP 2: EXPERTISE ---------------- */}
                        {currentStep === STEP_EXPERTISE && (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-10 max-w-2xl mx-auto">
                                    <span className="text-primary font-semibold tracking-wide uppercase text-xs mb-2 block">Step 2 of 3</span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Define your Research Expertise</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">This helps us route relevant student projects to you for review.</p>
                                </div>

                                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                                    {/* Left Column: Selection */}
                                    <div className="lg:col-span-7 flex flex-col gap-6">
                                        <div className="relative w-full group">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined group-focus-within:text-primary transition-colors">search</span>
                                            <input 
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b22] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm"
                                                placeholder="Search expertise (e.g., Stochastic Processes, NLP)..." 
                                                type="text"
                                            />
                                        </div>

                                        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-base">psychology</span>
                                                    Recommended for {formData.department || "Your Department"}
                                                </h3>
                                                <span className="text-xs text-primary cursor-pointer hover:underline">View all</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {csExpertise.map(tag => (
                                                    <label key={tag} className="cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only"
                                                            checked={formData.expertise.includes(tag)}
                                                            onChange={() => toggleExpertise(tag)}
                                                        />
                                                        <div className={`
                                                            px-3 py-1.5 rounded-full border text-sm font-medium transition-all flex items-center gap-1 select-none
                                                            ${formData.expertise.includes(tag)
                                                                ? "bg-primary text-white border-primary" 
                                                                : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
                                                            }
                                                        `}>
                                                            <span>{tag}</span>
                                                            <span className="material-symbols-outlined text-xs">
                                                                {formData.expertise.includes(tag) ? "check" : "add"}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                                                    <span className="material-symbols-outlined text-slate-400 text-base">functions</span>
                                                    Mathematics & Statistics
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {mathExpertise.map(tag => (
                                                        <label key={tag} className="cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only"
                                                                checked={formData.expertise.includes(tag)}
                                                                onChange={() => toggleExpertise(tag)}
                                                            />
                                                            <div className={`
                                                                px-3 py-1.5 rounded-full border text-sm font-medium transition-all flex items-center gap-1 select-none
                                                                ${formData.expertise.includes(tag)
                                                                    ? "bg-primary text-white border-primary" 
                                                                    : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary"
                                                                }
                                                            `}>
                                                                <span>{tag}</span>
                                                                <span className="material-symbols-outlined text-xs">
                                                                    {formData.expertise.includes(tag) ? "check" : "add"}
                                                                </span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Selected States */}
                                    <div className="lg:col-span-5 flex flex-col gap-6">
                                        <div className="bg-white dark:bg-[#161b22] rounded-xl border border-primary/20 shadow-lg shadow-primary/5 p-6 h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                                <h2 className="font-semibold text-lg text-slate-900 dark:text-white">Your Expertise</h2>
                                                <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">{formData.expertise.length} Selected</span>
                                            </div>
                                            
                                            {formData.expertise.length === 0 ? (
                                                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-slate-400">
                                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">label_off</span>
                                                    <p className="text-sm">No expertise selected yet.</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap content-start gap-2 flex-grow overflow-y-auto max-h-[300px] lg:max-h-[unset] p-1">
                                                    {formData.expertise.map(tag => (
                                                        <div key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium shadow-sm transition-transform hover:scale-105">
                                                            <span>{tag}</span>
                                                            <button 
                                                                onClick={() => toggleExpertise(tag)}
                                                                className="rounded-full w-4 h-4 flex items-center justify-center hover:bg-white/20 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">close</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <div className="mt-6 pt-4 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                                                <p className="flex items-start gap-2">
                                                    <span className="material-symbols-outlined text-sm mt-0.5 text-primary">info</span>
                                                    Selecting accurate tags ensures you receive project proposals that match your technical background.
                                                </p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleNext}
                                            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-4 px-6 rounded-lg shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-between group"
                                        >
                                            <span className="text-lg">Next: Platform Preferences</span>
                                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                        
                                        <button 
                                            onClick={handleBack}
                                            className="w-full text-slate-500 text-sm hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ---------------- STEP 3: PREFERENCES (Verification) ---------------- */}
                        {currentStep === 3 && (
                             <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-10 text-slate-900 dark:text-white">
                                    <span className="text-primary font-semibold tracking-wide uppercase text-xs mb-2 block">Step 3 of 3</span>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Identity Verification</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg">Upload your official ID to verify your staff status.</p>
                                </div>

                                <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm space-y-6">
                                    
                                    {/* File Upload Area */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload ID Document (Image or PDF)</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:border-primary transition-colors bg-slate-50 dark:bg-slate-800/50">
                                            <div className="space-y-1 text-center">
                                                {verificationFile ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="material-symbols-outlined text-4xl text-green-500 mb-2">check_circle</span>
                                                        <p className="text-sm text-slate-900 dark:text-white font-medium">{verificationFile.name}</p>
                                                        <button 
                                                            onClick={() => setVerificationFile(null)}
                                                            className="text-xs text-red-500 hover:text-red-600 mt-2 font-medium"
                                                        >
                                                            Remove file
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-4xl text-slate-400">upload_file</span>
                                                        <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                                <span>Upload a file</span>
                                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" onChange={(e) => e.target.files && setVerificationFile(e.target.files[0])} />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manual ID Input (Secondary) */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Staff ID Number (Optional)</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="e.g. SP/1239/AB"
                                            value={formData.staffId}
                                            onChange={(e) => updateData("staffId", e.target.value)}
                                        />
                                    </div>

                                    {/* Research Link (Optional) */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Research Profile Link (Optional)</label>
                                        <input 
                                            type="url" 
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="Google Scholar, ResearchGate, or Institutional Profile"
                                            value={formData.publicationsLink}
                                            onChange={(e) => updateData("publicationsLink", e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-4 flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="accepting"
                                            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                            checked={formData.acceptingStudents}
                                            onChange={(e) => updateData("acceptingStudents", e.target.checked)}
                                        />
                                        <label htmlFor="accepting" className="text-sm text-slate-700 dark:text-slate-300">
                                            I am currently accepting new student supervisees
                                        </label>
                                    </div>

                                    <button 
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? "Verifying..." : "Complete Setup"}
                                        {!isSubmitting && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                    </button>
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
