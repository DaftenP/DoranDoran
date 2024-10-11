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
        src: "/bird144.webp",
        sizes: "144x144",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/bird192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/bird256.webp",
        sizes: "256x256",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/bird512.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
