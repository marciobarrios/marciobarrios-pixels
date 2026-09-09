import { ArrowUpRight, ChevronDown, MapPin, ArrowUp } from "lucide-react";
import { PixelPortrait } from "@/components/pixel-portrait";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExternalLink, Favicon } from "@/components/external-link";
import { WorkClips } from "@/components/work-clips";
import { PixelPlayground } from "@/components/pixel-playground";
import { RotatingTagline } from "@/components/rotating-tagline";
import { SoundDetails } from "@/components/sound-effects";
import { projects } from "@/lib/content";

export default function Home() {
  return (
    <>
      <a
        className="skip-link fixed top-2.5 left-2.5 z-60 -translate-y-[150%] bg-popover px-4 py-2.5 focus:translate-y-0"
        href="#main"
        data-cuelume-hover="tick"
      >
        Skip to content
      </a>
      <div
        className="page-shell mx-auto w-[min(calc(100%-48px),644px)] max-[600px]:w-[calc(100%-40px)]"
        id="top"
      >
        <header className="topbar flex items-center justify-between pt-[30px] max-[600px]:pt-[15px]">
          <a
            href="#top"
            className="wordmark inline-flex min-h-11 items-center text-[21px] font-semibold tracking-[-2px] [&>span]:text-primary"
            aria-label="Marcio Barrios, back to top"
            data-cuelume-hover="tick"
          >
            mb<span aria-hidden="true">.</span>
          </a>
          <div className="topbar-right flex items-center gap-[17px] max-[600px]:gap-2">
            <span className="location flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin size={12} aria-hidden="true" />
              Barcelona, ES
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main id="main">
          <section className="intro mt-[68px] max-[600px]:mt-[45px]" aria-labelledby="intro-title">
            <div className="identity reveal flex items-center gap-[25px] motion-safe:animate-appear max-[600px]:gap-[21px] max-[360px]:gap-[15px]">
              <PixelPortrait />
              <div>
                <h1
                  id="intro-title"
                  className="-mt-1 text-[24px] leading-[1.45] font-[550] tracking-[-1.15px]"
                >
                  Marcio Barrios
                </h1>
                <p className="role mt-px text-[12px] text-(--secondary)">Design Engineer</p>
                <RotatingTagline />
              </div>
            </div>
            <div className="intro-copy reveal mt-[34px] text-[14px] leading-[1.95] tracking-[-0.25px] text-(--secondary) motion-safe:animate-appear motion-safe:[animation-delay:80ms] max-[600px]:mt-[29px] [&>p+p]:mt-[18px]">
              <p>
                I turn ideas into interfaces that feel good to use.
                <br className="desktop-break max-[600px]:hidden" /> Somewhere between design and
                code is my happy place.
              </p>
              <p>
                Currently a Product Engineer at{" "}
                <ExternalLink href="https://mito.ai/" icon="mito.svg">
                  MITO AI
                </ExternalLink>
                , building tools for filmmakers. Previously, I helped shape the web at{" "}
                <ExternalLink href="https://www.sketch.com/" icon="sketch.ico">
                  Sketch
                </ExternalLink>
                .
              </p>
              <p>
                Outside the canvas: family, a game of padel, or backpacking with the kids in tow.
                Always taking photos, still playing football on Sundays.
              </p>
              <p>I like making things. And going places.</p>
            </div>
            <div className="social-links reveal mt-[18px] flex flex-wrap gap-6 text-[11px] motion-safe:animate-appear motion-safe:[animation-delay:150ms] max-[600px]:mt-[15px] max-[600px]:gap-[21px] max-[360px]:gap-4 [&>a]:min-h-11 [&>a]:items-center">
              <ExternalLink href="https://github.com/marciobarrios" icon="github.ico">
                GitHub
              </ExternalLink>
              <ExternalLink href="https://www.linkedin.com/in/marciobarrios/" icon="linkedin.ico">
                LinkedIn
              </ExternalLink>
              <ExternalLink href="https://x.com/marciobarrios" icon="x.ico">
                X / Twitter
              </ExternalLink>
            </div>
          </section>

          <section
            className="work-section reveal mt-[53px] motion-safe:animate-appear motion-safe:[animation-delay:210ms] max-[600px]:mt-[38px]"
            aria-labelledby="work-title"
          >
            <div className="section-header mb-5 flex min-h-6 items-center justify-between max-[600px]:mb-[15px]">
              <h2 id="work-title" className="text-[12px] font-[550] tracking-[-0.25px]">
                Work
              </h2>
              <span className="text-[11px] text-muted-foreground">A few chapters</span>
            </div>
            <SoundDetails className="current-work group/current rounded-[10px] border border-border bg-[color-mix(in_srgb,var(--muted)_48%,transparent)] px-4 max-[600px]:px-3">
              <summary className="work-row flex min-h-[58px] list-none items-center gap-3.5 text-[12px] max-[600px]:gap-2.5 [&::-webkit-details-marker]:hidden">
                <Favicon icon="mito.svg" />
                <div className="work-name flex-1 font-medium tracking-[-0.2px]">
                  <span className="flex items-center gap-2">MITO AI</span>
                  <span className="work-role mt-[3px] block text-[11px] font-normal text-(--secondary)">
                    Product Engineer
                  </span>
                </div>
                <span className="work-years whitespace-nowrap text-[11px] font-normal text-muted-foreground">
                  2026 — now
                </span>
                <ChevronDown
                  className="work-chevron -rotate-90 text-muted-foreground transition-transform duration-200 ease-[ease] group-open/current:rotate-0"
                  size={14}
                  aria-hidden="true"
                />
              </summary>
              <div className="work-detail invisible grid grid-rows-[0fr] overflow-hidden opacity-0 pointer-events-none transition-[grid-template-rows,opacity,visibility] duration-[220ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none group-open/current:pointer-events-auto group-open/current:visible group-open/current:grid-rows-[1fr] group-open/current:opacity-100">
                <div className="min-h-0 overflow-hidden px-[15px] pt-0.5 pb-[18px] pl-9 text-[12px] leading-[1.9] text-(--secondary) max-[600px]:pr-1 max-[600px]:pl-8">
                  <p>
                    As a product engineer at MITO, I turn product ideas and wireframes into fully
                    realized features for an infinite canvas tool used in the filmmaking workflow.
                  </p>
                  <ExternalLink
                    className="mt-2.5 min-h-8 items-center text-[11px]"
                    href="https://mito.ai/"
                  >
                    Explore MITO
                  </ExternalLink>
                </div>
              </div>
            </SoundDetails>
            <div className="past-work px-[17px] pt-1 max-[600px]:px-[13px]">
              <a
                className="work-row group flex min-h-[49px] items-center gap-3.5 text-[12px] [&>svg]:text-muted-foreground pointer-fine:hover:[&_.work-name]:text-primary max-[600px]:gap-2.5 max-[360px]:gap-2"
                href="https://www.sketch.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-cuelume-hover="tick"
              >
                <Favicon icon="sketch.ico" />
                <span className="work-name flex-1 font-medium tracking-[-0.2px]">Sketch</span>
                <span className="work-years whitespace-nowrap text-[11px] font-normal text-muted-foreground">
                  2020 — 2025
                </span>
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                className="work-row group flex min-h-[49px] items-center gap-3.5 text-[12px] [&>svg]:text-muted-foreground pointer-fine:hover:[&_.work-name]:text-primary max-[600px]:gap-2.5 max-[360px]:gap-2"
                href="https://www.xing.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-cuelume-hover="tick"
              >
                <Favicon icon="xing.svg" />
                <span className="work-name flex-1 font-medium tracking-[-0.2px]">Xing</span>
                <span className="work-years whitespace-nowrap text-[11px] font-normal text-muted-foreground">
                  2013 — 2019
                </span>
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <div className="work-row flex min-h-[49px] items-center gap-3.5 text-[12px] max-[600px]:gap-2.5 max-[360px]:gap-2">
                <Favicon icon="tuenti.svg" />
                <span className="work-name flex-1 font-medium tracking-[-0.2px]">Tuenti</span>
                <span className="work-years whitespace-nowrap text-[11px] font-normal text-muted-foreground">
                  2011 — 2013
                </span>
                <span className="row-spacer w-[13px]" />
              </div>
            </div>
            <p className="old-days mt-4 ml-[18px] flex gap-3 text-[11px] leading-[1.8] text-muted-foreground max-[600px]:ml-[13px]">
              <span aria-hidden="true">↳</span> 20+ years in. The earlier chapters require a Flash
              plugin.
            </p>
          </section>

          <WorkClips />

          <section
            className="projects-section mt-14 max-[600px]:mt-[42px]"
            aria-labelledby="projects-title"
          >
            <div className="section-header mb-[17px] flex min-h-6 items-center justify-between">
              <h2 id="projects-title" className="text-[12px] font-[550] tracking-[-0.25px]">
                Side projects
              </h2>
              <span className="text-[11px] text-muted-foreground">Curiosity, shipped</span>
            </div>
            <div className="project-list flex flex-col gap-0">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cuelume-hover="sparkle"
                  className="project-row group -mx-[9px] flex items-start gap-[15px] rounded-[8px] px-[9px] py-[15px] transition-[background-color] duration-180 ease-[ease] pointer-fine:hover:bg-muted max-[600px]:gap-3 max-[600px]:py-3.5"
                >
                  <Favicon icon={project.icon} />
                  <div className="project-copy min-w-0 flex-1">
                    <h3 className="text-[14px] leading-[22px] font-medium tracking-[-0.3px]">
                      {project.name}
                      <span className="project-category ml-3 inline-block -translate-x-1 text-[11px] font-normal text-muted-foreground opacity-0 transition-[translate,opacity] duration-180 ease-[ease] group-focus-visible:translate-x-0 group-focus-visible:opacity-100 pointer-fine:group-hover:translate-x-0 pointer-fine:group-hover:opacity-100 max-[600px]:hidden">
                        {project.category}
                      </span>
                    </h3>
                    <p className="mt-[3px] text-[12px] leading-[1.8] tracking-[-0.15px] text-(--secondary)">
                      {project.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="project-arrow mt-1 shrink-0 text-muted-foreground opacity-60 transition-[translate,opacity] duration-180 ease-[ease] pointer-fine:group-hover:translate-x-px pointer-fine:group-hover:-translate-y-px pointer-fine:group-hover:opacity-100 max-[600px]:w-3"
                    size={15}
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </section>

          <section
            className="closing mt-[52px] border-t border-border pt-[33px] text-[12px] leading-[1.9] max-[600px]:mt-[39px] max-[600px]:pt-[27px]"
            aria-label="One last detail"
          >
            <p>Good things happen in the details.</p>
            <p className="closing-secondary text-(--secondary)">
              Thanks for noticing a few of mine.
            </p>
            <PixelPlayground />
          </section>
        </main>
        <footer className="footer flex items-center justify-between border-t border-border py-4 pb-6 text-[11px] text-muted-foreground [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center [&>a]:gap-[7px]">
          <span>© 2026 Marcio Barrios</span>
          <a className="pointer-fine:hover:text-primary" href="#top" data-cuelume-toggle="pulse">
            Back to top
            <ArrowUp size={12} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </>
  );
}
