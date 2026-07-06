import { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from "recharts";
import { Activity, Heart, Droplet, Wind, ChevronRight, ChevronLeft } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────
   VELOCITY · Digital Twin — OSU Wrestling
   Coach-facing. Real roster. Synthetic physiological data.
   Mobile-first: roster list → tap → athlete detail → back.
   ────────────────────────────────────────────────────────────────── */

const C = {
  ground:    "#0B1220",
  surface:   "#131D31",
  surfaceHi: "#172339",
  line:      "#243049",
  lineHi:    "#2E3C58",
  text:      "#E8EDF5",
  muted:     "#8595B0",
  faint:     "#5C6A88",
  brand:     "#6C8BFF",
  jade:      "#2FD3A5",
  amber:     "#F5B544",
  coral:     "#FF6A5A",
  scarlet:   "#BB0000",
};

const sc = (v) => v >= 80 ? C.jade : v >= 65 ? C.amber : C.coral;

const ROSTER = [
  {
    id: 1, name: "Jesse Mendez", wt: 141, yr: "Sr.", initials: "JM",
    readiness: 88, rhr: 47, hrv: 52, vo2: 58.2, spo2: 99,
    concern: "Cumulative mat load elevated. Autonomic recovery lag vs. prior block.",
    green:   "Full autonomic recovery. Output ceiling at current weight.",
    dexa: { bf: "8.1", fm: "11.4", lm: "129.6", ag: "0.86" },
    domains: [{ k:"Metabolic",p:91 },{ k:"Inflammatory",p:85 },{ k:"Hormonal",p:78 },{ k:"Cardiovascular",p:88 },{ k:"Endocrine",p:82 }],
  },
  {
    id: 2, name: "Paddy Gallagher", wt: 165, yr: "R-Sr.", initials: "PG",
    readiness: 74, rhr: 52, hrv: 38, vo2: 54.1, spo2: 98,
    concern: "HRV suppression 3rd consecutive day. Weight-cut window approaching.",
    green:   "HRV recovered. Cut window clear. Peak output available.",
    dexa: { bf: "9.4", fm: "14.8", lm: "142.3", ag: "0.89" },
    domains: [{ k:"Metabolic",p:76 },{ k:"Inflammatory",p:68 },{ k:"Hormonal",p:71 },{ k:"Cardiovascular",p:80 },{ k:"Endocrine",p:74 }],
  },
  {
    id: 3, name: "Carson Kharchla", wt: 174, yr: "Gr.", initials: "CK",
    readiness: 91, rhr: 44, hrv: 61, vo2: 59.8, spo2: 99,
    concern: "Minor shoulder load flag. Monitor contact volume this week.",
    green:   "Full green. Highest readiness in current block. Push intensity.",
    dexa: { bf: "7.6", fm: "12.9", lm: "157.2", ag: "0.84" },
    domains: [{ k:"Metabolic",p:94 },{ k:"Inflammatory",p:89 },{ k:"Hormonal",p:92 },{ k:"Cardiovascular",p:93 },{ k:"Endocrine",p:88 }],
  },
  {
    id: 4, name: "Dylan Fishback", wt: 184, yr: "R-Jr.", initials: "DF",
    readiness: 68, rhr: 58, hrv: 29, vo2: 51.3, spo2: 97,
    concern: "Elevated resting HR. Autonomic stress signature — reduce live intensity.",
    green:   "Stress signature cleared. Ready for full-intensity live wrestling.",
    dexa: { bf: "10.2", fm: "18.6", lm: "163.8", ag: "0.91" },
    domains: [{ k:"Metabolic",p:65 },{ k:"Inflammatory",p:58 },{ k:"Hormonal",p:62 },{ k:"Cardiovascular",p:71 },{ k:"Endocrine",p:67 }],
  },
  {
    id: 5, name: "Seth Shumate", wt: 197, yr: "R-Jr.", initials: "SS",
    readiness: 82, rhr: 49, hrv: 45, vo2: 55.7, spo2: 98,
    concern: "Mild inflammatory signal. Weight management load adding systemic stress.",
    green:   "Inflammatory signal resolved. Weight stable. Full output available.",
    dexa: { bf: "9.8", fm: "19.2", lm: "177.4", ag: "0.88" },
    domains: [{ k:"Metabolic",p:84 },{ k:"Inflammatory",p:77 },{ k:"Hormonal",p:81 },{ k:"Cardiovascular",p:85 },{ k:"Endocrine",p:79 }],
  },
  {
    id: 6, name: "Nick Feldman", wt: 285, yr: "R-Jr.", initials: "NF",
    readiness: 79, rhr: 54, hrv: 36, vo2: 48.9, spo2: 98,
    concern: "Aerobic base trailing. Recovery window between sessions needs extension.",
    green:   "Recovery window sufficient. Aerobic output at block peak.",
    dexa: { bf: "18.4", fm: "51.2", lm: "227.1", ag: "0.93" },
    domains: [{ k:"Metabolic",p:75 },{ k:"Inflammatory",p:72 },{ k:"Hormonal",p:76 },{ k:"Cardiovascular",p:68 },{ k:"Endocrine",p:78 }],
  },
  {
    id: 7, name: "Nic Bouzakis", wt: 125, yr: "R-Jr.", initials: "NB",
    readiness: 85, rhr: 46, hrv: 54, vo2: 61.2, spo2: 99,
    concern: "Cut weight proximity. Monitor hydration and autonomic markers daily.",
    green:   "Hydration markers clear. Autonomic balance maintained through cut.",
    dexa: { bf: "6.9", fm: "8.7", lm: "117.4", ag: "0.82" },
    domains: [{ k:"Metabolic",p:88 },{ k:"Inflammatory",p:83 },{ k:"Hormonal",p:80 },{ k:"Cardiovascular",p:86 },{ k:"Endocrine",p:84 }],
  },
  {
    id: 8, name: "Brendan McCrone", wt: 125, yr: "R-Jr.", initials: "BM",
    readiness: 77, rhr: 51, hrv: 41, vo2: 57.4, spo2: 98,
    concern: "Sleep quality decline. Cognitive load compounding training stress.",
    green:   "Sleep quality restored. Cognitive and physical stress markers normalized.",
    dexa: { bf: "7.4", fm: "9.3", lm: "116.2", ag: "0.83" },
    domains: [{ k:"Metabolic",p:79 },{ k:"Inflammatory",p:74 },{ k:"Hormonal",p:72 },{ k:"Cardiovascular",p:81 },{ k:"Endocrine",p:76 }],
  },
  {
    id: 9, name: "Ethan Stiles", wt: 149, yr: "R-So.", initials: "ES",
    readiness: 83, rhr: 48, hrv: 48, vo2: 56.1, spo2: 99,
    concern: "Volume spike last 7 days. Load:recovery ratio approaching ceiling.",
    green:   "Load:recovery balance restored. Ready for competition-level intensity.",
    dexa: { bf: "8.3", fm: "12.1", lm: "133.8", ag: "0.85" },
    domains: [{ k:"Metabolic",p:85 },{ k:"Inflammatory",p:80 },{ k:"Hormonal",p:82 },{ k:"Cardiovascular",p:84 },{ k:"Endocrine",p:81 }],
  },
  {
    id: 10, name: "Ryder Rogotzke", wt: 197, yr: "Jr.", initials: "RR",
    readiness: 87, rhr: 46, hrv: 55, vo2: 57.9, spo2: 99,
    concern: "Minor asymmetry in ground force. Lower-body loading pattern to monitor.",
    green:   "Asymmetry resolved. Force output symmetric. Full competition readiness.",
    dexa: { bf: "8.9", fm: "17.1", lm: "174.8", ag: "0.87" },
    domains: [{ k:"Metabolic",p:89 },{ k:"Inflammatory",p:86 },{ k:"Hormonal",p:84 },{ k:"Cardiovascular",p:88 },{ k:"Endocrine",p:85 }],
  },
];

function makeTraj(base, mode) {
  const pts = ["Apr 25","May 2","May 9","May 16","May 23","May 30","Jun 6","Jun 13","Jun 20","Jun 27","Jul 4","Jul 11","Jul 18"];
  return pts.map((d, i) => {
    const actual   = i <= 9 ? Math.round(base + Math.sin(i * 0.8) * 6) : null;
    const forecast = i >= 8 ? Math.round(mode === "concern" ? base - 6 + i * 0.4 : base + 3 + i * 0.7) : null;
    const bandRange = forecast ? (mode === "concern" ? 14 : 10) : 0;
    const bandLow   = forecast ? Math.max(40, forecast - bandRange / 2) : 0;
    return { d, actual, forecast, bandLow, bandRange };
  });
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${C.ground}; font-family: 'Space Grotesk', sans-serif;
    color: ${C.text}; min-height: 100vh; -webkit-tap-highlight-color: transparent; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 99px; }
`;


/* ── Karvonen HRR + Seiler 5-Zone Algorithm ─────────────────────────────────
   MaxHR: Tanaka formula — 208 − (0.7 × age) — validated for trained athletes
   Zones: % of Heart Rate Reserve anchored to individual RHR
   Z1 Active Recovery   50–60% HRR  · aerobic restoration, active cooldown
   Z2 Aerobic Base      60–70% HRR  · fat oxidation, aerobic capacity building
   Z3 Tempo             70–80% HRR  · sustained effort, lactate clearance
   Z4 Threshold         80–90% HRR  · lactate accumulation, anaerobic onset
   Z5 Neuromuscular     90–100% HRR · peak power, glycolytic demand
   Recovery debt: Z4+Z5 minutes > Z1+Z2 minutes × 0.6 triggers flag
   ─────────────────────────────────────────────────────────────────────────── */
function getHRZones(rhr, age) {
  const maxHR = Math.round(208 - 0.7 * age);
  const hrr   = maxHR - rhr;
  const bpm   = (pct) => Math.round(rhr + pct * hrr);
  return {
    maxHR,
    hrr,
    zones: [
      { id:1, label:"Z1", name:"Active Recovery", lo:bpm(0.50), hi:bpm(0.60), color:C.jade,  pct:0.50 },
      { id:2, label:"Z2", name:"Aerobic Base",    lo:bpm(0.60), hi:bpm(0.70), color:C.brand, pct:0.60 },
      { id:3, label:"Z3", name:"Tempo",           lo:bpm(0.70), hi:bpm(0.80), color:C.amber, pct:0.70 },
      { id:4, label:"Z4", name:"Threshold",       lo:bpm(0.80), hi:bpm(0.90), color:"#FF8C42", pct:0.80 },
      { id:5, label:"Z5", name:"Neuromuscular",   lo:bpm(0.90), hi:maxHR,     color:C.coral, pct:0.90 },
    ],
  };
}

/* Synthetic workout session — realistic zone distribution for a training block
   Seeded from athlete readiness + rhr so each athlete gets unique but plausible data */
function genWorkoutSessions(rhr, readiness, seed) {
  const s = (n) => ((seed * 9301 + n * 49297) % 233280) / 233280;
  const sessions = [
    { day:"Mon", label:"Morning practice",   duration:82 },
    { day:"Tue", label:"Technical drilling", duration:65 },
    { day:"Wed", label:"Live wrestling",     duration:90 },
    { day:"Thu", label:"Conditioning",       duration:55 },
    { day:"Fri", label:"Pre-match prep",     duration:45 },
    { day:"Sat", label:"Competition",        duration:40 },
  ];
  return sessions.map((s2, i) => {
    // Higher readiness → more time in productive zones (Z2–Z3)
    // Lower readiness → more time bleeding into Z4–Z5 for same effort
    const base = readiness / 100;
    const z1m = Math.round(s2.duration * (0.15 + s(i*7) * 0.08));
    const z2m = Math.round(s2.duration * (0.28 + base * 0.12 + s(i*13) * 0.06));
    const z3m = Math.round(s2.duration * (0.22 + s(i*17) * 0.08));
    const z4m = Math.round(s2.duration * (0.20 - base * 0.08 + s(i*23) * 0.06));
    const z5m = s2.duration - z1m - z2m - z3m - z4m;
    const avgHR = Math.round(rhr + (0.62 + (1 - base) * 0.1 + s(i*31) * 0.08) * (190 - rhr));
    return { ...s2, z1m, z2m, z3m, z4m, z5m: Math.max(2, z5m), avgHR,
             recoveryDebt: (z4m + Math.max(2, z5m)) > (z1m + z2m) * 0.6 };
  });
}


const Mono = ({ children, style = {} }) => (
  <span style={{ fontFamily: "'IBM Plex Mono',monospace", ...style }}>{children}</span>
);

function Ring({ value, size = 88 }) {
  const r = size * 0.4, circ = 2 * Math.PI * r, cx = size / 2, cy = size / 2;
  const color = sc(value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surfaceHi} strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x={cx} y={cy - 3} textAnchor="middle" fill={color}
        style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize: size * 0.23, fontWeight: 700 }}>
        {value}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill={C.faint}
        style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize: 8, letterSpacing: ".1em" }}>
        READINESS
      </text>
    </svg>
  );
}

function DomainBar({ label, p }) {
  const color = sc(p);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <Mono style={{ fontSize: 10.5, color: C.muted }}>{label}</Mono>
        <Mono style={{ fontSize: 10.5, color }}>{p}th</Mono>
      </div>
      <div style={{ background: C.surfaceHi, borderRadius: 99, height: 5 }}>
        <div style={{ width: `${p}%`, background: color, borderRadius: 99, height: 5, transition: "width .5s ease" }} />
      </div>
    </div>
  );
}

function RosterScreen({ week, setWeek, onSelect }) {
  const greenCount = ROSTER.filter(a => a.readiness >= 80).length;
  const warnCount  = ROSTER.filter(a => a.readiness >= 65 && a.readiness < 80).length;
  const riskCount  = ROSTER.filter(a => a.readiness < 65).length;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 0 32px" }}>
      <div style={{ padding: "28px 20px 20px", borderBottom: `1px solid ${C.line}` }}>
        <Mono style={{ fontSize: 9.5, color: C.scarlet, letterSpacing: ".14em",
                       textTransform: "uppercase", display: "block", marginBottom: 6 }}>
          Velocity · Ohio State Wrestling
        </Mono>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 2 }}>Digital Twin</div>
        <Mono style={{ fontSize: 11, color: C.muted }}>2025–26 Roster · Coach View</Mono>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { label: "Ready",   count: greenCount, color: C.jade },
            { label: "Monitor", count: warnCount,  color: C.amber },
            { label: "Reduce",  count: riskCount,  color: C.coral },
          ].map(({ label, count, color }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: `${color}14`, border: `1px solid ${color}44`, borderRadius: 99,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
              <Mono style={{ fontSize: 10.5, color }}>{count} {label}</Mono>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 8px" }}>
        <Mono style={{ fontSize: 9.5, color: C.faint, letterSpacing: ".1em",
                       textTransform: "uppercase", display: "block", marginBottom: 10 }}>
          Week scenario
        </Mono>
        <div style={{ display: "flex", gap: 6, padding: 4, background: C.surfaceHi,
                      border: `1px solid ${C.line}`, borderRadius: 10 }}>
          {[["concern", "Concern week"], ["positive", "Green-light week"]].map(([id, label]) => {
            const on = week === id;
            const oc = id === "positive" ? C.jade : C.amber;
            return (
              <button key={id} onClick={() => setWeek(id)} style={{
                flex: 1, padding: "9px 8px", borderRadius: 7,
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11,
                background: on ? `${oc}20` : "transparent",
                color: on ? oc : C.faint, transition: "all .16s ease",
              }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "8px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {ROSTER.map(a => {
          const color = sc(a.readiness);
          return (
            <button key={a.id} onClick={() => onSelect(a.id)} style={{
              width: "100%", textAlign: "left",
              background: C.surface, border: `1px solid ${C.line}`,
              borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14,
              transition: "border-color .15s",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(140deg,${C.brand},#3550C7)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14, color: "#fff",
              }}>{a.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.name}
                </div>
                <Mono style={{ fontSize: 10.5, color: C.muted, display: "block", marginTop: 2 }}>
                  {a.wt} lb · {a.yr}
                </Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>{a.readiness}</div>
                <ChevronRight size={16} color={C.faint} />
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "24px 20px 0", textAlign: "center" }}>
        <Mono style={{ fontSize: 9, color: C.faint, display: "block", lineHeight: 1.6 }}>
          Demonstration profile · synthetic physiological data · Velocity Health
        </Mono>
      </div>
    </div>
  );
}

function AthleteScreen({ athlete: A, week, onBack }) {
  const traj = makeTraj(A.readiness, week);
  const isConcern = week === "concern";

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 48 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "20px 16px 16px", borderBottom: `1px solid ${C.line}`,
        position: "sticky", top: 0, background: C.ground, zIndex: 10,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          color: C.brand, padding: "6px 12px 6px 8px",
          background: `${C.brand}14`, border: `1px solid ${C.brand}33`,
          borderRadius: 99, fontSize: 13, fontWeight: 600,
        }}>
          <ChevronLeft size={15} color={C.brand} /> Roster
        </button>
        <Mono style={{ fontSize: 10, color: C.muted, marginLeft: "auto", letterSpacing: ".06em" }}>
          {isConcern ? "CONCERN WEEK" : "GREEN-LIGHT WEEK"}
        </Mono>
      </div>

      <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Identity */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 18, padding: "18px 18px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13, flexShrink: 0,
            background: `linear-gradient(140deg,${C.brand},#3550C7)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 17, color: "#fff",
          }}>{A.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Mono style={{ fontSize: 9, color: C.scarlet, letterSpacing: ".12em",
                           textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              Ohio State Wrestling
            </Mono>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.text, lineHeight: 1.15 }}>{A.name}</div>
            <Mono style={{ fontSize: 11, color: C.muted, display: "block", marginTop: 3 }}>
              {A.wt} lb · {A.yr}
            </Mono>
          </div>
          <Ring value={A.readiness} size={84} />
        </div>

        {/* Engine call */}
        <div style={{
          background: isConcern ? `${C.amber}0e` : `${C.jade}0e`,
          border: `1px solid ${isConcern ? C.amber : C.jade}40`,
          borderRadius: 16, padding: "16px 18px",
        }}>
          <Mono style={{
            fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase",
            color: isConcern ? C.amber : C.jade, display: "block", marginBottom: 8,
          }}>
            Engine call · {isConcern ? "Concern week" : "Green-light week"}
          </Mono>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8, lineHeight: 1.35 }}>
            {isConcern
              ? "Reduce live contact volume this week."
              : "Full intensity available. Push competition simulation."}
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>
            {isConcern ? A.concern : A.green}
          </div>
        </div>

        {/* Vitals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Resting HR", value: A.rhr,  unit: "bpm",        icon: <Heart size={13} color={C.coral} /> },
            { label: "HRV",        value: A.hrv,  unit: "ms",         icon: <Activity size={13} color={C.brand} /> },
            { label: "VO₂ Max",    value: A.vo2,  unit: "ml/kg/min",  icon: <Wind size={13} color={C.jade} /> },
            { label: "SpO₂",       value: A.spo2, unit: "%",          icon: <Droplet size={13} color={C.brand} /> },
          ].map(v => (
            <div key={v.label} style={{
              background: C.surface, border: `1px solid ${C.line}`,
              borderRadius: 14, padding: "14px 15px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Mono style={{ fontSize: 10, color: C.muted }}>{v.label}</Mono>
                {v.icon}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1 }}>
                {v.value}
                <span style={{ fontSize: 10, color: C.faint, marginLeft: 4, fontWeight: 400 }}>{v.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trajectory */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: "18px 14px",
        }}>
          <Mono style={{ fontSize: 9.5, color: C.brand, letterSpacing: ".1em",
                         textTransform: "uppercase", display: "block", marginBottom: 14 }}>
            Readiness trajectory · 21-day window
          </Mono>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={traj} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <XAxis dataKey="d" interval={2}
                  tick={{ fill: C.faint, fontSize: 9, fontFamily: "'IBM Plex Mono',monospace" }}
                  axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]}
                  tick={{ fill: C.faint, fontSize: 9, fontFamily: "'IBM Plex Mono',monospace" }}
                  axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{
                  background: C.surface, border: `1px solid ${C.lineHi}`,
                  borderRadius: 8, fontSize: 11,
                }} labelStyle={{ color: C.muted }} />
                <Area type="monotone" dataKey="bandLow" stackId="b" stroke="none" fill="transparent" />
                <Area type="monotone" dataKey="bandRange" stackId="b" stroke="none"
                  fill={isConcern ? `${C.coral}18` : `${C.jade}18`} />
                <Line type="monotone" dataKey="actual" stroke={C.brand} strokeWidth={2.5}
                  dot={{ fill: C.brand, r: 3 }} connectNulls={false} />
                <Line type="monotone" dataKey="forecast"
                  stroke={isConcern ? C.coral : C.jade}
                  strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls={false} />
                <ReferenceLine x="Jul 4" stroke={C.lineHi} strokeDasharray="3 3"
                  label={{ value: "Today", fill: C.faint, fontSize: 9,
                           fontFamily: "'IBM Plex Mono',monospace", position: "insideTopRight" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEXA */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: "18px 16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <Mono style={{ fontSize: 9.5, color: C.brand, letterSpacing: ".1em", textTransform: "uppercase" }}>
              Body composition · DEXA
            </Mono>
            <Mono style={{
              fontSize: 9, padding: "3px 9px", borderRadius: 99,
              color: C.jade, border: `1px solid ${C.jade}55`, background: `${C.jade}12`,
            }}>
              ATHLETE PROFILE
            </Mono>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { l: "Body fat",  v: A.dexa.bf, u: "%" },
              { l: "Fat mass",  v: A.dexa.fm, u: "lb" },
              { l: "Lean mass", v: A.dexa.lm, u: "lb" },
              { l: "A/G ratio", v: A.dexa.ag, u: "" },
            ].map(t => (
              <div key={t.l} style={{
                background: C.surfaceHi, border: `1px solid ${C.line}`,
                borderRadius: 10, padding: "11px 13px",
              }}>
                <Mono style={{ fontSize: 10, color: C.muted, display: "block", marginBottom: 5 }}>{t.l}</Mono>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.text, lineHeight: 1 }}>
                  {t.v}<span style={{ fontSize: 10, color: C.faint, marginLeft: 3, fontWeight: 400 }}>{t.u}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Biomarker domains */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: "18px 16px",
        }}>
          <Mono style={{ fontSize: 9.5, color: C.brand, letterSpacing: ".1em",
                         textTransform: "uppercase", display: "block", marginBottom: 14 }}>
            Biomarker domains · current panel
          </Mono>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {A.domains.map(d => <DomainBar key={d.k} label={d.k} p={d.p} />)}
          </div>
        </div>


        {/* HR ZONE TRACKING ─────────────────────────────────────────────────── */}
        <div style={{
          background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: "18px 16px",
        }}>
          <Mono style={{ fontSize: 9.5, color: C.brand, letterSpacing: ".1em",
                         textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Heart rate zones · training block
          </Mono>
          {(() => {
            const age = A.yr === "Gr." ? 24 : A.yr.startsWith("R-Sr") ? 23 : A.yr === "Sr." ? 22 :
                        A.yr.startsWith("R-Jr") ? 21 : A.yr === "Jr." ? 20 : 19;
            const { zones, maxHR, hrr } = getHRZones(A.rhr, age);
            const sessions = genWorkoutSessions(A.rhr, A.readiness, A.id);
            const debtDays = sessions.filter(s => s.recoveryDebt).length;
            const isDebt = debtDays >= 2;
            return (
              <>
                <Mono style={{ fontSize: 9, color: C.faint, display:"block", marginBottom: 14, lineHeight:1.5 }}>
                  Karvonen HRR · Tanaka MaxHR · Seiler 5-zone · MaxHR {maxHR} bpm · HRR {hrr} bpm
                </Mono>

                {/* Zone chips */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
                  {zones.map(z => (
                    <span key={z.id} style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9,
                      padding:"3px 8px", borderRadius:99, color:z.color,
                      border:`1px solid ${z.color}55`, background:`${z.color}14` }}>
                      {z.label} {z.lo}–{z.hi}
                    </span>
                  ))}
                </div>

                {/* Session bars */}
                <div style={{ marginBottom: 16 }}>
                  <Mono style={{ fontSize:9.5, color:C.muted, letterSpacing:".08em",
                                 textTransform:"uppercase", display:"block", marginBottom:10 }}>
                    This week · session zone distribution
                  </Mono>
                  {sessions.map((sess, i) => (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <Mono style={{ fontSize:10, color:C.muted }}>{sess.day} · {sess.label}</Mono>
                        <Mono style={{ fontSize:10, color: sess.recoveryDebt ? C.amber : C.jade }}>
                          {sess.recoveryDebt ? "debt" : "clear"} · {sess.avgHR} bpm
                        </Mono>
                      </div>
                      <div style={{ display:"flex", height:9, borderRadius:5, overflow:"hidden", gap:1 }}>
                        {[sess.z1m, sess.z2m, sess.z3m, sess.z4m, sess.z5m].map((mins, zi) => (
                          <div key={zi} style={{
                            width:`${(mins / sess.duration) * 100}%`,
                            background: zones[zi].color, opacity:0.85,
                          }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recovery debt signal — coach framing */}
                <div style={{ padding:"12px 14px", borderRadius:12,
                              background: isDebt ? `${C.amber}12` : `${C.jade}12`,
                              border:`1px solid ${isDebt ? C.amber : C.jade}40` }}>
                  <Mono style={{ fontSize:9, fontWeight:700, color: isDebt ? C.amber : C.jade,
                                 letterSpacing:".1em", textTransform:"uppercase", display:"block", marginBottom:6 }}>
                    Recovery debt · {isDebt ? `${debtDays} sessions flagged` : "zone balance clear"}
                  </Mono>
                  <div style={{ fontSize:13.5, fontWeight:600, color:C.text, marginBottom:6, lineHeight:1.3 }}>
                    {isDebt
                      ? `Z4+Z5 accumulation outpacing Z1+Z2 clearance — ${A.name.split(" ")[0]} carrying anaerobic load into next session.`
                      : `Zone polarization healthy — ${A.name.split(" ")[0]}'s aerobic base is absorbing training load effectively.`}
                  </div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>
                    {isDebt
                      ? "Prioritize Z1–Z2 work before next high-intensity block. Reduce live contact if readiness drops below 75. Debt clears in 1–2 low-intensity sessions."
                      : "Current zone balance supports continued load. Safe to progress intensity. Monitor if debt signal appears mid-week."}
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        <div style={{ textAlign: "center", paddingTop: 8 }}>
          <Mono style={{ fontSize: 9, color: C.faint, display: "block", lineHeight: 1.6 }}>
            Demonstration profile · synthetic physiological data · Velocity Health
          </Mono>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [week, setWeek] = useState("concern");
  const selected = ROSTER.find(r => r.id === selectedId);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: C.ground }}>
        {selected
          ? <AthleteScreen athlete={selected} week={week} onBack={() => setSelectedId(null)} />
          : <RosterScreen week={week} setWeek={setWeek} onSelect={setSelectedId} />
        }
      </div>
    </>
  );
}