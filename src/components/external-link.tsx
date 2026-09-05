import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Favicon({ icon, className }: { icon: string; className?: string }) {
  return (
    <span className={cn("favicon", className)} aria-hidden="true">
      <Image src={`/icons/${icon}`} alt="" width={20} height={20} unoptimized />
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
      className={cn("inline-link", className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon ? <Favicon icon={icon} /> : null}
      <span>{children}</span>
      <ArrowUpRight className="external-arrow" size={12} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
