import { loadFont as loadDisplay } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const display = loadDisplay("normal", { weights: ["700", "800"], subsets: ["latin"] });
const body = loadBody("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const DISPLAY_FONT = display.fontFamily;
export const BODY_FONT = body.fontFamily;
