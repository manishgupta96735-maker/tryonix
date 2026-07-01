import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { COLORS } from "./theme";
import { DISPLAY_FONT, BODY_FONT } from "./fonts";
import { Backdrop, Logo } from "./components/Backdrop";

/* ============ AD LONG — 30s ============
   Hook: "68% of online clothes come back."
   CTA: "Get 3 Free Try-Ons" */

export const AdLong = () => (
  <AbsoluteFill style={{ fontFamily: BODY_FONT, background: COLORS.bg }}>
    <Backdrop />
    <Sequence from={0} durationInFrames={120}><StatHook /></Sequence>
    <Sequence from={120} durationInFrames={120}><ProblemMontage /></Sequence>
    <Sequence from={240} durationInFrames={150}><MeetTryOnix /></Sequence>
    <Sequence from={390} durationInFrames={180}><HowItWorks /></Sequence>
    <Sequence from={570} durationInFrames={180}><ResultBig /></Sequence>
    <Sequence from={750} durationInFrames={150}><FinalCTA /></Sequence>
    <PersistentLogo />
  </AbsoluteFill>
);

const PersistentLogo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 60, left: 60, opacity, zIndex: 20 }}>
      <Logo size={56} />
    </div>
  );
};

/* ---- 1. STAT HOOK ---- */
const StatHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.min(68, Math.floor(interpolate(frame, [10, 50], [0, 68], { extrapolateRight: "clamp" })));
  const capOpacity = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const capY = interpolate(spring({ frame: frame - 55, fps, config: { damping: 20 } }), [0, 1], [30, 0]);
  const strike = interpolate(frame, [85, 110], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}>
      <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 380, color: COLORS.primary, letterSpacing: -12, lineHeight: 0.9 }}>
        {count}<span style={{ fontSize: 200, color: COLORS.cream }}>%</span>
      </div>
      <div style={{ marginTop: 40, transform: `translateY(${capY}px)`, opacity: capOpacity, maxWidth: 900, position: "relative" }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 68, color: COLORS.cream, letterSpacing: -1.5, lineHeight: 1.15 }}>
          of clothes bought online<br />get <span style={{ position: "relative" }}>
            returned.
            <div style={{ position: "absolute", left: 0, top: "55%", height: 8, width: `${strike * 100}%`, background: COLORS.accent }} />
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- 2. PROBLEM MONTAGE ---- */
const ProblemMontage = () => {
  const frame = useCurrentFrame();
  const words = ["Wrong fit.", "Wrong size.", "Wrong vibe."];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 24 }}>
      {words.map((w, i) => {
        const start = i * 25;
        const p = spring({ frame: frame - start, fps: 30, config: { damping: 14 } });
        const x = interpolate(p, [0, 1], [i % 2 === 0 ? -400 : 400, 0]);
        return (
          <div key={w} style={{
            transform: `translateX(${x}px) rotate(${i % 2 === 0 ? -2 : 2}deg)`,
            opacity: p,
            fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 140,
            color: COLORS.cream, letterSpacing: -4,
          }}>
            <span style={{ color: COLORS.accent }}>✗</span> {w}
          </div>
        );
      })}
      <div style={{
        marginTop: 40, opacity: interpolate(frame, [90, 115], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: BODY_FONT, fontSize: 40, color: COLORS.muted, fontWeight: 500,
      }}>
        Sound familiar?
      </div>
    </AbsoluteFill>
  );
};

/* ---- 3. MEET TRYONIX ---- */
const MeetTryOnix = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 10, fps, config: { damping: 16 } });
  const bigS = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 30 }}>
      <div style={{
        opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        padding: "12px 28px", borderRadius: 100,
        background: `${COLORS.primary}22`, color: COLORS.primary,
        fontFamily: BODY_FONT, fontWeight: 700, fontSize: 32, letterSpacing: 1,
      }}>
        INTRODUCING
      </div>
      <div style={{ transform: `scale(${bigS})`, textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 260, color: COLORS.cream, letterSpacing: -8, lineHeight: 0.95 }}>
          Try<span style={{ color: COLORS.primary }}>Onix</span>
        </div>
        <div style={{ marginTop: 20, fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 60, color: COLORS.cream, letterSpacing: -1.5 }}>
          The AI fitting room.
        </div>
      </div>
      <div style={{
        marginTop: 30,
        opacity: interpolate(frame, [90, 120], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: BODY_FONT, fontSize: 36, color: COLORS.muted, maxWidth: 800, textAlign: "center",
      }}>
        See yourself in any outfit — before you buy.
      </div>
    </AbsoluteFill>
  );
};

