import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonContext } from './LessonProvider';
import LessonFormModal from './LessonFormModal';
import { getDay } from "../utils/days";
import { Badge, Button, Row, Col } from "react-bootstrap";
import { Icon } from "@mdi/react";
import { mdiInformationBoxOutline, mdiPencilBoxOutline, mdiDeleteOutline, mdiPlus } from "@mdi/js";
import LessonDeleteDialog from './LessonDeleteDialog';

function LessonList() {
    const { data, state, handlerMap } = useContext(LessonContext);
    const navigate = useNavigate();
    const [editLesson, setEditLesson] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = async () => {
        if (await handlerMap.delete(showDeleteDialog.id)) setShowDeleteDialog(false);
    };

    const handleDeleteWithUnregister = async () => {
        if (await handlerMap.delete(showDeleteDialog.id, true)) setShowDeleteDialog(false);
    };

    return (
        <>
        {showDeleteDialog && (
            <LessonDeleteDialog
                lesson={showDeleteDialog}
                setLesson={setShowDeleteDialog}
                handleDelete={handleDelete}
                handleDeleteWithUnregister={handleDeleteWithUnregister}
            />
        )}

        <Row>
            <Col className="me-auto col-auto"><h1>Lekce</h1></Col>
            <Col className="col-auto"><Button variant="success" onClick={() => setEditLesson({})}><Icon path={mdiPlus} size={0.9} /> Založit novou lekci</Button></Col>
        </Row>

        <LessonFormModal lesson={editLesson} onHide={() => setEditLesson(null)} />
        <div>
            <table className="table table-striped table-hover align-middle">
                <thead>
                    <tr>
                        <th>Název</th>
                        <th>Čas</th>
                        <th>Vyučující</th>
                        <th>Obsazenost</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    {data.itemList.length > 0 ? (
                        data.itemList.map((lesson) => (
                            <tr key={lesson.id}>
                                <td>{lesson.title}</td>
                                <td>{getDay(lesson.day)?.short} {lesson.timeFrom}-{lesson.timeTo}</td>
                                <td>{lesson.teacher}</td>
                                <td>
                                    <Badge bg={lesson.enrolled >= lesson.capacity ? "danger" : lesson.enrolled / lesson.capacity > 0.5 ? "warning" : "success"}>{lesson.enrolled} / {lesson.capacity}</Badge>
                                </td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <Button variant="success" size="sm" onClick={() => navigate(`/lesson/detail?lessonId=${lesson.id}`)}><Icon path={mdiInformationBoxOutline} size={1} /></Button>
                                        <Button variant="primary" size="sm" onClick={() => setEditLesson(lesson)}><Icon path={mdiPencilBoxOutline} size={1} /></Button>
                                        <Button variant="danger" size="sm" onClick={() => setShowDeleteDialog(lesson)}><Icon path={mdiDeleteOutline} size={1} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Žádné lekce k zobrazení</td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
        </>
    );
}

export default LessonList;