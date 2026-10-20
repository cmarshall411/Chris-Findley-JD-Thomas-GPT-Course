'use client'

import { useState } from "react";
import { MOODS, MOVIES, SERVICES, type Mood, type Movie, type Service } from "./movies";

type Screen = "signin" | "setup" | "questions" | "pick" | "followup" | "nomatch" | "handoff" | "history";

type Prefs = {
  mood: Mood;
  maxRuntime: number;
  note: string;
  excludedGenres: string[];
  lighter: boolean;
  runtimeCap: number; // tightened by the "Too long" follow-up within one flow
};

type HistoryEntry = { movie: Movie; outcome: string; at: string };

const TIME_OPTIONS = [
  { label: "Under 90 min", value: 90 },
  { label: "Up to 2 hours", value: 120 },
  { label: "Any length", value: 999 },
];

const FOLLOW_UPS = [
  { id: "long", label: "Too long" },
  { id: "genre", label: "Not into this genre" },
  { id: "seen", label: "Already seen it" },
  { id: "lighter", label: "Want something lighter" },
] as const;

const DEMO_EMAIL = "viewer@example.com";

const DEFAULT_PREFS: Prefs = { mood: "Feel-good", maxRuntime: 120, note: "", excludedGenres: [], lighter: false, runtimeCap: 999 };

function findMovie(prefs: Prefs, services: Service[], excludedIds: string[]): Movie | null {
  const words = prefs.note.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const candidates = MOVIES.filter(
    (m) =>
      !excludedIds.includes(m.id) &&
      m.services.some((s) => services.includes(s)) &&
      m.runtime <= Math.min(prefs.maxRuntime, prefs.runtimeCap) &&
      !prefs.excludedGenres.includes(m.genre) &&
      (prefs.lighter ? m.moods.some((x) => x === "Feel-good" || x === "Funny") : m.moods.includes(prefs.mood)),
  );
  // Mock "ranking": favor movies whose genre or synopsis mention words from the optional note.
  const score = (m: Movie) =>
    words.filter((w) => (m.genre + " " + m.synopsis).toLowerCase().includes(w)).length;
  return candidates.sort((a, b) => score(b) - score(a))[0] ?? null;
}

function rationale(movie: Movie, prefs: Prefs): string {
  const moodText = prefs.lighter ? "something lighter" : `a ${prefs.mood.toLowerCase()} pick`;
  const time = prefs.maxRuntime < 999 ? ` and at ${movie.runtime} minutes it fits your time` : "";
  const note = prefs.note ? `, with your note ("${prefs.note}") in mind` : "";
  return `You asked for ${moodText}${note}. This ${movie.genre.toLowerCase()} delivers that${time}.`;
}

