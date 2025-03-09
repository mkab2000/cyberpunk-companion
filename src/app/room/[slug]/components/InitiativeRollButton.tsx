import { StyledButton } from "@/styled-components/styledButton";
import React from "react";

interface InitiativeRollButtonProps {
  characterName: string,
  baseValue: number,
  sendRoll: (text: string) => void,
  rollDice: (sides: number, amount: number) => number[],
  onRoll: (result: number) => void,
}

const InitiativeRollButton = ({ characterName, baseValue, rollDice, sendRoll, onRoll }: InitiativeRollButtonProps) => {
  const handleClick = async () => {
    const diceRoll = rollDice(10, 1)[0]

    sendRoll(`${characterName} makes Initiave roll: ${baseValue} + ${diceRoll} = ${baseValue + diceRoll}`)

    onRoll(baseValue + diceRoll);
  };

  return <StyledButton onClick={handleClick}>Roll Initiative</StyledButton>;
};

export default InitiativeRollButton;
