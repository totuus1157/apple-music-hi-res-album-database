import { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "./fire";
import Title from "./Title";
import ButtonSection from "./ButtonSection";
import Albums from "./Albums";
import EditTable from "./EditTable";
import ModalWindow from "./ModalWindow";

const db = firebase.firestore();
const auth = firebase.auth();

export default function Main(props: { title: string }): JSX.Element {
  const [loginState, setLoginState] = useState(false);
  const [modalDetail, setModalDetail] = useState("");
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [albumInfo, setAlbumInfo] = useState("");
  const [registeredURL, setRegisteredURL] = useState<string[]>([]);
  const [uid, setUid] = useState("");

  auth
    .getRedirectResult()
    .then((result) => {
      console.log("result: ", result);
    })
    .catch((error) => {
      console.log("error: ", error);
    });

  auth.onAuthStateChanged(async (user) => {
    console.log("user: ", user);
    if (user) {
      setUid(user.uid);
      setLoginState(true);
    }
  });

  return (
    <main>
      <Title
        title={props.title}
        loginState={loginState}
        setLoginState={setLoginState}
      />
      <ButtonSection
        loginState={loginState}
        setModalDetail={setModalDetail}
        setShow={setShow}
        editing={editing}
        setEditing={setEditing}
      />
      {editing !== true ? (
        <Albums
          show={show}
          registeredURL={registeredURL}
          setRegisteredURL={setRegisteredURL}
        />
      ) : (
        <EditTable
          show={show}
          setShow={setShow}
          setModalDetail={setModalDetail}
          albumInfo={albumInfo}
          setAlbumInfo={setAlbumInfo}
          uid={uid}
        />
      )}
      <ModalWindow
        modalDetail={modalDetail}
        show={show}
        setShow={setShow}
        albumInfo={albumInfo}
        registeredURL={registeredURL}
        uid={uid}
      />
    </main>
  );
}
