// src/pages/Contact.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import PageBackdrop from "../components/PageBackdrop";

const SOCIALS = [
  {
    label: "in",
    color: "#0a66c2",
    url: "https://www.linkedin.com/in/aimeejesso/",
    imageSrc: "/linkedin-icon.png",
  },
  {
    label: "gh",
    color: "#ffffff",
    url: "https://github.com/Mantablast",
    imageSrc: "/github-logo.png",
  },
  {
    label: "ig",
    color: "#e1306c",
    url: "https://www.instagram.com/aimeeunmuted/",
    imageSrc: "/insta-icon.png",
  },
  {
    label: "cr",
    color: "#00b1b2",
    url: "https://www.credly.com/badges/782fa904-895f-482e-9e2c-c85eb03c8c72/public_url",
    imageSrc: "/credly-icon.png",
  },
];

export default function Contact() {
  const [unlocked, setUnlocked] = useState([]);

  const handleUnlock = useCallback((icon) => {
    setUnlocked((prev) => {
      if (prev.some((entry) => entry.url === icon.url)) return prev;
      return [...prev, icon];
    });
  }, []);

  return (
    <>
      <PageBackdrop />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16 text-zinc-50">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/60 p-6 text-center shadow-2xl backdrop-blur">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Punch some bricks 👊
          </h1>
          <p className="mb-5 text-sm opacity-80">
            Controls: ←/→ or A/D to move • Space to jump
          </p>
          <div className="flex justify-center">
            <ContactGame onUnlock={handleUnlock} />
          </div>
          <p className="mt-5 text-xs opacity-70">
            Tip: Knock a brick from below to pop out a social icon, then touch it to open the link
            in a new tab.
          </p>
          {unlocked.length > 0 && (
            <footer className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                Unlocked
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-3">
                {unlocked.map((icon) => (
                  <a
                    key={icon.url}
                    href={icon.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-black/70 shadow-lg shadow-black/40 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    aria-label={`Open ${icon.label.toUpperCase()} link`}
                  >
                    <img
                      src={icon.imageSrc}
                      alt={`${icon.label} icon`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

function ContactGame({ onUnlock }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    // --- world ---
    const W = (canvas.width = 520);
    const H = (canvas.height = 270);
    const GROUND_Y = H - 48;
    const GRAV = 0.7;
    const FRICTION = 0.86;
    const keys = { left: false, right: false, jump: false };

    // --- player ---
    const player = {
      x: 80,
      y: GROUND_Y - 32,
      w: 22,
      h: 32,
      vx: 0,
      vy: 0,
      speed: 0.9,
      jumpPower: 12,
      onGround: true,
    };

    // --- bricks (4) ---
    const bricks = [
      { x: 200, y: 90, w: 42, h: 42, used: false },
      { x: 250, y: 90, w: 42, h: 42, used: false },
      { x: 300, y: 90, w: 42, h: 42, used: false },
      { x: 350, y: 90, w: 42, h: 42, used: false }
    ];

    // --- icon cache ---
    const iconCache = new Map();
    for (const social of SOCIALS) {
      const img = new Image();
      img.src = social.imageSrc;
      iconCache.set(social.label, img);
    }

    // --- active floating items ---
    const items = []; // {x,y,vx,vy,label,url,alive,image,imageSrc,color}

    // helpers
    const rectsOverlap = (a, b) =>
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

    // input
    const down = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) keys.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) keys.right = true;
      if (e.code === "Space") keys.jump = true;
    };
    const up = (e) => {
      if (["ArrowLeft", "a", "A"].includes(e.key)) keys.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) keys.right = false;
      if (e.code === "Space") keys.jump = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    function spawnItem(fromBrick, indexHint = 0) {
      const pick = SOCIALS[indexHint % SOCIALS.length];
      const iconImage = iconCache.get(pick.label);
      const resolvedImageSrc = iconImage?.src ?? pick.imageSrc;
      items.push({
        x: fromBrick.x + fromBrick.w / 2,
        y: fromBrick.y - 8,
        vx: Math.random() < 0.5 ? -1.2 : 1.2,
        vy: -2 - Math.random(),
        label: pick.label,
        color: pick.color,
        url: pick.url,
        alive: true,
        icon: iconImage,
        imageSrc: resolvedImageSrc,
      });
      if (typeof onUnlock === "function")
        onUnlock({ ...pick, imageSrc: resolvedImageSrc });
    }

    let raf;
    const step = () => {
      // physics: horizontal
      if (keys.left) player.vx -= player.speed;
      if (keys.right) player.vx += player.speed;
      player.vx *= FRICTION;
      player.x += player.vx;

      // wrap horizontally when exiting the playfield
      if (player.x > W) {
        const overflow = player.x - W;
        player.x = -player.w + overflow;
      } else if (player.x + player.w < 0) {
        const overflow = (player.x + player.w) * -1;
        player.x = W - overflow;
      }

      // gravity / vertical
      player.vy += GRAV;
      player.y += player.vy;

      // ground collision
      if (player.y + player.h >= GROUND_Y) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.onGround = false;
      }

      // jump
      if (keys.jump && player.onGround) {
        player.vy = -player.jumpPower;
        player.onGround = false;
      }

      // brick collisions (detect head-bump)
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        // only consider if player's head intersects brick bottom while moving up
        const future = { x: player.x, y: player.y, w: player.w, h: player.h };
        const brickRect = { x: b.x, y: b.y, w: b.w, h: b.h };
        if (rectsOverlap(future, brickRect)) {
          // coming from below into brick
          const prevTop = player.y - player.vy;
          if (player.vy < 0 && prevTop > b.y + b.h - 2) {
            // bonk!
            player.y = b.y + b.h; // push back down a tad
            player.vy = 2; // rebound
            if (!b.used) {
              spawnItem(b, i);
              b.used = true;
            }
          } else {
            // land on top of brick
            if (player.vy > 0 && player.y + player.h - b.y < 18) {
              player.y = b.y - player.h;
              player.vy = 0;
              player.onGround = true;
            }
          }
        }
      }

      // update items (float & bounce)
      for (const it of items) {
        if (!it.alive) continue;
        it.vy += 0.12; // slight gravity then hover
        it.vy *= 0.98;
        it.x += it.vx;
        it.y += it.vy;

        // bounce on walls
        if (it.x < 10 || it.x > W - 10) it.vx *= -1;

        // gentle ceiling/floor constraints
        if (it.y < 40) {
          it.y = 40;
          it.vy = Math.abs(it.vy) * 0.6;
        }
        if (it.y > GROUND_Y - 20) {
          it.y = GROUND_Y - 20;
          it.vy *= -0.5;
        }

        // collect?
        const playerRect = { x: player.x, y: player.y, w: player.w, h: player.h };
        const pickupRadius = 14;
        const itemRect = {
          x: it.x - pickupRadius,
          y: it.y - pickupRadius,
          w: pickupRadius * 2,
          h: pickupRadius * 2,
        };
        if (rectsOverlap(playerRect, itemRect)) {
          it.alive = false;
          window.open(it.url, "_blank", "noopener,noreferrer");
        }
      }

      // draw
      ctx.clearRect(0, 0, W, H);

      // sky
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0b1220");
      g.addColorStop(1, "#111827");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // ground
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

      // bricks
      for (const b of bricks) {
        drawBrick(ctx, b);
      }

      // items
      for (const it of items) {
        if (!it.alive) continue;
        ctx.save();
        ctx.translate(it.x, it.y);
        const iconSize = 28;
        if (it.icon && it.icon.complete) {
          ctx.drawImage(it.icon, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
        } else {
          ctx.fillStyle = it.color ?? "#94a3b8";
          ctx.beginPath();
          ctx.arc(0, 0, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#111827";
          ctx.font = "bold 10px ui-sans-serif, system-ui";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(it.label.toUpperCase(), 0, 0);
        }
        ctx.restore();
      }

      // player (little suit person)
      drawSuitDude(ctx, player.x, player.y, player.w, player.h);

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onUnlock]);

  return (
    <canvas
      ref={ref}
      width={720}
      height={380}
      className="rounded-xl border border-white/10 shadow-inner"
    />
  );
}

// rounded rect helper
function roundRect(ctx, x, y, w, h, r, fill) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill) ctx.fill();
}

// brick sprite with mortar grooves and highlights
function drawBrick(ctx, brick) {
  const { x, y, w, h, used } = brick;
  ctx.save();

  const palette = used
    ? {
        top: "#a855f7",
        mid: "#7c3aed",
        base: "#5b21b6",
        dark: "#3b0764",
        mortar: "rgba(236, 233, 255, 0.18)",
      }
    : {
        top: "#f59e0b",
        mid: "#d97706",
        base: "#b45309",
        dark: "#7c2d12",
        mortar: "rgba(255, 245, 235, 0.18)",
      };

  const gradient = ctx.createLinearGradient(0, y, 0, y + h);
  gradient.addColorStop(0, palette.top);
  gradient.addColorStop(0.45, palette.mid);
  gradient.addColorStop(1, palette.dark);
  ctx.fillStyle = gradient;
  roundRect(ctx, x, y, w, h, 4, true);

  // top highlight lip
  ctx.fillStyle = palette.mortar;
  roundRect(ctx, x + 2, y + 2, w - 4, Math.max(3, h * 0.18), 2, true);

  // side shadow for depth
  const sideShade = ctx.createLinearGradient(x, y, x + w, y);
  sideShade.addColorStop(0.65, "rgba(0,0,0,0)");
  sideShade.addColorStop(1, "rgba(15,23,42,0.45)");
  ctx.fillStyle = sideShade;
  roundRect(ctx, x, y, w, h, 4, true);

  // scattered light ivory specks
  const ivory = "rgba(254, 249, 231, 0.55)";
  const seed = Math.abs(Math.sin((x + y) * 12.9898) * 43758.5453);
  const offsets = [
    { rx: 0.06, ry: 0.22 }, //left
    { rx: 0.50, ry: 0.04 }, //top
    { rx: 0.28, ry: 0.64 }, //mid
    { rx: 0.68, ry: 0.48 }, //mid-right
  ];

  ctx.fillStyle = ivory;
  const speckW = Math.max(2, 3 * w * 0.08);
  const speckH = Math.max(1, 3 * h * 0.05);
  const specks = offsets.map((o, i) => {
    const jitter = ((seed + i * 0.37) % 0.08) - 0.04;
    const px = x + w * (o.rx + jitter);
    const py = y + h * (o.ry + jitter * 0.6);
    ctx.fillRect(px, py, speckW, speckH);
    return { x: px, y: py, w: speckW, h: speckH };
  });

  ctx.strokeStyle = "rgba(8, 11, 20, 0.9)";
  ctx.lineWidth = 1;
  specks.forEach((s) => ctx.strokeRect(s.x, s.y, s.w, s.h));

  ctx.restore();
}

// lil' suit person sprite
function drawSuitDude(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);

  const jacketColor = "#111827";
  const shirtColor = "#e5e7eb";
  const accentColor = "#1f2937";
  const tieColor = "#b91c1c";
  const skinColor = "#fbe7c6";
  const hairColor = "#2f2e41";

  const headH = h * 0.45;
  const headW = w * 0.62;
  const headX = (w - headW) / 2;
  const headY = -headH + h * 0.08;

  // jacket 
  ctx.fillStyle = jacketColor;
  roundRect(ctx, 0, 0, w, h, Math.min(6, w * 0.25), true);

  // arms (slight offset to sell jacket sleeves)
  ctx.fillRect(-w * 0.18, h * 0.18, w * 0.2, h * 0.52);
  ctx.fillRect(w * 0.98, h * 0.18, w * 0.2, h * 0.52);

  // hands
  ctx.fillStyle = skinColor;
  ctx.fillRect(-w * 0.14, h * 0.64, w * 0.14, h * 0.15);
  ctx.fillRect(w, h * 0.64, w * 0.14, h * 0.15);

  // shirt panel
  ctx.fillStyle = shirtColor;
  ctx.fillRect(w * 0.32, h * 0.04, w * 0.36, h * 0.56);

  // lapels
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(w * 0.05, h * 0.08);
  ctx.lineTo(w * 0.32, h * 0.58);
  ctx.lineTo(w * 0.18, h * 0.6);
  ctx.lineTo(w * 0.02, h * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w * 0.95, h * 0.08);
  ctx.lineTo(w * 0.68, h * 0.58);
  ctx.lineTo(w * 0.82, h * 0.6);
  ctx.lineTo(w * 0.98, h * 0.3);
  ctx.closePath();
  ctx.fill();

  // tie knot + blade
  ctx.fillStyle = tieColor;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.08);
  ctx.lineTo(w * 0.45, h * 0.18);
  ctx.lineTo(w * 0.5, h * 0.58);
  ctx.lineTo(w * 0.55, h * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(w * 0.46, h * 0.02, w * 0.08, h * 0.12);

  // belt
  ctx.fillStyle = accentColor;
  ctx.fillRect(w * 0.12, h * 0.64, w * 0.76, h * 0.08);
  ctx.fillStyle = "#facc15";
  ctx.fillRect(w * 0.44, h * 0.65, w * 0.12, h * 0.06);

  // trousers
  ctx.fillStyle = jacketColor;
  ctx.fillRect(w * 0.12, h * 0.7, w * 0.3, h * 0.42);
  ctx.fillRect(w * 0.58, h * 0.7, w * 0.3, h * 0.42);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(w * 0.45 - w * 0.03, h * 0.72, w * 0.06, h * 0.3);


  // shoes
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(w * 0.06, h * 1.02, w * 0.36, h * 0.14);
  ctx.fillRect(w * 0.58, h * 1.02, w * 0.36, h * 0.14);

  // neck
  ctx.fillStyle = skinColor;
  ctx.fillRect(w * 0.44, -headH * 0.12 + h * 0.05, w * 0.12, headH * 0.22);

  // head
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.ellipse(
    headX + headW / 2,
    headY + headH / 2,
    headW / 2,
    headH / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // hair
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.ellipse(headX + headW / 2, headY + headH * 0.35, headW / 2, headH * 0.6, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(headX + headW * 0.15, headY + headH * 0.1, headW * 0.6, headH * 0.22);

  // eyes
  ctx.fillStyle = "#111827";
  const eyeW = w * 0.08;
  const eyeH = headH * 0.12;
  const eyeY = headY + headH * 0.48;
  ctx.fillRect(headX + headW * 0.28, eyeY, eyeW, eyeH);
  ctx.fillRect(headX + headW * 0.64, eyeY, eyeW, eyeH);

  // brow
  ctx.fillRect(headX + headW * 0.2, eyeY - eyeH * 0.6, headW * 0.6, eyeH * 0.35);

  // smile
  ctx.strokeStyle = "#d97706";
  ctx.lineWidth = Math.max(1, h * 0.03);
  ctx.beginPath();
  ctx.arc(headX + headW / 2, headY + headH * 0.7, headW * 0.22, 0, Math.PI, false);
  ctx.stroke();

  ctx.restore();
}
