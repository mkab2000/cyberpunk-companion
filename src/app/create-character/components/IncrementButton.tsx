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
  width: 30px;
  height: 30px;
  background-color: ${props => (props.disabled ? "black" : "#e01b1b")};
  font-size: 22px;
  user-select: none;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  text-align: center;
  align-items: center;

  p {
    margin: 0;
    color: white;
  }
`;

export default IncrementButton;