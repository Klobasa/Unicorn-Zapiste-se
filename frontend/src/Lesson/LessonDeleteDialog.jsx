import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getDay } from "../utils/days";
import { Icon } from "@mdi/react";
import { mdiDeleteOutline, mdiDeleteAlertOutline } from "@mdi/js";

function LessonDeleteDialog({ lesson, setLesson, handleDelete, handleDeleteWithUnregister }) {
    const [lessonParticipant, setParticipants] = useState([]);

    useEffect(() => {
        if (lesson?.id) {
            fetch(`/lesson-participant/list-by-lesson?lessonId=${lesson.id}`)
                .then((res) => res.json())
                .then((data) => setParticipants(data))
                .catch(() => setParticipants([]));
        }
    }, [lesson]);

    return (
        <Modal show={!!lesson} onHide={() => setLesson(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Opravdu chcete smazat lekci?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Lekce <b>{lesson?.title} ({getDay(lesson.day)?.short} {lesson.timeFrom}-{lesson.timeTo})</b> bude trvale odstraněna z databáze.</p>

                {lessonParticipant.length > 0 && (
                    <>
                        <p><b>Pozor! K leci jsou přihlášení účastníci:</b></p>
                        <ul>
                            {lessonParticipant.map((lp) => (
                                <li key={lp.participantId}>{lp.participant.name} {lp.participant.surname}</li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setLesson(false)}>
                    Zrušit
                </Button>

                {lessonParticipant.length > 0 && (
                    <Button variant="danger" onClick={handleDeleteWithUnregister}>
                        <Icon path={mdiDeleteAlertOutline} size={0.9} />
                       {" "}Odhlásit účastníky a smazat
                    </Button>
                )}

                <Button variant="warning" onClick={handleDelete} disabled={lessonParticipant.length > 0}>
                    <Icon path={mdiDeleteOutline} size={0.9} />
                    {" "}Smazat
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default LessonDeleteDialog;