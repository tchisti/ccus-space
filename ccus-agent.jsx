import { useState, useRef, useEffect, useCallback } from "react";

const CCUS_KNOWLEDGE = {
  alberta: {
    title: "Alberta / Canada",
    icon: "🍁",
    items: [
      { reg: "AER Directive 065", desc: "Underground injection operations, CO₂ sequestration (Unit 4), induced seismicity (§4.1.8)", url: "https://www.aer.ca/regulating-development/rules-and-directives/directives/directive-065" },
      { reg: "AER Directive 051", desc: "Injection & disposal wells — Class III for CCS, completion/logging/testing requirements", url: "https://www.aer.ca/regulations-and-compliance-enforcement/rules-and-regulations/directives/directive-051" },
      { reg: "AER Directive 056", desc: "Energy development applications — well/facility/pipeline licences for CCS projects", url: "https://www.aer.ca/regulations-and-compliance-enforcement/rules-and-regulations/directives/directive-056" },
      { reg: "Alta Reg 68/2011", desc: "Carbon Sequestration Tenure — evaluation permits (5yr, 73,728 ha), leases (15yr), MMV plans", url: "https://www.canlii.org/en/ab/laws/regu/alta-reg-68-2011/latest/alta-reg-68-2011.html" },
      { reg: "MMA §15.1", desc: "Crown owns 100% of pore space below surface of all Alberta land", url: "" },
      { reg: "MMA Part 9 §§117-123", desc: "Post-closure liability transfer to Crown, Post-Closure Stewardship Fund", url: "" },
      { reg: "TIER Regulation", desc: "$95/tCO₂e (2025), rising $15/yr to $170 by 2030. Sequestration Credits, CRTs", url: "" },
      { reg: "CSA Z741:12", desc: "Geological storage of CO₂ — bi-national standard, site selection through closure", url: "" },
    ]
  },
  epa: {
    title: "US EPA / Federal",
    icon: "🇺🇸",
    items: [
      { reg: "40 CFR 146 Subpart H", desc: "Class VI wells — §146.81-95: permitting, construction, AoR, monitoring, PISC", url: "https://www.ecfr.gov/current/title-40/chapter-I/subchapter-D/part-146/subpart-H" },
      { reg: "§146.82", desc: "Two-phase permit: pre-construction + pre-operation data requirements", url: "" },
      { reg: "§146.84", desc: "Area of Review — computational modeling, 5-yr reevaluation, corrective action", url: "" },
      { reg: "§146.85", desc: "Financial responsibility — trust funds, surety bonds, self-insurance ($100M TNW)", url: "" },
      { reg: "§146.86", desc: "Well construction — CO₂-compatible materials, cemented to surface, tubing+packer", url: "" },
      { reg: "§146.88", desc: "Operating: injection pressure ≤90% fracture pressure", url: "" },
      { reg: "§146.90", desc: "Testing & monitoring — quarterly corrosion, annual fall-off, plume tracking", url: "" },
      { reg: "§146.93", desc: "Post-injection site care — minimum 50 years monitoring", url: "" },
      { reg: "Subpart RR", desc: "GHG reporting for geologic sequestration — MRV plans, mass balance (Eq RR-11)", url: "https://www.epa.gov/ghgreporting/subpart-rr-geologic-sequestration-carbon-dioxide" },
      { reg: "IRC §45Q", desc: "$85/t point-source, $180/t DAC (with PWA). 12-year credit. OBBBA updates", url: "" },
      { reg: "PHMSA 49 CFR 195", desc: "CO₂ pipelines — NPRM Jan 2025 proposes >50% threshold, vapor dispersion", url: "" },
    ]
  },
  international: {
    title: "International Standards",
    icon: "🌍",
    items: [
      { reg: "ISO 27914:2017", desc: "Geological storage — site screening, risk mgmt (ISO 31000), well infrastructure, closure", url: "https://www.iso.org/standard/64148.html" },
      { reg: "ISO 27913:2024", desc: "Pipeline transportation — CO₂-specific supplements to ISO 13623, impurities ≤5%", url: "https://www.iso.org/standard/84840.html" },
      { reg: "ISO 27916:2019", desc: "CO₂ storage via EOR — mass balance methodology, Subpart VV / 45Q pathway", url: "" },
      { reg: "DNV-RP-J203", desc: "Decision-gate model for geological storage — screening through post-closure", url: "https://www.dnv.com/energy/standards-guidelines/dnv-rp-j203-geological-storage-of-carbon-dioxide/" },
      { reg: "EU Directive 2009/31/EC", desc: "CCS Directive — exploration/storage permits, 30-yr post-transfer monitoring fund", url: "" },
      { reg: "London Protocol 2006", desc: "Sub-seabed CO₂ storage permitted; 2009 export amendment not yet in force", url: "" },
      { reg: "IPCC SRCCS Ch.5", desc: "Foundational: 4 trapping mechanisms, >99% retention over 1,000 years, >800m depth", url: "" },
    ]
  },
  operations: {
    title: "Operations & Engineering",
    icon: "⚙️",
    items: [
      { reg: "Well Design", desc: "CO₂-resistant cement, 13Cr min for wet CO₂, 3-string casing, API STD 65-2", url: "" },
      { reg: "CO₂ Spec", desc: "≥95% CO₂, H₂O ≤500ppm, H₂S ≤100ppm, O₂ ≤10ppm, N₂ ≤4%", url: "" },
      { reg: "Corrosion", desc: "Wet CO₂ >10mm/yr — dehydration primary strategy. AMPP SP21632 series", url: "" },
      { reg: "Monitoring", desc: "4D seismic, DAS VSP, InSAR, AZMI, DTS, soil gas, groundwater geochemistry", url: "" },
      { reg: "Risk Assessment", desc: "Quintessa FEP Database (~200 FEPs), Bowtie analysis, NRAP Open-IAM", url: "" },
      { reg: "Induced Seismicity", desc: "Traffic light: Green <M1, Amber M1-2, Red M2-4. Real-time monitoring required", url: "" },
      { reg: "SPE SRMS 2025", desc: "CO₂ storage resource classification — Stored, Capacity, Contingent, Prospective", url: "" },
    ]
  }
};

