import React, {FunctionComponent, PropsWithChildren, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Spinner from "./components/Spinner";
import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";

interface OwnProps {}

type Props = OwnProps;

const PrivateRoute: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const [user, isLoadingUser,] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate("./login")
    }
  }, [user, isLoadingUser, navigate])

  if (isLoadingUser || !user) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner className="text-primary"/>
      </div>
    )
  } else {
    return (
      <>
        {props.children}
      </>
    );
  }
};


export default PrivateRoute;
