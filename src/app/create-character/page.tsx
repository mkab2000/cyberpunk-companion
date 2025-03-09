'use client';

import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { storedCharacterData, storedCharacterId } from '@/store/store';
import { Character } from '@/store/types';
import CreateStats from './components/CreateStats';
import CreateName from './components/CreateName';
import { supabase } from '@/lib/supabase';
import { useAtom, useSetAtom } from 'jotai';
import CreateSkills from './components/CreateSkills';
import CreateWeapons from './components/CreateWeapons';
import { RESET } from 'jotai/utils';
import CompletionModal from './components/CompletionModl';
import { useRouter } from 'next/navigation';
import CreateArmor from './components/CreateArmor';

type StepType = 1 | 2 | 3 | 4 | 5;
const TOTAL_STEP = 5;

const saveCharacter = async (character: Character) => {
  const { data, error } = await supabase.from('characters').insert([character]).select('id');
  
  if (error) {
    console.error(error);
    return null;
  }
  return data[0]?.id;
};

const CharacterCreate = () => {
  const [characterState] = useAtom(storedCharacterData);
  const [characterIdState, setCharacterIdState] = useAtom(storedCharacterId);

  const router = useRouter(); 
  const resetCharacter = useSetAtom(storedCharacterData)
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<StepType>(1);

  const StepComponent = useMemo(() => {
    const StepMap: Record<StepType, () => JSX.Element> = {
      1: CreateName,
      2: CreateStats,
      3: CreateSkills,
      4: CreateWeapons,
      5: CreateArmor
    };
    return StepMap[step];
  }, [step]);

  const isFinalStep = step === TOTAL_STEP;

  const resetPage = useCallback(() => {
    resetCharacter(RESET);
    setStep(1);
  }, [resetCharacter]);

  const onClickSubmit = async () => {
    const characterId = await saveCharacter(characterState);
    if (characterId) setCharacterIdState(characterId);
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(false);
    router.push('/');
  };

  useEffect(() => resetPage, [resetPage]);

  return (
    <StyledWrapper>
      <TopBanner>
        {["Bio", "Stats", "Skills", "Weapons", "Armor"].map((label, index) => (
          <button key={index} onClick={() => setStep((index + 1) as StepType)}>
            {label}
          </button>
        ))}
      </TopBanner>

      <StepContainer>
        <StepComponent />
      </StepContainer>
      
      <CompletionModal showModal={showModal} characterId={characterIdState} onClose={toggleModal} />
      
      <BottomBanner>
        <button disabled={!isFinalStep} onClick={onClickSubmit}>Submit Character</button>
      </BottomBanner>
    </StyledWrapper>
  );
};

const StyledBanner = styled.div`
  background-color: red;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  position: fixed;
  left: 0;
  z-index: 10;
`;

const TopBanner = styled(StyledBanner)`
  top: 0;
`;

const BottomBanner = styled(StyledBanner)`
  bottom: 0;
`;

const StepContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 45%;
  padding: 10px;
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
`;

const StyledWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  overflow: hidden;
`;

export default CharacterCreate;
