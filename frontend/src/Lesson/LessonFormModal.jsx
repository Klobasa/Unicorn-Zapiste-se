import { Modal } from "react-bootstrap";
import LessonForm from "./LessonForm";

function LessonFormModal({ lesson, onHide, onSuccess }) {
    const isEditMode = !!lesson?.id;

    return (
        <Modal show={!!lesson} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? "Upravit lekci" : "Nová lekce"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LessonForm lessonData={lesson ?? undefined} onSuccess={onSuccess ?? onHide} />
            </Modal.Body>
        </Modal>
    );
}

export default LessonFormModal;
