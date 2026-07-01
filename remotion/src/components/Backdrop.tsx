import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

export const Backdrop = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 900], [0, 40]);
  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 30% ${20 + drift}%, ${COLORS.primaryDark}55 0%, transparent 55%), radial-gradient(circle at 70% ${80 - drift}%, ${COLORS.primary}33 0%, transparent 60%)`,
        }}
      />
      {/* Grain / vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Logo = ({ size = 56 }: { size?: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
        display: "grid",
        placeItems: "center",
        color: COLORS.cream,
        fontWeight: 900,
        fontSize: size * 0.55,
        boxShadow: `0 4px 20px ${COLORS.primary}55`,
      }}
    >
      T
    </div>
    <div style={{ color: COLORS.cream, fontWeight: 800, fontSize: size * 0.55, letterSpacing: -0.5 }}>
      TryOnix
    </div>
  </div>
);
