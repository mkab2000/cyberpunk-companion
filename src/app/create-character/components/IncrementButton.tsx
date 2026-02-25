import { Colors } from "@/utils/colors";
import { styled } from "styled-components";

interface ButtonProps {
  onClick?: () => void;
  disabled: boolean;
  text: string;
}
const IncrementButton = ({ onClick, disabled, text }: ButtonProps) => {
  
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}>
        <p>{text}</p>
    </StyledButton>
  )
};

const StyledButton = styled.div<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  padding: 0 0 2px 2px;
  background-color: ${props => (props.disabled ? Colors.gray300 : Colors.gray100)};
  font-size: 28px;
  user-select: none;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  border: 1px solid white;
  border-radius: 4px;
  p {
    margin: 0;
    color: white;
  }
`;

export default IncrementButton;