import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-7 text-[11px]",
  md: "size-9 text-[13px]",
  lg: "size-12 text-[16px]",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={48}
        height={48}
        className={cn("rounded-full object-cover shrink-0", sizeClasses[size], className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-subtle text-brand font-semibold shrink-0",
        sizeClasses[size],
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
