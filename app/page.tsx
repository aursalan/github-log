"use client";

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(15);

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/webhook/events`
      );
      if (!res.ok) return;

      const data: EventData[] = await res.json();
      setEvents(data);

      setLastUpdated(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      setCountdown(15);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const fetchInterval = setInterval(fetchEvents, 15000);
    const countdownInterval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="min-h-screen w-screen bg-white text-neutral-900 flex flex-col relative">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-10 bg-[#f5f7fa] backdrop-blur">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaGithub className="w-5 h-5 text-neutral-900" />
            <span className="text-sm font-semibold">GitHub Log</span>
          </div>

          {lastUpdated && (
            <div className="text-[11px] text-neutral-400 font-mono">
              Last Updated: {lastUpdated}
            </div>
          )}
        </div>

        <div className="h-px bg-neutral-200/40" />
      </header>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 px-4 py-4 font-mono text-xs">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="animate-pulse">●</span>
              <span>listening for events</span>
            </div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="text-neutral-400 italic">no events yet</div>
        )}

        {!loading &&
          events.map((event, idx) => (
            <div key={`${event.author}-${event.action}-${event.timestamp}`}>
              <LogLine event={event} />
              {idx !== events.length - 1 && (
                <div className="ml-2 my-1 h-px bg-neutral-200/40" />
              )}
            </div>
          ))}
      </main>

      {/* ================= COUNTDOWN WIDGET ================= */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="px-3 py-2 rounded-md bg-white border border-neutral-200/50 shadow-sm font-mono text-[11px] text-neutral-500">
          refreshing in <span className="text-neutral-800">{countdown}s</span>
        </div>
      </div>
    </div>
  );
}

/* ================= LOG LINE ================= */

function LogLine({ event }: { event: EventData }) {
  return (
    <div className="px-2 py-1 leading-relaxed text-neutral-800 hover:bg-neutral-100/40 rounded transition">
      {event.action === "PUSH" && (
        <>
          <span className="font-semibold">{event.author}</span>{" "}
          pushed to{" "}
          <span className="font-semibold text-neutral-700">
            {event.to_branch}
          </span>{" "}
          on{" "}
          <span className="text-neutral-400">{event.timestamp}</span>
        </>
      )}

      {event.action === "PULL_REQUEST" && (
        <>
          <span className="font-semibold">{event.author}</span>{" "}
          submitted a pull request from{" "}
          <span className="font-semibold text-neutral-700">
            {event.from_branch}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-neutral-700">
            {event.to_branch}
          </span>{" "}
          on{" "}
          <span className="text-neutral-400">{event.timestamp}</span>
        </>
      )}

      {event.action === "MERGE" && (
        <>
          <span className="font-semibold">{event.author}</span>{" "}
          merged branch{" "}
          <span className="font-semibold text-neutral-700">
            {event.from_branch}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-neutral-700">
            {event.to_branch}
          </span>{" "}
          on{" "}
          <span className="text-neutral-400">{event.timestamp}</span>
        </>
      )}
    </div>
  );
}
