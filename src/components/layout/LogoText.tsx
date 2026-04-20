import { cn } from "@/lib/utils";

export function LogoText({ animated = true, className }: { animated?: boolean, className?: string }) {
  if (!animated) {
    return <span className={className}>SMaRT-Lab</span>;
  }

  return (
    <span className={cn("contents", className)}>
      <span className="inline-block animate-logo-sm-squeeze">SM</span>
      <span className="relative inline-block animate-logo-a-pop">a</span>
      <span className="inline-block animate-logo-rt-squeeze">RT</span>
      <span className="inline-block">-Lab</span>
    </span>
  );
}
