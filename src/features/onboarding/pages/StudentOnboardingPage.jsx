import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { db, storage } from "../../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PageLoader } from "../../../components/common/PageLoader";
import { NIGERIAN_UNIVERSITIES } from "../../../data/universities";

// Steps
const STEP_PROFILE = 1;
const STEP_INTERESTS = 2;
const STEP_INTENT = 3;

export const StudentOnboardingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(STEP_PROFILE);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    department: "",
    gradYear: "",
    interests: [],
    intents: []
  });

  // Auto-fill Institution based on email
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
                { key: "unn.edu.ng", term: "University of Nigeria" }, // Covers Nsukka
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
            
            // If recognized, set it
            if (matchedUni) {
                setFormData(prev => ({ ...prev, institution: matchedUni }));
                toast.info(`We've detected your institution: ${matchedUni}`);
            }
        }
    }
  }, [location.state]);

  // Handle Updates
  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const toggleIntent = (intentValue) => {
     setFormData(prev => {
        const intents = prev.intents.includes(intentValue)
            ? prev.intents.filter(i => i !== intentValue)
            : [...prev.intents, intentValue];
        return { ...prev, intents };
     });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  // Validations & Navigation
  const handleNext = async () => {
    if (currentStep === STEP_PROFILE) {
        if (!formData.degree || !formData.institution || !formData.department || !formData.gradYear) {
            toast.error("Please fill in all fields to continue.");
            return;
        }
        setCurrentStep(STEP_INTERESTS);
    } else if (currentStep === STEP_INTERESTS) {
        if (formData.interests.length < 3) {
            toast.error("Please select at least 3 interests.");
            return;
        }
        setCurrentStep(STEP_INTENT);
    } else if (currentStep === STEP_INTENT) {
        if (formData.intents.length === 0) {
            toast.error("Please select at least one way you plan to use AcadHub.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            if (!currentUser) throw new Error("No user logged in.");

            let photoURL = currentUser.photoURL;

            // 1. Upload Photo if selected
            if (profilePhoto) {
                const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
                const snapshot = await uploadBytes(storageRef, profilePhoto);
                // Get download URL from the snapshot's reference
                photoURL = await getDownloadURL(snapshot.ref);
            }

            // 2. Update Firestore
            // Ensure we are using 'setDoc' with merge:true or updateDoc if document exists
            // Since register creates the document, updateDoc is safe.
            const userRef = doc(db, "users", currentUser.uid);
            
            // Clean undefined values if any
            const dataToUpdate = {
                degree: formData.degree,
                institution: formData.institution,
                department: formData.department,
                gradYear: formData.gradYear,
                interests: formData.interests,
                intents: formData.intents,
                photoURL: photoURL || null,
                onboardingCompleted: true,
                updatedAt: new Date()
            };

            await updateDoc(userRef, dataToUpdate);

            toast.success("Profile Setup Complete!");
            // Short delay for toast visibility before redirect
            setTimeout(() => navigate("/dashboard", { replace: true }), 1000); 
            
        } catch (error) {
            console.error("Onboarding Error:", error);
            toast.error(`Failed to save profile: ${error.message}`);
            setIsSubmitting(false); // Only stop loading on error, success redirects/unmounts
        }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#0d1117] font-sans text-text-light dark:text-white flex flex-col transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="w-full bg-white dark:bg-[#161b22] border-b border-border-light dark:border-border-dark py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <img src="/icon.png" alt="AcadHub Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-text-light dark:text-white">AcadHub</span>
        </div>
        <div className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hidden sm:block">
            Student Onboarding
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-12 pb-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Stepper */}
        <div className="w-full max-w-xl mb-12">
            <div className="relative flex items-center justify-between w-full">
                {/* Line Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full -z-10 overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    ></div>
                </div>

                {/* Steps */}
                {[STEP_PROFILE, STEP_INTERESTS, STEP_INTENT].map((step) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    
                    let label = "Profile";
                    if (step === 2) label = "Interests";
                    if (step === 3) label = "Intent";

                    return (
                        <div key={step} className="flex flex-col items-center gap-2 bg-background-light dark:bg-[#0d1117] px-2 z-10">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ring-4 ring-background-light dark:ring-[#0d1117]
                                ${isActive ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : ""}
                                ${isCompleted ? "bg-primary text-white" : ""}
                                ${!isActive && !isCompleted ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500" : ""}
                            `}>
                                {isCompleted ? (
                                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                                ) : (
                                    step
                                )}
                            </div>
                            <span className={`text-xs font-medium uppercase tracking-wide transition-colors duration-300 ${isActive || isCompleted ? "text-primary" : "text-gray-400 dark:text-gray-600"}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-2xl bg-white dark:bg-[#161b22] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-border-light dark:border-border-dark overflow-hidden transition-all duration-500 min-h-[500px]">
            
            {/* Step 1: Academic Profile */}
            {currentStep === STEP_PROFILE && (
                <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-white mb-3">Build your Academic Profile</h1>
                        <p className="text-text-muted-light dark:text-text-muted-dark">
                            We personalize your research feed and peer recommendations based on your academic background.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture Upload */}
                         <div className="flex flex-col items-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center group-hover:border-primary transition-colors">
                                    {profilePhoto ? (
                                        <img src={URL.createObjectURL(profilePhoto)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-gray-400 text-4xl">add_a_photo</span>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 mt-2 block text-center mt-26">Upload Photo</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-text-light dark:text-white">Current Degree Level</label>
                             <select 
                                value={formData.degree}
                                onChange={(e) => updateData("degree", e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-light dark:text-white appearance-none cursor-pointer hover:border-primary/50"
                             >
                                <option value="" disabled>Select your degree...</option>
                                <option value="BSc">Bachelor of Science (BSc)</option>
                                <option value="BA">Bachelor of Arts (BA)</option>
                                <option value="MSc">Master of Science (MSc)</option>
                                <option value="MA">Master of Arts (MA)</option>
                                <option value="PhD">Doctor of Philosophy (PhD)</option>
                             </select>
                        </div>
                        
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-text-light dark:text-white">Institution / University</label>
                             <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">school</span>
                                <select 
                                    value={formData.institution}
                                    onChange={(e) => updateData("institution", e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-light dark:text-white appearance-none cursor-pointer hover:border-primary/50"
                                >
                                    <option value="" disabled>Select your institution...</option>
                                    {NIGERIAN_UNIVERSITIES.map((uni) => (
                                        <option key={uni} value={uni}>
                                            {uni}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-light dark:text-white">Department</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">apartment</span>
                                    <input 
                                        type="text" 
                                        placeholder="Computer Science"
                                        value={formData.department}
                                        onChange={(e) => updateData("department", e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-light dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-light dark:text-white">Graduation Year</label>
                                <select 
                                    value={formData.gradYear}
                                    onChange={(e) => updateData("gradYear", e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-text-light dark:text-white cursor-pointer hover:border-primary/50"
                                >
                                    <option value="" disabled>Select year...</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Interests */}
            {currentStep === STEP_INTERESTS && (
                <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-white mb-3">Research Interests</h1>
                         <p className="text-text-muted-light dark:text-text-muted-dark">
                            Select at least 3 topics to customize your feed.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Search (Visual Only) */}
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">search</span>
                            <input 
                                type="text"
                                placeholder="Search specific topics..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#0d1117] border-none ring-1 ring-gray-200 dark:ring-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-text-light dark:text-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Selected Tags */}
                        <div className="min-h-[40px]">
                             {formData.interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2">
                                    {formData.interests.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => toggleInterest(tag)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors animate-in zoom-in duration-200"
                                        >
                                            {tag}
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No interests selected yet.</p>
                            )}
                        </div>

                        {/* Tag Cloud */}
                        <div>
                             <h4 className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wider">Recommended Topics</h4>
                             <div className="flex flex-wrap gap-3">
                                {["Machine Learning", "Blockchain", "Sustainability", "Clinical Psychology", "Macroeconomics", "Bioinformatics", "Quantum Physics", "Renewable Energy", "Urban Planning"].map(topic => (
                                    <button
                                        key={topic}
                                        onClick={() => toggleInterest(topic)}
                                        className={`
                                            px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 transform
                                            ${formData.interests.includes(topic) 
                                                ? "opacity-50 scale-95 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-transparent" 
                                                : "bg-white dark:bg-[#0d1117] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-sm"}
                                        `}
                                        disabled={formData.interests.includes(topic)}
                                    >
                                        {topic}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Intent */}
            {currentStep === STEP_INTENT && (
                <div className="p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-white mb-3">How will you use AcadHub?</h1>
                        <p className="text-text-muted-light dark:text-text-muted-dark">
                            Choose all that apply so we can optimize your experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: "discover", icon: "travel_explore", title: "Discover Research", desc: "Find papers and citations." },
                            { id: "analyze", icon: "insights", title: "Analyze Trends", desc: "Visualize academic data." },
                            { id: "upload", icon: "cloud_upload", title: "Upload & Share", desc: "Publish my work globally." },
                            { id: "connect", icon: "groups", title: "Connect", desc: "Find peers and mentors." }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleIntent(item.id)}
                                className={`
                                    relative p-6 rounded-xl border-2 text-left transition-all duration-200 group
                                    ${formData.intents.includes(item.id) 
                                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0d1117] hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.01]"}
                                `}
                            >
                                {formData.intents.includes(item.id) && (
                                    <div className="absolute top-4 right-4 text-primary animate-in zoom-in">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                )}
                                
                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors
                                    ${formData.intents.includes(item.id) ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"}
                                `}>
                                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                </div>
                                <h3 className={`font-bold mb-1 ${formData.intents.includes(item.id) ? "text-primary" : "text-text-light dark:text-white"}`}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                                    {item.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Actions / Navigation */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-[#0d1117]/30 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                 {currentStep > 1 ? (
                    <button 
                        onClick={handleBack}
                        disabled={isSubmitting}
                        className="text-sm font-medium text-gray-500 hover:text-text-light dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                 ) : (
                    <span className="text-xs text-gray-400">Step 1 of 3</span>
                 )}

                 <button 
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                             <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                             Saving...
                        </span>
                    ) : (
                        <>
                            {currentStep === STEP_INTENT ? "Finish" : "Next Step"}
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </>
                    )}
                 </button>
            </div>

        </div>

      </main>
    </div>
  );
};
