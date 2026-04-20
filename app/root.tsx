import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { User } from "@prisma/client";
import nProgressStyles from "nprogress/nprogress.css?url";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import { ErrorContent } from "./components/errors";
import BlockInteractions from "./components/layout/maintenance-mode";
import { SidebarTrigger } from "./components/layout/sidebar/sidebar";
import { Clarity } from "./components/marketing/clarity";
import { config } from "./config/shelf.config";
import { useNprogress } from "./hooks/use-nprogress";
import fontsStylesheetUrl from "./styles/fonts.css?url";
import globalStylesheetUrl from "./styles/global.css?url";
import nProgressCustomStyles from "./styles/nprogress.css?url";
import pmDocStylesheetUrl from "./styles/pm-doc.css?url";
import styles from "./tailwind.css?url";
import { ClientHintCheck, getClientHint } from "./utils/client-hints";
import {
  buildDeChDomTranslationScript,
  DEFAULT_APP_LOCALE,
} from "./utils/de-ch";
import { getBrowserEnv } from "./utils/env";
import { payload } from "./utils/http.server";
import { useNonce } from "./utils/nonce-provider";
import { PwaManagerProvider } from "./utils/pwa-manager";
import { splashScreenLinks } from "./utils/splash-screen-links";

export interface RootData {
  env: typeof getBrowserEnv;
  user: User;
}

export const handle = {
  breadcrumb: () => <SidebarTrigger />,
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: fontsStylesheetUrl },
  { rel: "stylesheet", href: globalStylesheetUrl },
  { rel: "stylesheet", href: pmDocStylesheetUrl },
  { rel: "manifest", href: "/static/manifest.json" },
  { rel: "apple-touch-icon", href: config.faviconPath },
  { rel: "icon", href: config.faviconPath },
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: nProgressCustomStyles },
  ...splashScreenLinks,
];

export const meta: MetaFunction = () => [
  {
    title: "shelf.nu",
  },
];

export const loader = ({ request }: LoaderFunctionArgs) =>
  payload({
    env: getBrowserEnv(),
    maintenanceMode: false,
    requestInfo: {
      hints: getClientHint(request),
    },
  });

export const shouldRevalidate = () => false;

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const nonce = useNonce();
  const [hasCookies, setHasCookies] = useState(true);

  useEffect(() => {
    setHasCookies(navigator.cookieEnabled);
  }, []);

  return (
    <html lang={DEFAULT_APP_LOCALE} className="overflow-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <ClientHintCheck nonce={nonce} />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: buildDeChDomTranslationScript(),
          }}
        />
        <style data-fullcalendar />
        <Meta />
        <Links />
        <Clarity />
      </head>
      <body>
        <noscript>
          <BlockInteractions
            title="JavaScript ist deaktiviert"
            content="Diese Website benötigt aktiviertes JavaScript, um korrekt zu funktionieren. Bitte aktivieren Sie JavaScript oder verwenden Sie einen anderen Browser und versuchen Sie es erneut."
            icon="x"
          />
        </noscript>

        {hasCookies ? (
          children
        ) : (
          <BlockInteractions
            title="Cookies sind deaktiviert"
            content="Diese Website benötigt aktivierte Cookies, um korrekt zu funktionieren. Bitte aktivieren Sie Cookies und versuchen Sie es erneut."
            icon="x"
          />
        )}

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(data?.env)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  useNprogress();
  const { maintenanceMode } = useLoaderData<typeof loader>();

  return maintenanceMode ? (
    <BlockInteractions
      title={"Wartungsarbeiten werden durchgeführt"}
      content={
        "Entschuldigung, wir sind wegen geplanter Wartungsarbeiten vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut."
      }
      cta={{
        to: "https://www.shelf.nu/blog-categories/updates-maintenance",
        text: "Mehr erfahren",
      }}
      icon="tool"
    />
  ) : (
    <PwaManagerProvider>
      <Outlet />
    </PwaManagerProvider>
  );
}

export default App;

export const ErrorBoundary = () => <ErrorContent />;
