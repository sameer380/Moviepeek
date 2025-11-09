import { Provider } from 'react-redux';
import globalStyles from 'styles/global';
import Head from 'next/head';

import { useStore } from 'store';
import ThemeProvider from 'utils/hocs/ThemeProvider';
import Layout from 'parts/Layout';
import { AuthProvider } from 'utils/hocs/AuthProvider';

const MyApp = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);

  const siteTitle = 'WatchMovieHub';
  const siteDescription = 'Your source for movie reviews, trailers, and news.';

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
      <style jsx global>
        {globalStyles}
      </style>
    </>
  );
};

export default MyApp;
