import { useState, type ReactNode } from "react"
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  MapPinned,
  Scale,
  ChartNoAxesCombined,
  FileText,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LogOut,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { can, request } from "@/lib/api"
import { useAction } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { useNotice } from "./shared"
import type { PageId } from "@/lib/types"

const icons: Partial<Record<PageId, typeof Users>> = {
  dashboard: LayoutDashboard,
  members: Users,
  committees: Building2,
  assignments: ClipboardList,
  jurisdiction: MapPinned,
  workload: Scale,
  performance: ChartNoAxesCombined,
  reports: FileText,
  users: ShieldCheck,
}
export function AppShell({ children }: { children: ReactNode }) {
  const config = window.APP_CONFIG
  const [collapsed, setCollapsed] = useState(false)
  const [mobile, setMobile] = useState(false)
  const notify = useNotice()
  const logout = useAction(async () => {
    await request("logout.php", "POST")
    window.location.assign(config.login)
  })
  const navigation = config.navigation.filter((item) => can(config, item.permission))
  const initials = config.userEmail.slice(0, 2).toUpperCase() || "SK"
  const date = new Date().toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  function sidebar(compact = false) {
    return (
      <>
        <a
          className="ui-brand"
          href={
            navigation.find((n) => n.key === "dashboard")?.href ||
            navigation[0]?.href ||
            config.login
          }
        >
          <span className="ui-brand-emblem">SK</span>
          {!compact && (
            <span>
              <strong>
                Committee<span className="ui-brand-dot">.</span>
              </strong>
              <small>SANGGUNIANG KABATAAN</small>
            </span>
          )}
        </a>
        <Separator className="ui-nav-separator" />
        <nav className="ui-sidebar-nav" aria-label="Main navigation">
          {navigation.map((item, index) => {
            const Icon = icons[item.key] || LayoutDashboard
            const link = (
              <a
                href={item.href}
                className={cn("ui-nav-link", config.page === item.key && "active")}
                aria-current={config.page === item.key ? "page" : undefined}
                aria-label={compact ? item.label : undefined}
              >
                <Icon size={19} />
                {!compact && <span>{item.label}</span>}
                {!compact && config.page === item.key && <span className="ui-nav-active-dot" />}
              </a>
            )
            return (
              <div key={item.key}>
                {!compact && (index === 0 || navigation[index - 1].group !== item.group) && (
                  <p className="ui-nav-group">{item.group}</p>
                )}
                {compact ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )}
              </div>
            )
          })}
        </nav>
        <div className="ui-sidebar-bottom">
          {!compact && (
            <div className="ui-civic-note">
              <ShieldCheck size={20} />
              <strong>Built for better governance</strong>
              <p>A shared space for a stronger youth community.</p>
            </div>
          )}
          <div className="ui-sidebar-user">
            <span className="ui-avatar">{initials}</span>
            {!compact && (
              <div>
                <strong>{config.roleLabel}</strong>
                <small>{config.userEmail}</small>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
  return (
    <div className={cn("ui-app-shell", collapsed && "is-collapsed")}>
      <aside className="ui-sidebar">{sidebar(collapsed)}</aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent
          side="left"
          className="ui-mobile-sidebar tw:bg-[#082d55] tw:text-[#dce8f5] tw:gap-0"
        >
          <SheetHeader className="tw:sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Choose a page in the committee system.</SheetDescription>
          </SheetHeader>
          {sidebar()}
        </SheetContent>
      </Sheet>
      <div className="ui-app-main">
        <header className="ui-topbar">
          <div className="ui-topbar-breadcrumb">
            <Button
              variant="ghost"
              size="icon"
              className="ui-desktop-toggle tw:max-[800px]:hidden"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ui-mobile-toggle tw:hidden tw:max-[800px]:inline-flex"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </Button>
            <span>Workspace</span>
            <span className="ui-breadcrumb-divider">/</span>
            <strong>{config.title}</strong>
          </div>
          <div className="ui-topbar-right">
            <span className="ui-today">{date}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ui-user-trigger tw:h-10 tw:px-2 tw:py-0">
                  <span className="ui-avatar">{initials}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="tw:max-w-[calc(100vw-2rem)]">
                <DropdownMenuLabel className="tw:break-all">
                  {config.userEmail}
                  <p className="tw:mt-1 tw:text-xs tw:font-normal tw:text-muted-foreground">
                    {config.roleLabel}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={logout.isPending}
                  onSelect={(event) => {
                    event.preventDefault()
                    void logout.run().catch((e) => notify(e.message, true))
                  }}
                >
                  <LogOut size={16} />
                  {logout.isPending ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main id="main-content" className="ui-content">
          <div className="ui-page-heading">
            <div>
              <p className="ui-eyebrow">SK COMMITTEE WORKSPACE</p>
              <h1>{config.title}</h1>
              <p>{config.description}</p>
            </div>
            <span className="ui-page-mark">
              <ArrowUpRight size={28} />
            </span>
          </div>
          {children}
        </main>
        <footer className="ui-footer">
          <span>SK Committee Management System</span>
          <span>Purposeful work. Stronger communities.</span>
        </footer>
      </div>
    </div>
  )
}
