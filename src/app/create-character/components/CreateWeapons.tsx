import { storedCharacterData } from "@/store/store";
import { Weapon } from "@/store/types";
import { useAtom } from "jotai";
import { useState } from "react";
import { styled } from "styled-components";
import { Colors } from '@/utils/colors';
import SelectBox from "@/styled-components/selectBox";
import InputBox from "@/styled-components/inputBox";
import { 
  WEAPON_DAMAGE_OPTIONS, 
  WEAPON_STAT_OPTIONS, 
  WEAPON_PENETRATION_OPTIONS,
  WEAPON_QUALITY_OPTIONS,
  WEAPON_SKILL_OPTIONS,
  WEAPON_FIRERATE_OPTIONS 
} from "@/store/constants";


const CreateWeapons = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  const [showForm, setShowForm] = useState(false);
  const [newWeapon, setNewWeapon] = useState<Weapon>({
    name: "",
    damage: 1,
    stat: "DEX",
    skillName: "Brawling",
    penetration: "None",
    quality: "Standard",
    rateOfFire: 1,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateWeaponField = <K extends keyof Weapon>(name: K, value: string | number | boolean) => {
    // Automatically parse numeric fields 
    const parsedValue = (name === "damage" || name === "rateOfFire") && typeof value === "string" 
      ? parseInt(value, 10) 
      : value;
  
    setNewWeapon((prev) => ({
      ...prev,
      [name]: parsedValue as Weapon[K],
    }));
  };
  
  const handleSubmit = () => {
    if (editingIndex !== null) {
      const updatedWeapons = [...characterState.weapons];
      updatedWeapons[editingIndex] = newWeapon;
      if (!newWeapon.name.trim()) return;

      setCharacterState({ ...characterState, weapons: updatedWeapons });
      setEditingIndex(null);
    } else {
      if (!newWeapon.name.trim()) return;

      setCharacterState({ ...characterState, weapons: [...characterState.weapons, newWeapon] });
    }

    resetForm();
  };

  const resetForm = () => {
    setNewWeapon({
      name: "",
      damage: 1,
      stat: "DEX",
      skillName: "Brawling",
      penetration: "None",
      quality: "Standard",
      rateOfFire: 1,
    });
    setShowForm(false);
  };

  const handleEdit = (index: number) => {
    setNewWeapon(characterState.weapons[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you certain you want to delete this weapon?")) {
      const updatedWeapons = characterState.weapons.filter((_, i) => i !== index);
      setCharacterState({ ...characterState, weapons: updatedWeapons });
    }
  };

  return (
    <StyledWrapper>
      <h2>Weapons</h2>

      {characterState.weapons.map((weapon, index) => (
        <StyledWeapon key={index} isEditing={editingIndex === index}>
          <span>{weapon.name}: {weapon.damage}d6 damage / {weapon.skillName}</span>
          <div>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        </StyledWeapon>
      ))}

      <button onClick={() => setShowForm(true)}>{editingIndex !== null ? "Editing Weapon" : "Add New Weapon"}</button>

      {showForm && (
        <StyledForm>

        <InputBox
          label={"Weapon Name"}
          value={newWeapon.name ?? ""}
          onChange={(value) => updateWeaponField("name", value)}
        />

        <SelectBox
          label={"Damage"}
          value={newWeapon.damage}
          onChange={(value) => updateWeaponField("damage", value)}
          options={WEAPON_DAMAGE_OPTIONS}
        />

        <SelectBox
          label={"Stat"}
          value={newWeapon.stat}
          onChange={(value) => updateWeaponField("stat", value)}
          options={WEAPON_STAT_OPTIONS}
        />

        <SelectBox
          label={"Skill"}
          value={newWeapon.skillName}
          onChange={(value) => updateWeaponField("skillName", value)}
          options={WEAPON_SKILL_OPTIONS}
        />

        <SelectBox
          label={"Penetration"}
          value={newWeapon.penetration}
          onChange={(value) => updateWeaponField("penetration", value)}
          options={WEAPON_PENETRATION_OPTIONS}
        />

        <SelectBox
          label={"Quality"}
          value={newWeapon.quality}
          onChange={(value) => updateWeaponField("quality", value)}
          options={WEAPON_QUALITY_OPTIONS}
        />

        <SelectBox
          label={"Rate of Fire"}
          value={newWeapon.rateOfFire}
          onChange={(value) => updateWeaponField("rateOfFire", value)}
          options={WEAPON_FIRERATE_OPTIONS}
        />

          <StyledSubmitButtons>
            <button onClick={handleSubmit}>{editingIndex !== null ? "Update Weapon" : "Add Weapon"}</button>
            <button onClick={resetForm}>Cancel</button>
          </StyledSubmitButtons>
        </StyledForm>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${Colors.gray200};
  padding: 8px;
`;

const StyledWeapon = styled.div<{ isEditing?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
  background-color: ${Colors.gray100};
  padding: 10px;
  border: 2px solid ${props => props.isEditing ? Colors.primary : "white"};
  border-radius: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    border: 2px solid ${Colors.primary};
  }

  div {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;

const StyledSubmitButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: normal;
  gap: 24px;
  background-color: ${Colors.gray200};
  padding: 20px 0px;
  border-radius: 5px;
`;

// const StyledLabel = styled.label`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   gap: 300px;
//   min-height: 30px;
// `;

// const StyledSelect = styled.select`
//   background-color: ${Colors.gray200};
//   padding: 8px;
//   min-width: 220px;
// `;

export default CreateWeapons;
