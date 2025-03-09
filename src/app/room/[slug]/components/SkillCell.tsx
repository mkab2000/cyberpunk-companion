import { Skill, Stat } from "@/store/types";
import styled from "styled-components";

interface SkillCellProps {
  skill: Skill;
  stats: Record<string, Stat>;
}

const SkillCell = ({ skill, stats }: SkillCellProps) => {
  return (
    <>
      <StyledSkillName>
        <h2>{skill.name}</h2>
        <p>LEVEL {skill.baseValue} | { skill.stat }</p>
      </StyledSkillName>
      <StyledStatValue>
        {skill.baseValue + (skill.modifier || 0) + stats[skill.stat].baseValue}
      </StyledStatValue>
    </>
  );
}

const StyledSkillName = styled.div`
  display: flex;
  flex-direction: column;

  * {
    text-align: left;
  }
  h2 {
    color: white;
  }

  p {
    font-size: 14px;
    color: lightgray;
  }
`;

const StyledStatValue = styled.div`
  font-size: 30px;
`;

export default SkillCell;