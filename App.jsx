import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ─── 품목 정의 ────────────────────────────────────────────────────────────────
const ITEM_TYPES = [
  { id: "pallet",    label: "팔레트",       size: "1100×1100", color: "#5B8FD4", group: "팔레트" },
  { id: "carton560", label: "카톤박스 560", size: "560mm (TBD)", color: "#C8A96E", group: "카톤박스" },
  { id: "carton500", label: "카톤박스 500", size: "500mm (TBD)", color: "#E8CC90", group: "카톤박스" },
  { id: "assem_a",   label: "조립박스 A",   size: "TBD", color: "#7EC8A4", group: "조립박스" },
  { id: "assem_b",   label: "조립박스 B",   size: "TBD", color: "#5BAE8A", group: "조립박스" },
  { id: "assem_c",   label: "조립박스 C",   size: "TBD", color: "#E87B6A", group: "조립박스" },
  { id: "assem_d",   label: "조립박스 D",   size: "TBD", color: "#D4604F", group: "조립박스" },
  { id: "assem_e",   label: "조립박스 E",   size: "TBD", color: "#B84A3A", group: "조립박스" },
];

const ITEM_FILTERS = ["전체", "팔레트", "카톤박스", "조립박스"];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const monthlyData = [
  { month: "1월",  입고: 420, 출고: 380, 재고: 940, 비용: 2100000 },
  { month: "2월",  입고: 380, 출고: 410, 재고: 910, 비용: 1980000 },
  { month: "3월",  입고: 510, 출고: 460, 재고: 960, 비용: 2450000 },
  { month: "4월",  입고: 470, 출고: 490, 재고: 940, 비용: 2300000 },
  { month: "5월",  입고: 620, 출고: 540, 재고: 1020, 비용: 2900000 },
  { month: "6월",  입고: 550, 출고: 580, 재고: 990, 비용: 2700000 },
  { month: "7월",  입고: 480, 출고: 500, 재고: 970, 비용: 2400000 },
  { month: "8월",  입고: 600, 출고: 560, 재고: 1010, 비용: 2850000 },
  { month: "9월",  입고: 530, 출고: 510, 재고: 1030, 비용: 2600000 },
  { month: "10월", 입고: 590, 출고: 620, 재고: 1000, 비용: 2980000 },
  { month: "11월", 입고: 640, 출고: 590, 재고: 1050, 비용: 3100000 },
  { month: "12월", 입고: 700, 출고: 650, 재고: 1100, 비용: 3400000 },
];

// 품목별 입출고 비율 (필터별)
const itemRatioData = {
  "전체": [
    { name: "팔레트",       value: 38, color: "#5B8FD4" },
    { name: "카톤박스 560", value: 18, color: "#C8A96E" },
    { name: "카톤박스 500", value: 14, color: "#E8CC90" },
    { name: "조립박스 A",   value: 10, color: "#7EC8A4" },
    { name: "조립박스 B",   value: 8,  color: "#5BAE8A" },
    { name: "조립박스 C",   value: 6,  color: "#E87B6A" },
    { name: "조립박스 D",   value: 4,  color: "#D4604F" },
    { name: "조립박스 E",   value: 2,  color: "#B84A3A" },
  ],
  "팔레트": [
    { name: "입고",   value: 54, color: "#5B8FD4" },
    { name: "출고",   value: 46, color: "#E87B6A" },
  ],
  "카톤박스": [
    { name: "카톤박스 560", value: 56, color: "#C8A96E" },
    { name: "카톤박스 500", value: 44, color: "#E8CC90" },
  ],
  "조립박스": [
    { name: "조립박스 A", value: 32, color: "#7EC8A4" },
    { name: "조립박스 B", value: 26, color: "#5BAE8A" },
    { name: "조립박스 C", value: 20, color: "#E87B6A" },
    { name: "조립박스 D", value: 14, color: "#D4604F" },
    { name: "조립박스 E", value: 8,  color: "#B84A3A" },
  ],
};

