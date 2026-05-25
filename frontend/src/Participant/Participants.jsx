import ParticipantProvider from "./ParticipantProvider";
import ParticipantStateResolver from "./ParticipantStateResolver";

function Participants() {

  return (
    <div className="container">
          <h1>Účastníci</h1>

          <ParticipantProvider>
            <ParticipantStateResolver />
          </ParticipantProvider>
    </div>
  )
}

export default Participants