# Thumbnail sources

Thumbnail changes in this update were limited to official pages for the matching works.

| Work | Local asset | Source URL | Notes |
| --- | --- | --- | --- |
| Crabhouse Opus | `assets/games/crabhouse-opus-official.jpg` | https://kamibukuro18.github.io/opuscrabhouse/ | Captured from the official web game's title screen because the page renders its UI in a canvas. |
| Crabhouse Opus detail gallery | `assets/games/crabhouse-opus-room.png` | https://kamibukuro18.github.io/opuscrabhouse/ | Captured from the same official web game after entering the room. |
| Crabhouse detail gallery | `assets/games/crabhouse-store.jpg` | https://play.google.com/store/apps/details?hl=ja&id=com.GAIBAKO.Crabhouse | Official Google Play image; the store page identifies the same Crabhouse app. |
| FlowSwitch | `assets/projects/flowswitch-gumroad.jpg` | https://kamibukuro.gumroad.com/l/flowswitch | Official Gumroad product image (`og:image`). |
| FlowSwitch detail gallery | `assets/projects/flowswitch-repo.png` | https://github.com/kamibukuro18/FlowSwitch | Official repository README image. |
| Steam Image Exporter | `assets/projects/steam-image-exporter-gumroad.jpg` | https://kamibukuro.gumroad.com/l/steamimageexporter | Official Gumroad product image (`og:image`). |
| Steam Image Exporter detail gallery | `assets/projects/steam-image-exporter-repo.png` | https://github.com/kamibukuro18/SteamImageExporter | Official repository README image. |
| YORU NO NIWA | `assets/projects/yoru-no-niwa-hero-2026-10-20.png` | https://claude.ai/artifact/G6EGqVynidvfXef9btxaU5 | Existing capture of the actual concept-site screen retained. Chrome recheck on 2026-10-22 showed `Page not found – Claude`; no unrelated replacement image was used. |
| TSUKISHIRO-AN | `assets/projects/tsukishiro-an.png` | `experiments/tsukishiro-an/index.html` | Existing capture of the actual local responsive concept site; the source page was also opened in Chrome during this audit. |
| STAR FINCH | `assets/games/star-finch-real.png` | `games/star-finch/index.html` | Existing verified gameplay capture retained for the local web game; no external store page was used. |
| IKEBUKURO RUN thumbnail | `assets/games/ikebukuro-run-thumb-1280x720-20261022.png` | https://kamibukuro18.github.io/ikebukuro-run/ | Captured from the public game in Chrome during active play at 1280×720; used as the gaisan listing thumbnail. |
| IKEBUKURO RUN detail gallery | `assets/games/ikebukuro-run-play-1440x900-20261022.png` and `assets/games/ikebukuro-run-play-390x844-20261022.png` | https://kamibukuro18.github.io/ikebukuro-run/ | Captured from the public game in Chrome during active play at desktop and mobile viewport sizes. |
| Curva | `assets/3d/curva/curva-01-listing.jpg` and the Curva gallery assets | https://kamibukuro18.booth.pm/items/8996856 | Library-materialized sales images from the matching BOOTH product. |
| NEO-YORU | `assets/3d/neo-yoru/*.jpg` | https://kamibukuro18.booth.pm/items/9001329 | User-provided `NEO_YORU_BOOTH_Images_11.zip` from Downloads; 11 permitted sales images were resized to 1400px and JPEG quality 82. The requested BOOTH page was rechecked as publicly reachable (HTTP 200) on 2026-10-17. |
| FOLIO Bookstore | `assets/3d/folio/*.jpg` | https://kamibukuro18.booth.pm/items/9011742 | Official BOOTH product images fetched from the matching public product page on 2026-10-19; 6 images were resized to max 1400px and converted to JPEG quality 82. No model files were added. |
| AGED GRIMOIRES | `assets/3d/aged-grimoires/*.jpg` | https://kamibukuro18.booth.pm/items/9012607 | Official BOOTH product images fetched from the matching public product page on 2026-10-19; 8 images were resized to max 1400px and converted to JPEG quality 82. No model files were added. |
| Retro Bowling Alley | `assets/3d/bowling-alley/*.jpg` | https://kamibukuro18.booth.pm/items/8993429 | 12 product renders captured from the matching public BOOTH page in Chrome on 2026-10-22; resized BOOTH images retained as the listing cover and detail gallery. |
| Lantern Court | `assets/3d/lantern-court/*.jpg` | https://kamibukuro18.booth.pm/items/9027511 | 4 images captured from the matching public BOOTH product page on 2026-10-22; resized official images retained as the listing cover and detail gallery. |
| PYRAMID | `assets/3d/pyramid/pyramid-01.jpg` and `pyramid-02.jpg`–`pyramid-04.jpg` | https://kamibukuro18.booth.pm/items/9027942 | Four official product images fetched from the matching BOOTH page on 2026-10-22; resized to 1400px max and JPEG quality 82 for the listing cover and detail gallery. |
| RESIDUAL SIGNAL | `assets/projects/residual-signal-lab.png` | `experiments/ai-lab/index.html` | Screenshot of the actual local interactive experiment, generated from its Canvas/SVG/CSS rendering; no external assets were used. |
| 月白庵 | `assets/projects/tsukishiro-an.png` | `experiments/tsukishiro-an/index.html` | Screenshot of the actual local concept site; photos are original generated assets for the fictional ryokan and no real property or third-party photo was used. |
| ヨルノニワ | *(not captured)* | https://claude.ai/artifact/G6EGqVynidvfXef9btxaU5 | User-provided URL returned an HTTP shell, but Chromium displayed `Page not found – Claude`; no third-party image was substituted and no screenshot was saved. |

Crabhouse and the previously published 3D thumbnails were retained. STAR FINCH keeps the existing verified gameplay capture; no external store image was substituted. No model files were added.

## M300 model catalog previews

`assets/models/previews/M300-001.webp` through `M300-103.webp` are derived from the corresponding 103 saved models' existing hero renders, not concept/reference images. Each source image was checked against its recorded hash, then resized without cropping to a maximum dimension of 640px and encoded as WebP (quality 82). No new image generation, model modification, or re-rendering was performed. Only the web-sized previews and display metadata are included; original model files and private production materials are not published. Material or inspection-pose differences relevant to a preview are noted in the catalog.
