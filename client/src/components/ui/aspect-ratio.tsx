import { React, type AspectRatioProps } from "@/common/react-import";

/**
 * AspectRatio component that maintains a consistent width-to-height ratio.
 * This is a custom implementation that doesn't rely on @radix-ui/react-aspect-ratio.
 */
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${100 / ratio}%`,
          ...style,
        }}
        {...props}
      >
        {props.children && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {props.children}
          </div>
        )}
      </div>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };