'use client';

import Link from 'next/link';
import styled from 'styled-components';

const HomeButton = () => {
  return (
    <nav>
      <Link href="/">
        <StyledHomeButton>Home</StyledHomeButton>
      </Link>
    </nav>
  );
}

const StyledHomeButton = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 100;
  background: #800101;
  padding: 4px 8px;
  border-radius: 8px;
  color: white;
`;

export default HomeButton