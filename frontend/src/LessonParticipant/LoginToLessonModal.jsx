import { Modal } from "react-bootstrap";
import LessonProvider from "../Lesson/LessonProvider";
import ParticipantProvider from "../Participant/ParticipantProvider";
import LoginToLessonForm from "./LoginToLessonForm";

function LoginToLessonModal({ show, onHide, onSuccess, defaultLessonId }) {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Přihlásit na lekci</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LessonProvider>
                    <ParticipantProvider>
                        <LoginToLessonForm defaultLessonId={defaultLessonId} onSuccess={onSuccess ?? onHide} />
                    </ParticipantProvider>
                </LessonProvider>
            </Modal.Body>
        </Modal>
    );
}

export default LoginToLessonModal;
