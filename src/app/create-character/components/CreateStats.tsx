import { styled } from "styled-components";
import { useAtom } from "jotai";
import { baselineStats } from "@/store/constants";
import { storedCharacterData } from "@/store/store";
import { Stat } from "@/store/types";
import IncrementButton from "./IncrementButton";

interface StatsStates {
  [key: string]: Stat
}

const CreateStats = () => {
  const [characterState, setCharacterState] = useAtom(storedCharacterData);
  
  const statsState = characterState.stats;
  const totalStatsRemaining = 62 - Object.values(statsState).reduce((sum, stat) => sum + stat.baseValue, 0);

  const updateStat = (statKey: keyof StatsStates, value: number) => {
    const newTotalRemaining =
      totalStatsRemaining - value + statsState[statKey].baseValue;
    
    const totalHp = Math.floor((characterState.stats.WILL.baseValue + characterState.stats.BODY.baseValue + 1) / 2) * 5 + 10;
    
    if (newTotalRemaining >= 0) {
      setCharacterState((prev) => ({
        ...prev,
        hp: {
          total: totalHp,
          current: totalHp,
        },
        stats: {
          ...prev.stats, 
          [statKey]: {
            ...prev.stats[statKey], 
            baseValue: Math.max(2, Math.min(8, value)), 
          },
        }
      }));
    }
  };

  return (
    <>
      <StyledTotalStatWrapper>
        Total stats remaining: {totalStatsRemaining}
      </StyledTotalStatWrapper>

      {Object.entries(baselineStats).map(([key, myStat]) => (
        <StyledStatRow key={key} >
          <p>{myStat.name}</p>
          <IncrementStat
            statKey={key as keyof StatsStates}
            statValue={statsState[key as keyof StatsStates].baseValue}
            updateStat={updateStat}
            totalStatsRemaining={totalStatsRemaining}
          />
        </StyledStatRow>
      ))}
      Total HP: { characterState.hp.total }

    </>
  )
}

interface IncrementStatProps {
  statKey: keyof StatsStates;
  statValue: number;
  updateStat: (key: keyof StatsStates, value: number) => void;
  totalStatsRemaining: number;
}

const IncrementStat = ({ statKey, statValue, updateStat, totalStatsRemaining }: IncrementStatProps) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (/^\d*$/.test(value)) {
      let numValue = parseInt(value, 10);
      
      if (!isNaN(numValue)) {
        if (numValue < 2) numValue = 2;
        if (numValue > 8) numValue = 8;
        updateStat(statKey, numValue);
      }
    }
  };

  return (
    <StyledStatIncrement>
      <IncrementButton disabled={statValue<=2} text={"-"} onClick={() => { if (statValue > 2) updateStat(statKey, statValue - 1)}} />
      <StyledStatWindow value={statValue} onChange={handleChange} />
      <IncrementButton disabled={statValue>=8 || totalStatsRemaining==0} text={"+"} onClick={() => { if (statValue < 8) updateStat(statKey, statValue +1)}} />
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

export default CreateStats;