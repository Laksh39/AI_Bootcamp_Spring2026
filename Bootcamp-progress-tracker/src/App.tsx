import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const MISSIONS = [
  { day: 1, title: "Build Your Progress Tracker", desc: "Create this tracker app in Claude using prompts. Master prompt engineering fundamentals." },
  { day: 2, title: "Fact-Checking & Research", desc: "Use Gemini to verify AI claims. Learn multi-model comparison and fact validation." },
  { day: 3, title: "The Creative Duel", desc: "Compare Claude vs. Gemini on storytelling & logic. Which AI excels at what?" },
  { day: 4, title: "GitHub Foundations", desc: "Set up your 'Vault' to save all your work. Learn version control & collaboration." },
  { day: 5, title: "Replit Deployment", desc: "Host your tracker app live on the web. Deploy and share with others." },
  { day: 6, title: "Pi Setup", desc: "Run the 'One-Command' setup script to install the AI brains on Raspberry Pi." },
  { day: 7, title: "The Local Brain", desc: "Run a chat model on the Pi with the Wi-Fi off. Experience local AI inference." },
  { day: 8, title: "Vision Quest", desc: "Use the Pi camera to detect objects in your room. Explore computer vision on edge." },
  { day: 9, title: "Agentic Workflows", desc: "Use Replit Agent to build a tool that talks to the Pi. Create agent-based systems." },
  { day: 10, title: "Milestone: AI Alert System", desc: "Build a physical 'AI Alert' system on the Pi. Combine hardware + AI intelligence." },
  { day: 11, title: "The Math of AI", desc: "Visualize how a 'Neuron' works on your Pi. Understand neural network fundamentals." },
  { day: 12, title: "AI Ethics & Guardrails", desc: "Research 'Guardrails' and write your GitHub safety guide. Build responsibly." },
  { day: 13, title: "Physical Assistant", desc: "Build a voice-controlled alarm or lamp. Create a practical AI-powered device." },
  { day: 14, title: "Portfolio Polish", desc: "Clean up your code and finish your README files. Prepare for presentation." },
  { day: 15, title: "The Grand Finale", desc: "Pitch your projects to the family! Showcase your AI builder journey." },
];

const TOOLS = ["Claude", "Gemini", "Pi"];
const TOOL_COLORS = {
  Claude: { bg: "#ff6b35", glow: "#ff6b3580", text: "#ff6b35" },
  Gemini: { bg: "#4285f4", glow: "#4285f480", text: "#4285f4" },
  Pi: { bg: "#00e5ff", glow: "#00e5ff80", text: "#00e5ff" },
};

const LEVELS = [
  { level: 1, title: "Initiate",       minExp: 0,    maxExp: 100,  color: "#607d8b" },
  { level: 2, title: "Apprentice",     minExp: 100,  maxExp: 250,  color: "#26a69a" },
  { level: 3, title: "Operator",       minExp: 250,  maxExp: 450,  color: "#00e5ff" },
  { level: 4, title: "Architect",      minExp: 450,  maxExp: 700,  color: "#00bfa5" },
  { level: 5, title: "Specialist",     minExp: 700,  maxExp: 1000, color: "#64ffda" },
  { level: 6, title: "Engineer",       minExp: 1000, maxExp: 1350, color: "#69f0ae" },
  { level: 7, title: "Innovator",      minExp: 1350, maxExp: 1750, color: "#b2ff59" },
  { level: 8, title: "Synthesizer",    minExp: 1750, maxExp: 2200, color: "#ffff00" },
  { level: 9, title: "Neural Sage",    minExp: 2200, maxExp: 2700, color: "#ffab40" },
  { level: 10, title: "Pro-Builder",   minExp: 2700, maxExp: 3000, color: "#ff6e40" },
];

