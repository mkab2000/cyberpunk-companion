import { storedCharacterData } from "@/store/store";
import { useAtom } from "jotai";

const CreateName = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  return (
    <>
      <input
        type="text"
        value={characterState.name}
        onChange={(e) => setCharacterState((prev) => ({
          ...prev,
          name: e.target.value
        }))}
        placeholder="Enter name"
      />
    </>
  );
};

export default CreateName