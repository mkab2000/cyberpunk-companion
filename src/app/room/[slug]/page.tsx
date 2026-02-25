"use client";

import CharacterDisplay from "./components/CharacterDisplay";
import MessagesDisplay from "./components/MessagesDisplay";
import InitiativeDisplay from "./components/InitiativeDisplay";
import GmDisplay from "./components/GmDisplay";
import { StyledButton } from "@/styled-components/styledButton";

import { useSlug } from "./useSlug";
import * as S from "./slug.styles";

const GameRoom = () => {
  // 1. Destructure everything from our massive logic hook
  const {
    slug, username, setUsername, activeUsers, messages, newMessage, setNewMessage,
    showMessages, setShowMessages, isGM, sessionActive, showGmPage, setShowGmPage,
    character, loadedCharacters, importCharacterIdState, setImportCharacterIdState,
    combatOrder, attackLogs, updateUserInRoom, sendMessage, toggleSession,
    rollDice, sendRoll, rollAbility, rollAttack, onClickImportCharacter,
    nextTurn, prevTurn, addCombatant
  } = useSlug();

  // 2. Pure UI Rendering
  return (
    <S.Wrapper>
      <S.GameContainer>
        {isGM && (
          <S.Hotbar>
            <StyledButton onClick={toggleSession}>
              {sessionActive ? "End Session" : "Start Session"}
            </StyledButton>
            <StyledButton onClick={() => setShowGmPage(!showGmPage)}>
              {showGmPage ? "Player tools" : "GM tools"}
            </StyledButton>
          </S.Hotbar>
        )}

        {showGmPage ? (
          <GmDisplay
            addCombatant={addCombatant}
            sendRoll={sendRoll}
            rollDice={rollDice}
            rollAbility={rollAbility}
            rollAttack={rollAttack}
            attackLogs={attackLogs}
            sessionActive={sessionActive}
            loadedCharacters={loadedCharacters}
          />
        ) : (
          <>
            <S.Hotbar>
              <h1>Game Room: {slug}</h1>
              <div>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <StyledButton onClick={updateUserInRoom}>Set</StyledButton>
              </div>
              <h2>Session Status: {sessionActive ? "Active" : "Inactive"}</h2>

              <div>
                <S.ImportCharacterInput
                  value={importCharacterIdState}
                  onChange={(e) => setImportCharacterIdState(e.target.value)}
                />
                <StyledButton onClick={onClickImportCharacter}>Import Character</StyledButton>
              </div>
            </S.Hotbar>
            
            {character.id && (
              <CharacterDisplay
                sessionActive={sessionActive}
                character={character}
                rollAbility={rollAbility}
                rollAttack={rollAttack}
                sendRoll={sendRoll}
                rollDice={rollDice}
                addCombatant={addCombatant}
              />
            )}
          </>
        )}
      </S.GameContainer>

      <S.MessagesOrInitiativeContainer>
        <S.ToggleMessageOrInitiative>
          <S.MessageCombatToggleButton disabled={showMessages} onClick={() => setShowMessages(true)}>
            Messages
          </S.MessageCombatToggleButton>
          <S.MessageCombatToggleButton disabled={!showMessages} onClick={() => setShowMessages(false)}>
            Combat
          </S.MessageCombatToggleButton>
        </S.ToggleMessageOrInitiative>

        {!showMessages ? (
          <InitiativeDisplay
            combatOrder={combatOrder}
            isGM={isGM}
            characterId={character.id || ""}
            nextTurn={nextTurn}
            prevTurn={prevTurn}
          />
        ) : (
          <MessagesDisplay
            messages={messages}
            newMessage={newMessage}
            activeUsers={activeUsers}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
          />
        )}
      </S.MessagesOrInitiativeContainer>
    </S.Wrapper>
  );
};

export default GameRoom;