import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../firebase.init";

export const AuthContext = createContext(null)
const auth = getAuth(app)
const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const createUser = (email,password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    const signinUser = (email,password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }
    useEffect(()=>{
        const unsubscribe =  onAuthStateChanged(auth,currentuser =>{
                setUser(currentuser)
                setLoading(false); } )
            return () =>{
                return unsubscribe;
            }
    },[])
      const logOut =() =>{
        setLoading(true)
        return signOut(auth)
    }


    const userInfo = {
        user,
        loading,
        createUser,
        signinUser,
        logOut
    }
    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;