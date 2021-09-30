import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { m } from 'framer-motion'

import { isBrowser, useWindowSize } from '@lib/helpers'
import { pageTransitionSpeed } from '@lib/animate'

import HeadSEO from '@components/head-seo'
import CookieBar from '@components/cookie-bar'
import Header from '@components/header'
import Footer from '@components/footer'

const variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: pageTransitionSpeed / 1000,
      delay: 0.2,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: pageTransitionSpeed / 1000,
      ease: 'linear',
      when: 'beforeChildren',
    },
  },
}

const Layout = ({ site = {}, page = {}, schema, children }) => {
  // set window height var
  const { height: windowHeight } = useWindowSize()

  // set header height
  const [headerHeight, setHeaderHeight] = useState(null)

  useEffect(() => {
    if (isBrowser) {
      document.body.style.setProperty('--vh', `${windowHeight * 0.01}px`)
    }
  }, [windowHeight])

  return (
    <>
      <HeadSEO site={site} page={page} schema={schema} />

      {site.gtmID && (
        <Script
          id="gtm"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${site.gtmID}');`,
          }}
        />
      )}

      <m.div
        initial="initial"
        animate="enter"
        exit="exit"
        variants={variants}
        style={headerHeight ? { '--headerHeight': `${headerHeight}px` } : null}
      >
        <CookieBar data={site.cookieConsent} />
        <Header
          data={site.header}
          isTransparent={page.hasTransparentHeader}
          onSetup={({ height }) => setHeaderHeight(height)}
        />
        <main id="content">{children}</main>
        <Footer data={site.footer} />
      </m.div>
    </>
  )
}

export default Layout