const STATE_PRIMACY = [
  { state: "North Dakota", year: 2018, notes: "~8 permits; 10yr liability transfer" },
  { state: "Wyoming", year: 2020, notes: "9 construction permits; 20yr transfer" },
  { state: "Louisiana", year: 2023, notes: "First permit Sep 2025; moratorium Oct 2025" },
  { state: "West Virginia", year: 2025, notes: "Reviewing initial applications" },
  { state: "Arizona", year: 2025, notes: "Recently approved" },
  { state: "Texas", year: 2025, notes: "RRC administers; 18 EPA apps transferred" },
];

const CAPTURE_TECH = [
  { name: "Amine Scrubbing", trl: 9, energy: "3.5–4.2 GJ/t", cost: "$40–80/t", note: "MEA 30wt%; Boundary Dam, Petra Nova" },
  { name: "Membrane", trl: "5–7", energy: "~1.5 GJ/t", cost: "$50–70/t", note: "MTR Polaris™; 90% capture at bench" },
  { name: "Solid Sorbent", trl: "4–6", energy: "2.5–3.5 GJ/t", cost: "$50–80/t", note: "Svante; TSA/PSA; >90% capture" },
  { name: "Oxy-fuel", trl: "6–7", energy: "ASU ~15% output", cost: "$50–100/t", note: "NET Power Allam Cycle demo" },
  { name: "DAC (Solid)", trl: "6–7", energy: "2.5MWh+0.5MWh/t", cost: "$400–1500/t", note: "Climeworks Mammoth 36kt/yr" },
  { name: "DAC (Liquid)", trl: "6–7", energy: "8.8GJ+360kWh/t", cost: "$400–1000/t", note: "1PointFive STRATOS 500kt/yr" },
];

