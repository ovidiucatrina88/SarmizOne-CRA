import { React, type BadgeProps } from "@/common/react-import";
import { cn } from "@/lib/utils";

/**
 * Badge component for displaying status, counts, or indicators.
 * This is a custom implementation that doesn't rely on external dependencies.
 */

const badgeVariantStyles = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
};

const badgeBaseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(badgeBaseClasses, badgeVariantStyles[variant], className)}
        {...props} 
      />
    );
  }
);

Badge.displayName = "Badge";

// Export a compatible badgeVariants function for backward compatibility
const badgeVariants = (options?: { variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  const variant = options?.variant || "default";
  return cn(badgeBaseClasses, badgeVariantStyles[variant]);
};

export { Badge, badgeVariants };