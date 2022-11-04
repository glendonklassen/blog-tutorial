import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase"

export default function Enter({ }) {
    const user = null;
    const username = null;

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
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    }
    
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} />
        </button>
    );
}
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>
}
function UsernameForm() {

}