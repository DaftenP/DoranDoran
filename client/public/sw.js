if (!self.define) {
  let e,
    a = {};
  const c = (c, i) => (
    (c = new URL(c + ".js", i).href),
    a[c] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = a), document.head.appendChild(e);
        } else (e = c), importScripts(c), a();
      }).then(() => {
        let e = a[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, s) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[t]) return;
    let n = {};
    const d = (e) => c(e, t),
      r = { module: { uri: t }, exports: n, require: d };
    a[t] = Promise.all(i.map((e) => r[e] || d(e))).then((e) => (s(...e), n));
  };
}
define(["./workbox-c2c0676f"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/1444-d47e228f08b7a1ec.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/1704-6469e611d10fccee.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/1707.f01b750b7ef74db8.js",
          revision: "f01b750b7ef74db8",
        },
        {
          url: "/_next/static/chunks/231-489bfb38812805ce.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/2403-fa854ff78552089c.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/334.86d99e80ff894e59.js",
          revision: "86d99e80ff894e59",
        },
        {
          url: "/_next/static/chunks/3989-33ac30d08baf02ea.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/458.40ceacf8b6684cb8.js",
          revision: "40ceacf8b6684cb8",
        },
        {
          url: "/_next/static/chunks/6862-b087ed6bf7ae041d.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/7257-5669a5208f4a9138.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/759.90cc8a38a1376636.js",
          revision: "90cc8a38a1376636",
        },
        {
          url: "/_next/static/chunks/8087-b679c9004418cb0c.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/8173-399cb80afcd02d88.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/8472-e2ee0ff0b3f2d237.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/9672.ebdecadfe3754b9c.js",
          revision: "ebdecadfe3754b9c",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/(account)/change-password/page-373b94ffea190aaa.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/(account)/layout-eb13f2dc37c1c559.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/(account)/page-307d97ef05fed49c.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/(account)/signup/page-671c5d6ab5120645.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ai-tutor/%5Bpeople%5D/%5Btopic%5D/page-5eaa8b69e1e69f16.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ai-tutor/%5Bpeople%5D/page-bae3b907e2e88f2e.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ai-tutor/layout-61ba95ae0c1b26ca.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ai-tutor/page-c7b03521309f7066.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/layout-36d0496773eac485.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/loading-cf2dea74bc995c26.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/main/layout-ea8235884f620bce.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/main/page-f8ea16c4ed416251.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/profile/layout-f8a5d5505186fd22.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/profile/page-5983d73dfd4c675e.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/profile/setting/(.)change-password/page-d72348ae1c54e8cc.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/profile/setting/change-password/page-4d8a56fd4e1bebb6.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/profile/setting/page-5d802fcb6c624fde.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ranking/all/page-eceb158c8c79f696.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ranking/group/page-8d8f475384e265c3.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/ranking/layout-d06912038eea9a00.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/room/layout-9382c8f457c76bf2.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/room/page-276ac3e32f8fb4b3.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/store/layout-300afe5bd88ec3d0.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/store/page-0e1dd005974ee8c5.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/study/(study-detail)/daily/%5Bdaily-number%5D/page-68c3cf895442abda.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/study/(study-detail)/detail/%5Bquiz-number%5D/page-95a9331259987aa9.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/study/(study-detail)/layout-953caa21cb7a4e45.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/study/layout-389e824636a1643d.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/%5Blocale%5D/study/page-d8ab0f0aa78f0afd.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-6655feee65054fb2.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/fd9d1056-2dfb821c5b16afbc.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/framework-a63c59c368572696.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/main-app-e40a0b211ab38c83.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/main-c08150e645cc9c83.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/pages/_app-00b74eae5e8dab51.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/pages/_error-c72a1f77a3c0be1b.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",
          revision: "79330112775102f91e1010318bae2bd3",
        },
        {
          url: "/_next/static/chunks/webpack-d292f020ffce2909.js",
          revision: "ydlV6cX8nBL4VTu263wjc",
        },
        {
          url: "/_next/static/css/e3f6dd86b47c8396.css",
          revision: "e3f6dd86b47c8396",
        },
        {
          url: "/_next/static/css/e608295900d0d16d.css",
          revision: "e608295900d0d16d",
        },
        {
          url: "/_next/static/media/ai-tutor.24d694d3.webp",
          revision: "7f6f19b7fb6895bf006dcf59391b9bba",
        },
        {
          url: "/_next/static/media/back.cd1e862e.webp",
          revision: "8b209fa938fbfb52e5d20c1ea5516fe0",
        },
        {
          url: "/_next/static/media/bank-employee.fb9c882e.webp",
          revision: "0d98384d092a5372bfa3ffbf05b47857",
        },
        {
          url: "/_next/static/media/bird (1).bb35bfa2.webp",
          revision: "747904710a0ebf66fc0abdadba201c5d",
        },
        {
          url: "/_next/static/media/bird (2).f252b075.webp",
          revision: "021e14bd3690cf703ede031af80cd0a0",
        },
        {
          url: "/_next/static/media/bird (3).e551b47f.webp",
          revision: "091ea9b3fd765b4fb1260a245e3b41aa",
        },
        {
          url: "/_next/static/media/bird (6).b2c407c1.webp",
          revision: "86ae5b4c7afb0fc305ce87c48f7ca2ca",
        },
        {
          url: "/_next/static/media/bird (7).331b4e7c.webp",
          revision: "5c909101218670821cf3a70ce6ef4c22",
        },
        {
          url: "/_next/static/media/birthday.c928be69.webp",
          revision: "037a293ce6ee060d2ab315d8c72c0f4c",
        },
        {
          url: "/_next/static/media/bronze.ff82d21e.webp",
          revision: "e326d8c4b569a94ec71b1b082e946ebd",
        },
        {
          url: "/_next/static/media/credit.bc15bddc.webp",
          revision: "dbdb83bd97a94d6bce533b97a47a958d",
        },
        {
          url: "/_next/static/media/day.88062e08.webp",
          revision: "0761a33588d3c95ed53bfe4391fef3ff",
        },
        {
          url: "/_next/static/media/diamond.d3a36b79.webp",
          revision: "5fb01dc2bfd1cafee606dcbec93a3db1",
        },
        {
          url: "/_next/static/media/doctor.59e0bda1.webp",
          revision: "a0c56c344c1e8c10d64d535d3d72168b",
        },
        {
          url: "/_next/static/media/doryeoni.84a86e97.webp",
          revision: "b5919eb87703e4d12c2bbafd93d6c913",
        },
        {
          url: "/_next/static/media/email.6db54995.webp",
          revision: "a7f2686847b4e4ef2361efa8a22b48b8",
        },
        {
          url: "/_next/static/media/exp.7f9da6d9.webp",
          revision: "6173e0d36747a3b5b76c2f24b868b494",
        },
        {
          url: "/_next/static/media/field-level.afd9fbaa.webp",
          revision: "ee871ce397c16fb570360abfcc6cf086",
        },
        {
          url: "/_next/static/media/fieldonly.51e3acf6.webp",
          revision: "e0c1a282b153df357162174bd0b3bad3",
        },
        {
          url: "/_next/static/media/fire.1d33342a.webp",
          revision: "f7f549fec90e1917499222a46d296e51",
        },
        {
          url: "/_next/static/media/friend.f883f131.webp",
          revision: "bdc0a8955e782565b2b4e5cfaa86ec35",
        },
        {
          url: "/_next/static/media/gold.01e1802d.webp",
          revision: "b40121c16211b13d7544bab05e6a53a2",
        },
        {
          url: "/_next/static/media/google.e7f17bc8.webp",
          revision: "f0d2404af8e1d379ca51c3c799544034",
        },
        {
          url: "/_next/static/media/hide-password.8099a365.webp",
          revision: "bf31ed01d963d4a96a6595211fddd95b",
        },
        {
          url: "/_next/static/media/hint.e78d7fbb.webp",
          revision: "8337e2d7f9172ff2542303e203a22ae6",
        },
        {
          url: "/_next/static/media/home.f35566fc.webp",
          revision: "98ff370c1634d14f493d9d40125bcffe",
        },
        {
          url: "/_next/static/media/hotel-staff.3f3a8246.webp",
          revision: "1fd85eadde5cc99c2329eafc89da10fd",
        },
        {
          url: "/_next/static/media/interviewer.b0d3ef05.webp",
          revision: "189d4247f3ad9262af0ebe06f3d4c96b",
        },
        {
          url: "/_next/static/media/launch.01703863.webp",
          revision: "ac001d9d54652aa525b7a23ebab944d3",
        },
        {
          url: "/_next/static/media/logo-kr.eb9eb4a0.webp",
          revision: "d76fb793b7b13dade3bae227b999eb6c",
        },
        {
          url: "/_next/static/media/main-button.ca110807.webp",
          revision: "7e9f378bd9970edd24bd0395d3e6a7b3",
        },
        {
          url: "/_next/static/media/manual.25ea9f4e.webp",
          revision: "5c5599b2fbb5045f6b20a24de04b81c7",
        },
        {
          url: "/_next/static/media/megaphone.c41d0380.webp",
          revision: "f1fc607f331b14c5c04674c2daecb31e",
        },
        {
          url: "/_next/static/media/microphone-active.9b74f1ae.webp",
          revision: "a4b5b9493126840448e0cfd037abef0e",
        },
        {
          url: "/_next/static/media/microphone-normal.a024c206.webp",
          revision: "9e68a63d17ca3a585dd56791d71e16ef",
        },
        {
          url: "/_next/static/media/new-topic.630cb2ff.webp",
          revision: "dc7ab8b43305b71a0090bfac3c662950",
        },
        {
          url: "/_next/static/media/night.d3e11622.webp",
          revision: "f2a2c92e4ace02f17468df2c438cfe2d",
        },
        {
          url: "/_next/static/media/password.d7fd6506.webp",
          revision: "bd4559e9978afc7dd2ea8670ff1d9f8f",
        },
        {
          url: "/_next/static/media/path.a0189f8f.webp",
          revision: "66a43fc19c9a0fb572f017a96c9c50d3",
        },
        {
          url: "/_next/static/media/pencil.00da9754.webp",
          revision: "a7f9920653572428c25c00bb1cbd86e0",
        },
        {
          url: "/_next/static/media/platinum.8895a86b.webp",
          revision: "7c3e5c5f3652faaae6c6cb9f384d7449",
        },
        {
          url: "/_next/static/media/play1.83b681a4.webp",
          revision: "330de91d499d963ef3bdb10417fc7894",
        },
        {
          url: "/_next/static/media/play2.0f905206.webp",
          revision: "a425a8a964f37c243eab516b864b57f5",
        },
        {
          url: "/_next/static/media/profile.ac17f965.webp",
          revision: "66f2bbc455bce8a438a4b78d169122e3",
        },
        {
          url: "/_next/static/media/profile1.4623afc9.webp",
          revision: "32eb5db4881c7cb4e7bdb18f7f314539",
        },
        {
          url: "/_next/static/media/profile2.3961800f.webp",
          revision: "305f04d64baf6f87b3a739b68c98514c",
        },
        {
          url: "/_next/static/media/rank-down.ad465984.webp",
          revision: "8b2b064dbb7434b0e71f0d4ab5014918",
        },
        {
          url: "/_next/static/media/rank-plat.e7d6c4fd.webp",
          revision: "7054b7ff6209279c0c6b60d614bd9786",
        },
        {
          url: "/_next/static/media/rank-up.4f29fb9c.webp",
          revision: "9cd9b1fcd7f0bada8096c8610d9a73f2",
        },
        {
          url: "/_next/static/media/ranking1.758baafe.webp",
          revision: "d9bf40bb0043e1a0811fb9662ceb8277",
        },
        {
          url: "/_next/static/media/ranking2.f5b4eb8c.webp",
          revision: "2ebcea64fc631f59fbff24658620360c",
        },
        {
          url: "/_next/static/media/raoni.48357870.webp",
          revision: "329585ca96df689d3e324eff23006d69",
        },
        {
          url: "/_next/static/media/restaurant-server.ed5e46ec.webp",
          revision: "2139150d785fab7bc731bec0a90bb67b",
        },
        {
          url: "/_next/static/media/setting.5ccb9722.webp",
          revision: "fc61fcafbb7372c39c18f0fe4afcc180",
        },
        {
          url: "/_next/static/media/shelf.523ecd9a.webp",
          revision: "f2ce64e12df38f515e76c8841dbf3146",
        },
        {
          url: "/_next/static/media/shop-assistant.58d0e982.webp",
          revision: "8c935de090adf03f323b72a487dd845d",
        },
        {
          url: "/_next/static/media/shop-background.893a15e2.webp",
          revision: "4aae1932f26cc8e0e5b789053193a716",
        },
        {
          url: "/_next/static/media/shop-character.9a07795f.webp",
          revision: "50f00fb77fd97f1af75e113b77ad3433",
        },
        {
          url: "/_next/static/media/shop-color.f3b6662d.webp",
          revision: "d0c21936113b1d7c5379a18c4cb5a902",
        },
        {
          url: "/_next/static/media/shop-equipment.c8b1ec87.webp",
          revision: "f7e1572507a77587ae2cd3b702920eb4",
        },
        {
          url: "/_next/static/media/shop-gambling.2d78897b.webp",
          revision: "66156a2193cded4902ee87989533df8b",
        },
        {
          url: "/_next/static/media/shop-item.17650dc8.webp",
          revision: "94d4140bc248986e036062897fc4bd65",
        },
        {
          url: "/_next/static/media/show-password.8d5c72ed.webp",
          revision: "85b718ccd75911a02ed093cd7068fa4e",
        },
        {
          url: "/_next/static/media/signs.003f7e9d.webp",
          revision: "57cb99efd45c19f561a1dc713d61605d",
        },
        {
          url: "/_next/static/media/silver.a5443d6d.webp",
          revision: "080ce201a647639ab7fe4385b02cc5a7",
        },
        {
          url: "/_next/static/media/store1.6ec00f25.webp",
          revision: "41fe6d146fb331dce3890884f8881651",
        },
        {
          url: "/_next/static/media/store2.18f447d5.webp",
          revision: "ec7c24c5a7f0bea1dbb36671200f3326",
        },
        {
          url: "/_next/static/media/study1.ff564119.webp",
          revision: "a8508b6362da2a8c0ff1c08b11de37a6",
        },
        {
          url: "/_next/static/media/study2.e6dc9739.webp",
          revision: "f09285184c01c7291ad068fa0a4608bb",
        },
        {
          url: "/_next/static/media/taxi-driver.9ea64db2.webp",
          revision: "2723e8aeafda4c53f3d834c3d4dfa362",
        },
        {
          url: "/_next/static/media/tour-guide.8fdcd0b4.webp",
          revision: "93f1c14cde2a982e5e8e65f116289a96",
        },
        {
          url: "/_next/static/media/translation.51ed11e3.webp",
          revision: "86ce751cbdebe89a34a9ff43bb1e2fca",
        },
        {
          url: "/_next/static/ydlV6cX8nBL4VTu263wjc/_buildManifest.js",
          revision: "84a26a0f48a937edbc3a42834bb35da1",
        },
        {
          url: "/_next/static/ydlV6cX8nBL4VTu263wjc/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/bird192.webp", revision: "ece5eabd4cbbd4e07f31f9ba9c477f1c" },
        { url: "/bird256.webp", revision: "341e4f7dd6bcd48740ea3205ed9fa455" },
        { url: "/bird512.webp", revision: "8c9d20140a912d651861a8c2c0a3cfe7" },
        { url: "/manifest.json", revision: "76cb7d642c4f5e562dedccb90b3ffdea" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: a } }) =>
        !(!e || a.startsWith("/api/auth/callback") || !a.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: c }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        c &&
        !a.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: c }) =>
        "1" === e.headers.get("RSC") && c && !a.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: a }) => a && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
