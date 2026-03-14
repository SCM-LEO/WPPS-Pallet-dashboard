import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const monthlyData = [
  { month: "1월", 입고: 420, 출고: 380, 재고: 940, 비용: 2100000 },
  { month: "2월", 입고: 380, 출고: 410, 재고: 910, 비용: 1980000 },
  { month: "3월", 입고: 510, 출고: 460, 재고: 960, 비용: 2450000 },
  { month: "4월", 입고: 470, 출고: 490, 재고: 940, 비용: 2300000 },
  { month: "5월", 입고: 620, 출고: 540, 재고: 1020, 비용: 2900000 },
  { month: "6월", 입고: 550, 출고: 580, 재고: 990, 비용: 2700000 },
  { month: "7월", 입고: 480, 출고: 500, 재고: 970, 비용: 2400000 },
  { month: "8월", 입고: 600, 출고: 560, 재고: 1010, 비용: 2850000 },
  { month: "9월", 입고: 530, 출고: 510, 재고: 1030, 비용: 2600000 },
  { month: "10월", 입고: 590, 출고: 620, 재고: 1000, 비용: 2980000 },
  { month: "11월", 입고: 640, 출고: 590, 재고: 1050, 비용: 3100000 },
  { month: "12월", 입고: 700, 출고: 650, 재고: 1100, 비용: 3400000 },
];

const palletTypes = [
  { name: "목재 팔레트", value: 45, color: "#C8A96E" },
  { name: "플라스틱 팔레트", value: 30, color: "#5B8FD4" },
  { name: "철제 팔레트", value: 15, color: "#7EC8A4" },
  { name: "종이 팔레트", value: 10, color: "#E87B6A" },
];

const recentTransactions = [
  { id: "TXN-001", type: "입고", item: "목재 팔레트 1100×1100", qty: 50, warehouse: "A동 1층", date: "2025-03-10", status: "완료", cost: 250000 },
  { id: "TXN-002", type: "출고", item: "플라스틱 팔레트 1200×800", qty: 30, warehouse: "B동 2층", date: "2025-03-10", status: "완료", cost: 180000 },
  { id: "TXN-003", type: "입고", item: "철제 팔레트 1000×1200", qty: 20, warehouse: "A동 2층", date: "2025-03-09", status: "진행중", cost: 320000 },
  { id: "TXN-004", type: "출고", item: "목재 팔레트 1100×1100", qty: 80, warehouse: "C동 1층", date: "2025-03-09", status: "완료", cost: 400000 },
  { id: "TXN-005", type: "이동", item: "플라스틱 팔레트 1200×1000", qty: 45, warehouse: "A동 → B동", date: "2025-03-08", status: "완료", cost: 0 },
  { id: "TXN-006", type: "입고", item: "종이 팔레트 1100×1100", qty: 100, warehouse: "D동 1층", date: "2025-03-08", status: "대기", cost: 150000 },
];

const warehouseData = [
  { name: "A동 1층", used: 78, total: 100, pallets: 312 },
  { name: "A동 2층", used: 52, total: 100, pallets: 208 },
  { name: "B동 1층", used: 91, total: 100, pallets: 364 },
  { name: "B동 2층", used: 34, total: 100, pallets: 136 },
  { name: "C동 1층", used: 65, total: 100, pallets: 260 },
  { name: "D동 1층", used: 43, total: 100, pallets: 172 },
];

const alerts = [
  { level: "warning", msg: "B동 1층 창고 적재율 91% 초과 임박", time: "5분 전" },
  { level: "info", msg: "TXN-003 철제팔레트 입고 진행중", time: "23분 전" },
  { level: "danger", msg: "TXN-006 종이팔레트 입고 승인 대기", time: "1시간 전" },
];

const KPICard = ({ label, value, sub, trend, icon, accent }) => {
  const isPositive = trend > 0;
  return (
    <div onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${accent}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", position: "relative", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `${accent}18`, borderRadius: "0 16px 0 80px" }} />
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#8899AA", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#EEF2FF", fontFamily: "monospace", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, color: isPositive ? "#7EC8A4" : "#E87B6A", fontWeight: 600 }}>{isPositive ? "▲" : "▼"} {Math.abs(trend)}%</span>
        <span style={{ fontSize: 11, color: "#66778A" }}>{sub}</span>
      </div>
    </div>
  );
};

