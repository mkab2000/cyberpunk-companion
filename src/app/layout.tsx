import HomeButton from './components/HomeButton';
import './globals.css';
import Providers from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HomeButton />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