/* ---- 4. HOW IT WORKS ---- */
const HowItWorks = () => {
  const frame = useCurrentFrame();
  const steps = [
    { n: "1", label: "Upload your photo", img: "images/demo-person.jpg" },
    { n: "2", label: "Pick any outfit", img: "images/demo-outfit.jpg" },
    { n: "3", label: "See it on you", img: "images/demo-result.jpg" },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 50 }}>
      <div style={{
        fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 90, color: COLORS.cream, letterSpacing: -3,
        opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        3 easy steps.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {steps.map((s, i) => {
          const start = 15 + i * 25;
          const p = spring({ frame: frame - start, fps: 30, config: { damping: 18 } });
          return (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 32,
              transform: `translateX(${interpolate(p, [0, 1], [-100, 0])}px)`, opacity: p,
            }}>
              <div style={{ width: 220, height: 220, borderRadius: 36, overflow: "hidden", border: `4px solid ${COLORS.primary}66` }}>
                <Img src={staticFile(s.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 80, color: COLORS.primary, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 56, color: COLORS.cream, letterSpacing: -1.5, marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---- 5. RESULT BIG ---- */
const ResultBig = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 20 } });
  const yZoom = interpolate(frame, [0, 180], [1, 1.08]);
  const badge = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const captionOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(spring({ frame: frame - 50, fps, config: { damping: 18 } }), [0, 1], [40, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      <div style={{
        transform: `scale(${scale * yZoom})`,
        width: 820, height: 1100, borderRadius: 48, overflow: "hidden",
        border: `6px solid ${COLORS.primary}`, boxShadow: `0 40px 140px ${COLORS.primary}88`,
        position: "relative",
      }}>
        <Img src={staticFile("images/demo-result.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", top: 30, right: 30,
          transform: `scale(${badge}) rotate(6deg)`,
          background: COLORS.accent, color: COLORS.ink,
          padding: "14px 26px", borderRadius: 100,
          fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 32,
        }}>
          ⚡ 8 seconds
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 100, transform: `translateY(${captionY}px)`, opacity: captionOpacity,
        background: COLORS.cream, color: COLORS.ink,
        padding: "20px 44px", borderRadius: 100,
        fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 52, letterSpacing: -1.5,
      }}>
        Photoreal. On you.
      </div>
    </AbsoluteFill>
  );
};

/* ---- 6. FINAL CTA ---- */
const FinalCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const pulse = 1 + Math.sin(frame * 0.2) * 0.04;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 40, textAlign: "center" }}>
      <div style={{ transform: `scale(${s})` }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 110, color: COLORS.cream, letterSpacing: -3, lineHeight: 1.05 }}>
          Stop returning clothes.
        </div>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 110, color: COLORS.primary, letterSpacing: -3, lineHeight: 1.05 }}>
          Start knowing.
        </div>
      </div>
      <div style={{
        marginTop: 30,
        opacity: interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${pulse})`,
        background: COLORS.primary, color: COLORS.ink,
        padding: "38px 68px", borderRadius: 100,
        fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 56, letterSpacing: -1,
        boxShadow: `0 24px 70px ${COLORS.primary}66`,
      }}>
        Get 3 Free Try-Ons →
      </div>
      <div style={{
        opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: BODY_FONT, fontWeight: 600, fontSize: 44, color: COLORS.cream, marginTop: 8,
      }}>
        tryonix.app
      </div>
      <div style={{
        opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" }),
        fontFamily: BODY_FONT, fontSize: 28, color: COLORS.muted,
      }}>
        No credit card · HD downloads · 8-second results
      </div>
    </AbsoluteFill>
  );
};