const EXP_REWARDS = {
  complete: 120,
  sign: 50,
  tool: 30,
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function getUserId() {
  let userId = localStorage.getItem("tracker_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("tracker_user_id", userId);
  }
  return userId;
}

function getLevelInfo(exp: number) {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (exp >= LEVELS[i].minExp) { current = LEVELS[i]; break; }
  }
  return current;
}

function getExpForActions(card: { completed: boolean; signed: boolean; tool: string | null }) {
  let x = 0;
  if (card.completed) x += EXP_REWARDS.complete;
  if (card.signed) x += EXP_REWARDS.sign;
  if (card.tool) x += EXP_REWARDS.tool;
  return x;
}

const StarField = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4, dur: Math.random() * 3 + 2,
  }));
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.size} fill="#ffffff">
          <animate attributeName="opacity" values="0.1;0.8;0.1" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
};

const ScanLine = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.015) 2px, rgba(0,255,200,0.015) 4px)",
  }} />
);

function XPToast({ items, onDone }: { items: Array<{ exp: number; label: string; icon: string; color: string }>; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 2000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", top: "80px", right: "24px", zIndex: 100,
      display: "flex", flexDirection: "column", gap: "8px",
      opacity: visible ? 1 : 0, transition: "opacity 0.4s",
      pointerEvents: "none",
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          background: "linear-gradient(135deg, #001a2e, #002233)",
          border: `1px solid ${item.color}66`,
          borderRadius: "6px", padding: "10px 16px",
          boxShadow: `0 0 16px ${item.color}44`,
          display: "flex", alignItems: "center", gap: "10px",
          animation: "slideIn 0.3s ease forwards",
          animationDelay: `${i * 0.1}s`,
          opacity: 0,
        }}>
          <span style={{ fontSize: "18px" }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: "11px", color: item.color, letterSpacing: "2px", fontWeight: "bold" }}>
              +{item.exp} EXP
            </div>
            <div style={{ fontSize: "9px", color: "#4dd0e188", letterSpacing: "1px" }}>{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LevelUpBanner({ levelInfo, onDone }: { levelInfo: typeof LEVELS[0]; onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 500); }, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)",
      opacity: visible ? 1 : 0, transition: "opacity 0.5s",
      pointerEvents: visible ? "auto" : "none",
    }}>
      <div style={{
        textAlign: "center",
        animation: "levelPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
      }}>
        <div style={{ fontSize: "13px", letterSpacing: "6px", color: levelInfo.color, marginBottom: "12px", textTransform: "uppercase" }}>
          ◈ Level Up ◈
        </div>
        <div style={{
          fontSize: "clamp(36px, 8vw, 64px)", fontWeight: "900",
          color: levelInfo.color, letterSpacing: "4px",
          textShadow: `0 0 30px ${levelInfo.color}, 0 0 60px ${levelInfo.color}66`,
          textTransform: "uppercase",
        }}>
          {levelInfo.title}
        </div>
        <div style={{ fontSize: "14px", color: "#4dd0e1", letterSpacing: "3px", marginTop: "8px" }}>
          LEVEL {levelInfo.level} UNLOCKED
        </div>
        <div style={{
          marginTop: "20px", width: "200px", height: "2px",
          background: `linear-gradient(90deg, transparent, ${levelInfo.color}, transparent)`,
          margin: "20px auto 0",
          boxShadow: `0 0 10px ${levelInfo.color}`,
        }} />
      </div>
    </div>
  );
}

