import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { getCookie, setCookies } from 'cookies-next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { UserProvider } from '../context/User';
import '../public/global.css';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  // check logged in user and add to context
  const router = useRouter();
  let showHeaderFooter;
  switch (router.pathname) {
    case '/register':
    case '/login':
      showHeaderFooter = false;
      break;
    default:
      showHeaderFooter = true;
  }
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  useEffect(
    () => setColorScheme(getCookie('mantine-color-scheme') === 'dark' ? 'dark' : 'light' || 'dark'),
    []
  );

  return (
    <>
      <Head>
        <title>Reddit - Share Your Thoughts</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            colorScheme,
            fontFamily: 'Inter, sans-serif',
            fontFamilyMonospace: 'Monaco, Menlo, Consolas, Courier, monospace',
            headings: { fontFamily: 'Greycliff CF, sans-serif' },
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider position="top-center">
            <UserProvider>
              {/* {showHeaderFooter && <Navbar user={null} />} */}
              <Component {...pageProps} />
              {/* {showHeaderFooter && <Footer data={footerData} />} */}
              <ColorSchemeToggle />
            </UserProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
