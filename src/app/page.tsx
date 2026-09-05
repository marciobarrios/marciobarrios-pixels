import { ArrowUpRight, ChevronDown, MapPin, ArrowUp } from "lucide-react";
import { PixelPortrait } from "@/components/pixel-portrait";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExternalLink, Favicon } from "@/components/external-link";
import { WorkClips } from "@/components/work-clips";
import { PixelPlayground } from "@/components/pixel-playground";
import { projects } from "@/lib/content";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="page-shell" id="top">
        <header className="topbar">
          <a href="#top" className="wordmark" aria-label="Marcio Barrios, back to top">
            mb<span aria-hidden="true">.</span>
          </a>
          <div className="topbar-right">
            <span className="location">
              <MapPin size={12} aria-hidden="true" />
              Barcelona, ES
            </span>
            <ThemeToggle />
          </div>
        </header>
        <main id="main">
          <section className="intro" aria-labelledby="intro-title">
            <div className="identity reveal">
              <PixelPortrait />
              <div>
                <h1 id="intro-title">Marcio Barrios</h1>
                <p className="role">Design Engineer</p>
                <p className="tagline">
                  I move pixels
                  <span className="pixel-period" aria-hidden="true">
                    .
                  </span>
                </p>
              </div>
            </div>
            <div className="intro-copy reveal delay-1">
              <p>
                I turn ideas into interfaces that feel good to use.
                <br className="desktop-break" /> Somewhere between design and code is my happy
                place.
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
                Outside the canvas: family, a game of padel, or a backpack and a one-way ticket. I
                like making things. And going places.
              </p>
            </div>
            <div className="social-links reveal delay-2">
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

          <section className="work-section reveal delay-3" aria-labelledby="work-title">
            <div className="section-header">
              <h2 id="work-title">Work</h2>
              <span>A few chapters</span>
            </div>
            <details className="current-work" open>
              <summary className="work-row">
                <Favicon icon="mito.svg" />
                <div className="work-name">
                  <span>MITO AI</span>
                  <span className="work-role">Product Engineer</span>
                </div>
                <span className="work-years">2026 — now</span>
                <ChevronDown className="work-chevron" size={14} aria-hidden="true" />
              </summary>
              <div className="work-detail">
                <p>
                  As a product engineer at MITO, I turn product ideas and wireframes into fully
                  realized features for an infinite canvas tool used in the filmmaking workflow.
                </p>
                <ExternalLink href="https://mito.ai/">Explore MITO</ExternalLink>
              </div>
            </details>
            <div className="past-work">
              <a
                className="work-row"
                href="https://www.sketch.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Favicon icon="sketch.ico" />
                <span className="work-name">Sketch</span>
                <span className="work-years">2020 — 2025</span>
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                className="work-row"
                href="https://www.xing.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Favicon icon="xing.ico" />
                <span className="work-name">Xing</span>
                <span className="work-years">2013 — 2019</span>
                <ArrowUpRight size={13} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <div className="work-row">
                <span className="tuenti-icon" aria-hidden="true">
                  :)
                </span>
                <span className="work-name">Tuenti</span>
                <span className="work-years">2011 — 2013</span>
                <span className="row-spacer" />
              </div>
            </div>
            <p className="old-days">
              <span aria-hidden="true">↳</span> 20+ years in. The earlier chapters require a Flash
              plugin.
            </p>
          </section>

          <WorkClips />

          <section className="projects-section" aria-labelledby="projects-title">
            <div className="section-header">
              <h2 id="projects-title">Side projects</h2>
              <span>Curiosity, shipped</span>
            </div>
            <div className="project-list">
              {projects.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-row"
                >
                  <Favicon icon={project.icon} />
                  <div className="project-copy">
                    <h3>
                      {project.name}
                      <span className="project-category">{project.category}</span>
                    </h3>
                    <p>{project.description}</p>
                  </div>
                  <ArrowUpRight className="project-arrow" size={15} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </section>

          <section className="closing" aria-label="One last detail">
            <p>Good things happen in the details.</p>
            <p className="closing-secondary">Thanks for noticing a few of mine.</p>
            <PixelPlayground />
          </section>
        </main>
        <footer className="footer">
          <span>© 2026 Marcio Barrios</span>
          <a href="#top">
            Back to top
            <ArrowUp size={12} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </>
  );
}
