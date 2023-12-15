import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, getDoc, serverTimestamp, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import * as CryptoJS from 'crypto-js'
import { userIdContext } from "./Context";

export const UserLogin = () => {
 
    const navigate = useNavigate();

    const { userId, setUserId } = useContext(userIdContext);
    useEffect(() => {
        console.log(userId);
        // navigate(-1)
      }, [userId]);
    const secretKey = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345'
    const encrypt = (plainText) => {
        const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString()
        return cipherText
    }
    const decrypt = (cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey)
        const plainText = bytes.toString(CryptoJS.enc.Utf8)
        return plainText
    }
    const submitUserDetails = async (userEmail, userPassword) => {


        try {
            await setDoc(doc(database, "persons", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: encrypt(userPassword),

            });
        } catch (error) {
            console.error("Error submitUserDetails:", error);
        }
    }
    // holds email + pass
    const [userEmail, setEmail] = useState("");
    const [userPassword, setPassword] = useState("");

    // sign up
    const signUp = async () => {
        await createUserWithEmailAndPassword(userAuth, userEmail, userPassword).then((userCredential) => {
            const userCred = userCredential.userCredential;
            submitUserDetails(userEmail, userPassword)
            alert(userCred);
        });
    };

    const signIn = async () => {
        try {
            // Retrieve the user document from the database
            const userDoc = doc(database, "persons", userEmail);
            const userSnap = await getDoc(userDoc);
            const userData = userSnap.data();
            console.log(userData);

            if (userData) {
                const decryptedPassword = decrypt(userData.uPassword);
                if (userPassword === decryptedPassword) {
                    const userCredential = await signInWithEmailAndPassword(userAuth, userEmail, userPassword);
                    const userCred = userCredential.user;
                    localStorage.setItem("userId", userEmail);
                    navigate(-1)
                } else {
                    alert("Invalid password");
                }
            } else {
                alert("User does not exist");
            }
        } catch (error) {
            console.error("Error signing in:", error.code, error.message);
        }
    };

    // sign in with google
    const signInGoogle = async () => {

        await signInWithPopup(userAuth, userAuthWithGoogle).then((userCredential) => {
            const userCred = userCredential.providerId;
            alert(userCred.user);

        }).catch((err) => {

            alert(err.code);
            alert(err.message);
        });
    };

    return (
        <div>
            <input placeholder="Email" required value={userEmail} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required value={userPassword} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signUp}>Sign up</button>

            <hr />

            <input placeholder="Email" required value={userEmail} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required value={userPassword} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signIn}>Sign In</button>

            <hr />

            <button onClick={signInGoogle}>Sign In With google</button>
        </div>
    );
};