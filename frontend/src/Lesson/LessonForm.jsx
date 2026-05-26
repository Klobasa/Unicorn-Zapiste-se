import { useState, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Icon } from "@mdi/react";
import { mdiPlus, mdiLoading, mdiCheckBold } from "@mdi/js";
import { LessonContext } from "./LessonProvider";
import { DAYS } from "../utils/days";

function LessonForm({ lessonData, onSuccess }) {
    const { state, handlerMap } = useContext(LessonContext);

    const [title, setTitle]           = useState(lessonData?.title       ?? "");
    const [description, setDescription] = useState(lessonData?.description ?? "");
    const [teacher, setTeacher]       = useState(lessonData?.teacher     ?? "");
    const [day, setDay]               = useState(lessonData?.day         ?? 0);
    const [timeFrom, setTimeFrom]     = useState(lessonData?.timeFrom    ?? "");
    const [timeTo, setTimeTo]         = useState(lessonData?.timeTo      ?? "");
    const [capacity, setCapacity]     = useState(lessonData?.capacity    ?? "");

    const isCreating  = state === "creating";
    const isUpdating  = state === `updating_${lessonData?.id}`;
    const isBusy      = isCreating || isUpdating;

    const isEditMode  = !!lessonData?.id;

    const currentValues = { title, description, teacher, day: Number(day), timeFrom, timeTo, capacity: Number(capacity) };

    const isUnchanged = isEditMode && (
        title       === lessonData.title &&
        description === (lessonData.description ?? "") &&
        teacher     === lessonData.teacher &&
        Number(day) === lessonData.day &&
        timeFrom    === lessonData.timeFrom &&
        timeTo      === lessonData.timeTo &&
        Number(capacity) === lessonData.capacity
    );

    const handleSubmit = async () => {
        const ok = isEditMode
            ? await handlerMap.update({ id: lessonData.id, ...currentValues })
            : await handlerMap.add(currentValues);
        if (ok) onSuccess?.();
    };

    return (
        <Form>
            <Row className="g-3 align-items-center mb-1">
                <Col xs={4}>
                    <Form.Label className="mt-1">Název lekce</Form.Label>
                </Col>
                <Col auto>
                    <Form.Control
                        placeholder="Název lekce"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
            </Row>
            <Row className="g-3 align-items-center mb-1">
                <Col xs={4}>
                    <Form.Label className="mt-1">Vyučující</Form.Label>
                </Col>
                <Col auto>
                    <Form.Control
                        placeholder="Vyučující"
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
            </Row>
            <Row className="g-3 align-items-center mb-1">
                <Col xs={4}>
                    <Form.Label className="mt-1">Kapacita</Form.Label>
                </Col>
                <Col auto>
                    <Form.Control
                        type="number"
                        placeholder="Kapacita"
                        min={1}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
            </Row>

            <Row className="g-3 align-items-center mb-1">
                <Col auto>
                    <Form.Label className="mt-1">Den</Form.Label>
                    <Form.Select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        disabled={isBusy}
                    >
                        {DAYS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col auto>
                    <Form.Label className="mt-1">Od</Form.Label>
                    <Form.Control
                        type="time"
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
                <Col auto>
                    <Form.Label className="mt-1">Do</Form.Label> 
                    <Form.Control
                        type="time"
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
            </Row>
            <Row className="g-3 align-items-center mb-1">
                <Col auto>
                    <Form.Control as="textarea" rows={5}
                        placeholder="Popis (volitelný)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isBusy}
                    />
                </Col>
            </Row>

            <Button
                variant={isEditMode ? "primary" : "success"}
                onClick={handleSubmit}
                disabled={isBusy || isUnchanged}
            >
                <Icon path={isBusy ? mdiLoading : isEditMode ? mdiCheckBold : mdiPlus} spin={isBusy} size={0.9} />
                {" "}
                {isEditMode ? "Uložit změny" : "Přidat lekci"}
            </Button>
        </Form>
    );
}

export default LessonForm;
