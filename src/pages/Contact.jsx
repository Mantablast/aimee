// src/pages/Contact.jsx
import { useEffect, useRef } from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-zinc-50">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
        Let’s Connect — Punch the Bricks 👊
      </h1>
      <p className="opacity-80 mb-3 text-sm">
        Controls: ←/→ or A/D to move • Space to jump
      </p>
      <ContactGame />
      <p className="mt-4 text-xs opacity-70">
        Tip: Jump so your head hits the underside of a brick to spawn a social icon.
        Touch an icon to open the link in a new tab.
      </p>
    </div>
  );
}

function ContactGame() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    // --- world ---
    const W = (canvas.width = 720);
    const H = (canvas.height = 380);
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

    // --- bricks (5) ---
    const bricks = [
      { x: 200, y: 210, w: 42, h: 42, used: false },
      { x: 250, y: 210, w: 42, h: 42, used: false },
      { x: 300, y: 210, w: 42, h: 42, used: false },
      { x: 350, y: 210, w: 42, h: 42, used: false },
      { x: 400, y: 210, w: 42, h: 42, used: false },
    ];

    // --- socials to spawn from bricks ---
    const SOCIALS = [
      { label: "in", color: "#0a66c2", url: "https://www.linkedin.com/in/yourprofile" },
      { label: "gh", color: "#ffffff", url: "https://github.com/yourprofile" },
      { label: "ig", color: "#e1306c", url: "https://instagram.com/yourprofile" },
      { label: "cr", color: "#00b1b2", url: "https://www.credly.com/users/yourprofile" },
      { label: "cp", color: "#000000", url: "https://codepen.io/yourprofile" },
    ];

    // --- active floating items ---
    const items = []; // {x,y,vx,vy,label,color,url,alive}

    // helpers
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
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
      const pick = SOCIALS[(indexHint + items.length) % SOCIALS.length];
      items.push({
        x: fromBrick.x + fromBrick.w / 2,
        y: fromBrick.y - 8,
        vx: Math.random() < 0.5 ? -1.2 : 1.2,
        vy: -2 - Math.random(),
        label: pick.label,
        color: pick.color,
        url: pick.url,
        alive: true,
      });
    }

    let raf;
    const step = () => {
      // physics: horizontal
      if (keys.left) player.vx -= player.speed;
      if (keys.right) player.vx += player.speed;
      player.vx *= FRICTION;
      player.x += player.vx;

      // world bounds
      player.x = clamp(player.x, 8, W - player.w - 8);

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
        const itemRect = { x: it.x - 10, y: it.y - 10, w: 20, h: 20 };
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
        ctx.fillStyle = b.used ? "#5b21b6" : "#b45309";
        roundRect(ctx, b.x, b.y, b.w, b.h, 4, true);
        // brick sheen
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        roundRect(ctx, b.x + 3, b.y + 3, b.w - 6, 4, 2, true);
      }

      // items
      for (const it of items) {
        if (!it.alive) continue;
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();

        // label
        ctx.fillStyle = it.color === "#ffffff" ? "#111827" : "#ffffff";
        ctx.font = "bold 10px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(it.label, 0, 0);
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
  }, []);

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

// lil' suit person sprite
function drawSuitDude(ctx, x, y, w, h) {
  // body
  ctx.fillStyle = "#6d727dff";
  ctx.fillRect(x, y, w, h);
  // head
  ctx.fillStyle = "#fcd34d";
  ctx.fillRect(x + w / 4, y - h * 0.35, w / 2, h * 0.35);
  // eyes
  ctx.fillStyle = "#000104ff";
  ctx.fillRect(x + w / 5.5 + 3, y - h * 0.2, 3, 1);
  ctx.fillRect(x + (w * 3.5) / 4 - 6, y - h * 0.2, 3, 1);
  // right arm
  ctx.fillStyle = "#000104ff";
  ctx.fillRect(x + w - 4, y + 4, 2, h / 2);
  // left arm
  ctx.fillRect(x, y + 4, 2, h / 2);
  // right leg
  ctx.fillRect(x + w - 2, y + h - 4, 6, 4);
  // left leg
  ctx.fillRect(x, y + h - 4, 6, 4);
  // tie
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 4);
  ctx.lineTo(x + w / 2 - 3, y + 10);
  ctx.lineTo(x + w / 2 + 3, y + 10);
  ctx.closePath();
  ctx.fill();
}