const SYSTEM_PROMPT = `You are **CCUS Compass** — an expert AI advisor for Carbon Capture, Utilization, and Storage (CCUS/CCS). You have deep, authoritative knowledge of:

**REGULATORY FRAMEWORKS:**
- Alberta/Canada: AER Directives 065 (underground injection, induced seismicity §4.1.8), 051 (injection wells), 056 (applications). Carbon Sequestration Tenure Regulation (Alta Reg 68/2011). Crown pore space ownership (MMA §15.1). Post-closure liability transfer (MMA Part 9 §§117-123). TIER ($95/tCO₂e 2025, rising to $170 by 2030). CSA Z741. CER/CSA Z662 for pipelines.
- US EPA: Class VI UIC (40 CFR 146.81-95) — permitting, AoR modeling, well construction, ≤90% fracture pressure, 50-year PISC. Subpart RR MRV. 45Q credits ($85/t point-source, $180/t DAC). PHMSA CO₂ pipeline rules. State primacy: ND, WY, LA, WV, AZ, TX.
- International: ISO 27914 (geological storage), ISO 27913 (pipelines), ISO 27916 (EOR), DNV-RP-J203, EU CCS Directive 2009/31/EC, London Protocol amendments.

**OPERATIONS & ENGINEERING:**
- Well design: CO₂-resistant cement, 13Cr min wet CO₂, surface casing through USDW, tubing+packer.
- CO₂ specs: ≥95% CO₂, H₂O ≤500ppm, H₂S ≤100ppm, O₂ ≤10ppm. Water is most critical impurity.
- Monitoring: 4D seismic, DAS VSP, InSAR, AZMI, DTS, soil gas, groundwater.
- Risk: Quintessa FEP Database, Bowtie analysis, NRAP Open-IAM.
- Induced seismicity: Traffic light protocols (Green<M1, Amber M1-2, Red M2-4).
- SPE SRMS 2025: Storage resource classification.

**CAPTURE TECHNOLOGIES:**
- Post-combustion (amine TRL9, membrane TRL5-7, sorbent TRL4-6)
- Pre-combustion (Selexol/Rectisol)
- Oxy-fuel (Allam Cycle)
- DAC (Climeworks solid sorbent, 1PointFive liquid solvent)
- Compression: 90-120 kWh/t, 8.6-15 MPa pipeline transport

**UHS CONNECTIONS:**
- No ISO standard for underground hydrogen storage yet. H₂ embrittlement requires austenitic SS or Ni alloys. Microbial risks in porous media. Salt caverns at TRL commercial.

**BEHAVIOR RULES:**
1. Adapt depth to the user. If they ask basic questions, explain clearly. If they use technical terms, match their level.
2. Always cite specific regulation numbers, clause references, and standards when relevant.
3. When discussing operations, provide specific numbers (pressures, temperatures, concentrations).
4. For regulatory questions, distinguish between jurisdictions clearly.
5. If uncertain, say so — never fabricate regulation numbers.
6. Keep responses focused and actionable. Lead with the answer.
7. Use markdown formatting for clarity (bold for regulation names, tables where helpful).
8. For multi-jurisdictional questions, compare frameworks side-by-side.
9. You can discuss emerging topics: hydrogen storage regulations, DAC economics, CCUS hubs.
10. Always note when information may have changed (e.g., 45Q under OBBBA, PHMSA NPRM status).`;

