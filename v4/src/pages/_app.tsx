import {AppProps} from 'next/app';
import {NextRouter, withRouter} from 'next/router';
import {NextIntlClientProvider} from 'next-intl';
import ReduxProvider from  '../store/Providers'
//'../../store/Providers';

type Props = AppProps & {
  router: NextRouter;
};

function App({Component, pageProps, router}: Props) {
  return (
    <NextIntlClientProvider
      locale={(router.query.locale as string) || 'en'}
      messages={pageProps.messages}
      timeZone="Europe/Vienna"
    >
       <ReduxProvider>
      <Component {...pageProps} />
      </ReduxProvider>
    </NextIntlClientProvider>
  );
}

export default withRouter(App);
