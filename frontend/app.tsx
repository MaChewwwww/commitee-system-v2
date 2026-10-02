import { Component, Suspense, lazy, type ReactNode, type ComponentType } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NoticeProvider, LoadingState } from "@/components/shared"
import { AppShell } from "@/components/shell"
import type { PageId } from "@/lib/types"
const screens: Record<PageId, () => Promise<{ default: ComponentType }>> = {
  login: () => import("./pages/login"),
  dashboard: () => import("./pages/dashboard"),
  members: () => import("./pages/members"),
  committees: () => import("./pages/committees"),
  assignments: () => import("./pages/assignments"),
  jurisdiction: () => import("./pages/jurisdiction"),
  workload: () => import("./pages/workload"),
  performance: () => import("./pages/performance"),
  reports: () => import("./pages/reports"),
  users: () => import("./pages/users"),
  forbidden: () => import("./pages/forbidden"),
}
const client = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
})
class ScreenBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? (
      <div className="ui-empty" role="alert">
        <h2>This page could not start</h2>
        <p>
          Please reload the page. If this continues, check that the complete frontend build was
          uploaded.
        </p>
        <button className="ui-reload" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    ) : (
      this.props.children
    )
  }
}
export function App() {
  const config = window.APP_CONFIG
  const Screen = lazy(screens[config.page] || screens.forbidden)
  const content = (
    <ScreenBoundary>
      <Suspense fallback={<LoadingState />}>
        <Screen />
      </Suspense>
    </ScreenBoundary>
  )
  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <NoticeProvider>
          <a href="#main-content" className="ui-skip-link">
            Skip to content
          </a>
          {config.page === "login" ? content : <AppShell>{content}</AppShell>}
        </NoticeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
