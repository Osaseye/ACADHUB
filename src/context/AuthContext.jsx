import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user role from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                let userData = {};
                if (userDocSnap.exists()) {
                    userData = userDocSnap.data();
                }

                // Merge Firestore data into the user object
                // We use Object.assign to modify the user object in place to preserve methods
                Object.assign(user, userData);
                
                setCurrentUser(user);
                setUserRole(userData.role);
            } else {
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const register = async (email, password, role, additionalData) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        
        // Update user profile with displayName
        if (additionalData?.displayName) {
            await updateProfile(user, {
                displayName: additionalData.displayName
            });
            // Force update local state to reflect changes immediately
            setCurrentUser({ ...user });
        }
        
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email,
            role,
            createdAt: new Date(),
            ...additionalData,
        });

        return user;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        userRole,
        register,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};