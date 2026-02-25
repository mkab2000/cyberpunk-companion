import { Colors } from "@/utils/colors";
import { useState } from "react";
import styled from "styled-components";

type SelectBoxProps = {
  label: string;
  value: string | number;
  options: (string | number)[];
  onChange: (value: string) => void;
};

const SelectBox = ({ label, value, onChange, options }: SelectBoxProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Wrapper>
      <FloatingLabel isFocused={isFocused}>
        {label}
      </FloatingLabel>

      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </StyledSelect>
    </Wrapper>
  );
};



const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select<{ isFocused: boolean }>`
  width: 100%;
  padding: 14px 12px;
  padding-top: 20px;

  background-color: ${Colors.gray100};
  border: 2px solid ${(props) => (props.isFocused ? Colors.primary : "white")};
  border-radius: 4px;

  font-size: 16px;
  color: white;

  transition: border-color 0.2s ease;

  outline: none;
  box-shadow: none;
`;

const FloatingLabel = styled.label<{isFocused: boolean }>`
  position: absolute;
  left: 12px;
  top: -8px;

  font-size: 12px;
  color: white;

  padding: 0 4px;
  border-radius: 3px;

  background: linear-gradient(
          to bottom,
          ${Colors.gray200} 0%,
          ${Colors.gray200} 50%,
          ${Colors.gray100} 50%,
          ${Colors.gray100} 100%
        );

  transition: all 0.3s ease;
  pointer-events: none;


`;

export default SelectBox;
