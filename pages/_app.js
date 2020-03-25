import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'antd/dist/antd.css';
import 'nprogress/nprogress.css';
import { getWithAuth } from '../utils/request';
import Head from '../components/head';
import Body from '../components/body';

// configure global loading spinner
// ONLY show if page has been loading for more than a set period
// no need to load if already cached on client
const showLoadingThresholdMS = 200;
let isLoading = false;

NProgress.configure({
  trickleSpeed: 100,
  minimum: 0.3,
});

Router.onRouteChangeStart = () => {
  isLoading = true;
  setTimeout(() => {
    if (isLoading) {
      NProgress.start();
    }
  }, showLoadingThresholdMS);
};

Router.onRouteChangeComplete = () => {
  isLoading = false;
  NProgress.done();
};

Router.onRouteChangeError = () => {
  isLoading = false;
  NProgress.done();
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head title="Eko TeleMedicine" />
        <Body>
          <Component {...pageProps} />
        </Body>
        <style jsx global>{`
          body {
            background: #fff;
          }
        `}</style>
      </>
    );
  }
}

export default MyApp;
