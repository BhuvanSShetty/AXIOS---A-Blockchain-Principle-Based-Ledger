import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LoadingFallback } from "./components/LoadingFallback";

/* ── Lazy-loaded pages ──
   Each page is code-split into its own chunk, so the initial bundle
   only contains the layout shells + the page the user actually visits. */

const PublicLanding = lazy(() =>
  import("./pages/PublicLanding").then((m) => ({ default: m.PublicLanding }))
);
const PublicLookup = lazy(() =>
  import("./pages/PublicLookup").then((m) => ({ default: m.PublicLookup }))
);
const Login = lazy(() =>
  import("./pages/Login").then((m) => ({ default: m.Login }))
);
const Register = lazy(() =>
  import("./pages/Register").then((m) => ({ default: m.Register }))
);
const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy }))
);
const TermsOfService = lazy(() =>
  import("./pages/TermsOfService").then((m) => ({ default: m.TermsOfService }))
);
const ContactSupport = lazy(() =>
  import("./pages/ContactSupport").then((m) => ({ default: m.ContactSupport }))
);
const IntegrityVerify = lazy(() =>
  import("./pages/IntegrityVerify").then((m) => ({
    default: m.IntegrityVerify,
  }))
);
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound }))
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const CreateLand = lazy(() =>
  import("./pages/CreateLand").then((m) => ({ default: m.CreateLand }))
);
const LandDetail = lazy(() =>
  import("./pages/LandDetail").then((m) => ({ default: m.LandDetail }))
);
const Witnesses = lazy(() =>
  import("./pages/Witnesses").then((m) => ({ default: m.Witnesses }))
);
const TransferLand = lazy(() =>
  import("./pages/TransferLand").then((m) => ({ default: m.TransferLand }))
);
const TransferredLands = lazy(() => import("./pages/TransferredLands"));

/** Wraps a lazy component in Suspense with a branded loading skeleton */
function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        index: true,
        element: (
          <S>
            <PublicLanding />
          </S>
        ),
      },
      {
        path: "privacy",
        element: (
          <S>
            <PrivacyPolicy />
          </S>
        ),
      },
      {
        path: "terms",
        element: (
          <S>
            <TermsOfService />
          </S>
        ),
      },
      {
        path: "support",
        element: (
          <S>
            <ContactSupport />
          </S>
        ),
      },
      {
        path: "login",
        element: (
          <S>
            <Login />
          </S>
        ),
      },
      {
        path: "register",
        element: (
          <S>
            <Register />
          </S>
        ),
      },
      {
        path: "verify",
        element: (
          <S>
            <IntegrityVerify />
          </S>
        ),
      },
      {
        path: "*",
        element: (
          <S>
            <NotFound />
          </S>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        element: (
          <S>
            <Dashboard />
          </S>
        ),
      },
      {
        path: "create",
        element: (
          <S>
            <CreateLand />
          </S>
        ),
      },
      {
        path: "witnesses",
        element: (
          <S>
            <Witnesses />
          </S>
        ),
      },
      {
        path: "transferred",
        element: (
          <S>
            <TransferredLands />
          </S>
        ),
      },
      {
        path: "verify",
        element: (
          <S>
            <IntegrityVerify />
          </S>
        ),
      },
      {
        path: "public",
        element: (
          <S>
            <PublicLookup />
          </S>
        ),
      },
      {
        path: "land/:landId",
        element: (
          <S>
            <LandDetail />
          </S>
        ),
      },
      {
        path: "transfer",
        element: (
          <S>
            <TransferLand />
          </S>
        ),
      },
    ],
  },
]);
