import { storedCharacterData } from "@/store/store";
import { Weapon } from "@/store/types";
import { useAtom } from "jotai";
import { useState } from "react";
import { styled } from "styled-components";

const CreateWeapons = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  const [showForm, setShowForm] = useState(false);
  const [newWeapon, setNewWeapon] = useState<Weapon>({
    name: "",
    damage: 1,
    stat: "DEX",
    skillName: "Brawling",
    penetration: "None",
    excellentQuality: false,
    rateOfFire: 1,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setNewWeapon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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
      excellentQuality: false,
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
        <StyledWeapon key={index}>
          <span>{weapon.name}: {weapon.damage}d6 damage / {weapon.skillName}</span>
          <div>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        </StyledWeapon>
      ))}

      <button onClick={() => setShowForm(true)}>Add New Weapon</button>

      {showForm && (
        <StyledForm>
          <StyledLabel>
            Weapon Name:
            <input type="text" name="name" value={newWeapon.name} onChange={handleChange} placeholder="Weapon Name" />
          </StyledLabel>

          <StyledLabel>
            Damage:
            <select name="damage" value={newWeapon.damage} onChange={handleChange}>
              {[1, 2, 3, 4, 5, 6, 8].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </StyledLabel>

          <StyledLabel>
            Stat:
            <select name="stat" value={newWeapon.stat} onChange={handleChange}>
              <option value="DEX">DEX</option>
              <option value="REF">REF</option>
            </select>
          </StyledLabel>

          <StyledLabel>
            Skill:
            <select name="skill" value={newWeapon.skillName} onChange={handleChange}>
              {["Archery", "Handgun", "Shoulder Arms", "Autofire", "Heavy Weapons", "Brawling", "Martial Arts", "Melee Weapons"].map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </StyledLabel>

          <StyledLabel>
            Armor Piercing:
            <select name="penetration" value={newWeapon.penetration} onChange={handleChange}>
              <option value="None">None</option>
              <option value="Half">Half</option>
            </select>
          </StyledLabel>

          <StyledLabel>
            Excellent Quality:
            <input type="checkbox" name="excellentQuality" checked={newWeapon.excellentQuality} onChange={handleChange} />
          </StyledLabel>

          <StyledLabel>
            Rate of Fire:
            <select name="rateOfFire" value={newWeapon.rateOfFire} onChange={handleChange}>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </StyledLabel>

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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledWeapon = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
  align-items: center;
  background-color: #ebe9e9;
  padding: 10px;
  border: 2px solid red;
  border-radius: 5px;
  
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
  gap: 8px;
  background-color: #ebe9e9;
  padding: 10px;
  border-radius: 5px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
export default CreateWeapons;
