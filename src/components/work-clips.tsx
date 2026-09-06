"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Maximize2, Play, Pause } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clips } from "@/lib/content";

function Clip({ clip, moving }: { clip: (typeof clips)[number]; moving: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let visible = false;
    const sync = () => {
      if (visible && moving && !open && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [moving, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="clip">
        <DialogTrigger className="clip-trigger" aria-label={`Watch ${clip.subtitle}`}>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={`/media/${clip.id}.jpg`}
            aria-hidden="true"
            src={`/media/${clip.id}.mp4`}
          />
          <span className="clip-expand">
            <Maximize2 size={13} />
          </span>
        </DialogTrigger>
        <div className="clip-caption">
          <p>{clip.title}</p>
          <span>{clip.subtitle}</span>
        </div>
      </div>
      <DialogContent className="clip-dialog">
        <DialogHeader>
          <DialogTitle>{clip.subtitle}</DialogTitle>
          <DialogDescription>{clip.description}</DialogDescription>
        </DialogHeader>
        {failed ? (
          <p>
            Preview unavailable.{" "}
            <a className="text-link" href={`/media/${clip.id}.mp4`}>
              Open the video
            </a>
            .
          </p>
        ) : (
          <video
            className="expanded-video"
            controls
            muted
            playsInline
            preload="metadata"
            autoPlay={moving}
            poster={`/media/${clip.id}.jpg`}
            src={`/media/${clip.id}.mp4`}
            onError={() => setFailed(true)}
          />
        )}
        <p className="dialog-credit">Product engineering at MITO AI · 2026</p>
      </DialogContent>
    </Dialog>
  );
}

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function reducedMotionSnapshot() {
  return matchMedia(motionQuery).matches;
}
function serverMotionSnapshot() {
  return true;
}

export function WorkClips() {
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    reducedMotionSnapshot,
    serverMotionSnapshot,
  );
  const [preference, setPreference] = useState<boolean | null>(null);
  const moving = preference ?? !reducedMotion;
  return (
    <section className="craft-section" aria-labelledby="craft-title">
      <div className="section-header">
        <div className="craft-heading">
          <h2 id="craft-title">A few things in motion</h2>
          <p className="craft-note">Small details from the MITO canvas. Click for a closer look.</p>
        </div>
        <button
          className="motion-toggle"
          onClick={() => setPreference(!moving)}
          aria-label={moving ? "Pause previews" : "Play previews"}
          aria-pressed={moving}
        >
          <span className="motion-toggle-content">
            {moving ? <Pause size={11} /> : <Play size={11} />}
            <span>{moving ? "Pause" : "Play"}</span>
          </span>
        </button>
      </div>
      <div className="clip-grid">
        {clips.map((clip) => (
          <Clip key={clip.id} clip={clip} moving={moving} />
        ))}
      </div>
    </section>
  );
}
