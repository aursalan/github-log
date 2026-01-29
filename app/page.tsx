"use client";

import { useEffect, useState } from "react";
import { GitCommit, GitPullRequest, GitMerge, GitPullRequestArrow } from "lucide-react";

/* ================= TYPES ================= */

interface EventData {
  author: string;
  action: "PUSH" | "PULL_REQUEST" | "MERGE";
  from_branch: string;
  to_branch: string;
  timestamp: string;
}

/* ================= MAIN ================= */

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        "https://7e08de3b8067.ngrok-free.app/webhook/events"
      );
      if (!res.ok) return;
      setEvents(await res.json());
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvents();
    const i = setInterval(fetchEvents, 15000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-white text-neutral-900">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          
          <div>
            <h1 className="text-lg font-medium text-neutral-800">
              GitHub Log
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5 max-w-xl">
              Track pushes, pull requests, and merges.
            </p>
          </div>

          {lastUpdated && (
            <div className="text-xs text-neutral-400 whitespace-nowrap sm:pt-1">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-3 sm:px-6 py-4">
        <div className="divide-y divide-neutral-200 font-mono text-sm">
          {events.length === 0 && (
            <div className="px-4 py-6 text-neutral-400">
              waiting for events…
            </div>
          )}

          {events.map((event, i) => (
            <LogRow key={i} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= LOG ROW ================= */

function LogRow({ event }: { event: EventData }) {
  const config = {
    PUSH: {
      icon: <GitCommit size={14} />,
      text: `${event.author} pushed → ${event.to_branch}`,
    },
    PULL_REQUEST: {
      icon: <GitPullRequestArrow size={14} />,
      text: `${event.author} opened pull request ${event.from_branch} → ${event.to_branch}`,
    },
    MERGE: {
      icon: <GitMerge size={14} />,
      text: `${event.author} merged ${event.from_branch} → ${event.to_branch}`,
    },
  }[event.action];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3">
      
      {/* Left cluster */}
      <div className="flex items-center gap-2 shrink-0 text-neutral-500">
        {config.icon}
        <span className="sm:hidden text-neutral-400">
          {event.timestamp}
        </span>
      </div>

      {/* Timestamp (desktop) */}
      <div className="hidden sm:block text-neutral-400 shrink-0 whitespace-nowrap">
        {event.timestamp}
      </div>

      {/* Message */}
      <div className="flex-1 text-neutral-800 leading-relaxed">
        {config.text}
      </div>
    </div>
  );
}
