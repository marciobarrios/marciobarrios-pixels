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
        <DialogTrigger
          className="clip-trigger group relative block aspect-[1.2] w-full overflow-hidden rounded-[9px] bg-[#131313] shadow-[0_0_0_1px_#0000000c,0_3px_6px_#00000006] max-[600px]:aspect-[0.9] max-[600px]:rounded-[7px]"
          aria-label={`Watch ${clip.subtitle}`}
        >
          <video
            className="pointer-events-none size-full object-contain transition-transform duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-fine:group-hover:scale-[1.035]"
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={`/media/${clip.id}.jpg`}
            aria-hidden="true"
            src={`/media/${clip.id}.mp4`}
          />
          <span className="clip-expand absolute right-2 bottom-2 translate-y-[3px] rounded-[5px] border border-[#ffffff12] bg-[#ffffff1c] p-1.5 text-white opacity-0 transition-[translate,opacity] duration-180 ease-[ease] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 max-[600px]:right-[5px] max-[600px]:bottom-[5px] max-[600px]:p-1 max-[600px]:opacity-80">
            <Maximize2 size={13} />
          </span>
        </DialogTrigger>
        <div className="clip-caption mt-3 leading-[1.55] max-[600px]:mt-2">
          <p className="text-[11px] leading-[inherit] font-medium tracking-[-0.25px] max-[600px]:text-[10px] max-[600px]:leading-[1.6]">
            {clip.title}
          </p>
          <span className="text-[10px] text-muted-foreground max-[600px]:mt-[3px] max-[600px]:block">
            {clip.subtitle}
          </span>
        </div>
      </div>
      <DialogContent className="clip-dialog max-h-[calc(100dvh-32px)] w-[min(780px,calc(100vw-32px))] max-w-[min(780px,calc(100vw-32px))] gap-[18px] overflow-y-auto p-6 [&_[data-slot=dialog-close]]:size-11">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-[14px]">{clip.subtitle}</DialogTitle>
          <DialogDescription className="text-[11px] leading-[1.8]">
            {clip.description}
          </DialogDescription>
        </DialogHeader>
        {failed ? (
          <p>
            Preview unavailable.{" "}
            <a className="text-link underline underline-offset-4" href={`/media/${clip.id}.mp4`}>
              Open the video
            </a>
            .
          </p>
        ) : (
          <video
            className="expanded-video max-h-[64dvh] w-full rounded-[6px] bg-[#131313]"
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
        <p className="dialog-credit text-[10px] text-muted-foreground">
          Product engineering at MITO AI · 2026
        </p>
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
    <section className="craft-section mt-[49px] max-[600px]:mt-9" aria-labelledby="craft-title">
      <div className="section-header mb-3.5 flex min-h-6 items-end justify-between">
        <div className="craft-heading">
          <h2 id="craft-title" className="text-[12px] font-[550] tracking-[-0.25px]">
            A few things in motion
          </h2>
          <p className="craft-note mt-[3px] text-[12px] text-muted-foreground max-[600px]:leading-[1.8]">
            Small details from the MITO canvas.{" "}
            <span className="craft-note-click inline max-[600px]:block">
              Click for a closer look.
            </span>
          </p>
        </div>
        <button
          className="motion-toggle inline-flex min-h-11 min-w-[55px] items-end justify-end text-[10px] text-muted-foreground"
          onClick={() => setPreference(!moving)}
          aria-label={moving ? "Pause previews" : "Play previews"}
          aria-pressed={moving}
        >
          <span className="motion-toggle-content inline-flex items-center gap-1.5">
            {moving ? <Pause size={11} /> : <Play size={11} />}
            <span>{moving ? "Pause" : "Play"}</span>
          </span>
        </button>
      </div>
      <div className="clip-grid grid grid-cols-3 gap-3 max-[600px]:gap-2">
        {clips.map((clip) => (
          <Clip key={clip.id} clip={clip} moving={moving} />
        ))}
      </div>
    </section>
  );
}
