import { useState } from "react";
import { userAuth, userAuthWithGoogle, database } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, setDoc, doc, serverTimestamp, updateDoc, arrayUnion, addDoc } from "firebase/firestore";

export const UserLogin = () => {

    const submitUserDetails = async (userEmail, userPassword) => {


        try {
            await setDoc(doc(database, "persons", userEmail), {
                createdAt: serverTimestamp(),
                email: userEmail,
                isActive: true,
                signInAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uid: userEmail,
                uPassword: userPassword,

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

    // sign in
    const signIn = async () => {
        await signInWithEmailAndPassword(userAuth, userEmail, userPassword).then((userCredential) => {
            const userCred = userCredential.userCredential;
            alert(userCred.user);

        }).catch((err) => {

            alert(err.code);
            alert(err.message);
        });
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