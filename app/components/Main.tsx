import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "./fire";
import Title from "./Title";
import Buttons from "./Buttons";
import Album from "./Album";
import ModalWindow from "./ModalWindow";

const auth = firebase.auth();

export default function Main(props: { title: string }): JSX.Element {
  const [loginState, setLoginState] = useState(false);
  const [modalDetail, setModalDetail] = useState("");
  const [show, setShow] = useState(false);

  useEffect((): void => {
    console.log("Side Effect!");
    auth
      .getRedirectResult()
      .then((result: { credential: any }): void => {
        if (result.credential) {
          console.log("User", result.credential);
          const changeTrue = loginState === false ? true : true;
          setLoginState(changeTrue);
        }
      })
      .catch((_error: any): void => {
        console.log("not logined.");
      });
  }, [loginState]);

  return (
    <main>
      <Title
        title={props.title}
        loginState={loginState}
        setLoginState={setLoginState}
      />
      <Buttons
        loginState={loginState}
        setModalDetail={setModalDetail}
        setShow={setShow}
      />
      <Album />
      <ModalWindow modalDetail={modalDetail} show={show} setShow={setShow} />
    </main>
  );
}
