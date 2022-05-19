import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { getCookie, setCookies } from 'cookies-next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { StateProvider } from '../context';
import { useMeQuery } from '../graphql/generated/graphql';
import '../public/global.css';
import { isServer } from '../util/isServer';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  useEffect(() => {
    setColorScheme(getCookie('mantine-color-scheme') === 'dark' ? 'dark' : 'light' || 'dark');
  }, []);
  const router = useRouter();
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookies('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>Reddit - Share Your Thoughts</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>

      <StateProvider>
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
              <Component {...pageProps} />
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </StateProvider>
    </>
  );
}
