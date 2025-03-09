"use client"; // Ensures this is a Client Component

import { useRouter } from "next/navigation";
import styled from "styled-components";

export default function HomePage() {
  const router = useRouter();

  return (
    <HomeContainer>
      <HomeTitle>Welcome</HomeTitle>
      <HomeButton style={{backgroundColor: "#cb2a2a"}} onClick={() => router.push("/create-character")}>
        Create Character
      </HomeButton>
      <HomeButton style={{backgroundColor: "#4d21a7"}}  onClick={() => router.push("/room")}>
        Join or Create Room
      </HomeButton>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
`;

const HomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const HomeButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

`;
