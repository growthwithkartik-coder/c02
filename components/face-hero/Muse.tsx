import { useId } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   The CO2 Muse — an original, illustrated sculptural profile used as
   the campaign character. It is drawn (not a photographed person), so
   it never implies a real model identity. Replace with photography by
   setting site.campaign.heroCharacter.
   Faces right by default; `mirror` faces left.
   `lipTint` recolours the lips (used by the gloss section).
------------------------------------------------------------------- */

const PROFILE =
  "M548 150 C566 190 572 240 574 270 C576 296 582 308 590 320 C595 332 591 346 587 356 C602 410 640 468 662 508 C672 526 668 544 648 548 C636 550 628 552 622 560 C620 572 628 584 644 594 C652 600 646 610 630 612 C646 620 650 636 638 648 C628 658 612 662 608 676 C604 700 622 720 620 742 C616 772 590 788 556 796 C520 804 490 812 476 830 C470 880 482 980 504 1140";

const FACE_FILL = `${PROFILE} L240 1140 C300 900 260 700 220 560 C180 420 200 200 300 120 C380 60 500 80 548 150 Z`;

const LIPS =
  "M622 560 C620 572 628 584 644 594 C652 600 646 610 630 612 C646 620 650 636 638 648 C628 658 612 662 604 664 C596 640 594 620 600 596 C606 580 614 568 622 560 Z";

export function Muse({
  className,
  mirror = false,
  lipTint,
  tone = "gold",
  eyesOpen = false,
}: {
  className?: string;
  mirror?: boolean;
  lipTint?: string;
  tone?: "gold" | "bone";
  eyesOpen?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${uid}`;
  const line = tone === "gold" ? `url(#${id("gold")})` : "#F4EFE7";

  return (
    <svg viewBox="0 0 900 1100" className={cn("block", className)} role="img" aria-label="The CO2 Muse — an illustrated profile" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={id("skin")} cx="66%" cy="42%" r="58%">
          <stop offset="0" stopColor="#F3E6D3" />
          <stop offset=".45" stopColor="#CDA982" />
          <stop offset=".85" stopColor="#6B4C33" />
          <stop offset="1" stopColor="#2A1D14" />
        </radialGradient>
        <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E4B5" />
          <stop offset=".5" stopColor="#C9A15A" />
          <stop offset="1" stopColor="#8A6630" />
        </linearGradient>
        <radialGradient id={id("hair")} cx="55%" cy="20%" r="80%">
          <stop offset="0" stopColor="#3A2A1C" />
          <stop offset=".5" stopColor="#16110C" />
          <stop offset="1" stopColor="#0B0907" />
        </radialGradient>
        <radialGradient id={id("cheek")} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF4E4" stopOpacity=".6" />
          <stop offset="1" stopColor="#FFF4E4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("lip")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lipTint ?? "#A9705A"} />
          <stop offset=".5" stopColor={lipTint ?? "#8E5644"} stopOpacity=".95" />
          <stop offset="1" stopColor={lipTint ?? "#6E3E30"} />
        </linearGradient>
        <clipPath id={id("faceclip")}>
          <path d={FACE_FILL} />
        </clipPath>
        <filter id={id("soft")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <g transform={`${mirror ? "translate(900 0) scale(-1 1) " : ""}rotate(-5 450 550)`}>
        {/* skin */}
        <path d={FACE_FILL} fill={`url(#${id("skin")})`} />
        {/* jaw / neck shadow, blurred and clipped to the face */}
        <g clipPath={`url(#${id("faceclip")})`}>
          <path d="M556 796 C470 790 410 740 382 650 L250 700 L250 1060 L520 1060 C500 920 474 860 476 830 C490 812 520 804 556 796 Z" fill="#1A120C" opacity=".75" filter={`url(#${id("soft")})`} />
          <path d="M260 200 C220 400 240 700 300 900 L200 900 L200 200Z" fill="#1A120C" opacity=".5" filter={`url(#${id("soft")})`} />
        </g>
        <ellipse cx="520" cy="500" rx="86" ry="64" fill={`url(#${id("cheek")})`} />
        {/* lips */}
        <path d={LIPS} fill={`url(#${id("lip")})`} opacity={lipTint ? 0.96 : 0.55} style={{ transition: "fill 0.8s" }} />
        {lipTint && <path d="M628 598 C636 600 640 604 636 607" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" strokeLinecap="round" />}
        {lipTint && <path d="M626 628 C634 630 638 636 634 640" stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />}

        <g fill="none" stroke={line} strokeLinecap="round">
          <path d={PROFILE} strokeWidth="2.4" />
          {eyesOpen ? (
            <>
              <path d="M500 388 C520 372 552 372 572 386" strokeWidth="2.2" />
              <path d="M506 390 C526 402 552 402 570 390" strokeWidth="1.4" />
              <circle cx="546" cy="389" r="7" fill="#1A120C" stroke="none" />
            </>
          ) : (
            <>
              <path d="M498 384 C520 400 550 402 572 390" strokeWidth="2.2" />
              <path d="M508 391 l-7 11 M521 396 l-5 13 M535 399 l-2 13 M549 399 l1 13 M562 396 l3 11" strokeWidth="1.3" />
            </>
          )}
          <path d="M482 340 C516 322 556 322 586 334" strokeWidth="1.8" />
          <path d="M610 534 C620 543 634 542 642 534" strokeWidth="1.6" />
          <path d="M630 612 C616 615 602 613 592 607" strokeWidth="1.8" />
          <path d="M556 796 C470 790 410 740 382 650" strokeWidth="1.2" opacity=".55" />
        </g>
        {/* hair (drawn over the profile line so the hairline reads cleanly) */}
        <path
          d="M572 236 C604 196 612 96 572 30 C520 -40 360 -62 250 -2 C130 66 80 220 96 360 C110 480 170 560 208 640 C248 724 250 880 206 1140 L304 1140 C322 980 330 860 316 780 C302 690 292 580 312 486 C322 400 360 300 420 250 C470 210 530 214 572 236 Z"
          fill={`url(#${id("hair")})`}
        />
        <g fill="none" stroke={line} strokeLinecap="round">
          <g opacity=".55" strokeWidth="1.1">
            <path d="M580 170 C540 70 400 20 280 66 C170 112 128 236 140 360 C150 470 200 540 236 620" />
            <path d="M548 224 C480 192 404 204 352 262 C304 318 292 410 302 476" />
            <path d="M556 50 C516 -6 420 -26 330 6" />
            <path d="M236 640 C270 720 276 860 246 1000" />
            <path d="M270 700 C292 790 292 900 270 1060" opacity=".6" />
          </g>
        </g>
        {/* ear */}
        <path d="M372 468 C336 440 296 474 306 524 C314 574 348 604 374 604 C384 560 384 510 372 468Z" fill="#C49E77" />
        <g fill="none" stroke={line} strokeLinecap="round">
          <path d="M372 468 C336 440 296 474 306 524 C314 574 348 604 374 604" strokeWidth="1.6" />
          <path d="M330 500 C340 494 350 500 352 516" strokeWidth="1.1" opacity=".5" />
        </g>
      </g>
    </svg>
  );
}
