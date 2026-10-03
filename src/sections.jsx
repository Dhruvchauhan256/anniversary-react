import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONFIG, fill, bgImg } from "./config";
import { Reveal, useHearts, useStored, useToast } from "./ui";
import { useSong } from "./song";

const DARK = { background: "#0f0816" };
const GLOW_TOP = { background: "radial-gradient(circle at 50% 30%,#2a0f24,#0b0710 70%)" };
const GLOW_BOTTOM = { background: "radial-gradient(circle at 50% 70%,#2a0f24,#0b0710 70%)" };

/* ================= PASSWORD LOCK ================= */
export function Lock({ fading, onSuccess }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (value.trim().toLowerCase() === CONFIG.password.toLowerCase()) {
      onSuccess();
    } else {
      setErr("Hmm, that's not it. Think about our special day 🙈");
      setShake(true);
    }
  };

  return (
    <div id="lock" style={{ opacity: fading ? 0 : 1 }}>
      <div className="tag">Just for you</div>
      <h1>Enter our special date</h1>
      <p className="hint">{CONFIG.passwordHint}</p>
      <input
        id="pw"
        className={shake ? "shake" : ""}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        placeholder="••••"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        onAnimationEnd={() => setShake(false)}
      />
      <button className="btn" onClick={submit}>Unlock ❤</button>
      <p id="lockErr">{err}</p>
    </div>
  );
}

/* ================= INTRO ================= */
export function Intro({ fading, onOpen }) {
  return (
    <div id="intro" style={{ opacity: fading ? 0 : 1 }}>
      <div className="tag">For someone special</div>
      <h1>{`Happy Anniversary, ${CONFIG.herNick}`}</h1>
      <button className="btn pulse" onClick={onOpen}>Tap to open ❤</button>
    </div>
  );
}

/* ================= HERO ================= */
export function Hero() {
  return (
    <section id="hero">
      <div className="bg" style={bgImg(CONFIG.heroImg)} />
      <div className="content">
        <Reveal className="tag">Our first anniversary</Reveal>
        <Reveal as="h1">
          {CONFIG.herName}
          <br />
          &amp; {CONFIG.yourName}
        </Reveal>
        <Reveal as="p" className="date">{CONFIG.anniversary}</Reveal>
      </div>
      <div className="scroll">SCROLL ↓</div>
    </section>
  );
}

