import { Colors } from "@/utils/colors";
import { styled } from "styled-components";

export const NavBarSelectorButton = styled.button<{ selected: boolean }>`
  position: relative;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0 12px;
  height: 100%;
  color: ${({ selected }) => (selected ? Colors.primary : "white")};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ selected }) => (selected ? "100%" : "0")};
    height: 0;
    border-bottom: ${({ selected }) =>
      selected ? `6px solid ${Colors.primary}` : "6px solid transparent"};
    border-left: ${({ selected }) =>
      selected ? "6px solid transparent" : "0 solid transparent"};
    border-right: ${({ selected }) =>
      selected ? "6px solid transparent" : "0 solid transparent"};
    transition: all 0.3s ease;
  }

  &:hover::after {
    width: 100%;
    border-bottom-color: ${Colors.primary};
    border-left-width: 6px;
    border-right-width: 6px;
  }
`;