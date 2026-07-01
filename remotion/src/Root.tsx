import { Composition } from "remotion";
import { AdShort } from "./AdShort";
import { AdLong } from "./AdLong";

export const RemotionRoot = () => (
  <>
    <Composition
      id="ad-15s"
      component={AdShort}
      durationInFrames={450} // 15s @ 30fps
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ad-30s"
      component={AdLong}
      durationInFrames={900} // 30s @ 30fps
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
