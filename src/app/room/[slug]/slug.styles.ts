import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #21252d;
`;

export const GameContainer = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

export const Hotbar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #1f1f1f;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 46px;
  padding: 0 12px;
`;

export const ImportCharacterInput = styled.input`
  background: white;
  color: black;
  margin-right: 12px;
`;

export const ToggleMessageOrInitiative = styled.div`
  width: 100%;
  background-color: #1f1f1f;
  border-bottom: 2px solid #3e3e3f;
  border-left: 2px solid #3e3e3f;
  line-height: 44px;
  font-size: 18px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const MessagesOrInitiativeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MessageCombatToggleButton = styled.button`
  flex-grow: 1;
  background-color: #21252d;
  &:disabled {
    filter: brightness(0.57);
  }
`;