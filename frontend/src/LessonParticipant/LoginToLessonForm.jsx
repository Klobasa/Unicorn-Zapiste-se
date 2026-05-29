import { useContext, useState } from 'react';
import { LessonContext } from '../Lesson/LessonProvider';
import { ParticipantContext } from '../Participant/ParticipantProvider';
import { Form, Button, Row, Col } from "react-bootstrap";
import { Icon } from "@mdi/react";
import { mdiLoading, mdiAccountPlus } from "@mdi/js";
import { getDay } from "../utils/days";
import { useToast } from "../ToastProvider";

function LoginToLessonForm({ defaultLessonId, onSuccess }) {
    const { data: lessonData } = useContext(LessonContext);
    const { data: participantData } = useContext(ParticipantContext);
    const { addToast } = useToast();

    const [lessonId, setLessonId] = useState(defaultLessonId ?? "");
    const [participantId, setParticipantId] = useState("");
    const [newParticipantName, setNewParticipantName] = useState("");
    const [newParticipantSurname, setNewParticipantSurname] = useState("");
    const [newParticipantEmail, setNewParticipantEmail] = useState("");
    const [busy, setBusy] = useState(false);

    const allLessons = lessonData?.itemList ?? [];

    const isNewParticipant = !participantId && (newParticipantName || newParticipantSurname || newParticipantEmail);
    const canSubmit = lessonId && (participantId || (newParticipantName && newParticipantEmail));

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setBusy(true);
        try {
            let resolvedParticipantId = participantId;

            if (isNewParticipant) {
                const createRes = await fetch("/participant/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newParticipantName, surname: newParticipantSurname, email: newParticipantEmail }),
                });
                if (!createRes.ok) {
                    const body = await createRes.json().catch(() => ({}));
                    addToast("Nepodařilo se vytvořit účastníka.", "danger", body.message);
                    return;
                }
                const newParticipant = await createRes.json();
                resolvedParticipantId = newParticipant.id;
            }

            const res = await fetch("/lesson-participant/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, participantId: resolvedParticipantId }),
            });
            if (res.ok) {
                addToast("Účastník byl úspěšně přihlášen na lekci.", "success");
                onSuccess?.();
            } else {
                const body = await res.json().catch(() => ({}));
                addToast("Nepodařilo se přihlásit na lekci.", "danger", body.message);
            }
        } catch {
            addToast("Nepodařilo se připojit k serveru.", "danger");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Form>
            <Row className="mb-1">
                <Col>
                    <Form.Label>Účastník:</Form.Label>
                    <Form.Select value={participantId} onChange={(e) => setParticipantId(e.target.value)} disabled={busy}>
                        <option value="">--Vyberte účastníka--</option>
                        {participantData?.itemList?.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} {p.surname}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <Form.Label>--nebo zaregistrujte nového--</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Jméno"
                        onChange={(e) => setNewParticipantName(e.target.value)}
                        value={newParticipantName}
                        disabled={busy || participantId}
                    />
                </Col>
                <Col>
                    <Form.Label>&nbsp;</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Příjmení"
                        onChange={(e) => setNewParticipantSurname(e.target.value)}
                        value={newParticipantSurname}
                        disabled={busy || participantId}
                    />
                </Col>
            </Row>
            <Row className="mt-1">
                <Col>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setNewParticipantEmail(e.target.value)}
                        value={newParticipantEmail}
                        disabled={busy || participantId}
                    />
                </Col>
            </Row>
            <Row className="mb-3 mt-4">
                <Col>
                    <Form.Label>Lekce:</Form.Label>
                    <Form.Select value={lessonId} onChange={(e) => setLessonId(e.target.value)} disabled={busy}>
                        <option value="">--Vyberte lekci--</option>
                        {allLessons.map((l) => {
                            const full = l.enrolled >= l.capacity;
                            return (
                                <option key={l.id} value={l.id} disabled={full}>
                                    {l.title} ({getDay(l.day)?.short} {l.timeFrom}-{l.timeTo}) [{l.enrolled}/{l.capacity}]{full ? " – plná" : ""}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Col>
            </Row>
            <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={busy || !canSubmit}
            >
                <Icon path={busy ? mdiLoading : mdiAccountPlus} spin={busy} size={0.9} />
                {" "}Přihlásit na lekci
            </Button>
        </Form>
    );
}

export default LoginToLessonForm;
