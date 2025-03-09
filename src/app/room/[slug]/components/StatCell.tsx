import { Stat } from "@/store/types";
import styled from "styled-components";

interface StatsStates {
  [key: string]: Stat
}

interface StatCellProps {
  statKey: keyof StatsStates;
  stat: Stat;
}

const StatCell = ({ statKey, stat }: StatCellProps) => {
  
  return (
    <StyledStatContainer key={statKey}>
      <div>{statKey}</div>
      <StyledStat>
        <div>
          VAL
          <StyledStatValueBox>
            {stat.baseValue + (stat.modifier || 0)}
          </StyledStatValueBox>
        </div>
        <div>
          Modifier
          <StyledStatValueBox>
            {stat.modifier || 0}
          </StyledStatValueBox>
        </div>
      </StyledStat>
    </StyledStatContainer>
  );
}

const StyledStatContainer = styled.div`
  background: #222;
  min-width: 20%;
  max-width: 30%;
  border: 1px solid black;
  font-size: 12px;
  padding: 6px 0 10px 0;
  height: 90px;
  font-size: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const StyledStat = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 3px;
  gap: 3px;
  /* align-items: center; */
  justify-content: space-between;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: lightgray;
    width: 50%;
  }
`;

const StyledStatValueBox = styled.div`
  height: 26px;
  width: 90%;
  background-color: #6e2121;
  text-align: center;
  font-size: 16px;
`;

export default StatCell;