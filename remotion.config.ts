import { Config } from "@remotion/cli/config";
import fs from "fs";

// En el servidor en la nube hay un Chromium preinstalado; en tu PC Remotion descarga el suyo solo.
const cloudChromium = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(cloudChromium)) Config.setBrowserExecutable(cloudChromium);
Config.setVideoImageFormat("jpeg");
