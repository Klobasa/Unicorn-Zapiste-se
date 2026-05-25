import { useContext } from "react";
import { ParticipantContext } from "./ParticipantProvider";
import ParticipantList from "./ParticipantList";

const ParticipantStateResolver = () => {
    const { data, state, error } = useContext(ParticipantContext);

    if (data) {
        return <ParticipantList />;
    }

};

export default ParticipantStateResolver;