import { useContext } from "react";
import { ParticipantContext } from "./ParticipantProvider";
import ParticipantForm from "./ParticipantForm";

function ParticipantList() {
    const { data, state, handlerMap } = useContext(ParticipantContext);

    return (
        <div>
            <div>
                <ParticipantForm />
            </div>
            <div>
            {data.itemList.length > 0 ? (
                data.itemList.map((participant) => (
                    <ParticipantForm key={participant.id} participantData={participant} />
                ))
            ) : (
                <p>Není žádný účastník.</p>
            )}
            </div>
        </div>
    );
}

export default ParticipantList;