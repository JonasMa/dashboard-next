import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}