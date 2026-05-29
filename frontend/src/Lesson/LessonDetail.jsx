import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LessonProvider from "./LessonProvider";
import LessonFormModal from "./LessonFormModal";
import LessonDeleteDialog from './LessonDeleteDialog';
import { LessonContext } from "./LessonProvider";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { getDay } from "../utils/days";
import { Icon } from "@mdi/react";
import { mdiPencilBoxOutline, mdiDeleteOutline } from "@mdi/js";
import LoginToLessonModal from '../LessonParticipant/LoginToLessonModal';
import { useToast } from "../ToastProvider";

function LessonDetailContent() {
    const { handlerMap } = useContext(LessonContext);
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();
    const lessonId = searchParams.get("lessonId");
    const navigate = useNavigate();

    const [lessonData, setLessonData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const fetchLesson = () => {
        if (!lessonId) return;
        fetch(`/lesson/get?id=${lessonId}`)
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((data) => setLessonData(data))
            .catch((err) => setError(err.message));
    };

    const handleUnregister = async (lessonId, participantId) => {
        const res = await fetch("/lesson-participant/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId, participantId }),
        });
        if (res.ok) {
            setParticipants((prev) => prev.filter((x) => x.participantId !== participantId));
            addToast("Účastník byl úspěšně odhlášen z lekce.", "success");
        } else {
            const body = await res.json().catch(() => ({}));
            addToast("Nepodařilo se odhlásit účastníka.", "danger", body.message);
        }
    };

    useEffect(() => {
        fetchLesson();
    }, [lessonId]);

    const fetchParticipants = () => {
        if (!lessonId) return;
        fetch(`/lesson-participant/list-by-lesson?lessonId=${lessonId}`)
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((data) => setParticipants(data))
            .catch(() => setParticipants([]));
    };

    useEffect(() => {
        fetchParticipants();
    }, [lessonId]);

    return (
        <>
            {showDeleteDialog && (
                <LessonDeleteDialog
                    lesson={showDeleteDialog}
                    setLesson={setShowDeleteDialog}
                    handleDelete={async () => { if (await handlerMap.delete(lessonData.id)) navigate("/lesson"); }}
                    handleDeleteWithUnregister={async () => { if (await handlerMap.delete(lessonData.id, true)) navigate("/lesson"); }}
                />
            )}
            <LessonFormModal
                lesson={showEditModal ? lessonData : null}
                onHide={() => setShowEditModal(false)}
                onSuccess={() => { setShowEditModal(false); fetchLesson(); }}
            />
            <Container>
                <Row>
                    <Col>
                        <h1>{lessonData?.title}</h1>
                        <hr />
                    </Col>
                </Row>
                <Row>
                    <Col><h5>Lektor</h5></Col>
                    <Col><h5>Čas</h5></Col>
                    <Col><h5>Kapacita</h5></Col>
                </Row>
                <Row>
                    <Col>{lessonData?.teacher}</Col>
                    <Col>{lessonData ? `${getDay(lessonData.day)?.label}, ${lessonData.timeFrom} - ${lessonData.timeTo}` : ""}</Col>
                    <Col><Badge bg={lessonData?.enrolled >= lessonData?.capacity ? "danger" : lessonData?.enrolled / lessonData?.capacity > 0.5 ? "warning" : "success"}>{lessonData?.enrolled} / {lessonData?.capacity}</Badge></Col>
                </Row>
                <Row className="mt-4">
                    <Col><h5>Popis</h5></Col>
                </Row>
                <Row>
                    <Col>
                        {lessonData?.description ?? "Žádný popis"}
                        <hr className="mt-4" />
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col><h5>Účastníci</h5></Col>
                </Row>
                <Row className="row-cols-3">
                    {participants.length > 0 ? (
                        participants.map((p) => (
                            <Col key={p.participantId}>
                                <Button size="sm" className="btn-close" title="Odhlásit z lekce"
                                    onClick={() => handleUnregister(p.lessonId, p.participantId)} />
                                {p.participant?.name} {p.participant?.surname}
                            </Col>
                        ))
                    ) : (
                        <Col key="no-participants">Žádní přihlášení účastníci</Col>
                    )}
                </Row>
                <Row className="mt-4">
                    <Col className="me-auto col-auto"><Button variant="success" onClick={() => setShowLoginModal(true)}>Přihlásit se na lekci</Button></Col>
                    <LoginToLessonModal
                        show={showLoginModal}
                        onHide={() => setShowLoginModal(false)}
                        onSuccess={() => { setShowLoginModal(false); fetchLesson(); fetchParticipants(); }}
                        defaultLessonId={lessonId}
                    />
                    <Col className="col-auto">
                        <div className="btn-group" role="group">
                            <Button variant="primary" size="sm" onClick={() => setShowEditModal(true)}><Icon path={mdiPencilBoxOutline} size={1} /></Button>
                            <Button variant="danger" size="sm" onClick={() => setShowDeleteDialog(lessonData)}><Icon path={mdiDeleteOutline} size={1} /></Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

function LessonDetail() {
    return (
        <LessonProvider>
            <LessonDetailContent />
        </LessonProvider>
    );
}

export default LessonDetail;
