import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../firebase.init";

 const AuthContext = createContext(null)
const auth = getAuth(app)
const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    

    // create user
    const createUser = (email,password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password);
    }

    // signin User
    const signinUser = (email,password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    // current user
    useEffect(()=>{
        const unsubscribe =  onAuthStateChanged(auth,currentuser =>{
           
                setUser(currentuser)
                setLoading(false);
            }
            )
            return () =>{
                return unsubscribe;
            }
    
    },[])

    // logout user
      // logout
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