export default function App() {
  const [cards, setCards] = useState(() =>
    MISSIONS.map((m) => ({ ...m, completed: false, signed: false, tool: null as string | null }))
  );
  const [toasts, setToasts] = useState<Array<{ id: number; items: Array<{ exp: number; label: string; icon: string; color: string }> }>>([]);
  const [levelUpInfo, setLevelUpInfo] = useState<typeof LEVELS[0] | null>(null);
  const [prevLevel, setPrevLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const userIdRef = useRef(getUserId());
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  const totalExp = cards.reduce((sum, c) => sum + getExpForActions(c), 0);
  const levelInfo = getLevelInfo(totalExp);
  const completed = cards.filter((c) => c.completed).length;
  const progress = Math.round((completed / 15) * 100);
  const expInLevel = totalExp - levelInfo.minExp;
  const expNeeded = levelInfo.maxExp - levelInfo.minExp;
  const levelProgress = Math.min(100, Math.round((expInLevel / expNeeded) * 100));

  const showToast = (items: Array<{ exp: number; label: string; icon: string; color: string }>) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, items }]);
  };

  const handleComplete = (idx: number) => {
    const card = cards[idx];
    const wasCompleted = card.completed;
    const updated = cards.map((c, i) => i === idx ? { ...c, completed: !c.completed } : c);
    setCards(updated);
    saveProgress(updated);
    if (!wasCompleted) showToast([{ exp: EXP_REWARDS.complete, label: "Mission Complete", icon: "⚡", color: "#64ffda" }]);
  };

  const handleSign = (idx: number) => {
    const card = cards[idx];
    if (card.signed) return;
    const updated = cards.map((c, i) => i === idx ? { ...c, signed: true } : c);
    setCards(updated);
    saveProgress(updated);
    showToast([{ exp: EXP_REWARDS.sign, label: "Parent Authorized", icon: "✦", color: "#00e5ff" }]);
  };

  const handleTool = (idx: number, tool: string) => {
    const card = cards[idx];
    const hadTool = !!card.tool;
    const updated = cards.map((c, i) => i === idx ? { ...c, tool: c.tool === tool ? null : tool } : c);
    setCards(updated);
    saveProgress(updated);
    if (!hadTool) showToast([{ exp: EXP_REWARDS.tool, label: `Tool Logged: ${tool}`, icon: "🛠", color: TOOL_COLORS[tool as keyof typeof TOOL_COLORS].text }]);
  };

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", userIdRef.current);

        if (error) throw error;

        if (data && data.length > 0) {
          const progressMap = new Map(data.map((p) => [p.mission_day, p]));
          setCards((prev) =>
            prev.map((card) => {
              const saved = progressMap.get(card.day);
              return saved ? { ...card, completed: saved.completed, signed: saved.signed, tool: saved.tool } : card;
            })
          );
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  useEffect(() => {
    if (levelInfo.level > prevLevel) {
      setLevelUpInfo(levelInfo);
      setPrevLevel(levelInfo.level);
    }
  }, [levelInfo.level, prevLevel]);

  const saveProgress = async (updatedCards: typeof cards) => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        const updates = updatedCards.map((card) => ({
          user_id: userIdRef.current,
          mission_day: card.day,
          completed: card.completed,
          signed: card.signed,
          tool: card.tool,
        }));

        for (const update of updates) {
          await supabase.from("progress").upsert([update], { onConflict: "user_id,mission_day" });
        }
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 20%, #0a0f1e 0%, #050810 60%, #000308 100%)",
        fontFamily: "'Courier New', monospace",
        color: "#e0f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "14px", letterSpacing: "4px", color: "#00e5ff", marginBottom: "16px" }}>LOADING PROGRESS...</div>
          <div style={{ width: "40px", height: "40px", margin: "0 auto", border: "2px solid #00e5ff33", borderTop: "2px solid #00e5ff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 20%, #0a0f1e 0%, #050810 60%, #000308 100%)",
      fontFamily: "'Courier New', monospace",
      color: "#e0f7fa",
      padding: "20px",
      position: "relative",
      overflowX: "hidden",
    }}>
      <StarField />
      <ScanLine />

      {toasts.map((t) => (
        <XPToast key={t.id} items={t.items} onDone={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} />
      ))}
      {levelUpInfo && <LevelUpBanner levelInfo={levelUpInfo} onDone={() => setLevelUpInfo(null)} />}

      <div style={{ textAlign: "center", marginBottom: "28px", position: "relative", zIndex: 2 }}>
        <div style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #00e5ff22, #00bfa522)",
          border: "1px solid #00e5ff44", borderRadius: "4px",
          padding: "4px 14px", fontSize: "10px", letterSpacing: "4px",
          color: "#00e5ff", marginBottom: "12px", textTransform: "uppercase",
        }}>⬡ AI Bootcamp // Sector 7G ⬡</div>
        <h1 style={{
          fontSize: "clamp(22px, 5vw, 42px)", fontWeight: "900",
          letterSpacing: "3px", textTransform: "uppercase",
          background: "linear-gradient(90deg, #00e5ff, #00bfa5, #64ffda)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          margin: "0 0 4px", filter: "drop-shadow(0 0 20px #00e5ff66)",
        }}>Pro-Builder Progress Tracker</h1>
        <p style={{ fontSize: "11px", letterSpacing: "6px", color: "#4dd0e188", textTransform: "uppercase", margin: "0 0 24px" }}>
          15-Day Mission Protocol · Builder Class
        </p>

        <div style={{ maxWidth: "600px", margin: "0 auto 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#4dd0e1", letterSpacing: "2px", marginBottom: "8px" }}>
            <span>▸ MISSION PROGRESS</span>
            <span>{completed}/15 COMPLETE · {progress}%</span>
          </div>
          <div style={{ height: "10px", background: "#0a1628", borderRadius: "6px", border: "1px solid #00e5ff33", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg, #00bfa5, #00e5ff, #64ffda)",
              borderRadius: "6px", transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 0 12px #00e5ff88",
            }} />
          </div>
        </div>

        <LevelPanel totalExp={totalExp} levelInfo={levelInfo} levelProgress={levelProgress} expInLevel={expInLevel} expNeeded={expNeeded} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px", maxWidth: "1200px", margin: "0 auto",
        position: "relative", zIndex: 2,
      }}>
        {cards.map((card, idx) => (
          <MissionCard
            key={card.day} card={card} idx={idx}
            onToggle={() => handleComplete(idx)}
            onSign={() => handleSign(idx)}
            onSetTool={(t) => handleTool(idx, t)}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px", position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#1a3a4a" }}>
          ◈ SYSTEM ONLINE · ANTHROPIC NEURAL NET · BUILD v15.0 ◈
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes levelPop { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>
    </div>
  );
}

