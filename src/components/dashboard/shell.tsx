import {
  BarChart3,
  BedDouble,
  CalendarDays,
  ClipboardCheck,
  ConciergeBell,
  Home,
  Hotel,
  Leaf,
  LogOut,
  MessageSquareText,
  PanelLeft,
  ReceiptText,
  Settings2,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const managerNav = [
  { href: "/manager/dashboard", label: "Dashboard", icon: Home },
  { href: "/manager/operations", label: "Operations", icon: ClipboardCheck },
  { href: "/manager/reservations", label: "Reservations", icon: ReceiptText },
  { href: "/manager/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/manager/villas", label: "Villas", icon: Hotel },
  { href: "/manager/concierge", label: "Concierge", icon: ConciergeBell },
  { href: "/manager/readiness", label: "Readiness", icon: ClipboardCheck },
  { href: "/manager/facilities", label: "Facilities", icon: Wrench },
  { href: "/manager/finance", label: "Finance", icon: BarChart3 },
  { href: "/manager/sustainability", label: "Sustainability", icon: Leaf },
];

const guestNav = [
  { href: "/guest/dashboard", label: "Dashboard", icon: BedDouble },
  { href: "/guest/concierge", label: "Concierge", icon: MessageSquareText },
];

export function ManagerShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      description={description}
      navItems={managerNav}
      roleLabel="Manager Suite"
      title={title}
    >
      {children}
    </DashboardShell>
  );
}

export function GuestShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      description={description}
      navItems={guestNav}
      roleLabel="Guest Portal"
      title={title}
    >
      {children}
    </DashboardShell>
  );
}

function DashboardShell({
  roleLabel,
  title,
  description,
  navItems,
  children,
}: {
  roleLabel: string;
  title: string;
  description: string;
  navItems: typeof managerNav;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white px-4 py-4 text-slate-950 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex size-10 items-center justify-center rounded-md bg-slate-950 text-cyan-200">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">
                  Serene Bali Villas
                </span>
                <span className="block text-xs text-slate-500">{roleLabel}</span>
              </span>
            </Link>
            <PanelLeft className="size-5 text-slate-400 lg:hidden" aria-hidden="true" />
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4 text-cyan-800" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 lg:block">
            <div className="flex items-center gap-2 text-slate-950">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Role protected
            </div>
            <p className="mt-2 leading-6">
              Session and role are checked server-side for guest, manager, and
              owner workflows.
            </p>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-800">
                {roleLabel}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-800"
                href="/"
              >
                <UserRound className="size-4" aria-hidden="true" />
                Public site
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                href="/api/auth/signout"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </Link>
            </div>
            </div>
          </header>

          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
    </article>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "CONFIRMED" ||
    value === "PAID" ||
    value === "ACTIVE" ||
    value === "COMPLETED" ||
    value === "DONE" ||
    value === "ONLINE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : value === "CANCELLED" ||
          value === "FAILED" ||
          value === "INACTIVE"
        ? "border-red-200 bg-red-50 text-red-800"
        : value === "HIGH" || value === "URGENT" || value === "MAINTENANCE"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${tone}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <Settings2 className="mx-auto size-8 text-slate-400" aria-hidden="true" />
      <h2 className="mt-4 font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
