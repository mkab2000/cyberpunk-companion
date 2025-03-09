import { storedCharacterData } from "@/store/store";
import { useAtom } from "jotai";
import { styled } from "styled-components";

const CreateArmor = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10); 
  
    setCharacterState((prev) => ({
      ...prev,
      armor: {
        ...prev.armor,
        [name]: numValue,
      ...(name === "armorTotal" && { armorCurrent: numValue }),
      } 
    }));
  };

  return (
    <StyledWrapper>
      <h2>Armor</h2>

      <StyledForm>

        <StyledLabel>
          Armor rating:
          <select name="armorTotal" value={characterState.armor.armorTotal} onChange={handleChange}>
            {[7, 9, 11, 12, 13, 15, 18].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </StyledLabel>

        <StyledLabel>
          DEX / REF penalty:
          <select name="penalty" value={characterState.armor.penalty} onChange={handleChange}>
            {[0, 2, 4].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </StyledLabel>
      </StyledForm>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
export default CreateArmor;
