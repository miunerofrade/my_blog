import Link from "next/link";
import type { ReactNode } from "react";

type CupertinoLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function CupertinoButton({
  href,
  children,
  className = "",
  external = false,
}: CupertinoLinkProps) {
  const classes = `cupertino-button ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function CupertinoCard({
  href,
  children,
  className = "",
  external = false,
}: CupertinoLinkProps) {
  const classes = `cupertino-card ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function CupertinoSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`cupertino-section ${className}`.trim()}>{children}</section>;
}
