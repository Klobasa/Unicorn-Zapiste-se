import { createContext, useState, useEffect } from "react";

export const LessonContext = createContext();

const LessonProvider = ({ children }) => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [state, setState] = useState();

    const fetchLessons = async () => {
        setState("loading");
        const response = await fetch("/lesson/list");
        if (response.ok) {
            const itemList = await response.json();
            setData({ itemList });
            setState("success");
        } else {
            setError(response.statusText);
            setState("error");
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);


    const handleCreate = async (lesson) => {
        setState("creating");
        const response = await fetch("/lesson/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(lesson)
        });

        if (response.ok) {
            const newLesson = await response.json();
            setData((currentData) => ({ ...currentData, itemList: [...currentData.itemList, newLesson] }));
            setState("success");
            return true;
        } else {
            setError(response.statusText);
            setState("errorCreating");
            return false;
        }
    };

    const handleUpdate = async (lesson) => {
        setState("updating_" + lesson.id);
        const response = await fetch("/lesson/update", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(lesson)
        });

        if (response.ok) {
            const updatedLesson = await response.json();
            setData((currentData) => ({ ...currentData, itemList: currentData.itemList.map((item) =>
                item.id === updatedLesson.id ? updatedLesson : item) }));
            setState("success");
            return true;
        } else {
            setError(response.statusText);
            setState("errorUpdating");
            return false;
        }
    };

    const handleDelete = async (id, unregister = false) => {
        setState("deleting_" + id);
        const response = await fetch("/lesson/delete", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id, unregister }),
        });

        if (response.ok) {
            setData((currentData) => ({ ...currentData, itemList: currentData.itemList.filter((item) => item.id !== id) }));
            setState("success");
            return true;
        } else {
            setError(response.statusText);
            setState("errorDeleting");
            return false;
        }
    };

    return (
        <LessonContext.Provider value={{ 
            data, error, state, 
            handlerMap: { add: handleCreate, update: handleUpdate, delete: handleDelete }
        }}>
            {children}
        </LessonContext.Provider>
    );
};

export default LessonProvider;