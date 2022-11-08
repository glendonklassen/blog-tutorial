import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider, db } from "../lib/firebase"
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { getDoc, writeBatch, doc } from "firebase/firestore";
import debounce from 'lodash.debounce';

export default function Enter({ }) {
    const { user, username } = useContext(UserContext);
    return (
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
        </main>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
            }).catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} /> Sign in with Google
        </button>
    );
}
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);
    const checkUsernameHandler = async (username) => {
        if (username.length >= 3) {
            const docSnap = await getDoc(doc(db, 'usernames', username));
            setIsValid(!docSnap.exists())
            setLoading(false);
        }
    }
    const checkUsername = useCallback(debounce(checkUsernameHandler, 500), []);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue])

    const onSubmit = async (e) => {
        e.preventDefault();
        const batch = writeBatch(db);
        batch.set(doc(db, 'users', user.uid), { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(doc(db, 'usernames', formValue), { uid: user.uid });

        await batch.commit();
    }

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>
                    <h3>Debug State</h3>
                    <div>
                        UserName: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}