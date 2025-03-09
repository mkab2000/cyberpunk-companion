"use client"; // Ensures this is a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

export default function RoomPage() {
  const [slugInput, setSlugInput] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const randomSlug = uuidv4().slice(0, 8);
    router.push(`/room/${randomSlug}`);
  };

  const joinRoom = () => {
    if (slugInput.trim()) {
      router.push(`/room/${slugInput.trim()}`);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Room Selection</PageTitle>
      <PageButton style={{backgroundColor: "#cb2a2a"}} onClick={createRoom}>
        Create a Room
      </PageButton>
      <InputContainer>
        <Input
          type="text"
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          placeholder="Enter room slug"
        />
        <PageButton style={{backgroundColor: "#4d21a7"}} onClick={joinRoom}>
          Join Room
        </PageButton>
      </InputContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: bold;
`;

const PageButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;