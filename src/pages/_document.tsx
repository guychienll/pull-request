import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/github-fav.png" />
        <meta property="og:image" content="/github.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pr-platform.guychienll.dev/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
