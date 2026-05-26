import LessonProvider from './LessonProvider';
import LessonStateResolver from './LessonStateResolver';

function Lessons() {
    return (

        <div className="container">
            <LessonProvider>
                <LessonStateResolver />
            </LessonProvider>
        </div>
    );
}

export default Lessons;