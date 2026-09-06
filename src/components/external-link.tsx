import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const faviconVariants = cva(
  "favicon inline-flex shrink-0 items-center justify-center rounded-[5px] align-[-4px] [transition:transform_220ms_cubic-bezier(0.2,0.8,0.2,1),filter_180ms_ease] pointer-fine:group-hover:-translate-y-0.5 pointer-fine:group-hover:-rotate-[8deg] pointer-fine:group-hover:scale-[1.08]",
  {
    variants: {
      size: {
        default: "size-[22px]",
        inline: "size-[15px] self-center",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export function Favicon({
  icon,
  className,
  size,
}: {
  icon: string;
  className?: string;
} & VariantProps<typeof faviconVariants>) {
  const invertInDark = icon === "github.ico" || icon === "compra.ico";

  return (
    <span className={cn(faviconVariants({ size }), className)} aria-hidden="true">
      <Image
        className={cn(
          "rounded-[3px] object-contain",
          size === "inline" ? "size-3.5" : "size-[18px]",
          invertInDark && "dark:invert",
        )}
        src={`/icons/${icon}`}
        alt=""
        width={20}
        height={20}
        unoptimized
      />
    </span>
  );
}

export function ExternalLink({
  href,
  icon,
  children,
  className,
}: {
  href: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={cn(
        "inline-link group inline-flex items-baseline gap-[5px] whitespace-nowrap align-baseline text-foreground",
        className,
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon ? <Favicon icon={icon} size="inline" /> : null}
      <span className="underline decoration-border underline-offset-4 transition-[text-decoration-color] duration-160 ease-[ease] pointer-fine:group-hover:decoration-primary">
        {children}
      </span>
      <ArrowUpRight
        className="external-arrow self-center opacity-55 transition-[transform,opacity] duration-180 ease-[ease] pointer-fine:group-hover:translate-x-px pointer-fine:group-hover:-translate-y-px pointer-fine:group-hover:opacity-100"
        size={12}
        aria-hidden="true"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
