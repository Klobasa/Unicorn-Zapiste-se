import { Form, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { ParticipantContext } from "./ParticipantProvider";
import { Icon } from "@mdi/react";
import { mdiPlus, mdiLoading, mdiCheckBold, mdiDeleteOutline } from "@mdi/js";
import ParticipantDeleteDialog from "./ParticipantDeleteDialog";



function ParticipantForm({participantData}) {
    const { state, handlerMap } = useContext(ParticipantContext);
    const [name, setName] = useState(participantData ? participantData.name : "");
    const [surname, setSurname] = useState(participantData ? participantData.surname : "");
    const [email, setEmail] = useState(participantData ? participantData.email : "");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handlerCreate = async () => {
        await handlerMap.add({ name, surname, email });
        setName("");
        setSurname("");
        setEmail("");
    };

    const handlerUpdate = async () => {
        await handlerMap.update(participantData.id, { name, surname, email });
    };

  const isUpdating = state === `updating_${participantData?.id}`;
  const isDeleting = state === `deleting_${participantData?.id}`;

  return (
    <>
    {showDeleteDialog && (
        <ParticipantDeleteDialog
            participant={showDeleteDialog}
            setParticipant={setShowDeleteDialog}
            handleDelete={() => handlerMap.delete(participantData.id)}
            handleDeleteWithUnregister={() => handlerMap.delete(participantData.id, true)}
        />
    )}

    <div className="row g-2 align-items-center">
        <div className="col-3">
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jméno" 
                disabled={state === "creating" || isUpdating || isDeleting}
            />
        </div>
        <div className="col-3">
            <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Příjmení" 
                disabled={state === "creating" || isUpdating || isDeleting}
            />
        </div>
        <div className="col-4">
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" 
                disabled={state === "creating" || isUpdating || isDeleting}
            />
        </div>
        <div className="col-2">
            <div className="btn-group" role="group">
                {!participantData?.id ? (
                <Button variant="success" size="sm" onClick={() => handlerMap.add({ name, surname, email })}
                    disabled={state === "creating" || !name || !email}>
                    <Icon path={state === "creating" ? mdiLoading : mdiPlus} spin={state === "creating"} size={1} />
                </Button>
                ) : (
                <Button variant="primary" size="sm" onClick={() => handlerMap.update({ id: participantData.id, name, surname, email })} 
                    disabled={isUpdating || (participantData.name === name && participantData.surname === surname && participantData.email === email)}>
                    <Icon path={isUpdating ? mdiLoading : mdiCheckBold} spin={isUpdating} size={1} />
                </Button>
                )}

                {participantData?.id && (
                <Button variant="danger" size="sm" onClick={() => setShowDeleteDialog(participantData)}>
                    <Icon path={isDeleting ? mdiLoading : mdiDeleteOutline} spin={isDeleting} size={1} />
                </Button>
                )}
            </div>
        </div>
    </div>
    </>
  );
}

export default ParticipantForm;