function LevelPanel({ totalExp, levelInfo, levelProgress, expInLevel, expNeeded }: {
  totalExp: number;
  levelInfo: typeof LEVELS[0];
  levelProgress: number;
  expInLevel: number;
  expNeeded: number;
}) {
  const allLevels = LEVELS;
  return (
    <div style={{
      maxWidth: "700px", margin: "0 auto",
      background: "linear-gradient(135deg, #060e1a, #080d18)",
      border: `1px solid ${levelInfo.color}44`,
      borderRadius: "10px", padding: "20px",
      boxShadow: `0 0 24px ${levelInfo.color}22`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${levelInfo.color}`,
          background: `radial-gradient(circle, ${levelInfo.color}22, transparent)`,
          boxShadow: `0 0 20px ${levelInfo.color}66`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: "20px", fontWeight: "900", color: levelInfo.color, lineHeight: 1 }}>{levelInfo.level}</div>
          <div style={{ fontSize: "7px", letterSpacing: "1px", color: `${levelInfo.color}88` }}>LVL</div>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#4dd0e188", marginBottom: "2px", textTransform: "uppercase" }}>Current Rank</div>
          <div style={{
            fontSize: "20px", fontWeight: "900", letterSpacing: "2px",
            color: levelInfo.color, textTransform: "uppercase",
            textShadow: `0 0 10px ${levelInfo.color}66`,
          }}>{levelInfo.title}</div>
          <div style={{ fontSize: "10px", color: "#4dd0e166", letterSpacing: "1px", marginTop: "2px" }}>
            {totalExp.toLocaleString()} TOTAL EXP
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#4dd0e155" }}>NEXT LEVEL</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: levelInfo.color }}>
            {levelInfo.level < 10 ? `${(expNeeded - expInLevel).toLocaleString()} EXP` : "MAX"}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#4dd0e166", letterSpacing: "2px", marginBottom: "6px" }}>
          <span>▸ EXPERIENCE</span>
          <span>{expInLevel} / {expNeeded} EXP</span>
        </div>
        <div style={{ height: "8px", background: "#0a1628", borderRadius: "4px", border: `1px solid ${levelInfo.color}33`, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${levelProgress}%`,
            background: `linear-gradient(90deg, ${levelInfo.color}88, ${levelInfo.color})`,
            borderRadius: "4px", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 8px ${levelInfo.color}88`,
          }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {[
          { icon: "⚡", label: "Mission", exp: EXP_REWARDS.complete, color: "#64ffda" },
          { icon: "✦", label: "Signature", exp: EXP_REWARDS.sign, color: "#00e5ff" },
          { icon: "🛠", label: "Tool Log", exp: EXP_REWARDS.tool, color: "#ff6b35" },
        ].map((r) => (
          <div key={r.label} style={{
            flex: 1, background: "#0a1628", border: `1px solid ${r.color}33`,
            borderRadius: "6px", padding: "8px 6px", textAlign: "center",
          }}>
            <div style={{ fontSize: "14px" }}>{r.icon}</div>
            <div style={{ fontSize: "11px", color: r.color, fontWeight: "bold" }}>+{r.exp}</div>
            <div style={{ fontSize: "8px", color: "#4dd0e166", letterSpacing: "1px" }}>{r.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "4px", alignItems: "flex-end" }}>
        {allLevels.map((lv) => {
          const active = totalExp >= lv.minExp;
          const current = lv.level === levelInfo.level;
          return (
            <div key={lv.level} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: `${8 + lv.level * 3}px`,
                background: active ? lv.color : "#1a3a4a",
                borderRadius: "2px 2px 0 0",
                boxShadow: current ? `0 0 8px ${lv.color}` : "none",
                transition: "all 0.3s",
                animation: current ? "pulse 1.5s ease-in-out infinite" : "none",
              }} />
              <div style={{ fontSize: "7px", color: active ? lv.color : "#1a3a4a", marginTop: "3px" }}>{lv.level}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissionCard({ card, idx, onToggle, onSign, onSetTool }: {
  card: typeof MISSIONS[0] & { completed: boolean; signed: boolean; tool: string | null };
  idx: number;
  onToggle: () => void;
  onSign: () => void;
  onSetTool: (tool: string) => void;
}) {
  const cardExp = getExpForActions(card);
  const border = card.completed ? "1px solid #00e5ff66" : "1px solid #1a3a4a";
  const bg = card.completed ? "linear-gradient(135deg, #001a2e, #002233)" : "linear-gradient(135deg, #060e1a, #080d18)";
  const glow = card.completed ? "0 0 20px #00e5ff22, inset 0 0 20px #00e5ff08" : "0 2px 8px #00000066";

  return (
    <div style={{
      background: bg, border, borderRadius: "8px", padding: "18px",
      boxShadow: glow, transition: "all 0.3s ease",
      position: "relative", overflow: "hidden",
      animation: "fadeIn 0.4s ease forwards",
      animationDelay: `${idx * 0.04}s`, opacity: 0,
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px",
        borderTop: card.completed ? "2px solid #00e5ff66" : "2px solid #1a3a4a44",
        borderRight: card.completed ? "2px solid #00e5ff66" : "2px solid #1a3a4a44",
        borderTopRightRadius: "8px" }} />

      <div style={{
        position: "absolute", top: "10px", right: "10px",
        background: cardExp > 0 ? "#00e5ff22" : "#1a3a4a",
        border: `1px solid ${cardExp > 0 ? "#00e5ff66" : "#1a3a4a"}`,
        borderRadius: "4px", padding: "2px 7px",
        fontSize: "9px", color: cardExp > 0 ? "#00e5ff" : "#2a5a7a",
        letterSpacing: "1px", fontWeight: "bold",
      }}>
        {cardExp > 0 ? `+${cardExp} EXP` : "0 EXP"}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", paddingRight: "60px" }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#4dd0e188", textTransform: "uppercase", marginBottom: "4px" }}>
            DAY {String(card.day).padStart(2, "0")}
          </div>
          <div style={{
            fontSize: "15px", fontWeight: "900", letterSpacing: "1px",
            color: card.completed ? "#64ffda" : "#7fdbff",
            textTransform: "uppercase",
            textShadow: card.completed ? "0 0 10px #64ffda66" : "none",
          }}>{card.title}</div>
        </div>
        <button onClick={onToggle} style={{
          width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
          border: card.completed ? "2px solid #00e5ff" : "2px solid #1a4a5a",
          background: card.completed ? "radial-gradient(circle, #00e5ff22, #00bfa511)" : "transparent",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", boxShadow: card.completed ? "0 0 12px #00e5ff66" : "none",
          transition: "all 0.2s",
        }}>
          {card.completed ? "✓" : "○"}
        </button>
      </div>

      <p style={{ fontSize: "11px", color: "#4dd0e188", margin: "0 0 14px", lineHeight: "1.6" }}>{card.desc}</p>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#4dd0e155", marginBottom: "6px" }}>▸ TOOL USED</div>
        <div style={{ display: "flex", gap: "6px" }}>
          {TOOLS.map((t) => {
            const tc = TOOL_COLORS[t as keyof typeof TOOL_COLORS];
            const active = card.tool === t;
            return (
              <button key={t} onClick={() => onSetTool(t)} style={{
                flex: 1, padding: "5px 4px", borderRadius: "4px",
                border: active ? `1px solid ${tc.bg}` : "1px solid #1a3a4a",
                background: active ? `${tc.bg}22` : "transparent",
                color: active ? tc.text : "#4dd0e144",
                fontSize: "10px", letterSpacing: "1px", cursor: "pointer",
                fontFamily: "inherit", textTransform: "uppercase",
                boxShadow: active ? `0 0 8px ${tc.glow}` : "none",
                transition: "all 0.2s", fontWeight: active ? "bold" : "normal",
              }}>{t}</button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#4dd0e155", marginBottom: "6px" }}>▸ PARENT AUTHORIZATION</div>
        {card.signed ? (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 12px", background: "#001a1a",
            border: "1px solid #00e5ff44", borderRadius: "4px",
          }}>
            <span style={{ fontSize: "16px" }}>✦</span>
            <span style={{ fontSize: "10px", color: "#00e5ff", letterSpacing: "2px" }}>AUTHORIZED</span>
            <span style={{ marginLeft: "auto", fontSize: "9px", color: "#4dd0e166" }}>VERIFIED</span>
          </div>
        ) : (
          <button onClick={onSign} style={{
            width: "100%", padding: "9px", background: "transparent",
            border: "1px dashed #2a5a7a", borderRadius: "4px",
            color: "#4dd0e199", fontSize: "10px", letterSpacing: "2px",
            cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#00e5ff66"; e.currentTarget.style.color = "#00e5ff"; e.currentTarget.style.background = "#00e5ff11"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a5a7a"; e.currentTarget.style.color = "#4dd0e199"; e.currentTarget.style.background = "transparent"; }}
          >
            ✎ Tap to Sign
          </button>
        )}
      </div>

      {card.completed && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg, transparent, #00e5ff, #64ffda, transparent)",
          animation: "pulse 2s ease-in-out infinite",
        }} />
      )}
    </div>
  );
}
