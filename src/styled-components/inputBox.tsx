import { Colors } from "@/utils/colors";
import { useState } from "react";
import styled from "styled-components";

type InputBoxProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const InputBox = ({ label, value, onChange }: InputBoxProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || value.length > 0;

  return (
    <Wrapper>
      <FloatingLabel hasValue={shouldFloat} isFocused={isFocused}>
        {label}
      </FloatingLabel>

      <StyledInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFocused={isFocused}
      />
    </Wrapper>
  );
};



const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input<{ isFocused: boolean }>`
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

const FloatingLabel = styled.label<{ hasValue: boolean, isFocused: boolean }>`
  position: absolute;
  left: 12px;
  top: ${(props) => (props.hasValue ? "-8px" : "16px")};

  font-size: ${(props) => (props.hasValue ? "12px" : "16px")};
  color: ${(props) => 
  (props.hasValue || props.isFocused) ? "white" : Colors.gray300
  };

  padding: 0 4px;
  border-radius: 3px;

  background: ${(props) =>
    props.hasValue
      ? `linear-gradient(
          to bottom,
          ${Colors.gray200} 0%,
          ${Colors.gray200} 50%,
          ${Colors.gray100} 50%,
          ${Colors.gray100} 100%
        )`
      : Colors.gray100};

  transition: all 0.3s ease;
  pointer-events: none;


`;

export default InputBox;
