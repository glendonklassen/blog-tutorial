import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase"
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Enter({ }) {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
            }
        </main>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
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

}