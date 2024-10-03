export default function manifest() {
  return {
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "Doran Doran",
    short_name: "Doran",
    description: "Korean Learning Platform",
    icons: [
      {
        src: "/bird192.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/bird256.webp",
        sizes: "256x256",
        type: "image/webp",
      },
      {
        src: "/bird512.webp",
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