// 품목별 재고 현황
const itemStockData = [
  { id: "pallet",    label: "팔레트",       stock: 580, safeStock: 200, in: 700, out: 650, color: "#5B8FD4", size: "1100×1100" },
  { id: "carton560", label: "카톤박스 560", stock: 240, safeStock: 100, in: 320, out: 280, color: "#C8A96E", size: "560mm" },
  { id: "carton500", label: "카톤박스 500", stock: 180, safeStock: 100, in: 250, out: 230, color: "#E8CC90", size: "500mm" },
  { id: "assem_a",   label: "조립박스 A",   stock: 95,  safeStock: 50,  in: 120, out: 110, color: "#7EC8A4", size: "TBD" },
  { id: "assem_b",   label: "조립박스 B",   stock: 72,  safeStock: 50,  in: 90,  out: 85,  color: "#5BAE8A", size: "TBD" },
  { id: "assem_c",   label: "조립박스 C",   stock: 43,  safeStock: 50,  in: 60,  out: 70,  color: "#E87B6A", size: "TBD" },
  { id: "assem_d",   label: "조립박스 D",   stock: 38,  safeStock: 30,  in: 45,  out: 42,  color: "#D4604F", size: "TBD" },
  { id: "assem_e",   label: "조립박스 E",   stock: 22,  safeStock: 20,  in: 30,  out: 28,  color: "#B84A3A", size: "TBD" },
];

const recentTransactions = [
  { id: "TXN-001", type: "입고", item: "팔레트",       qty: 50,  location: "A동 1층", date: "2025-03-10", status: "완료",  cost: 250000 },
  { id: "TXN-002", type: "출고", item: "카톤박스 560", qty: 30,  location: "A동 1층", date: "2025-03-10", status: "완료",  cost: 180000 },
  { id: "TXN-003", type: "입고", item: "조립박스 A",   qty: 20,  location: "A동 1층", date: "2025-03-09", status: "진행중", cost: 120000 },
  { id: "TXN-004", type: "출고", item: "팔레트",       qty: 80,  location: "A동 1층", date: "2025-03-09", status: "완료",  cost: 400000 },
  { id: "TXN-005", type: "이동", item: "카톤박스 500", qty: 45,  location: "A동 1층", date: "2025-03-08", status: "완료",  cost: 0 },
  { id: "TXN-006", type: "입고", item: "조립박스 C",   qty: 100, location: "A동 1층", date: "2025-03-08", status: "대기",  cost: 150000 },
];

// ─── 창고 현황 (A동 1층만) ────────────────────────────────────────────────────
const warehouseData = [
  { name: "A동 1층", used: 72, capacity: 1500, current: 1083, note: "메인 적재 공간" },
];

const alerts = [
  { level: "danger",  msg: "조립박스 C 안전재고 이하 (43개 / 기준 50개)", time: "방금" },
  { level: "warning", msg: "A동 1층 적재율 72% — 여유 공간 확인 권장",    time: "10분 전" },
  { level: "info",    msg: "TXN-003 조립박스 A 입고 진행중",               time: "23분 전" },
  { level: "warning", msg: "TXN-006 조립박스 C 입고 승인 대기",            time: "1시간 전" },
];

