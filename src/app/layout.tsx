import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'src/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Text 2 Slide',
  description: 'Convert your text into slides.',
  applicationName: 'Text 2 Slide',
  authors: [
    {
      url: 'https://instagram.com/dimas.mfth',
      name: 'Dimas Miftah',
    },
  ],
  keywords: ['text to slide', 'presentation', 'slide generator', 'online tool'],
  twitter: {
    card: 'summary_large_image',
    site: '@dimasmfth',
    creator: '@dimasmfth',
  },
  openGraph: {
    title: 'Text 2 Slide',
    description: 'Convert your text into slides.',
    images: {
      url: 'https://www.text2slide.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Preview of Text 2 Slide',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='icon'
          href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💬</text></svg>'
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
