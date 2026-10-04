import localFont from "next/font/local";

export const inter = localFont({
  src: "../public/fonts/font-2.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "300 700",
});

export const playfair = localFont({
  src: "../public/fonts/font-29.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 700",
});
