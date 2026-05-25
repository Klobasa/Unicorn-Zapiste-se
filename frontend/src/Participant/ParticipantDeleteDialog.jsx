import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { getDay } from "../utils/days";
import { Icon } from "@mdi/react";
import { mdiDeleteOutline, mdiDeleteAlertOutline } from "@mdi/js";

function ParticipantDeleteDialog({ participant, setParticipant, handleDelete, handleDeleteWithUnregister }) {
    const [lessonParticipant, setLessons] = useState([]);

    useEffect(() => {
        if (participant?.id) {
            fetch(`/lesson-participant/list-by-participant?participantId=${participant.id}`)
                .then((res) => res.json())
                .then((data) => setLessons(data))
                .catch(() => setLessons([]));
        }
    }, [participant]);

    return (
        <Modal show={!!participant} onHide={() => setParticipant(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Opravdu chcete smazat účastníka?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Účastník <b>{participant?.name} {participant?.surname}</b> bude trvale odstraněn z databáze.</p>

                {lessonParticipant.length > 0 && (
                    <>
                        <p><b>Pozor! Účastník je přihlášen na lekce:</b></p>
                        <ul>
                            {lessonParticipant.map((lp) => (
                                <li key={lp.lessonId}>{lp.lesson.title} ({getDay(lp.lesson.day)?.short} - {lp.lesson.timeFrom}-{lp.lesson.timeTo})</li>
                            ))}
                        </ul>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setParticipant(false)}>
                    Zrušit
                </Button>

                {lessonParticipant.length > 0 && (
                    <Button variant="danger" onClick={handleDeleteWithUnregister}>
                        <Icon path={mdiDeleteAlertOutline} size={1} />
                        Odhlásit z lekcí a smazat
                    </Button>
                )}

                <Button variant="warning" onClick={handleDelete} disabled={lessonParticipant.length > 0}>
                    <Icon path={mdiDeleteOutline} size={1} />
                    Smazat
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ParticipantDeleteDialog;
