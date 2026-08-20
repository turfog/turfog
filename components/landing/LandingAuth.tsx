"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Logo from "@/components/Logo";

const U = "https://images.unsplash.com/";

const LIVE = [
  { n: "Rahul K.", t: "joined a game near you", time: "2m", icon: "JOINED", sport: "Football", img: "photo-1579952363873-27f3bade9f55", alt: "Football on a green pitch" },
  { n: "5 players", t: "looking for a match tonight", time: "5m", icon: "LOOKING", sport: "Football", img: "photo-1526232761682-d26e03ac148e", alt: "Team huddle" },
  { n: "Football", t: "8 PM · Downtown Turf · 1 slot left", time: "12m", icon: "TONIGHT", sport: "Turf", img: "photo-1522778119026-d647f0596c20", alt: "Stadium under floodlights" },
  { n: "Arun S.", t: "created team “Storm FC”", time: "18m", icon: "NEW TEAM", sport: "Football", img: "photo-1551958219-acbc608c6377", alt: "Players competing" },
  { n: "3 players", t: "available nearby · open to play", time: "22m", icon: "AVAILABLE", sport: "Running", img: "photo-1552674605-db6ffd4facb5", alt: "Runners on a track" },
  { n: "Cricket match", t: "starting in 45 minutes", time: "28m", icon: "SOON", sport: "Cricket", img: "photo-1531415074968-036a1b608fc1", alt: "Cricket bat and ball" },
  { n: "Sunday Crew", t: "looking for 2 more players", time: "35m", icon: "2 NEEDED", sport: "Football", img: "photo-1517466787929-bc90951d0974", alt: "Player striking a football" },
  { n: "Priya S.", t: "verified her sports profile", time: "41m", icon: "VERIFIED", sport: "Basketball", img: "photo-1546519638-68e109498ffc", alt: "Basketball hoop" },
  { n: "Match #2847", t: "finished · confirmed by captains", time: "48m", icon: "DONE", sport: "Football", img: "photo-1431324155629-1a6deb1dec8d", alt: "Stadium at kickoff" },
  { n: "Neha P.", t: "joined Riverside Rovers", time: "1h", icon: "JOINED", sport: "Football", img: "photo-1459865264687-595d652de67e", alt: "Ball hitting the net" },
];

