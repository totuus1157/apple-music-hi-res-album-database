import { useState, useEffect, SetStateAction } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "components/fire";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

const db = firebase.firestore();
const auth = firebase.auth();

type Props = {
  albumInfo: string;
  setAlbumInfo: (arg0: string) => void;
  setIsModalOpen: (arg0: boolean) => void;
  setModalContent: (arg0: string) => void;
  isModalOpen: boolean;
  uid: string;
};

export default function EditTable(props: Props): JSX.Element {
  const {
    albumInfo,
    setAlbumInfo,
    setIsModalOpen,
    setModalContent,
    isModalOpen,
    uid,
  } = props;

  const tableRows: SetStateAction<any[]> = [];
  const [data, setData] = useState(tableRows);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleShow = (e: any): void => {
    setAlbumInfo(e.currentTarget.value);
    setIsModalOpen(true);
    setModalContent("delete");
  };

  useEffect((): void => {
    if (auth.currentUser !== null) {
      db.collection("users")
        .doc(uid)
        .collection("albums")
        .get()
        .then((snapshot): void => {
          snapshot.forEach((document): void => {
            const doc = document.data();
            tableRows.push(
              <tr key={document.id}>
                <td>{doc.artist}</td>
                <td>{doc.genre}</td>
                <td>{doc.composer}</td>
                <td>{doc.sampleRate}</td>
                <td>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.title}
                  </a>
                </td>
                <td style={{ border: "none" }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    value={[
                      document.id,
                      doc.artist,
                      doc.title,
                      doc.genre,
                      doc.composer,
                      doc.sampleRate,
                    ]}
                    onClick={handleShow}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </td>
              </tr>,
            );
          });
          setData(tableRows);
          setIsLoaded(true);
        });
    } else {
      tableRows.push(
        <tr key="1">
          <th>Cannot retrieve data.</th>
        </tr>,
      );
    }
  }, [isModalOpen]);

  return (
    <div style={{ marginBottom: "20px" }}>
      {isLoaded === true ? (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Artist</th>
              <th>Genre</th>
              <th>Composer</th>
              <th>Sample Rate</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>{data}</tbody>
        </Table>
      ) : (
        <p>Now loading...</p>
      )}
    </div>
  );
}
