import { Config } from "@remotion/cli/config";

// Chromium preinstalado (no hace falta descargar navegador).
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
