import { createContext, useState, useEffect } from "react";
import { useToast } from "../ToastProvider";

export const ParticipantContext = createContext();

const ParticipantProvider = ({ children }) => {
    const { addToast } = useToast();
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [state, setState] = useState();

    const fetchParticipants = async () => {
        setState("loading");
        const response = await fetch("/participant/list");
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
        fetchParticipants();
    }, []);


    const handleCreate = async (participant) => {
        setState("creating");
        const response = await fetch("/participant/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: participant.name, surname: participant.surname, email: participant.email}),
        });

        if (response.ok) {
            const newParticipant = await response.json();
            setData((currentData) => ({...currentData,itemList: [...currentData.itemList, newParticipant]}));
            setState("success");
            addToast("Účastník byl úspěšně přidán.", "success");
        } else {
            const body = await response.json().catch(() => ({}));
            setError(body.message ?? response.statusText);
            setState("errorCreating");
            addToast("Nepodařilo se přidat účastníka.", "danger", body.message);
        }
    };

    const handleUpdate = async (participant) => {
        setState("updating_" + participant.id);
        const response = await fetch("/participant/update", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: participant.id, name: participant.name, surname: participant.surname, email: participant.email}),
        });

        if (response.ok) {
            const newParticipant = await response.json();
            setData((currentData) => {
                const updatedList = currentData.itemList.map((item) =>
                    item.id === participant.id ? newParticipant : item
                );
                return { ...currentData, itemList: updatedList };
            });
            setState("success");
            addToast("Účastník byl úspěšně upraven.", "success");
        } else {
            const body = await response.json().catch(() => ({}));
            setError(body.message ?? response.statusText);
            setState("errorUpdating");
            addToast("Nepodařilo se upravit účastníka.", "danger", body.message);
        }
    };

    const handleDelete = async (id, unregister = false) => {
        setState("deleting_" + id);
        const response = await fetch("/participant/delete", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id, ...(unregister && { unregister: true }) }),
        });

        if (response.ok) {
            setData((currentData) => {
                const updatedList = currentData.itemList.filter((item) => item.id !== id);
                return { ...currentData, itemList: updatedList };
            });
            setState("success");
            addToast("Účastník byl úspěšně smazán.", "success");
        } else {
            const body = await response.json().catch(() => ({}));
            setError(body.message ?? response.statusText);
            setState("errorDeleting");
            addToast("Nepodařilo se smazat účastníka.", "danger", body.message);
        }
    };

    return (
        <ParticipantContext.Provider 
            value={{
                data, error, state, 
                handlerMap: { add: handleCreate, update: handleUpdate, delete: handleDelete }
            }}>
            {children}
        </ParticipantContext.Provider>
    );

};

export default ParticipantProvider;