/* ================= COUNTER ================= */
export function Counter() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, now - new Date(CONFIG.startDate).getTime());
  const cells = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Mins", Math.floor(diff / 6e4) % 60],
    ["Secs", Math.floor(diff / 1e3) % 60],
  ];

  return (
    <section style={GLOW_TOP}>
      <div className="content">
        <Reveal className="tag">Together for</Reveal>
        <Reveal as="h2">Every second with you counts</Reveal>
        <Reveal className="counter">
          {cells.map(([label, v]) => (
            <div key={label}>
              <b>{v}</b>
              <span>{label}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ================= TIMELINE ================= */
export function Timeline() {
  return (
    <>
      {CONFIG.timeline.map((t) => (
        <section key={t.title}>
          <div className="bg" style={bgImg(t.img)} />
          <div className="content">
            <Reveal className="tl-card">
              <div className="tl-date">{t.date}</div>
              <h2>{t.title}</h2>
              <p>{t.text}</p>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

/* ================= POLAROIDS ================= */
export function Polaroids() {
  const [lb, setLb] = useState(null);
  const rots = useMemo(
    () => CONFIG.polaroids.map((_, i) => ((i % 2 ? 1 : -1) * (2 + Math.random() * 4)).toFixed(1) + "deg"),
    []
  );

  return (
    <>
      <section style={DARK}>
        <Reveal className="tag">Our scrapbook</Reveal>
        <Reveal as="h2">A year in pictures</Reveal>
        <Reveal className="polas">
          {CONFIG.polaroids.map((g, i) => (
            <div key={g.src} className="pola" style={{ "--r": rots[i] }} onClick={() => setLb(g)}>
              <img src={g.src} alt={g.cap} loading="lazy" />
              <span>{g.cap}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <div id="lightbox" style={{ display: lb ? "flex" : "none" }} onClick={() => setLb(null)}>
        {lb && (
          <>
            <img src={lb.src} alt={lb.cap} />
            <p>{lb.cap}</p>
          </>
        )}
      </div>
    </>
  );
}

/* ================= VOICE / VIDEO MESSAGE ================= */
export function MessageSection() {
  const m = CONFIG.message;
  const { pauseForMedia, resumeAfterMedia } = useSong();
  if (m.type === "none") return null;
  const isAudio = m.type === "audio";

  return (
    <section id="msgSec" style={GLOW_TOP}>
      <Reveal className="tag">Press play</Reveal>
      <Reveal as="h2">{m.title}</Reveal>
      <Reveal className={`vid ${isAudio ? "voice" : ""}`}>
        {isAudio ? (
          <>
            <div className="big">🎙️</div>
            <p style={{ marginTop: 8 }}>{m.caption}</p>
            <audio controls src={m.src} onPlay={pauseForMedia} onPause={resumeAfterMedia} />
          </>
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            poster={m.poster}
            src={m.src}
            onPlay={pauseForMedia}
            onPause={resumeAfterMedia}
          />
        )}
      </Reveal>
      {!isAudio && (
        <Reveal>
          <p style={{ marginTop: 16, opacity: 0.8 }}>{m.caption}</p>
        </Reveal>
      )}
    </section>
  );
}

/* ================= OUR SONG ================= */
export function SongSection() {
  const {
    spotifyElRef,
    restart,
  } = useSong();

  return (
    <section className="song-section" id="songSec">
      <div className="content">

        <Reveal className="song-heart">
          ♡
        </Reveal>

        <Reveal className="tag">
          Our song
        </Reveal>

        <Reveal as="h2">
          {CONFIG.song.title}
        </Reveal>

        <Reveal as="p" className="song-subtitle">
          {CONFIG.song.subtitle}
        </Reveal>

        <Reveal>
          <div
            className="spotify-wrapper"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "520px",
              margin: "25px auto 0",
            }}
          >
            <div ref={spotifyElRef} />
          </div>
        </Reveal>

        <Reveal>
          <button
            className="btn"
            onClick={restart}
            style={{ marginTop: "20px" }}
          >
            Restart from beginning ↺
          </button>
        </Reveal>

      </div>
    </section>
  );
}

/* ================= REASONS ================= */
function ReasonCard({ text }) {
  const [flip, setFlip] = useState(false);
  return (
    <div className={`card ${flip ? "flip" : ""}`} onClick={() => setFlip((f) => !f)}>
      <div className="in">
        <div className="f">❤</div>
        <div className="b">{text}</div>
      </div>
    </div>
  );
}

export function Reasons() {
  return (
    <section style={GLOW_BOTTOM}>
      <Reveal className="tag">Tap the hearts</Reveal>
      <Reveal as="h2">Reasons I love you</Reveal>
      <Reveal className="cards">
        {CONFIG.reasons.map((r) => <ReasonCard key={r} text={r} />)}
      </Reveal>
    </section>
  );
}

/* ================= STARRY SKY ================= */
export function StarSky() {
  const secRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, bgStars = [], pts = [], shown = 0, visible = false, shoot = null, raf = 0, cancelled = false;

    const build = () => {
      W = cv.width = sec.clientWidth;
      H = cv.height = sec.clientHeight;
      if (!W || !H) return;

      bgStars = Array.from({ length: 150 }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2,
        p: Math.random() * 6.28, s: 0.015 + Math.random() * 0.03,
      }));

      const oh = 200;
      const off = document.createElement("canvas");
      off.width = W;
      off.height = oh;
      const o = off.getContext("2d");
      let fs = 110;
      do {
        o.font = `italic 700 ${fs}px 'Playfair Display',Georgia,serif`;
        if (o.measureText(CONFIG.herNick).width <= W * 0.86) break;
        fs -= 4;
      } while (fs > 16);
      o.fillStyle = "#fff";
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText(CONFIG.herNick, W / 2, oh / 2);

      const d = o.getImageData(0, 0, W, oh).data;
      pts = [];
      for (let y = 0; y < oh; y += 5) {
        for (let x = 0; x < W; x += 5) {
          if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y: y + H / 2 - oh / 2, p: Math.random() * 6.28 });
        }
      }
      pts.sort(() => Math.random() - 0.5);
    };

    const frame = () => {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        bgStars.forEach((s) => {
          s.p += s.s;
          ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(s.p));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 6.283);
          ctx.fill();
        });

        if (shown < pts.length) shown += 6;
        ctx.fillStyle = "#ffd98a";
        const n = Math.min(shown, pts.length);
        for (let i = 0; i < n; i++) {
          const s = pts[i];
          s.p += 0.05;
          const a = 0.75 + 0.25 * Math.sin(s.p);
          ctx.globalAlpha = a * 0.18;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 4, 0, 6.283);
          ctx.fill();
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.7, 0, 6.283);
          ctx.fill();
        }

        if (!shoot && Math.random() < 0.006) shoot = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.3, l: 0 };
        if (shoot) {
          shoot.x += 9;
          shoot.y += 4;
          shoot.l++;
          ctx.globalAlpha = Math.max(0, 1 - shoot.l / 40);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - 50, shoot.y - 22);
          ctx.stroke();
          if (shoot.l > 40) shoot = null;
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!visible) shown = 0;
          visible = true;
        } else {
          visible = false;
        }
      },
      { threshold: 0.15 }
    );
    const onResize = () => { if (sec.clientWidth !== W) build(); };

    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      build();
      io.observe(sec);
      window.addEventListener("resize", onResize);
      frame();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="skySec" ref={secRef}>
      <canvas id="skyCanvas" ref={cvRef} />
      <div className="sky-top">
        <Reveal className="tag">Written in the stars</Reveal>
        <Reveal as="h2">Out of all the stars...</Reveal>
      </div>
      <Reveal className="sky-bottom" dangerouslySetInnerHTML={{ __html: CONFIG.skyCaption }} />
    </section>
  );
}

