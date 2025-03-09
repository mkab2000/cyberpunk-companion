import { baselineSkills } from "@/store/constants";
import { storedCharacterData } from "@/store/store";
import { useAtom } from "jotai";
import { styled } from "styled-components";
import IncrementButton from "./IncrementButton";

const CreateStats = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  const totalSkillsRemaining = 12 - Object.values(characterState.skills).reduce((sum, skill) => sum + skill.baseValue * skill.price, 0);

  const updateSkill = (index: number, value: number) => {
    const skill = baselineSkills[index]; 
    if (!skill) return;

    const newTotalRemaining =
      totalSkillsRemaining - (value - characterState.skills[index].baseValue) * characterState.skills[index].price;
    
    if (newTotalRemaining >= 0) {
      setCharacterState((prev) =>({
        ...prev,
        skills: prev.skills.map((s, i) =>
          i === index ? { ...s, baseValue: Math.max(0, Math.min(6, value)) } : s
        )})
      );
    }
  };

  return (
    <>
      <StyledTotalStatWrapper>
        Total skill points remaining: {totalSkillsRemaining}
      </StyledTotalStatWrapper>

      {baselineSkills.map((mySkill, index) => (
        <StyledStatRow key={mySkill.name} >
          <StyledSkill>
            <p>{mySkill.name} {mySkill.price == 1 ? "" : "(2x)"}</p>
            <p>{ characterState.stats[mySkill.stat].name}</p>
          </StyledSkill>
           
          <IncrementSkill
            index={index}
            skillValue={characterState.skills[index]?.baseValue}
            skillPrice={characterState.skills[index].price}
            updateSkill={updateSkill}
            totalSkillsRemaining={totalSkillsRemaining}
          />
        </StyledStatRow>
      ))}
    </>
  )
}

interface IncrementStatProps {
  index: number;
  skillValue: number;
  skillPrice: number;
  updateSkill: (index: number, value: number) => void;
  totalSkillsRemaining: number;
}

const IncrementSkill = ({ index, skillValue, skillPrice, updateSkill, totalSkillsRemaining }: IncrementStatProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (/^\d*$/.test(value)) {
      let numValue = parseInt(value, 10);
      
      if (!isNaN(numValue)) {
        if (numValue < 0) numValue = 0;
        if (numValue > 6) numValue = 6;
        updateSkill(index, numValue);
      }
    }
  };

  return (
    <StyledStatIncrement>
      <IncrementButton disabled={skillValue <= 0} text={"-"} onClick={() => { if (skillValue > 0) updateSkill(index, skillValue - 1)}} />
      <StyledStatWindow value={skillValue} onChange={handleChange} />
      <IncrementButton disabled={skillValue >= 6 || (skillPrice > 1 ? totalSkillsRemaining <= 1 : totalSkillsRemaining <= 0)} text={"+"} onClick={() => { if (skillValue < 6) updateSkill(index, skillValue + 1)}} />
    </StyledStatIncrement>
  )
}

const StyledStatRow = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  user-select: none;

`;

const StyledStatIncrement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StyledStatWindow = styled.input`
  box-sizing: border-box;
  resize: none;
  width: 40px;
  height: 40px;
  text-align: center;
`;

const StyledTotalStatWrapper = styled.div`
  
`;

const StyledSkill = styled.div`
  display: flex;
  flex-direction: row;

  p {
    width: 200px;
  }
`
export default CreateStats;