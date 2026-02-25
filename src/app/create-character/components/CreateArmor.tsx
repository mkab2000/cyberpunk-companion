import { storedCharacterData } from "@/store/store";
import { useAtom } from "jotai";
import { styled } from "styled-components";
import SelectBox from "@/styled-components/selectBox";
import { 
  ARMOR_PENALTY,
  ARMOR_TOTAL_OPTIONS
} from "@/store/constants";
import { Colors } from "@/utils/colors";
import { Armor } from "@/store/types";

const CreateArmor = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);

  // Use a typed key to ensure we only update valid Armor properties
  const updateArmorField = (name: keyof Armor, value: string | number) => {
    const numValue = typeof value === "string" ? parseInt(value, 10) : value;

    setCharacterState((prev) => ({
      ...prev,
      armor: {
        ...prev.armor,
        [name]: numValue,
        // Update current armor if total changes
        ...(name === "armorTotal" && { armorCurrent: numValue }),
      }
    }));
  };

  return (
    <StyledWrapper>
      <h2>Armor</h2>
      <StyledForm>
        <SelectBox
          label="Armor Total"
          value={characterState.armor.armorTotal}
          // Pass the field name and value directly
          onChange={(val) => updateArmorField("armorTotal", val)}
          options={ARMOR_TOTAL_OPTIONS}
        />

        <SelectBox
          label="Armor Penalty"
          value={characterState.armor.penalty}
          onChange={(val) => updateArmorField("penalty", val)}
          options={ARMOR_PENALTY}
        />
      </StyledForm>
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


const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: normal;
  gap: 24px;
  background-color: ${Colors.gray200};
  padding: 20px 0px;
  border-radius: 5px;
`;

export default CreateArmor;
