import { Character, Skill } from "@/store/types";
import React, { useState } from "react";
import styled from "styled-components";
import InitiativeRollButton from "./InitiativeRollButton";
import CharacterDisplay from "./CharacterDisplay";
import { supabase } from "@/lib/supabase";
import { StyledButton } from "@/styled-components/styledButton";
import { RollAttackProps } from "../types";

interface GmDisplayProps {
  addCombatant: (id: string, name: string, ref: number) => void;
  sendRoll: (text: string) => void,
  rollDice: (sides: number, amount: number) => number[],
  rollAbility: (
    characterName: string,
    skill: Skill,
    statValue: number
  ) => void,
  rollAttack: (props: RollAttackProps) => void,
  attackLogs: {
    id: string,
    slug: string,
    characterId: string,
    characterName: string,
    damage: number,
    createdAt: string,
    penetration: string,
  }[],
  sessionActive: boolean,
  loadedCharacters: Character[];
}

const GmDisplay = ({
  addCombatant,
  rollDice,
  sendRoll,
  rollAbility,
  rollAttack,
  attackLogs,
  sessionActive,
  loadedCharacters
}: GmDisplayProps) =>
{
  const [initiativeModifiersState, setInitiativeModifiersState] = useState<number[]>(Array(loadedCharacters.length).fill(0));
  const [characterToDisplay, setCharacterToDisplay] = useState("");

  const handleInitiativeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (/^\d*$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      
      setInitiativeModifiersState((prev) => {
        const newModifiers = [...prev];
        newModifiers[index] = numValue;
        return newModifiers;
      });
    }
  };

  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const handleApplyDamage = async (characterId: string, damage: number, penetration: string) => {
    if (!characterId) return;

    const character = loadedCharacters.find((char) => char.id === characterId);
    if (!character) return;

    let armorCurrent = character.armor.armorCurrent;
    let effectiveDamage = damage;

    if (penetration === "None") {
        if (damage <= armorCurrent) {
            return; 
        }
        effectiveDamage -= armorCurrent;
        armorCurrent = Math.max(0, armorCurrent - 1); 
    } 
    else if (penetration === "Half") {
        const halfArmor = Math.floor((armorCurrent + 1) / 2);
        if (damage <= halfArmor) {
            return; 
        }
        effectiveDamage -= halfArmor;
        armorCurrent = Math.max(0, armorCurrent - 1); 
    }

    const newHp = Math.max(0, character.hp.current - effectiveDamage);

    const { error } = await supabase
      .from("characters")
      .update({ 
        hp: { ...character.hp, current: newHp }, 
        armor: { ...character.armor, armorCurrent: armorCurrent }
      })
      .eq("id", characterId);

    if (error) {
      console.error("Failed to update HP and Armor:", error);
    } 
  };

  return (
    <StyledGmBox>
      <select style={{color:"black", backgroundColor:"white", height: 20}} value={selectedCharacterId} onChange={(e) => setSelectedCharacterId(e.target.value)}>
        <option value="">Select Target</option>
        {loadedCharacters.map((char) => (
          <option key={char.id} value={char.id}>
            {char.name}
          </option>
        ))}
      </select>

      <AttackLogsBox>
        <AttackLogsRow>
          <div>Attacker</div>
          <div>Damage</div>
          <div>Penetration</div>
          <div>Apply Damages</div>
        </AttackLogsRow>
        {attackLogs.slice().reverse().map((log) => (
          <AttackLogsRow key={log.id}>
            <div>
              {log.characterName}
            </div>
            <div>
              {log.damage}
            </div>
            <div>
              {log.penetration}
            </div>
            <StyledButton onClick={() => handleApplyDamage(selectedCharacterId, log.damage, log.penetration)}>
              Apply to Target
            </StyledButton>
          </AttackLogsRow>
        ))}
      </AttackLogsBox>
      <CharacterMenu>
      {loadedCharacters.map((character, index) => (
        <div key={`gm+${character.id}`}>
          <CharacterRow>
            <div>
              {character.name}
            </div>
            <input value={initiativeModifiersState[index]} onChange={(e) => handleInitiativeChange(index, e)} />
            
            <StyledButton
              onClick={() =>
                addCombatant(character.id!, character.name, initiativeModifiersState[index])
              }
            >
              Set Initiative
            </StyledButton>
            
            <InitiativeRollButton
              characterName={character.name}
              baseValue={character.stats.REF.baseValue}
              sendRoll={sendRoll}
              rollDice={rollDice}
              onRoll={(result: number) => addCombatant(character.id!, character.name, result)}
            />

            <StyledButton onClick={() =>
            (character.id === characterToDisplay
              ? setCharacterToDisplay("")
              : setCharacterToDisplay(character.id!))}
            >Display Character
            </StyledButton>
          </CharacterRow>

          {character.id === characterToDisplay && (
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
        </div>
      ))}
      </CharacterMenu>
    </StyledGmBox>
  );
};

const StyledGmBox = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

`;

const CharacterMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  
  color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 120px;
`;

const CharacterRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;


`;

const AttackLogsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 300px;
  overflow: scroll;
  border: 2px solid #942121;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

const AttackLogsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  & > div, & > button {
    flex: 1;  
  }
`
export default GmDisplay;
