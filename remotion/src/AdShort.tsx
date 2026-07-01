import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { COLORS } from "./theme";
import { DISPLAY_FONT, BODY_FONT } from "./fonts";
import { Backdrop, Logo } from "./components/Backdrop";

/* ============ AD SHORT — 15s ============
   Hook: "Stop guessing."   CTA: "Try it Free" */

export const AdShort = () => (
  <AbsoluteFill style={{ fontFamily: BODY_FONT, background: COLORS.bg }}>
    <Backdrop />
    <Sequence from={0} durationInFrames={75}><SceneHook /></Sequence>
    <Sequence from={75} durationInFrames={90}><SceneProblem /></Sequence>
    <Sequence from={165} durationInFrames={135}><SceneReveal /></Sequence>
    <Sequence from={300} durationInFrames={90}><SceneProof /></Sequence>
    <Sequence from={390} durationInFrames={60}><SceneCTA /></Sequence>
    <PersistentLogo />
  </AbsoluteFill>
);

const PersistentLogo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 60, left: 60, opacity, zIndex: 10 }}>
      <Logo size={56} />
    </div>
  );
};

/* ---- Scene 1: HOOK ---- */
const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const y = interpolate(s, [0, 1], [80, 0]);
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const under = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ transform: `translateY(${y}px) scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 200, color: COLORS.cream, lineHeight: 0.95, letterSpacing: -6 }}>
          Stop
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 200, color: COLORS.primary, lineHeight: 0.95, letterSpacing: -6 }}>
            guessing.
          </div>
          <div style={{ position: "absolute", left: 0, bottom: 10, height: 12, width: `${under * 100}%`, background: COLORS.accent, borderRadius: 6 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---- Scene 2: PROBLEM ---- */
const SceneProblem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });
  const y = interpolate(s, [0, 1], [40, 0]);
  const shake = Math.sin(frame * 0.5) * 4;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ transform: `translateY(${y}px)`, textAlign: "center", maxWidth: 900 }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 110, color: COLORS.cream, lineHeight: 1, letterSpacing: -3 }}>
          "Will this <span style={{ color: COLORS.accent, transform: `rotate(${shake}deg)`, display: "inline-block" }}>actually</span> look good on me?"
        </div>
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 30, opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }) }}>
        <ProblemCard label="?" />
        <ProblemCard label="?" />
        <ProblemCard label="?" />
      </div>
    </AbsoluteFill>
  );
};

const ProblemCard = ({ label }: { label: string }) => (
  <div style={{
    width: 200, height: 260, borderRadius: 28,
    border: `3px dashed ${COLORS.muted}`,
    display: "grid", placeItems: "center",
    fontSize: 120, color: COLORS.muted, fontFamily: DISPLAY_FONT, fontWeight: 800,
  }}>{label}</div>
);

/* ---- Scene 3: REVEAL ---- */
const SceneReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const personX = interpolate(spring({ frame: frame - 5, fps, config: { damping: 20 } }), [0, 1], [-600, 0]);
  const outfitX = interpolate(spring({ frame: frame - 20, fps, config: { damping: 20 } }), [0, 1], [600, 0]);
  const plus = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const resultScale = spring({ frame: frame - 60, fps, config: { damping: 12 } });
  const flash = interpolate(frame, [60, 70, 90], [0, 0.7, 0], { extrapolateRight: "clamp" });
  const captionY = interpolate(spring({ frame: frame - 80, fps, config: { damping: 18 } }), [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* Result reveal (behind) */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${resultScale})`, opacity: resultScale }}>
        <div style={{ width: 720, height: 900, borderRadius: 40, overflow: "hidden", border: `6px solid ${COLORS.primary}`, boxShadow: `0 40px 120px ${COLORS.primary}66` }}>
          <Img src={staticFile("images/demo-result.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Ingredients row (in front when result hidden) */}
      {frame < 65 && (
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <SmallCard src={staticFile("images/demo-person.jpg")} tag="You" transform={`translateX(${personX}px)`} />
          <div style={{ fontSize: 100, color: COLORS.primary, fontFamily: DISPLAY_FONT, fontWeight: 800, opacity: plus }}>+</div>
          <SmallCard src={staticFile("images/demo-outfit.jpg")} tag="Any outfit" transform={`translateX(${outfitX}px)`} />
        </div>
      )}

      {/* Flash */}
      <AbsoluteFill style={{ background: "white", opacity: flash, pointerEvents: "none" }} />

      {/* Caption */}
      <div style={{ position: "absolute", bottom: 120, transform: `translateY(${captionY}px)`, opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateRight: "clamp" }) }}>
        <div style={{
          padding: "18px 36px", borderRadius: 100,
          background: COLORS.cream, color: COLORS.ink,
          fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 48, letterSpacing: -1,
        }}>
          Actually see it. ✨
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SmallCard = ({ src, tag, transform }: { src: string; tag: string; transform: string }) => (
  <div style={{ transform }}>
    <div style={{ width: 340, height: 440, borderRadius: 32, overflow: "hidden", border: `3px solid ${COLORS.cream}22`, position: "relative" }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", top: 16, left: 16, background: COLORS.cream, color: COLORS.ink, padding: "6px 14px", borderRadius: 100, fontSize: 20, fontWeight: 700 }}>{tag}</div>
    </div>
  </div>
);

/* ---- Scene 4: PROOF ---- */
const SceneProof = () => {
  const frame = useCurrentFrame();
  const items = ["Photoreal AI", "10-second results", "HD downloads"];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100, gap: 30 }}>
      <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 90, color: COLORS.cream, letterSpacing: -3, marginBottom: 20 }}>
        Why <span style={{ color: COLORS.primary }}>TryOnix</span>?
      </div>
      {items.map((label, i) => {
        const start = i * 15;
        const p = spring({ frame: frame - start, fps: 30, config: { damping: 16 } });
        return (
          <div key={label} style={{
            transform: `translateX(${interpolate(p, [0, 1], [-200, 0])}px)`, opacity: p,
            display: "flex", alignItems: "center", gap: 24,
            background: COLORS.bgSoft, border: `2px solid ${COLORS.primary}44`,
            padding: "28px 44px", borderRadius: 100,
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: COLORS.primary, display: "grid", placeItems: "center", color: COLORS.ink, fontWeight: 900, fontSize: 32 }}>✓</div>
            <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 56, color: COLORS.cream }}>{label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---- Scene 5: CTA ---- */
const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame * 0.25) * 0.03;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, gap: 40 }}>
      <div style={{ transform: `scale(${s})`, textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 130, color: COLORS.cream, letterSpacing: -4, lineHeight: 1 }}>
          Try it <span style={{ color: COLORS.primary }}>Free.</span>
        </div>
      </div>
      <div style={{ transform: `scale(${pulse})`, background: COLORS.primary, color: COLORS.ink, padding: "36px 72px", borderRadius: 100, fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 64, letterSpacing: -1, boxShadow: `0 20px 60px ${COLORS.primary}66` }}>
        tryonix.app →
      </div>
      <div style={{ fontFamily: BODY_FONT, fontSize: 32, color: COLORS.muted, marginTop: 12 }}>
        3 free try-ons · No credit card
      </div>
    </AbsoluteFill>
  );
};
