type CtaLayout = "center" | "left" | "right";

interface LayoutIconProps {
  layout: CtaLayout;
  isActive: boolean;
}

export default function CtaLayoutIcon({ layout, isActive }: LayoutIconProps) {
  const dotColor = "#050505";
  const lineColor = isActive ? "#050505" : "#747474";

  const container = isActive ? (
    <path
      d="M0 8C0 3.58172 3.58172 0 8 0H72.6667C77.085 0 80.6667 3.58172 80.6667 8V70C80.6667 74.4183 77.0849 78 72.6667 78H7.99999C3.58171 78 0 74.4183 0 70V8Z"
      fill="#EDEDED"
    />
  ) : (
    <>
      <mask id={`cta-mask-${layout}`} fill="white">
        <path d="M0 8C0 3.58172 3.58172 0 8 0H72.6667C77.085 0 80.6667 3.58172 80.6667 8V70C80.6667 74.4183 77.0849 78 72.6667 78H7.99999C3.58171 78 0 74.4183 0 70V8Z" />
      </mask>
      <path
        d="M8 0V0.85H72.6667V0V-0.85H8V0ZM80.6667 8H79.8167V70H80.6667H81.5167V8H80.6667ZM72.6667 78V77.15H7.99999V78V78.85H72.6667V78ZM0 70H0.85V8H0H-0.85V70H0ZM7.99999 78V77.15C4.05116 77.15 0.85 73.9488 0.85 70H0H-0.85C-0.85 74.8877 3.11227 78.85 7.99999 78.85V78ZM80.6667 70H79.8167C79.8167 73.9488 76.6155 77.15 72.6667 77.15V78V78.85C77.5544 78.85 81.5167 74.8877 81.5167 70H80.6667ZM72.6667 0V0.85C76.6155 0.85 79.8167 4.05116 79.8167 8H80.6667H81.5167C81.5167 3.11228 77.5544 -0.85 72.6667 -0.85V0ZM8 0V-0.85C3.11228 -0.85 -0.85 3.11228 -0.85 8H0H0.85C0.85 4.05116 4.05116 0.85 8 0.85V0Z"
        fill="#EDEDED"
        mask={`url(#cta-mask-${layout})`}
      />
    </>
  );

  const shapes: Record<CtaLayout, React.ReactNode> = {
    center: (
      <>
        <circle cx="40.332" cy="22" r="6" fill={dotColor} />
        <rect x="14.332" y="33" width="52" height="4" fill={lineColor} />
        <rect x="8" y="41" width="64.6667" height="4" fill={lineColor} />
        <rect x="24.332" y="50" width="32" height="12" fill={dotColor} />
      </>
    ),
    left: (
      <>
        <circle cx="14" cy="22" r="6" fill={dotColor} />
        <rect x="8" y="33" width="52" height="4" fill={lineColor} />
        <rect x="8" y="41" width="64.6667" height="4" fill={lineColor} />
        <rect x="8" y="50" width="32" height="12" fill={dotColor} />
      </>
    ),
    right: (
      <>
        <circle cx="66.668" cy="22" r="6" fill={dotColor} />
        <rect x="20.668" y="33" width="52" height="4" fill={lineColor} />
        <rect x="8" y="41" width="64.6667" height="4" fill={lineColor} />
        <rect x="40.668" y="50" width="32" height="12" fill={dotColor} />
      </>
    ),
  };

  return (
    <svg
      width="81"
      height="78"
      viewBox="0 0 81 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
    >
      {container}
      {shapes[layout]}
    </svg>
  );
}