export default function CineMatch() {
  const [screen, setScreen] = useState<Screen>("signin");
  const [services, setServices] = useState<Service[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [current, setCurrent] = useState<Movie | null>(null);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [flowStart, setFlowStart] = useState(0);

  const signedIn = screen !== "signin";

  function log(movie: Movie, outcome: string) {
    setHistory((h) => [{ movie, outcome, at: new Date().toLocaleString() }, ...h]);
  }

  function recommend(nextPrefs: Prefs, excluded: string[]) {
    const movie = findMovie(nextPrefs, services, excluded);
    setPrefs(nextPrefs);
    setCurrent(movie);
    if (movie) {
      setShownIds([...excluded, movie.id]);
      setScreen("pick");
    } else {
      setScreen("nomatch");
    }
  }

  function startFlow() {
    setFlowStart(Date.now());
    recommend({ ...prefs, excludedGenres: [], lighter: false, runtimeCap: 999 }, []);
  }

  function reject(reason: (typeof FOLLOW_UPS)[number]["id"]) {
    if (!current) return;
    const label = FOLLOW_UPS.find((f) => f.id === reason)!.label;
    log(current, `Rejected: ${label.toLowerCase()}`);
    const next = { ...prefs };
    if (reason === "long") next.runtimeCap = current.runtime - 1;
    if (reason === "genre") next.excludedGenres = [...prefs.excludedGenres, current.genre];
    if (reason === "lighter") next.lighter = true;
    recommend(next, shownIds);
  }

  function watch() {
    if (!current) return;
    const seconds = Math.round((Date.now() - flowStart) / 1000);
    log(current, `Opened on ${current.services.find((s) => services.includes(s))} after ${seconds}s`);
    setScreen("handoff");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <button onClick={() => signedIn && setScreen("questions")} className="text-xl font-bold tracking-tight">
            🎬 Cine<span className="text-amber-400">Match</span>
          </button>
          {signedIn && (
            <nav className="flex gap-4 text-sm text-zinc-400">
              <button onClick={() => setScreen("questions")} className="hover:text-white">New pick</button>
              <button onClick={() => setScreen("history")} className="hover:text-white">History</button>
              <button onClick={() => setScreen("setup")} className="hover:text-white">Services</button>
              <button onClick={() => setScreen("signin")} className="hover:text-white">Sign out</button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10">
        {screen === "signin" && (
          <Card title="Find tonight's movie in under two minutes" subtitle="Sign in to save your services, preferences, and history.">
            {/* Visual mockup only: fields are pre-filled and the button just advances. */}
            <div className="flex flex-col gap-3">
              <input readOnly value={DEMO_EMAIL} className={inputClass} />
              <input readOnly type="password" value="password" className={inputClass} />
              <PrimaryButton onClick={() => setScreen(services.length ? "questions" : "setup")}>
                Sign in / Create account
              </PrimaryButton>
            </div>
          </Card>
        )}

        {screen === "setup" && (
          <Card title="Your streaming services" subtitle="We'll only recommend movies you can watch. Region: United States.">
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <Chip
                  key={s}
                  selected={services.includes(s)}
                  onClick={() => setServices(services.includes(s) ? services.filter((x) => x !== s) : [...services, s])}
                >
                  {s}
                </Chip>
              ))}
            </div>
            <PrimaryButton disabled={!services.length} onClick={() => setScreen("questions")} className="mt-6">
              Save and continue
            </PrimaryButton>
          </Card>
        )}

        {screen === "questions" && (
          <Card title="What are you in the mood for tonight?">
            <Label>Mood</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={m} selected={prefs.mood === m} onClick={() => setPrefs({ ...prefs, mood: m })}>{m}</Chip>
              ))}
            </div>
            <Label>How much time do you have?</Label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <Chip key={t.value} selected={prefs.maxRuntime === t.value} onClick={() => setPrefs({ ...prefs, maxRuntime: t.value })}>
                  {t.label}
                </Chip>
              ))}
            </div>
            <Label>Anything else? (optional)</Label>
            <input
              value={prefs.note}
              onChange={(e) => setPrefs({ ...prefs, note: e.target.value })}
              placeholder="e.g. something set by the ocean, no subtitles"
              className={inputClass + " w-full"}
            />
            <PrimaryButton onClick={startFlow} className="mt-6">Find my movie</PrimaryButton>
          </Card>
        )}

        {screen === "pick" && current && (
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="flex h-48 items-end bg-gradient-to-br from-amber-500/40 via-rose-600/30 to-indigo-700/40 p-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-300">Tonight&apos;s pick</p>
                <h2 className="text-3xl font-bold">{current.title}</h2>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <p className="text-sm text-zinc-400">
                {current.year} · {current.runtime} min · {current.genre}
              </p>
              <p>{current.synopsis}</p>
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm">
                <span className="font-semibold text-amber-300">Why this fits: </span>
                {rationale(current, prefs)}
              </div>
              <p className="text-sm text-zinc-400">
                Available on{" "}
                <span className="text-zinc-100">{current.services.filter((s) => services.includes(s)).join(", ")}</span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <PrimaryButton onClick={watch}>
                  ▶ Watch on {current.services.find((s) => services.includes(s))}
                </PrimaryButton>
                <SecondaryButton onClick={() => setScreen("followup")}>Not this one</SecondaryButton>
              </div>
            </div>
          </div>
        )}

        {screen === "followup" && current && (
          <Card title="Got it. What was off?" subtitle={`We'll keep your other answers and find something other than ${current.title}.`}>
            <div className="grid gap-2 sm:grid-cols-2">
              {FOLLOW_UPS.map((f) => (
                <SecondaryButton key={f.id} onClick={() => reject(f.id)}>{f.label}</SecondaryButton>
              ))}
            </div>
          </Card>
        )}

        {screen === "nomatch" && (
          <Card
            title="No match on your services"
            subtitle="We couldn't find a movie on your selected services that fits all of your answers. Try loosening a preference or adding a service."
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <PrimaryButton onClick={() => setScreen("questions")}>Adjust preferences</PrimaryButton>
              <SecondaryButton onClick={() => setScreen("setup")}>Edit services</SecondaryButton>
            </div>
          </Card>
        )}

        {screen === "handoff" && current && (
          <Card
            title={`Enjoy ${current.title}!`}
            subtitle={`In the real app this would open ${current.services.find((s) => services.includes(s))}. It's been saved to your history.`}
          >
            <Label>Quick feedback: how well did this match?</Label>
            <div className="flex gap-2">
              {["👎 Poor", "👌 Okay", "🎯 Spot on"].map((f) => (
                <SecondaryButton key={f} onClick={() => setScreen("history")}>{f}</SecondaryButton>
              ))}
            </div>
          </Card>
        )}

        {screen === "history" && (
          <Card title="Your recommendation history" subtitle={`Signed in as ${DEMO_EMAIL}`}>
            {history.length === 0 ? (
              <p className="text-zinc-400">No recommendations yet.</p>
            ) : (
              <ul className="divide-y divide-zinc-800">
                {history.map((h, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{h.movie.title}</p>
                      <p className="text-xs text-zinc-500">{h.at}</p>
                    </div>
                    <span className="text-right text-sm text-zinc-400">{h.outcome}</span>
                  </li>
                ))}
              </ul>
            )}
            <PrimaryButton onClick={() => setScreen("questions")} className="mt-6">Get a new pick</PrimaryButton>
          </Card>
        )}
      </main>
    </div>
  );
}

const inputClass =
  "rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none";

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-zinc-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 mt-5 text-sm font-medium text-zinc-300 first:mt-0">{children}</p>;
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        selected ? "border-amber-400 bg-amber-400 text-zinc-950" : "border-zinc-700 hover:border-zinc-500"
      }`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40 ${className}`}
    />
  );
}

function SecondaryButton({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-zinc-700 px-5 py-2.5 transition hover:border-zinc-500 hover:bg-zinc-800 ${className}`}
    />
  );
}
