import { auth, db } from "../lib/firebase"

import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, onSnapshot } from "firebase/firestore";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;
        if (user) {
            unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
                setUsername(doc.data()?.username)
            })
        } else {
            setUsername(null)
        }
        return unsubscribe;
    }, [user])
    
    return { user, username }
}