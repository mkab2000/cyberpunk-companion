import { useEffect, useRef } from "react";
import styled from "styled-components";

interface ProjectModalProps {
  showModal: boolean;
  characterId: string;
  onClose: () => void;
}

const CompletionModal: React.FC<ProjectModalProps> = ({ showModal, characterId, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal, onClose]);

  if (!showModal) return null;

  return (
    <Overlay>
      <ModalContent ref={modalRef}>
        <p>Character ID: {characterId}</p>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </ModalContent>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: aliceblue;
  width: 600px;
  height: 200px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background-color: #ff5555;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #cc4444;
  }
`;

export default CompletionModal;
