import HomeButton from './components/HomeButton';
import './globals.css';
import Providers from './providers';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={orbitron.className}>
      <body>
        <HomeButton />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