const FEATS = [
  { i: "🚨", t: "Player SOS", d: "One tap pings verified players when you need subs fast." },
  { i: "📍", t: "Games near you", d: "Every open match within your radius — live and bookable." },
  { i: "🤝", t: "Find your people", d: "Players at your level, teams that match your vibe." },
  { i: "✅", t: "Verified stats", d: "Scores and attendance confirmed by both captains." },
  { i: "⚡", t: "Smart availability", d: "Flip “Available” — the right games come to you." },
  { i: "🛡️", t: "Team identity", d: "Rosters, match history, trophies — your squad’s home." },
  { i: "⭐", t: "Trust score", d: "Show up, play fair. Your reputation follows you." },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
:root{--bg-right:#FFFFFF;--bg-left:#F8FBF9;--green-50:#ECFDF5;--green-100:#D1FAE5;--green-500:#10B981;--green-600:#059669;--green-700:#047857;--slate-900:#0F172A;--slate-700:#334155;--slate-500:#64748B;--slate-400:#94A3B8;--slate-200:#E2E8F0;--slate-100:#F1F5F9;--shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.03);--shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.05),0 2px 4px -2px rgb(0 0 0 / 0.03);}
.lz *,.lz *::before,.lz *::after{box-sizing:border-box;margin:0;padding:0}
.lz{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg-right);color:var(--slate-700);-webkit-font-smoothing:antialiased;line-height:1.5;height:100dvh;overflow:hidden;}
.lz-shell{display:grid;grid-template-columns:1.15fr 0.85fr;height:100dvh;width:100vw;overflow:hidden;}
.lz-left{background:var(--bg-left);position:relative;display:flex;flex-direction:column;padding:40px 48px;overflow:hidden;border-right:1px solid var(--slate-200);}
.lz-left::before{content:"";position:absolute;top:-10%;left:-10%;width:60%;height:60%;background:radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%);pointer-events:none;z-index:0;}
.lz-left::after{content:"";position:absolute;bottom:-10%;right:-10%;width:50%;height:50%;background:radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%);pointer-events:none;z-index:0;}
.lz-left>*{position:relative;z-index:1}
.lz-brand{display:flex;align-items:center;gap:10px;margin-bottom:40px}
.lz-brand-mark{width:12px;height:12px;border-radius:4px;background:var(--green-500);box-shadow:0 0 12px rgba(16,185,129,0.4)}
.lz-brand-text{font-weight:800;font-size:20px;letter-spacing:-0.02em;color:var(--slate-900)}
.lz-hero{margin-bottom:36px;max-width:520px}
.lz-hero h1{font-size:clamp(32px,3.5vw,46px);font-weight:800;letter-spacing:-0.035em;line-height:1.1;color:var(--slate-900);margin-bottom:14px;}
.lz-hero h1 .accent{color:var(--green-600)}
.lz-hero p{font-size:16px;color:var(--slate-500);line-height:1.6}
.lz-feeds{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:24px}
.lz-col{display:flex;flex-direction:column;min-height:0}
.lz-col-label{flex-shrink:0;display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--slate-500);margin-bottom:14px;}
.lz-col-label .dot{width:6px;height:6px;border-radius:50%;background:var(--green-500);animation:lz-pulse 2s infinite}
@keyframes lz-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
.lz-col-label .arrow{margin-left:auto;color:var(--green-600);font-size:14px;font-weight:800}
.lz-feed{flex:1;min-height:0;overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(180deg,transparent 0%,black 8%,black 92%,transparent 100%);mask-image:linear-gradient(180deg,transparent 0%,black 8%,black 92%,transparent 100%);}
.lz-track{display:flex;flex-direction:column;gap:14px;will-change:transform}
@keyframes lz-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes lz-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
.lz-track-up{animation:lz-up 60s linear infinite}
.lz-track-down{animation:lz-down 45s linear infinite}
.lz-feed:hover .lz-track-up,.lz-feed:hover .lz-track-down{animation-play-state:paused}
.lz-card{background:#FFFFFF;border:1px solid var(--slate-200);border-radius:16px;overflow:hidden;box-shadow:var(--shadow-sm);flex-shrink:0;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;}
.lz-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);border-color:var(--green-100)}
.lz-card-img{position:relative;height:120px;overflow:hidden;background:var(--slate-100)}
.lz-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s ease}
.lz-card:hover .lz-card-img img{transform:scale(1.05)}
.lz-card-badge{position:absolute;top:10px;left:10px;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);color:var(--green-700);font-size:10px;font-weight:800;letter-spacing:0.06em;padding:4px 10px;border-radius:999px;box-shadow:var(--shadow-sm);}
.lz-card-body{padding:12px 14px 14px}
.lz-card-title{font-size:13.5px;color:var(--slate-700);line-height:1.35;letter-spacing:-0.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lz-card-title strong{color:var(--slate-900);font-weight:700}
.lz-card-meta{display:flex;align-items:center;gap:6px;margin-top:6px;font-size:11.5px;color:var(--slate-500)}
.lz-card-meta .sep{color:#CBD5E1}
.lz-feat{background:#FFFFFF;border:1px solid var(--slate-200);border-radius:16px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;box-shadow:var(--shadow-sm);flex-shrink:0;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;}
.lz-feat:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);border-color:var(--green-100)}
.lz-feat-icon{width:38px;height:38px;border-radius:12px;flex-shrink:0;background:var(--green-50);border:1px solid var(--green-100);display:flex;align-items:center;justify-content:center;font-size:18px;}
.lz-feat-body{flex:1;min-width:0}
.lz-feat-title{font-size:13.5px;font-weight:700;color:var(--slate-900);line-height:1.3;letter-spacing:-0.01em}
.lz-feat-desc{font-size:12px;color:var(--slate-500);margin-top:3px;line-height:1.4}
.lz-right{background:var(--bg-right);display:flex;align-items:center;justify-content:center;padding:48px;position:relative;}
.lz-auth{width:100%;max-width:380px}
.lz-auth-header{margin-bottom:32px}
.lz-auth-header h2{font-size:26px;font-weight:800;letter-spacing:-0.02em;color:var(--slate-900);margin-bottom:8px}
.lz-auth-header p{font-size:14px;color:var(--slate-500)}
.lz-tabs{display:flex;gap:4px;padding:4px;background:var(--slate-100);border-radius:12px;margin-bottom:26px}
.lz-tab{flex:1;border:none;background:transparent;padding:10px 12px;border-radius:9px;font:inherit;font-weight:600;font-size:13px;color:var(--slate-500);cursor:pointer;transition:all .2s ease;}
.lz-tab.active{background:#FFFFFF;color:var(--slate-900);box-shadow:var(--shadow-sm)}
.lz-tab:not(.active):hover{color:var(--slate-700)}
.lz-field{margin-bottom:18px}
.lz-field label{display:block;font-size:12px;font-weight:600;color:var(--slate-700);margin-bottom:8px}
.lz-input{width:100%;background:#FFFFFF;border:1px solid var(--slate-200);border-radius:10px;padding:13px 16px;font:inherit;font-size:14px;color:var(--slate-900);transition:all .2s ease;}
.lz-input::placeholder{color:var(--slate-400)}
.lz-input:focus{outline:none;border-color:var(--green-500);box-shadow:0 0 0 4px rgba(16,185,129,0.12)}
.lz-btn{width:100%;padding:14px;background:var(--green-500);color:#FFFFFF;border:none;border-radius:10px;font:inherit;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s ease;box-shadow:0 1px 2px rgba(16,185,129,0.2);}
.lz-btn:hover{background:var(--green-600);transform:translateY(-1px);box-shadow:0 4px 12px rgba(16,185,129,0.25)}
.lz-btn:active{transform:translateY(0)}
.lz-btn:disabled{opacity:0.6;cursor:default;transform:none}
.lz-error{margin-bottom:14px;font-size:12px;color:#DC2626;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:10px 12px}
.lz-success{margin-bottom:14px;font-size:12px;color:var(--green-700);background:var(--green-50);border:1px solid var(--green-100);border-radius:10px;padding:10px 12px}
.lz-divider{display:flex;align-items:center;gap:16px;margin:22px 0;color:var(--slate-400);font-size:12px;font-weight:500}
.lz-divider::before,.lz-divider::after{content:"";flex:1;height:1px;background:var(--slate-200)}
.lz-social{width:100%;padding:13px;background:#FFFFFF;color:var(--slate-700);border:1px solid var(--slate-200);border-radius:10px;font:inherit;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .2s ease;}
.lz-social:hover{background:var(--slate-100)}
.lz-foot{margin-top:28px;text-align:center;font-size:13px;color:var(--slate-500)}
.lz-foot a{color:var(--green-600);font-weight:600;text-decoration:none;cursor:pointer}
.lz-foot a:hover{text-decoration:underline}
.lz-global{position:absolute;bottom:24px;left:0;right:0;text-align:center;font-size:11px;color:var(--slate-400)}
.lz-global a{color:var(--slate-500);text-decoration:none;margin:0 8px;transition:color .2s}
.lz-global a:hover{color:var(--green-600)}
@media(max-width:900px){
  .lz-shell{grid-template-columns:1fr;grid-template-rows:auto 1fr auto}
  .lz-left{border-right:none;border-bottom:1px solid var(--slate-200);padding:20px 20px 16px}
  .lz-brand{margin-bottom:16px}.lz-hero{margin-bottom:16px}
  .lz-hero h1{font-size:26px;margin-bottom:6px}.lz-hero p{display:none}
  .lz-feeds{grid-template-columns:1fr;gap:12px;max-height:220px}
  .lz-col-right{display:none}.lz-card-img{height:96px}
  .lz-right{padding:24px 20px;align-items:flex-start}.lz-auth{max-width:100%}
  .lz-auth-header{margin-bottom:18px}.lz-auth-header h2{font-size:21px}
  .lz-global{position:relative;bottom:auto;margin-top:20px;padding-bottom:8px}
}
@media(prefers-reduced-motion:reduce){
  .lz-track-up,.lz-track-down{animation:none;transform:none}
  .lz-brand-mark,.lz-col-label .dot{animation:none}
  .lz-feed{overflow-y:auto;-webkit-mask-image:none;mask-image:none}
  .lz *,.lz *::before,.lz *::after{transition:none!important}
}
`;

export default function LandingAuth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [liEmail, setLiEmail] = useState("");
  const [liPass, setLiPass] = useState("");
  const [rgName, setRgName] = useState("");
  const [rgEmail, setRgEmail] = useState("");
  const [rgPass, setRgPass] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: liEmail, password: liPass });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/"); router.refresh();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: rgEmail,
      password: rgPass,
      options: { data: { full_name: rgName }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess("Account created! Check your email to verify, then log in.");
    setMode("login");
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
  };

  return (
    <div className="lz">
      <style>{CSS}</style>
      <div className="lz-shell">
        {/* LEFT: showcase */}
        <div className="lz-left">
          <div className="lz-brand"><Logo size={36} priority /></div>
          <div className="lz-hero">
            <h1>Never Cancel <span className="accent">a Match</span> Again.</h1>
            <p>The player-first sports network. Find players, join games, and build your local team in seconds.</p>
          </div>
          <div className="lz-feeds">
            <div className="lz-col">
              <div className="lz-col-label"><span className="dot" />Live Activity<span className="arrow">↑</span></div>
              <div className="lz-feed">
                <div className="lz-track lz-track-up">
                  {[...LIVE, ...LIVE].map((item, i) => (
                    <article className="lz-card" key={i}>
                      <div className="lz-card-img">
                        <img src={`${U}${item.img}?auto=format&fit=crop&w=800&q=80`} alt={item.alt} loading="lazy" decoding="async" />
                        <span className="lz-card-badge">{item.icon}</span>
                      </div>
                      <div className="lz-card-body">
                        <div className="lz-card-title"><strong>{item.n}</strong> {item.t}</div>
                        <div className="lz-card-meta"><span>{item.sport}</span><span className="sep">·</span><span>{item.time} ago</span></div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <div className="lz-col lz-col-right">
              <div className="lz-col-label"><span className="dot" />What&apos;s Inside<span className="arrow">↓</span></div>
              <div className="lz-feed">
                <div className="lz-track lz-track-down">
                  {[...FEATS, ...FEATS].map((f, i) => (
                    <div className="lz-feat" key={i}>
                      <div className="lz-feat-icon">{f.i}</div>
                      <div className="lz-feat-body">
                        <div className="lz-feat-title">{f.t}</div>
                        <div className="lz-feat-desc">{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: auth */}
        <div className="lz-right">
          <div className="lz-auth">
            <div className="lz-auth-header">
              <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p>{mode === "login" ? "Log in to access your dashboard and upcoming matches." : "Join the network and never cancel a match again."}</p>
            </div>

            <div className="lz-tabs" role="tablist">
              <button className={`lz-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Log In</button>
              <button className={`lz-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
            </div>

            {error && <div className="lz-error">{error}</div>}
            {success && <div className="lz-success">{success}</div>}

            {mode === "login" ? (
              <form onSubmit={handleLogin}>
                <div className="lz-field"><label>Email</label><input className="lz-input" type="email" value={liEmail} onChange={(e) => setLiEmail(e.target.value)} placeholder="you@example.com" required /></div>
                <div className="lz-field"><label>Password</label><input className="lz-input" type="password" value={liPass} onChange={(e) => setLiPass(e.target.value)} placeholder="••••••••" required /></div>
                <button type="submit" className="lz-btn" disabled={loading}>{loading ? "Signing in…" : "Continue"}</button>
                <p className="lz-foot"><Link href="/auth/forgot-password">Forgot password?</Link></p>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="lz-field"><label>Full Name</label><input className="lz-input" type="text" value={rgName} onChange={(e) => setRgName(e.target.value)} placeholder="Alex Fernandes" required /></div>
                <div className="lz-field"><label>Email</label><input className="lz-input" type="email" value={rgEmail} onChange={(e) => setRgEmail(e.target.value)} placeholder="you@example.com" required /></div>
                <div className="lz-field"><label>Password</label><input className="lz-input" type="password" value={rgPass} onChange={(e) => setRgPass(e.target.value)} placeholder="Minimum 6 characters" required /></div>
                <button type="submit" className="lz-btn" disabled={loading}>{loading ? "Creating…" : "Create Account"}</button>
              </form>
            )}

            <div className="lz-divider">OR</div>
            <button className="lz-social" type="button" onClick={handleGoogle}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
              Continue with Google
            </button>

            <p className="lz-foot">By continuing, you agree to Turfog&apos;s <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
          </div>
          <div className="lz-global"><a href="#">About</a><a href="#">Help</a><a href="#">Privacy</a><a href="#">Terms</a></div>
        </div>
      </div>
    </div>
  );
}