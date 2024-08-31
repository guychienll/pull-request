import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import config from "../../next-i18next.config.js";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      themes={["light", "dark"]}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App, config);
