import './globals.css';
import ThemeRegistry from './components/ThemeRegistry';

export const metadata = {
  title: 'My Dashboard',
  description: 'Personal dashboard with weather, todos, and Notion content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}