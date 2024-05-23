import { NextIntlProvider } from 'next-intl'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'

import store from '../lib/store'
import { Provider } from 'react-redux';


export default function App({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <NextIntlProvider messages={pageProps.messages}>
        <Component {...pageProps} />
      </NextIntlProvider>
    </Provider>
  )
}
