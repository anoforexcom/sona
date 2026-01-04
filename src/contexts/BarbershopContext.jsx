import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const BarbershopContext = createContext();

export const useBarbershop = () => {
    return useContext(BarbershopContext);
};

export const BarbershopProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [barbershop, setBarbershop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // We use onSnapshot for real-time updates (e.g., when Admin approves)
        const q = query(collection(db, 'barbershops'), where('ownerId', '==', currentUser.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setBarbershop({ id: doc.id, ...doc.data() });
            } else {
                setBarbershop(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching barbershop context:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const value = {
        barbershop,
        loading
    };

    return (
        <BarbershopContext.Provider value={value}>
            {children}
        </BarbershopContext.Provider>
    );
};