/* ================= OPEN WHEN LETTERS ================= */
export function OpenWhen() {
  const [open, setOpen] = useState(null);

  return (
    <>
      <section style={DARK}>
        <Reveal className="tag">Little letters</Reveal>
        <Reveal as="h2">Open when...</Reveal>
        <Reveal className="env-list">
          {CONFIG.openWhen.map((o) => (
            <button key={o.label} className="env" onClick={() => setOpen(o)}>
              <i>{o.icon}</i>
              <span>{o.label}</span>
            </button>
          ))}
        </Reveal>
      </section>

      <div
        id="modal"
        style={{ display: open ? "flex" : "none" }}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
      >
        <div className="mbox">
          <button id="mClose" onClick={() => setOpen(null)}>✕</button>
          <div className="tag">A letter for you</div>
          <h3>{open ? open.label : ""}</h3>
          <p>{open ? fill(open.text) : ""}</p>
        </div>
      </div>
    </>
  );
}

/* ================= COUPONS ================= */
export function Coupons() {
  const [used, setUsed] = useStored("coupons", {});
  const toast = useToast();
  const { burst } = useHearts();

  const redeem = (i) => {
    if (used[i]) return;
    setUsed((u) => ({ ...u, [i]: 1 }));
    toast("Redeemed! Show me this and I'll make it happen ❤");
    burst(8);
  };

  return (
    <section style={GLOW_TOP}>
      <Reveal className="tag">Tap to redeem</Reveal>
      <Reveal as="h2">Love coupons</Reveal>
      <Reveal className="coupons">
        {CONFIG.coupons.map((c, i) => (
          <div key={c.title} className={`coupon ${used[i] ? "used" : ""}`} onClick={() => redeem(i)}>
            <i>{c.icon}</i>
            <b>{c.title}</b>
            <small>{c.note}</small>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ================= YEAR TWO ================= */
export function YearTwo() {
  const [done, setDone] = useStored("bucket", {});
  const toast = useToast();

  const toggle = (i) => {
    const on = !done[i];
    setDone((d) => ({ ...d, [i]: on ? 1 : 0 }));
    if (on) toast("Added to our adventures ❤");
  };

  return (
    <section style={DARK}>
      <Reveal className="tag">Looking ahead</Reveal>
      <Reveal as="h2">Our year two</Reveal>
      <Reveal className="list">
        <h3>My promises to you</h3>
        <div>
          {CONFIG.promises.map((p) => (
            <div key={p} className="li">
              <span>❤</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
        <h3>Our bucket list (tap to tick)</h3>
        <div>
          {CONFIG.bucket.map((t, i) => (
            <div key={t} className={`li bk ${done[i] ? "done" : ""}`} onClick={() => toggle(i)}>
              <div className="box">{done[i] ? "✓" : ""}</div>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ================= QUIZ ================= */
export function Quiz() {
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const total = CONFIG.quiz.length;
  const q = CONFIG.quiz[qi];

  const choose = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.a) setScore((s) => s + 1);
    setTimeout(() => {
      setQi((n) => n + 1);
      setPicked(null);
    }, 1100);
  };

  return (
    <section style={GLOW_BOTTOM}>
      <Reveal className="tag">Let's see how well you know us</Reveal>
      <Reveal as="h2">Our little quiz</Reveal>
      <Reveal className="quiz">
        {qi >= total ? (
          <>
            <h3 style={{ fontSize: 26, marginBottom: 10 }}>You scored {score}/{total}</h3>
            <p>{score === total ? "Perfect! You know us so well 🥰" : "Cute try! Still my favourite person ❤"}</p>
          </>
        ) : (
          <>
            <p style={{ opacity: 0.6, fontSize: 13 }}>Question {qi + 1} of {total}</p>
            <h3 style={{ margin: "8px 0 12px", fontSize: 21 }}>{q.q}</h3>
            {q.o.map((o, i) => {
              let cls = "opt";
              if (picked !== null) {
                if (i === q.a) cls += " ok";
                else if (i === picked) cls += " no";
              }
              return (
                <button key={i} className={cls} disabled={picked !== null} onClick={() => choose(i)}>
                  {o}
                </button>
              );
            })}
          </>
        )}
      </Reveal>
    </section>
  );
}

/* ================= SCRATCH CARD ================= */
export function ScratchSection() {
  const cvRef = useRef(null);
  const drawing = useRef(false);
  const finished = useRef(false);
  const [fade, setFade] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { burst } = useHearts();

  useEffect(() => {
    const cv = cvRef.current;
    const r = cv.parentElement.getBoundingClientRect();
    cv.width = Math.round(r.width) || 340;
    cv.height = Math.round(r.height) || 190;
    const ctx = cv.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, cv.width, cv.height);
    g.addColorStop(0, "#d9b25f");
    g.addColorStop(0.5, "#f4dc9a");
    g.addColorStop(1, "#c79a45");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "rgba(60,40,10,.75)";
    ctx.font = "600 20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch here ✨", cv.width / 2, cv.height / 2);
  }, []);

  const scratch = (e) => {
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    const b = cv.getBoundingClientRect();
    const x = ((e.clientX - b.left) * cv.width) / b.width;
    const y = ((e.clientY - b.top) * cv.height) / b.height;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, 6.283);
    ctx.fill();
  };

  const check = () => {
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let c = 0, n = 0;
    for (let i = 3; i < d.length; i += 64) {
      n++;
      if (d[i] === 0) c++;
    }
    if (c / n > 0.5 && !finished.current) {
      finished.current = true;
      setFade(true);
      setTimeout(() => setHidden(true), 800);
      burst(20);
    }
  };

  return (
    <section style={DARK}>
      <Reveal className="tag">A tiny surprise</Reveal>
      <Reveal as="h2">Scratch to reveal</Reveal>
      <Reveal className="scratch-wrap">
        <div className="scratch-under" dangerouslySetInnerHTML={{ __html: CONFIG.scratchText }} />
        <canvas
          id="scratchCv"
          ref={cvRef}
          style={{ opacity: fade ? 0 : 1, display: hidden ? "none" : "block" }}
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={(e) => { if (drawing.current) scratch(e); }}
          onPointerUp={() => { drawing.current = false; check(); }}
          onPointerCancel={() => { drawing.current = false; }}
        />
      </Reveal>
    </section>
  );
}

/* ================= LETTER (typewriter) ================= */
export function Letter() {
  const ref = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const full = fill(CONFIG.letter);
    let timer = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          io.disconnect();
          let i = 0;
          timer = setInterval(() => {
            i++;
            setText(full.slice(0, i));
            if (i >= full.length) clearInterval(timer);
          }, 45);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  return (
    <section id="letterSec" ref={ref} style={{ background: "radial-gradient(circle at 50% 30%,#2a0f24,#0b0710 75%)" }}>
      <div className="content">
        <Reveal className="tag">A letter for you</Reveal>
        <div id="letterText">{text}</div>
      </div>
    </section>
  );
}

/* ================= FINAL QUESTION + GIFT ================= */
export function Finale() {
  const { burst } = useHearts();
  const [noPos, setNoPos] = useState(null);
  const [scale, setScale] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [giftShown, setGiftShown] = useState(false);
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const noRef = useRef(null);
  const giftRef = useRef(null);

  const runAway = useCallback(() => {
    const el = noRef.current;
    const w = el ? el.offsetWidth : 80;
    const h = el ? el.offsetHeight : 48;
    setNoPos({
      left: Math.random() * (window.innerWidth - w - 20) + 10,
      top: Math.random() * (window.innerHeight - h - 20) + 10,
    });
    setScale((s) => Math.min(s + 0.12, 2));
  }, []);

  // touchstart must be non-passive so preventDefault can stop the fake click
  useEffect(() => {
    const el = noRef.current;
    if (!el) return;
    const onTouch = (e) => {
      e.preventDefault();
      runAway();
    };
    el.addEventListener("touchstart", onTouch, { passive: false });
    return () => el.removeEventListener("touchstart", onTouch);
  }, [runAway, answered]);

  const yes = () => {
    setAnswered(true);
    burst(40);
    setTimeout(() => setGiftShown(true), 1200);
  };

  useEffect(() => {
    if (giftShown && giftRef.current) {
      giftRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [giftShown]);

  const openGift = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => {
      setOpened(true);
      burst(50);
    }, 600);
  };

  return (
    <section id="finalSec">
      <div className="bg" style={bgImg(CONFIG.finalImg)} />
      <div className="content">
        <Reveal className="tag">One last thing...</Reveal>
        <Reveal as="h2">{CONFIG.finalQuestion}</Reveal>

        {!answered && (
          <Reveal className="btns">
            <button className="btn" style={{ transform: `scale(${scale})` }} onClick={yes}>
              Yes ❤
            </button>
            <button
              id="noBtn"
              className="btn"
              ref={noRef}
              style={noPos ? { position: "fixed", left: noPos.left, top: noPos.top } : undefined}
              onMouseEnter={runAway}
              onClick={runAway}
            >
              No
            </button>
          </Reveal>
        )}

        <p id="finalMsg" style={{ marginTop: 20, fontSize: 18 }}>
          {answered ? CONFIG.yesMessage : ""}
        </p>

        {giftShown && (
          <div id="gift" ref={giftRef} style={{ display: "block" }}>
            <div className={`giftbox ${opening ? "open" : ""}`} onClick={openGift}>
              {opened ? "🎉" : "🎁"}
            </div>
            {!opened && <p style={{ opacity: 0.8 }}>I have one more thing for you... tap the gift</p>}
            <div className={`giftcard ${opened ? "show" : ""}`}>
              <h3>{CONFIG.gift.title}</h3>
              <p>{fill(CONFIG.gift.text)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}