"use client";
import Link from "next/link";
import styled from "styled-components";

const NavbarContainer = styled.nav`
  background: black;
  padding: 1rem;
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function Navbar() {
  return (
    <NavbarContainer>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/create">Create Character</NavLink>
    </NavbarContainer>
  );
}
