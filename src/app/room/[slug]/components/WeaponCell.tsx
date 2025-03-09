import { Weapon } from "@/store/types";
import styled from "styled-components";

interface SkillCellProps {
  weapon: Weapon;
}

const WeaponCell = ({ weapon }: SkillCellProps) => {
  
  return (
    <>
      <StyledWeaponName>
        <h2>{weapon.name}</h2>
        <p>Damage: {weapon.damage}d6</p>
        <p>Penetration: { weapon.penetration }</p>
        <p>Skill: { weapon.skillName }</p>
      </StyledWeaponName>
      <StyledWeaponDamage>
        Attack
      </StyledWeaponDamage>
    </>
  );
}

const StyledWeaponName = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    color: white;
  }

  p {
    font-size: 14px;
    color: lightgray;
  }
`;

const StyledWeaponDamage = styled.div`
  font-size: 30px;
`;

export default WeaponCell;