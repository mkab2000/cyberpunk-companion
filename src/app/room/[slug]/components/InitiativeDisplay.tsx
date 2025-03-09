import { StyledButton } from "@/styled-components/styledButton";
import { styled } from "styled-components";

interface MessagesDisplayProps {
  combatOrder: { name: string; initiative: number; id: string }[]
  isGM: boolean;
  characterId: string;
  nextTurn: () => void;
  prevTurn: () => void;
}

const InitiativeDisplay = ({
  combatOrder,
  isGM,
  characterId,
  nextTurn,
  prevTurn
}: MessagesDisplayProps) => {
  return (
    <StyledInitiativeContainer>
      {isGM && (
        <>
          <button onClick={prevTurn}>Previous Turn</button>
          <button onClick={nextTurn}>Next Turn</button>
        </>
      )}
      {!isGM && combatOrder.length > 1 && (
        <StyledButton disabled={combatOrder[0].id === characterId} onClick={nextTurn}>End my turn</StyledButton>
      )}
      <ul style={{paddingLeft: "14px"}}>
        {combatOrder.map((character) => (
          <li style={{fontSize: "20px"}} key={`initiative+${character.id}`}>
            {character.name} - {character.initiative}
          </li>
        ))}
      </ul>
      
    </StyledInitiativeContainer>
  );
};

const StyledInitiativeContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 362px;
  background-color: #1f1f1f;
  color: white;
`;

export default InitiativeDisplay;