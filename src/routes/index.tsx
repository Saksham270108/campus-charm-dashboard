import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AttendX | Student Attendance Dashboard" },
      { name: "description", content: "Track every class, protect your attendance, and stay ahead with AttendX." },
      { property: "og:title", content: "AttendX | Student Attendance Dashboard" },
      { property: "og:description", content: "Track every class, protect your attendance, and stay ahead with AttendX." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Status = "good" | "watch" | "risk";
type Subject = { name: string; code: string; schedule: string; attended: number; total: number };

const initialSubjects: Subject[] = [
  { name: "Data Structures", code: "CS-204", schedule: "Mon & Wed", attended: 46, total: 50 },
  { name: "Discrete Mathematics", code: "MATH-210", schedule: "Tue & Thu", attended: 39, total: 50 },
  { name: "Operating Systems", code: "CS-231", schedule: "Mon, Wed, Fri", attended: 32, total: 50 },
  { name: "Database Systems", code: "CS-245", schedule: "Tue & Thu", attended: 44, total: 50 },
  { name: "Software Engineering", code: "CS-260", schedule: "Wed & Fri", attended: 38, total: 50 },
];

const navItems = [
  ["Today", LayoutDashboard], ["Subjects", BookOpen], ["Calendar", CalendarDays], ["Statistics", BarChart3],
] as const;

function getStatus(percent: number): Status {
  if (percent >= 75) return "good";
  if (percent >= 65) return "watch";
  return "risk";
}

const statusStyle: Record<Status, { label: string; text: string; bg: string; bar: string }> = {
  good: { label: "On track", text: "text-jade", bg: "bg-jade/12", bar: "bg-jade" },
  watch: { label: "Watch", text: "text-amber", bg: "bg-amber/12", bar: "bg-amber" },
  risk: { label: "At risk", text: "text-clay", bg: "bg-clay/12", bar: "bg-clay" },
};

function Dashboard() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const totals = useMemo(() => {
    const total = subjects.reduce((sum, item) => sum + item.total, 0);
    const attended = subjects.reduce((sum, item) => sum + item.attended, 0);
    return { total, attended, missed: total - attended, percent: total ? (attended / total) * 100 : 0 };
  }, [subjects]);
  const filtered = subjects.filter((subject) => `${subject.name} ${subject.code}`.toLowerCase().includes(query.toLowerCase()));

  const mark = (index: number, present: boolean) => {
    const target = filtered[index];
    if (!target) return;
    setSubjects((current) => current.map((subject) => subject.code === target.code
      ? { ...subject, total: subject.total + 1, attended: subject.attended + (present ? 1 : 0) }
      : subject));
    setNotice(`${target.name} marked ${present ? "present" : "absent"}`);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const safeMisses = Math.max(0, Math.floor((totals.attended - 0.75 * totals.total) / 0.75));

  return (
    <div className="min-h-screen bg-mist font-body text-ink antialiased">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-mist/10 bg-ink px-5 py-6 text-mist transition-transform lg:sticky lg:top-0 lg:h-screen ${menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-1">
              <div className="grid size-8 place-items-center rounded-md bg-jade font-display text-sm font-bold text-ink">A</div>
              <div className="leading-tight"><p className="font-display text-[15px] font-semibold">AttendX</p><p className="text-[11px] text-sage/70">Student console</p></div>
            </div>
            <Button variant="ghost" size="icon" className="text-sage lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
          </div>
          <nav className="mt-8 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-sage/50">Overview</p>
            {navItems.map(([label, Icon], index) => <a key={label} href={`#${label.toLowerCase()}`} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${index === 0 ? "bg-jade/15 font-medium text-mist ring-1 ring-jade/30" : "text-sage/80 hover:bg-mist/5"}`}><Icon className="size-4" />{label}</a>)}
            <p className="px-3 pb-2 pt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-sage/50">Manage</p>
            <a href="#attendance" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sage/80 hover:bg-mist/5"><ClipboardCheck className="size-4" />Attendance log</a>
            <a href="#preferences" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sage/80 hover:bg-mist/5"><Settings className="size-4" />Preferences</a>
          </nav>
          <div className="mt-auto rounded-lg bg-mist/5 p-3 ring-1 ring-mist/10">
            <div className="flex items-center gap-2.5"><div className="grid size-9 place-items-center rounded-md bg-sage/20 font-display text-sm font-semibold">SR</div><div className="leading-tight"><p className="text-[13px] font-medium">Saksham Rawal</p><p className="text-[11px] text-sage/60">BSc Computing · Yr 2</p></div></div>
          </div>
        </aside>
        {menuOpen && <button className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

        <main className="min-w-0 flex-1 pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-ink/10 bg-mist/85 px-4 py-3.5 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Button variant="quiet" size="icon" className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
                <div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/45">Sunday · 27 September</p><h1 className="truncate font-display text-lg font-semibold leading-tight">Good evening, Saksham</h1></div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects" className="h-9 w-44 rounded-md border border-ink/15 bg-surface pl-9 pr-3 text-sm outline-none focus:border-jade" /></div>
                <Button variant="quiet" className="hidden md:inline-flex">Week <ChevronDown /></Button>
                <Button variant="ink" onClick={() => setNotice("Choose a subject below to mark today")}>Mark today</Button>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 lg:px-8 lg:py-6">
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Attendance summary">
              <Metric dark label="Overall" value={`${totals.percent.toFixed(1)}%`} note="Above 75% requirement" progress={totals.percent} />
              <Metric label="Total classes" value={String(totals.total)} note="This semester" />
              <Metric label="Attended" value={String(totals.attended)} note={`${totals.percent.toFixed(1)}% of sessions`} accent="text-jade" />
              <Metric label="Missed" value={String(totals.missed)} note={`${(100 - totals.percent).toFixed(1)}% of sessions`} accent="text-clay" />
            </section>

            <section className="rise rise-2 mt-4 rounded-[10px] bg-ink p-5 text-mist ring-1 ring-ink/10 lg:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-[46ch]"><p className="text-[11px] font-medium uppercase tracking-[0.14em] text-jade">Attendance insight</p><h2 className="mt-2 text-balance font-display text-2xl font-semibold leading-tight">You can miss {safeMisses} more classes and stay eligible.</h2><p className="mt-2 text-pretty text-sm text-sage/70">Your minimum requirement is 75%. Keep the buffer healthy before a busy assessment week.</p></div>
                <div className="w-full lg:w-[340px]"><div className="flex items-end justify-between"><p className="text-xs font-medium text-sage/70">Buffer to 75% floor</p><p className="font-display text-lg font-semibold text-jade">+{(totals.percent - 75).toFixed(1)}%</p></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-mist/10"><div className="h-full rounded-full bg-jade transition-[width] duration-300" style={{ width: `${Math.min(100, totals.percent)}%` }} /></div><div className="mt-4 grid grid-cols-2 gap-2"><Button variant="jade" onClick={() => mark(0, true)}><Check />Mark present</Button><Button variant="darkQuiet" onClick={() => mark(0, false)}><X />Mark absent</Button></div></div>
              </div>
            </section>

            <section id="subjects" className="rise rise-3 mt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-display text-base font-semibold">Subject attendance</h2><div className="flex items-center gap-2"><div className="relative flex-1 sm:hidden"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects" className="h-9 w-full rounded-md border border-ink/15 bg-surface pl-9 pr-3 text-sm outline-none focus:border-jade" /></div><Button variant="quiet" onClick={() => setNotice("Add Subject is ready for connection to your account")}><Plus />Add</Button></div></div>
              <div className="mt-3 overflow-hidden rounded-[10px] bg-surface ring-1 ring-ink/10">
                <div className="hidden grid-cols-[1.6fr_1.4fr_1.2fr_1fr] gap-4 border-b border-ink/10 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-ink/45 md:grid"><span>Subject</span><span>Progress</span><span>Status</span><span className="text-right">Action</span></div>
                {filtered.length ? filtered.map((subject, index) => <SubjectRow key={subject.code} subject={subject} onPresent={() => mark(index, true)} onAbsent={() => mark(index, false)} />) : <div className="px-4 py-12 text-center"><BookOpen className="mx-auto size-6 text-ink/30" /><p className="mt-2 text-sm font-medium">No subjects found</p><p className="text-xs text-ink/50">Try a different search.</p></div>}
              </div>
            </section>
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-mist/10 bg-ink text-mist lg:hidden">
        {navItems.slice(0, 3).map(([label, Icon], index) => <a key={label} href={`#${label.toLowerCase()}`} className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${index === 0 ? "text-mist" : "text-sage/60"}`}><Icon className={`size-4 ${index === 0 ? "text-jade" : ""}`} />{label}</a>)}
        <a href="#profile" className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-sage/60"><UserRound className="size-4" />Profile</a>
      </nav>
      {notice && <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm text-mist shadow-lg lg:bottom-6" role="status">{notice}</div>}
    </div>
  );
}

function Metric({ label, value, note, dark = false, accent = "", progress }: { label: string; value: string; note: string; dark?: boolean; accent?: string; progress?: number }) {
  return <div className={`rise rise-1 rounded-lg p-4 ring-1 ring-ink/10 ${dark ? "bg-ink text-mist" : "bg-surface"}`}><p className={`text-[11px] font-medium uppercase tracking-[0.12em] ${dark ? "text-sage/60" : "text-ink/45"}`}>{label}</p><p className={`mt-2 font-display text-3xl font-semibold leading-none ${accent}`}>{value}</p><p className={`mt-2 text-xs ${dark ? "text-sage/70" : "text-ink/50"}`}>{note}</p>{progress !== undefined && <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist/10"><div className="h-full rounded-full bg-jade" style={{ width: `${progress}%` }} /></div>}</div>;
}

function SubjectRow({ subject, onPresent, onAbsent }: { subject: Subject; onPresent: () => void; onAbsent: () => void }) {
  const percent = Math.round((subject.attended / subject.total) * 100);
  const status = statusStyle[getStatus(percent)];
  return <div className="grid grid-cols-1 gap-3 border-b border-ink/8 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-background/70 md:grid-cols-[1.6fr_1.4fr_1.2fr_1fr] md:items-center md:gap-4"><div><p className="text-sm font-medium">{subject.name}</p><p className="text-xs text-ink/45">{subject.code} · {subject.schedule}</p></div><div className="flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"><div className={`h-full rounded-full transition-[width] duration-300 ${status.bar}`} style={{ width: `${percent}%` }} /></div><span className="w-10 text-right text-[13px] font-medium">{percent}%</span></div><div><span className={`inline-flex items-center gap-1.5 rounded-[5px] px-2 py-1 text-xs font-medium ${status.bg} ${status.text}`}><span className={`size-1.5 rounded-full ${status.bar}`} />{status.label}</span></div><div className="flex gap-1.5 md:justify-end"><Button variant="jade" size="sm" onClick={onPresent}>Present</Button><Button variant="quiet" size="sm" onClick={onAbsent}>Absent</Button></div></div>;
}