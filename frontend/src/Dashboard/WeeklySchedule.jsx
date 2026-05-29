import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LessonContext } from "../Lesson/LessonProvider";
import { DAYS } from "../utils/days";
import { Spinner } from "react-bootstrap";

const PIXEL_PER_MINUTE = 1.1;

function timeToMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function WeeklySchedule() {
    const { data, state } = useContext(LessonContext);
    const navigate = useNavigate();

    if (state === "loading") {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="secondary" />
            </div>
        );
    }

    if (state === "error") {
        return <div className="alert alert-danger">Nepodařilo se načíst lekce.</div>;
    }

    const lessons = data?.itemList ?? [];

    if (lessons.length === 0) {
        return <div className="text-muted py-4">Žádné lekce k zobrazení.</div>;
    }

    const allStartMinutes = lessons.map((l) => timeToMinutes(l.timeFrom));
    const allEndMinutes = lessons.map((l) => timeToMinutes(l.timeTo));
    const startHour = Math.floor(Math.min(...allStartMinutes) / 60);
    const endHour = Math.ceil(Math.max(...allEndMinutes) / 60);
    const totalMinutes = (endHour - startHour) * 60;
    const totalHeight = totalMinutes * PIXEL_PER_MINUTE;

    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const lessonsByDay = DAYS.map((d) => lessons.filter((l) => l.day === d.value));

    return (
        <div style={{ maxHeight: "calc(100vh - 200px)", overflow: "auto", paddingBottom: 8 }}>
            {/* Header row */}
            <div className="d-flex sticky-top bg-white border-bottom">
                <div style={{ width: 56, flexShrink: 0 }} />
                {DAYS.map((d) => (
                    <div key={d.value} className="flex-fill text-center fw-semibold py-2 px-1 small">
                        {d.label}
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="d-flex">
                {/* Time labels column */}
                <div className="position-relative flex-shrink-0" style={{ width: 56, height: totalHeight }}>
                    {hours.map((h, i) => (
                        <div
                            key={h}
                            className="position-absolute text-muted"
                            style={{
                                top: i * 60 * PIXEL_PER_MINUTE,
                                right: 6,
                                fontSize: "0.7rem",
                                transform: i === 0 ? "none" : i === hours.length - 1 ? "translateY(-100%)" : "translateY(-50%)",
                            }}
                        >
                            {String(h).padStart(2, "0")}:00
                        </div>
                    ))}
                </div>

                {/* Day columns */}
                {lessonsByDay.map((dayLessons, dayIndex) => (
                    <div
                        key={dayIndex}
                        className="flex-fill border-start position-relative"
                        style={{ height: totalHeight }}
                    >
                        {/* Horizontal hour lines */}
                        {hours.map((h, i) => (
                            <div
                                key={h}
                                className="position-absolute w-100 border-top"
                                style={{ top: i * 60 * PIXEL_PER_MINUTE }}
                            />
                        ))}

                        {/* Lesson cards */}
                        {dayLessons.map((lesson) => {
                            const top = (timeToMinutes(lesson.timeFrom) - startHour * 60) * PIXEL_PER_MINUTE;
                            const height = (timeToMinutes(lesson.timeTo) - timeToMinutes(lesson.timeFrom)) * PIXEL_PER_MINUTE;
                            const isFull = lesson.enrolled >= lesson.capacity;
                            const isAlmost = !isFull && lesson.enrolled / lesson.capacity > 0.5;
                            const colorClass = isFull
                                ? "bg-danger-subtle border-danger"
                                : isAlmost
                                ? "bg-warning-subtle border-warning"
                                : "bg-success-subtle border-success";

                            return (
                                <div
                                    key={lesson.id}
                                    className={`position-absolute rounded p-1 border-start border-2 ${colorClass}`}
                                    style={{
                                        top,
                                        height,
                                        left: 2,
                                        right: 2,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/lesson/detail?lessonId=${lesson.id}`)}
                                >
                                    <div className="fw-semibold text-truncate small">{lesson.title}</div>
                                    <div className="text-muted text-truncate" style={{ fontSize: "0.7rem" }}>
                                        {lesson.teacher}
                                    </div>
                                    <div style={{ fontSize: "0.7rem" }}>
                                        {lesson.enrolled}/{lesson.capacity}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WeeklySchedule;
