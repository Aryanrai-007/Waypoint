import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waypoint — Student Productivity Workspace',
  description: 'A focused productivity workspace for college students.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
