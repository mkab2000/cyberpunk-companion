import { storedCharacterData } from "@/store/store";
import { LifePath } from "@/store/types";
import InputBox from "@/styled-components/inputBox";
import { useAtom } from "jotai";
import styled from "styled-components";

const CreateLifepath = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);

  const lifepathKeys = Object.keys(characterState.lifepath) as (keyof LifePath)[];

  return (
    <Wrapper>
      {lifepathKeys.map((key) => (
        <InputBox
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={characterState.lifepath[key] ?? ""}
          onChange={(value) =>
            setCharacterState((prev) => ({
              ...prev,
              lifepath: {
                ...prev.lifepath,
                [key]: value,
              },
            }))
          }
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

export default CreateLifepath