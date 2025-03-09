import { Character, Skill } from "@/store/types"
import { styled } from "styled-components";
import StatCell from "./StatCell";
import SkillCell from "./SkillCell";
import WeaponCell from "./WeaponCell";
import InitiativeRollButton from "./InitiativeRollButton";
import { RollAttackProps } from "../types";

interface CharacterDisplayProps {
  character: Character,
  rollAbility: (characterName: string, skill: Skill, statValue: number) => void,
  rollAttack: (props: RollAttackProps) => void,
  sendRoll: (text: string) => void,
  rollDice: (sides: number, amount: number) => number[],
  addCombatant: (id: string, name: string, ref: number) => void,
  sessionActive: boolean,
}

const CharacterDisplay = ({
  character,
  rollAbility,
  rollAttack,
  sendRoll,
  rollDice,
  addCombatant,
  sessionActive
}: CharacterDisplayProps) => {
  return (
    <StyledCharacterBox>
      <HpWrapper>
        <div>Character: {character.name} </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>HP Status: </div>
          <HpArmorBar>{character.hp.current} / { character.hp.total }</HpArmorBar>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>Armor Status: </div>
          <HpArmorBar style={{backgroundColor:"gray"}}>{character.armor.armorCurrent} / { character.armor.armorTotal }</HpArmorBar>
        </div>
        <InitiativeRollButton
          characterName={character.name}
          baseValue={character.stats.REF.baseValue}
          sendRoll={sendRoll}
          rollDice={rollDice}
          onRoll={(result: number) => addCombatant(character.id!, character.name, result)}
        />
      </HpWrapper>
      
      <Box>
        {Object.entries(character.stats).map(([statKey, stat]) => (
          <StatCell key={statKey} statKey={statKey} stat={stat} />
        ))}
      </Box>

      <Box>
        {character.skills.map((skill) => (
          <SkillButton disabled={!sessionActive} key={skill.name} onClick={ () => {
            rollAbility(character.name, skill, character.stats[skill.stat].baseValue)
          }}>
            <SkillCell skill={skill} stats={ character.stats} />
          </SkillButton>
        ))}
      </Box>

      <Box>
        {character.weapons.map((weapon) => (
          <WeaponButton disabled={!sessionActive} key={weapon.name} onClick={() => {
            rollAttack(
              {characterId: character.id!,
              characterName: character.name,
              weapon: weapon,
              skillValue: character.skills.find(skill => skill.name === weapon.skillName)!.baseValue,
              statValue: character.stats[weapon.stat].baseValue}
            )
          }}>
            <WeaponCell weapon={weapon} />
          </WeaponButton>
        ))}
      </Box>

    </StyledCharacterBox>
  )
}

const StyledCharacterBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;  
  color: white;
  padding: 10px;
  border-radius: 5px;
  min-width: 120px;
`;

const HpArmorBar = styled.div`
  background-color: #bd0e0e;
  width: 100px;
  height: 35px;
  font-size: 22px;
  text-align: center;
`;

const HpWrapper = styled.div`
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 10px;
  align-items: center;
  font-size: 20px;
  gap: 20px;

  > div {
    display: flex;
    flex-direction: column;
  }
`;

const SkillButton = styled.button`
  background: #222;
  box-sizing: border-box;
  min-width: 33.3%;
  max-width: 50%;
  border: 1px solid #bd0e0e;
  font-size: 12px;
  padding: 6px 0 10px 0;
  height: 90px;
  font-size: 16px;
  flex-grow: 1;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0 32px 0 16px;

  cursor: pointer;

  &:disabled {
    opacity: 0.6; 
    cursor: not-allowed;
  }
`;

const WeaponButton = styled.button`
  background: #222;
  min-width: 33.3%;
  max-width: 50%;
  border: 1px solid #bd0e0e;
  font-size: 12px;
  padding: 6px 0 10px 0;
  height: 100px;
  font-size: 16px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0 32px 0 16px;
  gap: 2px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6; 
    cursor: not-allowed;
  }
`;

export default CharacterDisplay;