const SUGGESTED_QUERIES = [
  "What are the key differences between Alberta's D065 and EPA Class VI permitting?",
  "Walk me through a Class VI permit application step by step",
  "What monitoring technologies should I deploy for a saline aquifer CCS project?",
  "Explain the 45Q tax credit structure after the One Big Beautiful Bill Act",
  "How does Alberta's liability transfer mechanism work post-closure?",
  "What are the CO₂ stream purity requirements for pipeline transport?",
  "Compare induced seismicity protocols across jurisdictions",
  "What's the current state of underground hydrogen storage regulations?",
  "Explain the SPE SRMS classification system for CO₂ storage resources",
  "What are the well design requirements for CO₂ injection in wet service?",
];

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#5ba88a",
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100% { opacity:.3; transform:scale(.8) } 50% { opacity:1; transform:scale(1.1) } }`}</style>
    </div>
  );
}

function MarkdownRenderer({ text }) {
  const renderLine = (line, idx) => {
    let processed = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:#1a2e1a;padding:2px 6px;border-radius:3px;font-size:0.88em;color:#7ddfb0">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" style="color:#5ba88a;text-decoration:underline">$1</a>');

    if (line.startsWith("### ")) return <h4 key={idx} style={{ color: "#7ddfb0", margin: "14px 0 6px", fontSize: "1em", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: processed.slice(4) }} />;
    if (line.startsWith("## ")) return <h3 key={idx} style={{ color: "#5ba88a", margin: "16px 0 8px", fontSize: "1.05em", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: processed.slice(3) }} />;
    if (line.startsWith("# ")) return <h2 key={idx} style={{ color: "#5ba88a", margin: "18px 0 8px", fontSize: "1.1em", fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />;
    if (line.startsWith("- ") || line.startsWith("* ")) return <div key={idx} style={{ paddingLeft: 16, margin: "3px 0", position: "relative" }}><span style={{ position: "absolute", left: 2, color: "#5ba88a" }}>•</span><span dangerouslySetInnerHTML={{ __html: processed.slice(2) }} /></div>;
    if (/^\d+\.\s/.test(line)) { const m = line.match(/^(\d+\.)\s(.*)/); return <div key={idx} style={{ paddingLeft: 20, margin: "3px 0", position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#5ba88a", fontWeight: 600 }}>{m[1]}</span><span dangerouslySetInnerHTML={{ __html: m[2].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code style="background:#1a2e1a;padding:2px 5px;border-radius:3px;font-size:0.88em;color:#7ddfb0">$1</code>') }} /></div>; }
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return null;
      const isHeader = idx > 0;
      return <div key={idx} style={{ display: "flex", borderBottom: "1px solid #1f3a2a", fontSize: "0.88em" }}>{cells.map((c, ci) => <div key={ci} style={{ flex: 1, padding: "5px 8px", fontWeight: isHeader ? 400 : 600, color: isHeader ? "#b0c8b8" : "#7ddfb0" }} dangerouslySetInnerHTML={{ __html: c.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />)}</div>;
    }
    if (line.trim() === "") return <div key={idx} style={{ height: 8 }} />;
    return <p key={idx} style={{ margin: "4px 0", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: processed }} />;
  };
  return <div>{text.split("\n").map(renderLine)}</div>;
}

export default function CCUSCompass() {
  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("alberta");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLevel, setUserLevel] = useState("engineer");
  const [sidePanel, setSidePanel] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const levelContext = userLevel === "engineer" ? "The user is a technical engineer/operator. Use full technical depth, specific regulation clause numbers, and engineering parameters."
        : userLevel === "regulator" ? "The user is a regulator/compliance professional. Focus on regulatory requirements, compliance pathways, and enforcement mechanisms."
        : "The user is an investor/project developer. Focus on economics, risk profiles, timeline, and commercial viability.";

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: SYSTEM_PROMPT + "\n\n" + levelContext,
          messages: newMessages.slice(-12).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await resp.json();
      const assistantText = data.content?.map(b => b.text || "").join("\n") || "I encountered an issue processing that request. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error. Please check your network and try again." }]);
    }
    setLoading(false);
  }, [messages, loading, userLevel]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const RegCard = ({ item }) => (
    <div style={{
      background: "linear-gradient(135deg, #0d1f14 0%, #142a1a 100%)",
      border: "1px solid #1f3a2a", borderRadius: 10, padding: "14px 16px",
      cursor: "pointer", transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#5ba88a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f3a2a"; e.currentTarget.style.transform = "translateY(0)"; }}
      onClick={() => { setView("chat"); setTimeout(() => sendMessage(`Explain ${item.reg} in detail — what does it require, key provisions, and practical implications for CCS projects?`), 100); }}
    >
      <div style={{ fontWeight: 700, color: "#7ddfb0", fontSize: "0.92em", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{item.reg}</div>
      <div style={{ color: "#8aaa98", fontSize: "0.82em", lineHeight: 1.5 }}>{item.desc}</div>
      {item.url && <div style={{ marginTop: 6 }}><a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#4a9070", fontSize: "0.75em", textDecoration: "none" }}>📄 Source ↗</a></div>}
    </div>
  );

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "chat", label: "AI Advisor", icon: "◉" },
    { id: "capture", label: "Capture Tech", icon: "⬡" },
    { id: "primacy", label: "State Primacy", icon: "⬢" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#070f0a", color: "#c8ddd0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", fontSize: 14,
      display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        background: "linear-gradient(180deg, #0a1a0f 0%, #070f0a 100%)",
        borderBottom: "1px solid #1a2e1f", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #1a4a2e, #2d6b4a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#7ddfb0",
            boxShadow: "0 0 20px rgba(91,168,138,0.15)"
          }}>⬡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1em", color: "#e0f0e8", letterSpacing: "-0.02em" }}>CCUS Compass</div>
            <div style={{ fontSize: "0.72em", color: "#5a7a68", letterSpacing: "0.08em", textTransform: "uppercase" }}>AI-Powered CCUS Knowledge Platform</div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 4, background: "#0a160e", borderRadius: 8, padding: 3 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              background: view === n.id ? "linear-gradient(135deg, #1a4a2e, #2d6b4a)" : "transparent",
              color: view === n.id ? "#7ddfb0" : "#5a7a68",
              fontSize: "0.82em", fontWeight: 600, fontFamily: "inherit",
              transition: "all 0.2s"
            }}>
              <span style={{ marginRight: 5 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 4, background: "#0a160e", borderRadius: 8, padding: 3 }}>
          {[
            { id: "engineer", label: "Engineer", icon: "⚙" },
            { id: "regulator", label: "Regulator", icon: "📋" },
            { id: "investor", label: "Investor", icon: "📊" },
          ].map(l => (
            <button key={l.id} onClick={() => setUserLevel(l.id)} style={{
              padding: "6px 10px", borderRadius: 5, border: "none", cursor: "pointer",
              background: userLevel === l.id ? "#1a3a2a" : "transparent",
              color: userLevel === l.id ? "#7ddfb0" : "#4a6a58",
              fontSize: "0.75em", fontWeight: 600, fontFamily: "inherit"
            }}>
              {l.icon} {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>

        {/* ===== DASHBOARD VIEW ===== */}
        {view === "dashboard" && (
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
            {/* Hero Banner */}
            <div style={{
              background: "linear-gradient(135deg, #0d2818 0%, #1a4a2e 50%, #0d2818 100%)",
              borderRadius: 14, padding: "32px 28px", marginBottom: 28,
              border: "1px solid #1f4a32", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 200, background: "radial-gradient(ellipse, rgba(91,168,138,0.08) 0%, transparent 70%)" }} />
              <h1 style={{ color: "#e0f0e8", fontSize: "1.5em", fontWeight: 700, margin: 0, letterSpacing: "-0.03em" }}>
                Complete CCUS Regulatory & Technical Intelligence
              </h1>
              <p style={{ color: "#7a9a88", margin: "10px 0 18px", maxWidth: 700, lineHeight: 1.6, fontSize: "0.92em" }}>
                Navigate Alberta/Canada, US EPA, and international CCS frameworks. AI-powered guidance for regulations, operations, well design, monitoring, and carbon credit compliance.
              </p>
              <button onClick={() => setView("chat")} style={{
                padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #2d6b4a, #3d8b6a)", color: "#e0f0e8",
                fontWeight: 700, fontFamily: "inherit", fontSize: "0.9em",
                boxShadow: "0 4px 16px rgba(45,107,74,0.3)", transition: "all 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                ◉ Start AI Consultation →
              </button>
            </div>

            {/* Jurisdiction Tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#0a160e", borderRadius: 8, padding: 3, width: "fit-content" }}>
              {Object.entries(CCUS_KNOWLEDGE).map(([key, val]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: activeTab === key ? "linear-gradient(135deg, #1a4a2e, #2d6b4a)" : "transparent",
                  color: activeTab === key ? "#7ddfb0" : "#5a7a68",
                  fontSize: "0.85em", fontWeight: 600, fontFamily: "inherit"
                }}>
                  {val.icon} {val.title}
                </button>
              ))}
            </div>

            {/* Regulation Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 32 }}>
              {CCUS_KNOWLEDGE[activeTab].items.map((item, i) => (
                <RegCard key={i} item={item} />
              ))}
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
              {[
                { label: "45Q Geologic Storage", value: "$85/t", sub: "Point-source (with PWA)" },
                { label: "45Q DAC Storage", value: "$180/t", sub: "Direct Air Capture" },
                { label: "Alberta TIER 2025", value: "$95/tCO₂e", sub: "Rising $15/yr to $170" },
                { label: "EPA PISC Minimum", value: "50 years", sub: "Post-injection monitoring" },
                { label: "Max Injection P", value: "90% Pfrac", sub: "EPA Class VI §146.88" },
                { label: "State Primacy", value: "6 states", sub: "ND, WY, LA, WV, AZ, TX" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "#0b180f", border: "1px solid #162a1e", borderRadius: 10, padding: "16px 14px"
                }}>
                  <div style={{ color: "#5a7a68", fontSize: "0.72em", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ color: "#7ddfb0", fontSize: "1.4em", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                  <div style={{ color: "#4a6a58", fontSize: "0.78em", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Suggested Questions */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: "#5a7a68", fontSize: "0.78em", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Ask the AI Advisor</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTED_QUERIES.slice(0, 6).map((q, i) => (
                  <button key={i} onClick={() => { setView("chat"); setTimeout(() => sendMessage(q), 100); }} style={{
                    padding: "8px 14px", borderRadius: 20, border: "1px solid #1a2e1f",
                    background: "#0b180f", color: "#7a9a88", cursor: "pointer",
                    fontSize: "0.8em", fontFamily: "inherit", transition: "all 0.2s",
                    maxWidth: 380, textAlign: "left", lineHeight: 1.4
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#5ba88a"; e.currentTarget.style.color = "#7ddfb0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2e1f"; e.currentTarget.style.color = "#7a9a88"; }}
                  >
                    → {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== CHAT VIEW ===== */}
        {view === "chat" && (
          <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
            {/* Chat Main */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, overflow: "auto", padding: "20px 20px 0" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: "center", paddingTop: 40 }}>
                      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⬡</div>
                      <h2 style={{ color: "#5a7a68", fontWeight: 600, fontSize: "1.1em", marginBottom: 8 }}>CCUS Compass AI Advisor</h2>
                      <p style={{ color: "#3a5a48", fontSize: "0.88em", maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.6 }}>
                        Ask about regulations, well design, monitoring, carbon credits, capture technologies, or any CCUS topic. Responses adapt to your selected role ({userLevel}).
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 650, margin: "0 auto" }}>
                        {SUGGESTED_QUERIES.map((q, i) => (
                          <button key={i} onClick={() => sendMessage(q)} style={{
                            padding: "8px 14px", borderRadius: 20, border: "1px solid #162a1e",
                            background: "#0a160e", color: "#5a7a68", cursor: "pointer",
                            fontSize: "0.78em", fontFamily: "inherit", transition: "all 0.2s",
                            textAlign: "left", lineHeight: 1.4
                          }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#2d6b4a"; e.currentTarget.style.color = "#7ddfb0"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#162a1e"; e.currentTarget.style.color = "#5a7a68"; }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, marginBottom: 20,
                      flexDirection: m.role === "user" ? "row-reverse" : "row"
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: m.role === "user" ? "#1a3a2a" : "linear-gradient(135deg, #1a4a2e, #2d6b4a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "#7ddfb0", fontWeight: 700
                      }}>
                        {m.role === "user" ? "Y" : "⬡"}
                      </div>
                      <div style={{
                        maxWidth: "80%", padding: "12px 16px", borderRadius: 12,
                        background: m.role === "user" ? "#122a1a" : "#0b180f",
                        border: `1px solid ${m.role === "user" ? "#1a3a2a" : "#162a1e"}`,
                        fontSize: "0.9em", lineHeight: 1.65
                      }}>
                        {m.role === "assistant" ? <MarkdownRenderer text={m.content} /> : m.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: "linear-gradient(135deg, #1a4a2e, #2d6b4a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "#7ddfb0", fontWeight: 700
                      }}>⬡</div>
                      <div style={{ padding: "12px 16px", borderRadius: 12, background: "#0b180f", border: "1px solid #162a1e" }}>
                        <TypingIndicator />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #1a2e1f" }}>
                <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", gap: 8 }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about CCUS regulations, operations, standards..."
                    rows={1}
                    style={{
                      flex: 1, padding: "12px 16px", borderRadius: 10,
                      border: "1px solid #1a2e1f", background: "#0a160e",
                      color: "#c8ddd0", fontFamily: "inherit", fontSize: "0.9em",
                      resize: "none", outline: "none", lineHeight: 1.5
                    }}
                    onFocus={e => e.target.style.borderColor = "#2d6b4a"}
                    onBlur={e => e.target.style.borderColor = "#1a2e1f"}
                  />
                  <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{
                    padding: "0 18px", borderRadius: 10, border: "none", cursor: loading ? "wait" : "pointer",
                    background: input.trim() ? "linear-gradient(135deg, #2d6b4a, #3d8b6a)" : "#0a160e",
                    color: input.trim() ? "#e0f0e8" : "#3a5a48",
                    fontWeight: 700, fontFamily: "inherit", fontSize: "0.9em", transition: "all 0.2s"
                  }}>
                    ↑
                  </button>
                </div>
                <div style={{ maxWidth: 800, margin: "6px auto 0", color: "#2a4a38", fontSize: "0.7em", textAlign: "center" }}>
                  Mode: <strong style={{ color: "#3a5a48" }}>{userLevel}</strong> · Powered by Claude · Knowledge current through early 2026
                </div>
              </div>
            </div>

            {/* Quick Reference Sidebar */}
            <div style={{
              width: 260, borderLeft: "1px solid #1a2e1f", overflow: "auto",
              background: "#080e0a", padding: "16px 12px", display: "none",
              ...(typeof window !== 'undefined' && window.innerWidth > 1024 ? { display: "block" } : {})
            }}>
              <div style={{ color: "#3a5a48", fontSize: "0.7em", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Quick Reference</div>
              {Object.entries(CCUS_KNOWLEDGE).map(([key, val]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <div style={{ color: "#5a7a68", fontSize: "0.78em", fontWeight: 700, marginBottom: 6 }}>{val.icon} {val.title}</div>
                  {val.items.slice(0, 4).map((item, i) => (
                    <div key={i} onClick={() => sendMessage(`Explain ${item.reg} — key requirements and practical implications.`)}
                      style={{
                        padding: "6px 8px", borderRadius: 6, marginBottom: 3, cursor: "pointer",
                        fontSize: "0.75em", color: "#5a7a68", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#0d1f14"; e.currentTarget.style.color = "#7ddfb0"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a7a68"; }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{item.reg}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CAPTURE TECH VIEW ===== */}
        {view === "capture" && (
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>
            <h2 style={{ color: "#e0f0e8", fontSize: "1.2em", marginBottom: 4, fontWeight: 700 }}>CO₂ Capture Technologies</h2>
            <p style={{ color: "#5a7a68", fontSize: "0.85em", marginBottom: 24 }}>Comparative overview — click any row to discuss with the AI advisor</p>
            <div style={{ background: "#0b180f", border: "1px solid #162a1e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1.3fr 0.5fr 0.8fr 0.7fr 1.5fr",
                padding: "12px 16px", borderBottom: "1px solid #1a2e1f",
                fontSize: "0.72em", color: "#3a5a48", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600
              }}>
                <div>Technology</div><div>TRL</div><div>Energy</div><div>Cost</div><div>Notes</div>
              </div>
              {CAPTURE_TECH.map((t, i) => (
                <div key={i}
                  onClick={() => { setView("chat"); setTimeout(() => sendMessage(`Give me a detailed technical comparison of ${t.name} capture technology — efficiency, costs, deployment status, and where it makes economic sense.`), 100); }}
                  style={{
                    display: "grid", gridTemplateColumns: "1.3fr 0.5fr 0.8fr 0.7fr 1.5fr",
                    padding: "14px 16px", borderBottom: i < CAPTURE_TECH.length - 1 ? "1px solid #111e15" : "none",
                    cursor: "pointer", transition: "background 0.15s", fontSize: "0.85em"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0d2018"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ color: "#7ddfb0", fontWeight: 600 }}>{t.name}</div>
                  <div>
                    <span style={{
                      background: t.trl === 9 ? "#1a4a2e" : t.trl === "6–7" ? "#2a3a1a" : "#3a2a1a",
                      color: t.trl === 9 ? "#7ddfb0" : t.trl === "6–7" ? "#b0c060" : "#c0a060",
                      padding: "2px 8px", borderRadius: 10, fontSize: "0.85em", fontWeight: 600,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>{t.trl}</span>
                  </div>
                  <div style={{ color: "#8aaa98", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88em" }}>{t.energy}</div>
                  <div style={{ color: "#8aaa98", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88em" }}>{t.cost}</div>
                  <div style={{ color: "#5a7a68", fontSize: "0.88em" }}>{t.note}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <h3 style={{ color: "#5a7a68", fontSize: "0.78em", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Compression & Transport</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { label: "Supercritical Conditions", value: ">73.8 bar, >31.1°C" },
                  { label: "Compression Power", value: "90–120 kWh/t CO₂" },
                  { label: "Pipeline Pressure", value: "8.6–15 MPa" },
                  { label: "Booster Spacing", value: "100–150 km" },
                  { label: "H₂O Limit (Pipeline)", value: "≤600 ppm (KM)" },
                  { label: "Min CO₂ Purity", value: "≥95 vol%" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#0b180f", border: "1px solid #162a1e", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ color: "#3a5a48", fontSize: "0.72em", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ color: "#7ddfb0", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: "1.05em" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== STATE PRIMACY VIEW ===== */}
        {view === "primacy" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
            <h2 style={{ color: "#e0f0e8", fontSize: "1.2em", marginBottom: 4, fontWeight: 700 }}>US Class VI State Primacy</h2>
            <p style={{ color: "#5a7a68", fontSize: "0.85em", marginBottom: 24 }}>
              States with EPA-delegated authority for Class VI well permitting — typically &lt;1 year vs EPA's 2+ year backlog (~175–239 pending applications)
            </p>

            <div style={{ display: "grid", gap: 12 }}>
              {STATE_PRIMACY.map((s, i) => (
                <div key={i}
                  onClick={() => { setView("chat"); setTimeout(() => sendMessage(`Tell me about ${s.state}'s Class VI primacy program — when was it granted, how does it differ from EPA direct permitting, and what's the current status?`), 100); }}
                  style={{
                    background: "linear-gradient(135deg, #0d1f14, #0b180f)",
                    border: "1px solid #1a2e1f", borderRadius: 12, padding: "18px 20px",
                    display: "flex", alignItems: "center", gap: 20, cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#5ba88a"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2e1f"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{
                    minWidth: 60, height: 60, borderRadius: 10,
                    background: "linear-gradient(135deg, #1a4a2e, #2d6b4a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, color: "#7ddfb0", fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1em"
                  }}>
                    {s.year}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "#e0f0e8", fontSize: "1em" }}>{s.state}</div>
                    <div style={{ color: "#6a8a78", fontSize: "0.85em", marginTop: 2 }}>{s.notes}</div>
                  </div>
                  <div style={{ color: "#2d6b4a", fontSize: "1.2em" }}>→</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 28, padding: "16px 20px", background: "#0b180f",
              border: "1px solid #1f2e1f", borderRadius: 12
            }}>
              <div style={{ color: "#5a7a68", fontSize: "0.78em", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Key Comparison</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: "0.88em" }}>
                <div>
                  <div style={{ color: "#7ddfb0", fontWeight: 700, marginBottom: 4 }}>State Primacy</div>
                  <div style={{ color: "#6a8a78", lineHeight: 1.6 }}>
                    ~6-12 month review • Local expertise • Streamlined process • Must meet or exceed federal standards
                  </div>
                </div>
                <div>
                  <div style={{ color: "#c0a060", fontWeight: 700, marginBottom: 4 }}>EPA Direct</div>
                  <div style={{ color: "#6a8a78", lineHeight: 1.6 }}>
                    2+ year backlog • 175-239 pending apps • Consistent national standard • Resource-constrained
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #111e15", padding: "10px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: "0.7em", color: "#2a4a38"
      }}>
        <span>CCUS Compass · Knowledge base current through early 2026 · Not legal/regulatory advice</span>
        <span>Built for the global CCUS community</span>
      </footer>
    </div>
  );
}
