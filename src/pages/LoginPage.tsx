import { signInWithPopup } from 'firebase/auth';
import React, { FunctionComponent } from 'react';
import {auth} from "../firebase";
import firebase from "firebase/compat";
import { GoogleAuthProvider } from "firebase/auth";
import {useNavigate} from "react-router-dom";

interface OwnProps {}

type Props = OwnProps;

const LoginPage: FunctionComponent<Props> = (props) => {
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        navigate("/")
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }
  return (
    <section className="container flex justify-center m-auto h-screen items-center">
      <button onClick={loginWithGoogle} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-500 transition-all shadow hover:shadow-md">
        connect with google
      </button>
    </section>
  );
};

export default LoginPage;
