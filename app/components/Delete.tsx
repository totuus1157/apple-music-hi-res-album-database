import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "components/fire";
import BSModal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

const db = firebase.firestore();
const auth = firebase.auth();

type Props = {
  setIsModalOpen: (arg0: boolean) => void;
  isModalOpen: boolean;
  albumInfo: string;
  uid: string;
};

export default function Delete(props: Props): JSX.Element {
  const { setIsModalOpen, isModalOpen, albumInfo, uid } = props;

  const albumDataArray = albumInfo.split(",");
  const [albumId, artist, title, genre, composer, sampleRate] = albumDataArray;

  const doAction = (): void => {
    if (auth.currentUser !== null) {
      db.collection("users")
        .doc(uid)
        .collection("albums")
        .doc(albumId)
        .delete()
        .then((): void => {
          handleClose();
        });
    }
  };

  const handleClose = (): void => setIsModalOpen(false);

  return (
    <BSModal show={isModalOpen} onHide={handleClose}>
      <BSModal.Header closeButton>
        <BSModal.Title>Deleting an album</BSModal.Title>
      </BSModal.Header>
      <BSModal.Body>
        <Table>
          <tbody>
            <tr>
              <td>Artist</td>
              <td>{artist}</td>
            </tr>
            <tr>
              <td>Title</td>
              <td>{title}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>{genre}</td>
            </tr>
            <tr>
              <td>Composer</td>
              <td>{composer ? composer : "-"}</td>
            </tr>
            <tr>
              <td>SampleRate</td>
              <td>{sampleRate}</td>
            </tr>
          </tbody>
        </Table>
      </BSModal.Body>
      <BSModal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={doAction}>
          Delete
        </Button>
      </BSModal.Footer>
    </BSModal>
  );
}
