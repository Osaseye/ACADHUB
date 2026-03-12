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

    const refreshUser = async () => {
        if (!auth.currentUser) return;
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userData = {};
        if (userDocSnap.exists()) {
            userData = userDocSnap.data();
        }

        const updatedUser = Object.assign({}, auth.currentUser, userData);
        setCurrentUser(updatedUser);
        setUserRole(userData.role);
    };

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
                const combinedUser = Object.assign({}, user, userData);
                
                setCurrentUser(combinedUser);
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
        
        if (additionalData?.displayName) {
            await updateProfile(user, {
                displayName: additionalData.displayName
            });
        }
        
        const userData = {
            uid: user.uid,
            email,
            role,
            createdAt: new Date(),
            ...additionalData,
        };
        
        await setDoc(doc(db, "users", user.uid), userData);

        const combinedUser = Object.assign({}, user, userData);
        setCurrentUser(combinedUser);
        setUserRole(role);

        return combinedUser;
    };

    const login = async (email, password) => {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let userData = {};
        if (userDocSnap.exists()) {
            userData = userDocSnap.data();
        }

        const combinedUser = Object.assign({}, user, userData);
        setCurrentUser(combinedUser);
        setUserRole(userData.role);
        
        return res;
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
        refreshUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};