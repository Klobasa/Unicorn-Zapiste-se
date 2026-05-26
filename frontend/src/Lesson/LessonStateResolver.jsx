import { useContext } from 'react';
import { LessonContext } from './LessonProvider';
import LessonList from './LessonList';

const LessonStateResolver = () => {
    const { data, state, error } = useContext(LessonContext);

    if (data) {
        return <LessonList />;
    }
};

export default LessonStateResolver;