const Badge = ({ type }) => {
  const map = { "입고": { bg: "#1E3A5F", color: "#5B8FD4" }, "출고": { bg: "#3A1E2A", color: "#E87B6A" }, "이동": { bg: "#1E3A2A", color: "#7EC8A4" } };
  const s = map[type] || { bg: "#222", color: "#aaa" };
  return <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>{type}</span>;
};

const StatusDot = ({ status }) => {
  const map = { "완료": "#7EC8A4", "진행중": "#C8A96E", "대기": "#E87B6A" };
  return <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: map[status] || "#aaa" }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: map[status] || "#aaa", display: "inline-block" }} />{status}
  </span>;
};

const WarehouseBar = ({ name, used, pallets }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: "#C0CFE0" }}>{name}</span>
      <span style={{ fontSize: 12, color: "#8899AA" }}>{pallets}개 · {used}%</span>
    </div>
    <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${used}%`, borderRadius: 4, background: used > 85 ? "linear-gradient(90deg,#E87B6A,#FF9F8A)" : used > 65 ? "linear-gradient(90deg,#C8A96E,#E8CC90)" : "linear-gradient(90deg,#5B8FD4,#7EC8A4)", transition: "width 1s ease" }} />
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [period, setPeriod] = useState("월별");
  const [filterType, setFilterType] = useState("전체");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("입고");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: "dashboard", icon: "⬡", label: "대시보드" },
    { id: "inout", icon: "⇅", label: "입출고 관리" },
    { id: "inventory", icon: "▦", label: "재고 현황" },
    { id: "cost", icon: "₩", label: "비용 관리" },
    { id: "trend", icon: "↗", label: "이동 추이" },
    { id: "warehouse", icon: "⊞", label: "창고 현황" },
    { id: "report", icon: "≡", label: "보고서" },
    { id: "settings", icon: "⚙", label: "설정" },
  ];

  const filteredTxns = recentTransactions.filter(t =>
    (filterType === "전체" || t.type === filterType) &&
    (searchQuery === "" || t.item.includes(searchQuery) || t.id.includes(searchQuery))
  );

  const totalCostThisMonth = 3400000;
  const budgetTotal = 3600000;
  const budgetUsed = Math.round((totalCostThisMonth / budgetTotal) * 100);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Noto Sans KR', sans-serif", background: "#080E1A", color: "#D0DCF0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .nav-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .trow:hover { background: rgba(255,255,255,0.03) !important; }
        .btn-g:hover { background: rgba(255,255,255,0.08) !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        .fade { animation: fadeUp 0.35s ease both; }
        .d1{animation-delay:.05s} .d2{animation-delay:.1s} .d3{animation-delay:.15s} .d4{animation-delay:.2s}
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 220 : 64, flexShrink: 0, background: "rgba(8,14,26,0.98)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.3s ease", overflow: "hidden", zIndex: 10 }}>
        <div style={{ padding: "22px 16px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg,#5B8FD4,#7EC8A4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#080E1A" }}>P</div>
          {sidebarOpen && <div><div style={{ fontSize: 14, fontWeight: 700, color: "#EEF2FF" }}>PalletOS</div><div style={{ fontSize: 10, color: "#5B8FD4", letterSpacing: "0.06em" }}>ANTIGRAVITY</div></div>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(item => (
            <button key={item.id} className="nav-btn" onClick={() => setActiveTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: activeTab === item.id ? "rgba(91,143,212,0.15)" : "transparent", color: activeTab === item.id ? "#5B8FD4" : "#8899AA", borderLeft: activeTab === item.id ? "2px solid #5B8FD4" : "2px solid transparent", marginBottom: 2, transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden" }}>
              <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, fontWeight: activeTab === item.id ? 700 : 400 }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#C8A96E,#E8CC90)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#080E1A" }}>김</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: "#C0CFE0" }}>김관리자</div><div style={{ fontSize: 10, color: "#66778A" }}>물류팀 · 관리자</div></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ height: 60, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, background: "rgba(8,14,26,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button className="btn-g" onClick={() => setSidebarOpen(v => !v)} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#8899AA", cursor: "pointer", fontSize: 16 }}>☰</button>
          <div style={{ flex: 1, maxWidth: 300, position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#66778A", fontSize: 13 }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="팔레트, 거래번호 검색…" style={{ width: "100%", padding: "7px 12px 7px 32px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#C0CFE0", fontSize: 12, outline: "none" }} />
          </div>
          <div style={{ flex: 1 }} />
          {alerts.slice(0, 2).map((a, i) => (
            <div key={i} style={{ padding: "5px 12px", borderRadius: 20, background: a.level === "danger" ? "rgba(232,123,106,0.12)" : a.level === "warning" ? "rgba(200,169,110,0.12)" : "rgba(91,143,212,0.12)", border: `1px solid ${a.level === "danger" ? "rgba(232,123,106,0.3)" : a.level === "warning" ? "rgba(200,169,110,0.3)" : "rgba(91,143,212,0.3)"}`, fontSize: 11, color: a.level === "danger" ? "#E87B6A" : a.level === "warning" ? "#C8A96E" : "#5B8FD4", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
              <span>{a.level === "danger" ? "🔴" : a.level === "warning" ? "🟡" : "🔵"}</span>
              <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>{a.msg}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            {["입고", "출고"].map(t => (
              <button key={t} onClick={() => { setModalType(t); setShowModal(true); }} style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", background: t === "입고" ? "linear-gradient(135deg,#5B8FD4,#4A7BBF)" : "linear-gradient(135deg,#E87B6A,#D4604F)", color: "#fff", fontSize: 12, fontWeight: 700, transition: "all 0.15s" }}>
                {t === "입고" ? "▼ " : "▲ "}{t} 등록
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div className="fade" style={{ marginBottom: 24, display: "flex", alignItems: "baseline", gap: 12 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#EEF2FF", letterSpacing: "-0.03em" }}>팔레트 관리 대시보드</h1>
                <span style={{ fontSize: 12, color: "#66778A" }}>2025년 3월 기준</span>
              </div>
              <div className="fade d1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                <KPICard label="총 재고" value="1,452개" sub="전월 대비" trend={4.8} icon="📦" accent="#5B8FD4" />
                <KPICard label="이번달 입고" value="700개" sub="전월 대비" trend={9.4} icon="⬇" accent="#7EC8A4" />
                <KPICard label="이번달 출고" value="650개" sub="전월 대비" trend={10.2} icon="⬆" accent="#C8A96E" />
                <KPICard label="이번달 비용" value="₩3,400만" sub="예산 대비" trend={-5.6} icon="💰" accent="#E87B6A" />
              </div>
              <div className="fade d2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0" }}>입출고 추이</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {["월별", "주별", "일별"].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className="btn-g" style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${period === p ? "rgba(91,143,212,0.5)" : "rgba(255,255,255,0.08)"}`, background: period === p ? "rgba(91,143,212,0.12)" : "transparent", color: period === p ? "#5B8FD4" : "#66778A", fontSize: 11, cursor: "pointer" }}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5B8FD4" stopOpacity={0.35}/><stop offset="95%" stopColor="#5B8FD4" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E87B6A" stopOpacity={0.35}/><stop offset="95%" stopColor="#E87B6A" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gStock" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7EC8A4" stopOpacity={0.25}/><stop offset="95%" stopColor="#7EC8A4" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: "#66778A", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#66778A", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="입고" stroke="#5B8FD4" strokeWidth={2} fill="url(#gIn)" />
                      <Area type="monotone" dataKey="출고" stroke="#E87B6A" strokeWidth={2} fill="url(#gOut)" />
                      <Area type="monotone" dataKey="재고" stroke="#7EC8A4" strokeWidth={1.5} fill="url(#gStock)" strokeDasharray="4 2" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>팔레트 종류</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={palletTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                        {palletTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div>
                    {palletTypes.map((t, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color, display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: "#9AAABB" }}>{t.name}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#C0CFE0", fontFamily: "monospace" }}>{t.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="fade d3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>최근 입출고</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["거래ID", "유형", "품목", "수량", "창고", "비용", "상태"].map(h => (
                          <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, color: "#66778A", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.slice(0, 5).map((t, i) => (
                        <tr key={i} className="trow" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "8px 8px", fontSize: 11, color: "#5B8FD4", fontFamily: "monospace" }}>{t.id}</td>
                          <td style={{ padding: "8px 8px" }}><Badge type={t.type} /></td>
                          <td style={{ padding: "8px 8px", fontSize: 11, color: "#C0CFE0", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.item}</td>
                          <td style={{ padding: "8px 8px", fontSize: 12, color: "#EEF2FF", fontFamily: "monospace", textAlign: "right" }}>{t.qty}</td>
                          <td style={{ padding: "8px 8px", fontSize: 11, color: "#8899AA" }}>{t.warehouse}</td>
                          <td style={{ padding: "8px 8px", fontSize: 12, color: "#C8A96E", fontFamily: "monospace" }}>{t.cost > 0 ? `₩${t.cost.toLocaleString()}` : "-"}</td>
                          <td style={{ padding: "8px 8px" }}><StatusDot status={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>창고 현황</div>
                  {warehouseData.map((w, i) => <WarehouseBar key={i} {...w} />)}
                </div>
              </div>
            </div>
          )}

          {/* INOUT */}
          {activeTab === "inout" && (
            <div>
              <div className="fade" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#EEF2FF" }}>입출고 관리</h1>
                  <p style={{ fontSize: 12, color: "#66778A", marginTop: 4 }}>모든 팔레트 입출고 거래를 조회·관리합니다</p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["전체", "입고", "출고", "이동"].map(f => (
                    <button key={f} onClick={() => setFilterType(f)} className="btn-g" style={{ padding: "6px 16px", borderRadius: 20, border: `1px solid ${filterType === f ? "rgba(91,143,212,0.5)" : "rgba(255,255,255,0.08)"}`, background: filterType === f ? "rgba(91,143,212,0.12)" : "transparent", color: filterType === f ? "#5B8FD4" : "#66778A", fontSize: 12, cursor: "pointer" }}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="fade d1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["거래ID","유형","품목명","수량","창고","날짜","비용","상태"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, color: "#66778A", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((t, i) => (
                      <tr key={i} className="trow" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#5B8FD4", fontFamily: "monospace" }}>{t.id}</td>
                        <td style={{ padding: "12px 16px" }}><Badge type={t.type} /></td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#C0CFE0" }}>{t.item}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#EEF2FF", fontFamily: "monospace", fontWeight: 600 }}>{t.qty}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#9AAABB" }}>{t.warehouse}</td>
                        <td style={{ padding: "12px 16px", fontSize: 11, color: "#66778A", fontFamily: "monospace" }}>{t.date}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#C8A96E", fontFamily: "monospace" }}>{t.cost > 0 ? `₩${t.cost.toLocaleString()}` : "-"}</td>
                        <td style={{ padding: "12px 16px" }}><StatusDot status={t.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COST */}
          {activeTab === "cost" && (
            <div>
              <div className="fade" style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#EEF2FF" }}>비용 관리</h1>
              </div>
              <div className="fade d1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                <KPICard label="이번달 총 비용" value="₩3,400만" sub="예산 대비 94.4%" trend={-5.6} icon="💳" accent="#C8A96E" />
                <KPICard label="연간 누적 비용" value="₩3.12억" sub="전년 대비" trend={8.2} icon="📊" accent="#5B8FD4" />
                <KPICard label="팔레트당 단가" value="₩5,230" sub="전월 대비" trend={-1.2} icon="🏷" accent="#7EC8A4" />
              </div>
              <div className="fade d2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0" }}>3월 예산 현황</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: budgetUsed > 90 ? "#E87B6A" : "#7EC8A4", fontFamily: "monospace" }}>₩{totalCostThisMonth.toLocaleString()} / ₩{budgetTotal.toLocaleString()}</span>
                </div>
                <div style={{ height: 12, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${budgetUsed}%`, borderRadius: 8, background: "linear-gradient(90deg,#5B8FD4,#7EC8A4)" }} />
                </div>
                <div style={{ fontSize: 11, color: "#66778A" }}>예산의 {budgetUsed}% 사용 · 잔여 ₩{(budgetTotal - totalCostThisMonth).toLocaleString()}</div>
              </div>
              <div className="fade d3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>연간 비용 현황</div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: "#66778A", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#66778A", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/10000).toFixed(0)}만`} />
                    <Tooltip contentStyle={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} formatter={v => [`₩${v.toLocaleString()}`, "비용"]} />
                    <Bar dataKey="비용" fill="#C8A96E" radius={[4,4,0,0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TREND */}
          {activeTab === "trend" && (
            <div>
              <div className="fade" style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#EEF2FF" }}>기간별 이동 추이</h1>
              </div>
              <div className="fade d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>입출고 비교 분석</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyData} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: "#66778A", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#66778A", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#8899AA" }} />
                      <Bar dataKey="입고" fill="#5B8FD4" radius={[3,3,0,0]} />
                      <Bar dataKey="출고" fill="#E87B6A" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0", marginBottom: 16 }}>재고 추이</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyData} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: "#66778A", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#66778A", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="재고" stroke="#7EC8A4" strokeWidth={2.5} dot={{ fill: "#7EC8A4", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* WAREHOUSE */}
          {activeTab === "warehouse" && (
            <div>
              <div className="fade" style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#EEF2FF" }}>창고 현황</h1>
              </div>
              <div className="fade d1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {warehouseData.map((w, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${w.used > 85 ? "rgba(232,123,106,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#C8D8F0" }}>{w.name}</div>
                        <div style={{ fontSize: 11, color: "#66778A", marginTop: 2 }}>총 {w.total * 10}개 가용</div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: w.used > 85 ? "#E87B6A" : w.used > 65 ? "#C8A96E" : "#7EC8A4", fontFamily: "monospace" }}>{w.used}%</div>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#EEF2FF", fontFamily: "monospace", marginBottom: 16 }}>{w.pallets}<span style={{ fontSize: 14, color: "#8899AA", fontWeight: 400 }}>개</span></div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${w.used}%`, borderRadius: 4, background: w.used > 85 ? "linear-gradient(90deg,#E87B6A,#FF9F8A)" : w.used > 65 ? "linear-gradient(90deg,#C8A96E,#E8CC90)" : "linear-gradient(90deg,#5B8FD4,#7EC8A4)" }} />
                    </div>
                    {w.used > 85 && <div style={{ marginTop: 10, fontSize: 11, color: "#E87B6A", background: "rgba(232,123,106,0.1)", borderRadius: 6, padding: "4px 10px" }}>⚠ 적재율 주의</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER */}
          {!["dashboard","inout","cost","trend","warehouse"].includes(activeTab) && (
            <div className="fade" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
              <div style={{ fontSize: 48 }}>{navItems.find(n => n.id === activeTab)?.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#C0CFE0" }}>{navItems.find(n => n.id === activeTab)?.label}</div>
              <div style={{ fontSize: 13, color: "#66778A" }}>이 기능은 준비 중입니다</div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0D1830", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 32, width: 440, maxWidth: "90vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#EEF2FF" }}>팔레트 {modalType} 등록</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "transparent", border: "none", color: "#66778A", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {[
              { label: "팔레트 종류", placeholder: "목재 / 플라스틱 / 철제 / 종이" },
              { label: "규격 (mm)", placeholder: "예: 1100 × 1100" },
              { label: "수량", placeholder: "수량 입력" },
              { label: "창고 위치", placeholder: "예: A동 1층" },
              { label: "단가 (₩)", placeholder: "팔레트당 단가" },
              { label: "비고", placeholder: "메모 입력 (선택)" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, color: "#8899AA", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.label}</label>
                <input placeholder={f.placeholder} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#C0CFE0", fontSize: 13, outline: "none" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#8899AA", fontSize: 13, cursor: "pointer" }}>취소</button>
              <button style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: modalType === "입고" ? "linear-gradient(135deg,#5B8FD4,#4A7BBF)" : "linear-gradient(135deg,#E87B6A,#D4604F)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ {modalType} 등록 완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