// ─── Sub Components ───────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, trend, icon, accent }) => {
  const pos = trend > 0;
  return (
    <div onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${accent}33`;}}
         onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
         style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"20px 24px",position:"relative",overflow:"hidden",transition:"transform 0.2s, box-shadow 0.2s",cursor:"default"}}>
      <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:`${accent}18`,borderRadius:"0 16px 0 80px"}}/>
      <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
      <div style={{fontSize:11,color:"#8899AA",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <div style={{fontSize:26,fontWeight:700,color:"#EEF2FF",fontFamily:"monospace",letterSpacing:"-0.02em"}}>{value}</div>
      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:12,color:pos?"#7EC8A4":"#E87B6A",fontWeight:600}}>{pos?"▲":"▼"} {Math.abs(trend)}%</span>
        <span style={{fontSize:11,color:"#66778A"}}>{sub}</span>
      </div>
    </div>
  );
};

const Badge = ({ type }) => {
  const map = { "입고":{bg:"#1E3A5F",color:"#5B8FD4"}, "출고":{bg:"#3A1E2A",color:"#E87B6A"}, "이동":{bg:"#1E3A2A",color:"#7EC8A4"} };
  const s = map[type]||{bg:"#222",color:"#aaa"};
  return <span style={{background:s.bg,color:s.color,borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:"0.08em"}}>{type}</span>;
};

const StatusDot = ({ status }) => {
  const map = {"완료":"#7EC8A4","진행중":"#C8A96E","대기":"#E87B6A"};
  return <span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:map[status]||"#aaa"}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:map[status]||"#aaa",display:"inline-block"}}/>{status}
  </span>;
};

// 품목 필터 버튼
const FilterTabs = ({ value, onChange }) => (
  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
    {ITEM_FILTERS.map(f => (
      <button key={f} onClick={()=>onChange(f)} style={{
        padding:"4px 14px",borderRadius:20,border:`1px solid ${value===f?"rgba(91,143,212,0.5)":"rgba(255,255,255,0.08)"}`,
        background:value===f?"rgba(91,143,212,0.12)":"transparent",
        color:value===f?"#5B8FD4":"#66778A",fontSize:12,cursor:"pointer",transition:"all 0.15s",
      }}>{f}</button>
    ))}
  </div>
);

// 재고 카드 (안전재고 경고 포함)
const StockCard = ({ item }) => {
  const isBelowSafe = item.stock < item.safeStock;
  const ratio = Math.min((item.stock / (item.safeStock * 3)) * 100, 100);
  return (
    <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${isBelowSafe?"rgba(232,123,106,0.4)":"rgba(255,255,255,0.07)"}`,borderRadius:14,padding:18,transition:"border 0.2s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#C8D8F0"}}>{item.label}</div>
          <div style={{fontSize:10,color:"#66778A",marginTop:2}}>{item.size !== "TBD" ? item.size : "규격 미정"}</div>
        </div>
        <span style={{width:10,height:10,borderRadius:"50%",background:item.color,display:"inline-block",marginTop:3,flexShrink:0}}/>
      </div>
      <div style={{fontSize:26,fontWeight:800,color:"#EEF2FF",fontFamily:"monospace",marginBottom:4}}>
        {item.stock.toLocaleString()}<span style={{fontSize:12,color:"#66778A",fontWeight:400}}>개</span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden",marginBottom:8}}>
        <div style={{height:"100%",width:`${ratio}%`,borderRadius:3,background:isBelowSafe?"linear-gradient(90deg,#E87B6A,#FF9F8A)":item.color,transition:"width 1s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#66778A"}}>
        <span>안전재고: {item.safeStock}개</span>
        <span style={{color:isBelowSafe?"#E87B6A":"#66778A",fontWeight:isBelowSafe?700:400}}>{isBelowSafe?"⚠ 재고 부족":"정상"}</span>
      </div>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <div style={{flex:1,background:"rgba(91,143,212,0.1)",borderRadius:8,padding:"6px 10px",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#5B8FD4",marginBottom:2}}>입고</div>
          <div style={{fontSize:13,fontWeight:700,color:"#EEF2FF",fontFamily:"monospace"}}>{item.in}</div>
        </div>
        <div style={{flex:1,background:"rgba(232,123,106,0.1)",borderRadius:8,padding:"6px 10px",textAlign:"center"}}>
          <div style={{fontSize:10,color:"#E87B6A",marginBottom:2}}>출고</div>
          <div style={{fontSize:13,fontWeight:700,color:"#EEF2FF",fontFamily:"monospace"}}>{item.out}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [itemFilter,  setItemFilter]  = useState("전체");
  const [period,      setPeriod]      = useState("월별");
  const [filterType,  setFilterType]  = useState("전체");
  const [showModal,   setShowModal]   = useState(false);
  const [modalType,   setModalType]   = useState("입고");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalItem,   setModalItem]   = useState(ITEM_TYPES[0].id);

  const navItems = [
    { id:"dashboard", icon:"⬡", label:"대시보드" },
    { id:"inout",     icon:"⇅", label:"입출고 관리" },
    { id:"inventory", icon:"▦", label:"재고 현황" },
    { id:"cost",      icon:"₩", label:"비용 관리" },
    { id:"trend",     icon:"↗", label:"이동 추이" },
    { id:"warehouse", icon:"⊞", label:"창고 현황" },
    { id:"report",    icon:"≡", label:"보고서" },
    { id:"settings",  icon:"⚙", label:"설정" },
  ];

  const filteredTxns = recentTransactions.filter(t =>
    (filterType === "전체" || t.type === filterType) &&
    (searchQuery === "" || t.item.includes(searchQuery) || t.id.includes(searchQuery))
  );

  const filteredStock = itemFilter === "전체" ? itemStockData
    : itemFilter === "팔레트"  ? itemStockData.filter(i => i.id === "pallet")
    : itemFilter === "카톤박스" ? itemStockData.filter(i => i.id.startsWith("carton"))
    : itemStockData.filter(i => i.id.startsWith("assem"));

  const totalCost   = 3400000;
  const budgetTotal = 3600000;
  const budgetUsed  = Math.round((totalCost / budgetTotal) * 100);
  const belowSafe   = itemStockData.filter(i => i.stock < i.safeStock).length;

  const chartTitle = {
    "전체":   "품목별 이번달 입출고 비율",
    "팔레트": "팔레트 입고 vs 출고 비율",
    "카톤박스":"카톤박스 560 vs 500 비율",
    "조립박스":"조립박스 A~E 비율",
  };

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"'Noto Sans KR',sans-serif",background:"#080E1A",color:"#D0DCF0"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
        .ni:hover{background:rgba(255,255,255,0.06)!important;}
        .tr:hover{background:rgba(255,255,255,0.03)!important;}
        .bg:hover{background:rgba(255,255,255,0.08)!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp 0.35s ease both;}
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{width:sidebarOpen?220:64,flexShrink:0,background:"rgba(8,14,26,0.98)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",transition:"width 0.3s",overflow:"hidden",zIndex:10}}>
        <div style={{padding:"22px 16px 18px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,#5B8FD4,#7EC8A4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#080E1A"}}>P</div>
          {sidebarOpen&&<div><div style={{fontSize:14,fontWeight:700,color:"#EEF2FF"}}>PalletOS</div><div style={{fontSize:10,color:"#5B8FD4",letterSpacing:"0.06em"}}>OPENHAN</div></div>}
        </div>
        <nav style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
          {navItems.map(item=>(
            <button key={item.id} className="ni" onClick={()=>setActiveTab(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:activeTab===item.id?"rgba(91,143,212,0.15)":"transparent",color:activeTab===item.id?"#5B8FD4":"#8899AA",borderLeft:activeTab===item.id?"2px solid #5B8FD4":"2px solid transparent",marginBottom:2,transition:"all 0.15s",whiteSpace:"nowrap",overflow:"hidden"}}>
              <span style={{fontSize:16,flexShrink:0,width:20,textAlign:"center"}}>{item.icon}</span>
              {sidebarOpen&&<span style={{fontSize:13,fontWeight:activeTab===item.id?700:400}}>{item.label}</span>}
            </button>
          ))}
        </nav>
        {sidebarOpen&&(
          <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#C8A96E,#E8CC90)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#080E1A"}}>오</div>
              <div><div style={{fontSize:12,fontWeight:600,color:"#C0CFE0"}}>오픈한</div><div style={{fontSize:10,color:"#66778A"}}>물류팀 · 관리자</div></div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Topbar */}
        <header style={{height:60,display:"flex",alignItems:"center",padding:"0 24px",gap:12,background:"rgba(8,14,26,0.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
          <button className="bg" onClick={()=>setSidebarOpen(v=>!v)} style={{width:34,height:34,borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"#8899AA",cursor:"pointer",fontSize:16}}>☰</button>
          <div style={{flex:1,maxWidth:280,position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#66778A",fontSize:13}}>🔍</span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="품목, 거래번호 검색…" style={{width:"100%",padding:"7px 12px 7px 32px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,color:"#C0CFE0",fontSize:12,outline:"none"}}/>
          </div>
          <div style={{flex:1}}/>
          {/* 안전재고 경보 */}
          {belowSafe > 0 && (
            <div style={{padding:"5px 12px",borderRadius:20,background:"rgba(232,123,106,0.12)",border:"1px solid rgba(232,123,106,0.3)",fontSize:11,color:"#E87B6A",display:"flex",alignItems:"center",gap:5}}>
              🔴 안전재고 이하 {belowSafe}개 품목
            </div>
          )}
          {alerts.slice(0,1).map((a,i)=>(
            <div key={i} style={{padding:"5px 12px",borderRadius:20,background:a.level==="warning"?"rgba(200,169,110,0.12)":"rgba(91,143,212,0.12)",border:`1px solid ${a.level==="warning"?"rgba(200,169,110,0.3)":"rgba(91,143,212,0.3)"}`,fontSize:11,color:a.level==="warning"?"#C8A96E":"#5B8FD4",display:"flex",alignItems:"center",gap:5,maxWidth:220}}>
              <span>{a.level==="warning"?"🟡":"🔵"}</span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.msg}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:8}}>
            {["입고","출고"].map(t=>(
              <button key={t} onClick={()=>{setModalType(t);setShowModal(true);}} style={{padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",background:t==="입고"?"linear-gradient(135deg,#5B8FD4,#4A7BBF)":"linear-gradient(135deg,#E87B6A,#D4604F)",color:"#fff",fontSize:12,fontWeight:700,transition:"all 0.15s"}}>
                {t==="입고"?"▼ ":"▲ "}{t} 등록
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main style={{flex:1,overflowY:"auto",padding:24}}>

          {/* ── 대시보드 ── */}
          {activeTab==="dashboard"&&(
            <div>
              <div className="fade" style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"baseline",gap:12}}>
                  <h1 style={{fontSize:21,fontWeight:800,color:"#EEF2FF",letterSpacing:"-0.03em"}}>팔레트 관리 대시보드</h1>
                  <span style={{fontSize:12,color:"#66778A"}}>2025년 3월 기준</span>
                </div>
                <FilterTabs value={itemFilter} onChange={setItemFilter}/>
              </div>

              {/* KPI */}
              <div className="fade d1" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
                <KPICard label="총 재고" value={`${itemStockData.reduce((s,i)=>s+i.stock,0).toLocaleString()}개`} sub="전월 대비" trend={4.8} icon="📦" accent="#5B8FD4"/>
                <KPICard label="이번달 입고" value="700개" sub="전월 대비" trend={9.4} icon="⬇" accent="#7EC8A4"/>
                <KPICard label="이번달 출고" value="650개" sub="전월 대비" trend={10.2} icon="⬆" accent="#C8A96E"/>
                <KPICard label="안전재고 부족" value={`${belowSafe}개 품목`} sub="즉시 확인 필요" trend={belowSafe>0?-10:5} icon="⚠" accent="#E87B6A"/>
              </div>

              {/* 차트 */}
              <div className="fade d2" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:20}}>
                {/* 입출고 추이 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0"}}>입출고 추이</div>
                      <div style={{fontSize:11,color:"#66778A",marginTop:2}}>월별 입고 / 출고 / 재고 현황</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {["월별","주별","일별"].map(p=>(
                        <button key={p} onClick={()=>setPeriod(p)} className="bg" style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${period===p?"rgba(91,143,212,0.5)":"rgba(255,255,255,0.08)"}`,background:period===p?"rgba(91,143,212,0.12)":"transparent",color:period===p?"#5B8FD4":"#66778A",fontSize:11,cursor:"pointer"}}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={monthlyData} margin={{top:5,right:5,left:-20,bottom:0}}>
                      <defs>
                        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5B8FD4" stopOpacity={0.35}/><stop offset="95%" stopColor="#5B8FD4" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E87B6A" stopOpacity={0.35}/><stop offset="95%" stopColor="#E87B6A" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gSt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7EC8A4" stopOpacity={0.25}/><stop offset="95%" stopColor="#7EC8A4" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                      <XAxis dataKey="month" tick={{fill:"#66778A",fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#66778A",fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
                      <Area type="monotone" dataKey="입고" stroke="#5B8FD4" strokeWidth={2} fill="url(#gIn)"/>
                      <Area type="monotone" dataKey="출고" stroke="#E87B6A" strokeWidth={2} fill="url(#gOut)"/>
                      <Area type="monotone" dataKey="재고" stroke="#7EC8A4" strokeWidth={1.5} fill="url(#gSt)" strokeDasharray="4 2"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 품목별 비율 도넛 - 필터 연동 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:4}}>{chartTitle[itemFilter]}</div>
                  <div style={{fontSize:10,color:"#66778A",marginBottom:12}}>이번달 기준</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={itemRatioData[itemFilter]} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                        {itemRatioData[itemFilter].map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:11}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{marginTop:4,maxHeight:120,overflowY:"auto"}}>
                    {itemRatioData[itemFilter].map((t,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{width:7,height:7,borderRadius:2,background:t.color,display:"inline-block",flexShrink:0}}/>
                          <span style={{fontSize:11,color:"#9AAABB"}}>{t.name}</span>
                        </div>
                        <span style={{fontSize:11,fontWeight:600,color:"#C0CFE0",fontFamily:"monospace"}}>{t.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 */}
              <div className="fade d3" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
                {/* 최근 거래 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:14}}>최근 입출고</div>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                        {["거래ID","유형","품목","수량","위치","상태"].map(h=>(
                          <th key={h} style={{textAlign:"left",padding:"6px 8px",fontSize:10,color:"#66778A",fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.slice(0,5).map((t,i)=>(
                        <tr key={i} className="tr" style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                          <td style={{padding:"8px 8px",fontSize:11,color:"#5B8FD4",fontFamily:"monospace"}}>{t.id}</td>
                          <td style={{padding:"8px 8px"}}><Badge type={t.type}/></td>
                          <td style={{padding:"8px 8px",fontSize:11,color:"#C0CFE0"}}>{t.item}</td>
                          <td style={{padding:"8px 8px",fontSize:12,color:"#EEF2FF",fontFamily:"monospace",textAlign:"right"}}>{t.qty}</td>
                          <td style={{padding:"8px 8px",fontSize:11,color:"#8899AA"}}>{t.location}</td>
                          <td style={{padding:"8px 8px"}}><StatusDot status={t.status}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* A동 1층 창고 현황 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:4}}>창고 현황</div>
                  <div style={{fontSize:10,color:"#66778A",marginBottom:16}}>A동 1층 — 메인 적재 공간</div>
                  {warehouseData.map((w,i)=>(
                    <div key={i}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:13,fontWeight:700,color:"#C8D8F0"}}>{w.name}</span>
                        <span style={{fontSize:16,fontWeight:800,color:w.used>85?"#E87B6A":w.used>65?"#C8A96E":"#7EC8A4",fontFamily:"monospace"}}>{w.used}%</span>
                      </div>
                      <div style={{height:10,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",marginBottom:10}}>
                        <div style={{height:"100%",width:`${w.used}%`,borderRadius:6,background:"linear-gradient(90deg,#5B8FD4,#7EC8A4)",transition:"width 1.2s ease"}}/>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                        <div style={{background:"rgba(91,143,212,0.08)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                          <div style={{fontSize:10,color:"#5B8FD4",marginBottom:3}}>현재 적재</div>
                          <div style={{fontSize:18,fontWeight:800,color:"#EEF2FF",fontFamily:"monospace"}}>{w.current.toLocaleString()}</div>
                        </div>
                        <div style={{background:"rgba(126,200,164,0.08)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                          <div style={{fontSize:10,color:"#7EC8A4",marginBottom:3}}>여유 공간</div>
                          <div style={{fontSize:18,fontWeight:800,color:"#EEF2FF",fontFamily:"monospace"}}>{(w.capacity-w.current).toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"#66778A",textAlign:"center"}}>최대 용량: {w.capacity.toLocaleString()}개</div>
                      <div style={{marginTop:12,padding:"8px 12px",background:"rgba(91,143,212,0.06)",borderRadius:8,fontSize:11,color:"#66778A",textAlign:"center"}}>
                        구역 세분화 준비중
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── 입출고 관리 ── */}
          {activeTab==="inout"&&(
            <div>
              <div className="fade" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <h1 style={{fontSize:20,fontWeight:800,color:"#EEF2FF"}}>입출고 관리</h1>
                  <p style={{fontSize:12,color:"#66778A",marginTop:4}}>전체 품목 입출고 거래를 조회·관리합니다</p>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {["전체","입고","출고","이동"].map(f=>(
                    <button key={f} onClick={()=>setFilterType(f)} className="bg" style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filterType===f?"rgba(91,143,212,0.5)":"rgba(255,255,255,0.08)"}`,background:filterType===f?"rgba(91,143,212,0.12)":"transparent",color:filterType===f?"#5B8FD4":"#66778A",fontSize:12,cursor:"pointer"}}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="fade d1" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                      {["거래ID","유형","품목","수량","위치","날짜","상태"].map(h=>(
                        <th key={h} style={{textAlign:"left",padding:"12px 16px",fontSize:11,color:"#66778A",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((t,i)=>(
                      <tr key={i} className="tr" style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                        <td style={{padding:"12px 16px",fontSize:12,color:"#5B8FD4",fontFamily:"monospace"}}>{t.id}</td>
                        <td style={{padding:"12px 16px"}}><Badge type={t.type}/></td>
                        <td style={{padding:"12px 16px",fontSize:12,color:"#C0CFE0"}}>{t.item}</td>
                        <td style={{padding:"12px 16px",fontSize:13,color:"#EEF2FF",fontFamily:"monospace",fontWeight:600}}>{t.qty}</td>
                        <td style={{padding:"12px 16px",fontSize:12,color:"#9AAABB"}}>{t.location}</td>
                        <td style={{padding:"12px 16px",fontSize:11,color:"#66778A",fontFamily:"monospace"}}>{t.date}</td>
                        <td style={{padding:"12px 16px"}}><StatusDot status={t.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 재고 현황 ── */}
          {activeTab==="inventory"&&(
            <div>
              <div className="fade" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div>
                  <h1 style={{fontSize:20,fontWeight:800,color:"#EEF2FF"}}>재고 현황</h1>
                  <p style={{fontSize:12,color:"#66778A",marginTop:4}}>전체 8개 품목 재고를 품목별로 관리합니다</p>
                </div>
                <FilterTabs value={itemFilter} onChange={setItemFilter}/>
              </div>
              {belowSafe>0&&(
                <div className="fade d1" style={{marginBottom:16,padding:"12px 16px",background:"rgba(232,123,106,0.08)",border:"1px solid rgba(232,123,106,0.25)",borderRadius:12,fontSize:12,color:"#E87B6A"}}>
                  ⚠ 안전재고 이하 품목 {belowSafe}개 — {itemStockData.filter(i=>i.stock<i.safeStock).map(i=>i.label).join(", ")}
                </div>
              )}
              <div className="fade d2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
                {filteredStock.map((item,i)=><StockCard key={i} item={item}/>)}
              </div>
            </div>
          )}

          {/* ── 비용 관리 ── */}
          {activeTab==="cost"&&(
            <div>
              <div className="fade" style={{marginBottom:20}}>
                <h1 style={{fontSize:20,fontWeight:800,color:"#EEF2FF"}}>비용 관리</h1>
              </div>
              <div className="fade d1" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
                <KPICard label="이번달 총 비용" value="₩3,400만" sub="예산 대비 94.4%" trend={-5.6} icon="💳" accent="#C8A96E"/>
                <KPICard label="연간 누적 비용" value="₩3.12억" sub="전년 대비" trend={8.2} icon="📊" accent="#5B8FD4"/>
                <KPICard label="품목당 평균 단가" value="₩4,850" sub="전월 대비" trend={-1.2} icon="🏷" accent="#7EC8A4"/>
              </div>
              <div className="fade d2" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0"}}>3월 예산 현황</div>
                  <span style={{fontSize:13,fontWeight:700,color:"#7EC8A4",fontFamily:"monospace"}}>₩{totalCost.toLocaleString()} / ₩{budgetTotal.toLocaleString()}</span>
                </div>
                <div style={{height:10,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",width:`${budgetUsed}%`,borderRadius:6,background:"linear-gradient(90deg,#5B8FD4,#7EC8A4)"}}/>
                </div>
                <div style={{fontSize:11,color:"#66778A"}}>예산의 {budgetUsed}% 사용 · 잔여 ₩{(budgetTotal-totalCost).toLocaleString()}</div>
              </div>
              <div className="fade d3" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24}}>
                <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:16}}>연간 비용 현황</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={monthlyData} margin={{left:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                    <XAxis dataKey="month" tick={{fill:"#66778A",fontSize:11}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#66778A",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/10000).toFixed(0)}만`}/>
                    <Tooltip contentStyle={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}} formatter={v=>[`₩${v.toLocaleString()}`,"비용"]}/>
                    <Bar dataKey="비용" fill="#C8A96E" radius={[4,4,0,0]} opacity={0.85}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── 이동 추이 ── */}
          {activeTab==="trend"&&(
            <div>
              <div className="fade" style={{marginBottom:20}}>
                <h1 style={{fontSize:20,fontWeight:800,color:"#EEF2FF"}}>기간별 이동 추이</h1>
              </div>
              <div className="fade d1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:16}}>입출고 비교 분석</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyData} margin={{left:-20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                      <XAxis dataKey="month" tick={{fill:"#66778A",fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#66778A",fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
                      <Legend wrapperStyle={{fontSize:11,color:"#8899AA"}}/>
                      <Bar dataKey="입고" fill="#5B8FD4" radius={[3,3,0,0]}/>
                      <Bar dataKey="출고" fill="#E87B6A" radius={[3,3,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:16}}>재고 추이</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyData} margin={{left:-20}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                      <XAxis dataKey="month" tick={{fill:"#66778A",fontSize:11}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#66778A",fontSize:10}} axisLine={false} tickLine={false}/>
                      <Tooltip contentStyle={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,fontSize:12}}/>
                      <Line type="monotone" dataKey="재고" stroke="#7EC8A4" strokeWidth={2.5} dot={{fill:"#7EC8A4",r:4}} activeDot={{r:6}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── 창고 현황 ── */}
          {activeTab==="warehouse"&&(
            <div>
              <div className="fade" style={{marginBottom:20}}>
                <h1 style={{fontSize:20,fontWeight:800,color:"#EEF2FF"}}>창고 현황</h1>
                <p style={{fontSize:12,color:"#66778A",marginTop:4}}>A동 1층 메인 적재 공간</p>
              </div>
              <div className="fade d1" style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14}}>
                {/* 창고 카드 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:28}}>
                  <div style={{fontSize:18,fontWeight:800,color:"#EEF2FF",marginBottom:4}}>A동 1층</div>
                  <div style={{fontSize:11,color:"#66778A",marginBottom:20}}>메인 팔레트·박스 적재 공간</div>
                  <div style={{fontSize:48,fontWeight:800,color:"#7EC8A4",fontFamily:"monospace",marginBottom:4}}>72%</div>
                  <div style={{fontSize:12,color:"#66778A",marginBottom:16}}>현재 적재율</div>
                  <div style={{height:12,background:"rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden",marginBottom:20}}>
                    <div style={{height:"100%",width:"72%",borderRadius:6,background:"linear-gradient(90deg,#5B8FD4,#7EC8A4)",transition:"width 1.2s ease"}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[["현재 적재","1,083개","#5B8FD4"],["여유 공간","417개","#7EC8A4"],["최대 용량","1,500개","#C8A96E"],["구역 수","미정","#8899AA"]].map(([label,val,color],i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"12px 14px"}}>
                        <div style={{fontSize:10,color:"#66778A",marginBottom:4}}>{label}</div>
                        <div style={{fontSize:15,fontWeight:700,color,fontFamily:"monospace"}}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:16,padding:"10px 14px",background:"rgba(91,143,212,0.06)",borderRadius:10,fontSize:11,color:"#66778A",textAlign:"center"}}>
                    구역 세분화 추가 예정
                  </div>
                </div>
                {/* 품목별 적재 현황 */}
                <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:24}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#C8D8F0",marginBottom:16}}>품목별 적재 현황</div>
                  {itemStockData.map((item,i)=>(
                    <div key={i} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{width:8,height:8,borderRadius:2,background:item.color,display:"inline-block",flexShrink:0}}/>
                          <span style={{fontSize:12,color:"#C0CFE0"}}>{item.label}</span>
                          {item.stock<item.safeStock&&<span style={{fontSize:10,color:"#E87B6A",background:"rgba(232,123,106,0.1)",padding:"1px 7px",borderRadius:10}}>재고부족</span>}
                        </div>
                        <span style={{fontSize:12,color:"#8899AA",fontFamily:"monospace"}}>{item.stock.toLocaleString()}개</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.min((item.stock/580)*100,100)}%`,borderRadius:3,background:item.stock<item.safeStock?"linear-gradient(90deg,#E87B6A,#FF9F8A)":item.color,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OTHER */}
          {!["dashboard","inout","inventory","cost","trend","warehouse"].includes(activeTab)&&(
            <div className="fade" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:12}}>
              <div style={{fontSize:48}}>{navItems.find(n=>n.id===activeTab)?.icon}</div>
              <div style={{fontSize:18,fontWeight:700,color:"#C0CFE0"}}>{navItems.find(n=>n.id===activeTab)?.label}</div>
              <div style={{fontSize:13,color:"#66778A"}}>이 기능은 준비 중입니다</div>
            </div>
          )}
        </main>
      </div>

      {/* ── 등록 모달 ── */}
      {showModal&&(
        <div onClick={()=>setShowModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#0D1830",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:32,width:460,maxWidth:"90vw"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h2 style={{fontSize:17,fontWeight:800,color:"#EEF2FF"}}>{modalType} 등록</h2>
              <button onClick={()=>setShowModal(false)} style={{background:"transparent",border:"none",color:"#66778A",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>

            {/* 품목 선택 */}
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,color:"#8899AA",marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>품목 선택</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {ITEM_TYPES.map(item=>(
                  <button key={item.id} onClick={()=>setModalItem(item.id)} style={{padding:"7px 4px",borderRadius:8,border:`1px solid ${modalItem===item.id?item.color+"88":"rgba(255,255,255,0.08)"}`,background:modalItem===item.id?`${item.color}18`:"transparent",color:modalItem===item.id?item.color:"#8899AA",fontSize:10,cursor:"pointer",transition:"all 0.15s",textAlign:"center"}}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {[
              {label:"수량",      placeholder:"수량 입력",    type:"number"},
              {label:"위치",      placeholder:"A동 1층",     type:"text"},
              {label:"단가 (₩)", placeholder:"개당 단가",    type:"number"},
              {label:"비고",      placeholder:"메모 (선택)", type:"text"},
            ].map((f,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:11,color:"#8899AA",marginBottom:6,letterSpacing:"0.06em",textTransform:"uppercase"}}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} style={{width:"100%",padding:"10px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#C0CFE0",fontSize:13,outline:"none"}}/>
              </div>
            ))}

            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#8899AA",fontSize:13,cursor:"pointer"}}>취소</button>
              <button style={{flex:2,padding:"11px",borderRadius:10,border:"none",background:modalType==="입고"?"linear-gradient(135deg,#5B8FD4,#4A7BBF)":"linear-gradient(135deg,#E87B6A,#D4604F)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                ✓ {ITEM_TYPES.find(i=>i.id===modalItem)?.label} {modalType} 등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
