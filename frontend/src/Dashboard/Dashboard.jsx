import LessonProvider from "../Lesson/LessonProvider";
import WeeklySchedule from "./WeeklySchedule";

function Dashboard() {
    return (
        <div className="container-fluid py-3">
            <h1>Rozvrh</h1>
            <LessonProvider>
                <WeeklySchedule />
            </LessonProvider>
        </div>
    );
}

export default Dashboard;
