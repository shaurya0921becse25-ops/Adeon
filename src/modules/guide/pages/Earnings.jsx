import { useState } from "react";
import { Wallet, Percent, IndianRupee, Download, CheckCircle2 } from "lucide-react";
import StatCard from "../ui/StatCard";
import Card from "../ui/card";
import Badge from "../ui/badge";
import Tabs from "../ui/tabs";
import { earnings, payouts } from "../data/mock";
import { useApp } from "../data/AppContext";

const COMMISSION_RATE = 0.15;
const fmt = n => "₹" + n.toLocaleString("en-IN");

function EarningsAreaChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const width = 660;
  const height = 260;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => d.value), 10000);
  const yMax = Math.ceil(maxVal / 10000) * 10000;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartW;
    const y = paddingTop + (1 - d.value / yMax) * chartH;
    return { x, y, ...d };
  });

  // Build smooth bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

  return (
    <div style={{ position: "relative", width: "100%", height: 280 }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="earnAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
          </linearGradient>
          <filter id="glowShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Horizontal grid lines & Y labels */}
        {yTicks.map((tickVal, idx) => {
          const yPos = paddingTop + (1 - tickVal / yMax) * chartH;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={width - paddingRight}
                y2={yPos}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <text
                x={paddingLeft - 10}
                y={yPos + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontFamily="inherit"
              >
                {tickVal === 0 ? "₹0" : `₹${tickVal / 1000}k`}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#earnAreaGradient)" />

        {/* Line stroke */}
        <path
          d={pathD}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowShadow)"
        />

        {/* Data points & X labels */}
        {points.map((pt, i) => (
          <g key={i}>
            <text
              x={pt.x}
              y={height - 12}
              textAnchor="middle"
              fontSize="12"
              fontWeight={hoveredIdx === i ? "600" : "500"}
              fill={hoveredIdx === i ? "#0f172a" : "#64748b"}
              fontFamily="inherit"
            >
              {pt.month}
            </text>

            {hoveredIdx === i && (
              <line
                x1={pt.x}
                y1={paddingTop}
                x2={pt.x}
                y2={paddingTop + chartH}
                stroke="#94a3b8"
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            )}

            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === i ? 6 : 4}
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth={hoveredIdx === i ? 3 : 2}
              style={{ transition: "all 0.2s ease" }}
            />

            <rect
              x={pt.x - chartW / (points.length * 2)}
              y={paddingTop}
              width={chartW / points.length}
              height={chartH}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </g>
        ))}
      </svg>

      {hoveredIdx !== null && (
        <div
          style={{
            position: "absolute",
            left: `${(points[hoveredIdx].x / width) * 100}%`,
            top: `${(points[hoveredIdx].y / height) * 100}%`,
            transform: "translate(-50%, -120%)",
            background: "#ffffff",
            padding: "8px 14px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
            {points[hoveredIdx].month} Earnings
          </div>
          <div style={{ fontSize: "15px", color: "#2563eb", fontWeight: 700 }}>
            ₹{points[hoveredIdx].value.toLocaleString("en-IN")}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Earnings() {
  const { showToast } = useApp();
  const [tab, setTab] = useState("Overview");
  const [range, setRange] = useState(6);

  const data = earnings.slice(-range);
  const total = 48320;
  const commission = Math.round(total * COMMISSION_RATE);
  const net = total - commission;

  const downloadStatement = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Amount,Status\n" +
      payouts.map(p => `${p.date},₹${p.amount},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Abeon_Earnings_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Earnings statement CSV downloaded successfully!");
  };

  return (
    <>
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Host Earnings & Payouts</h1>
          <p className="page-sub">Direct transfers and transparent commission records.</p>
        </div>
        <button className="btn btn-primary" onClick={downloadStatement}>
          <Download size={15} /> Download Statement (CSV)
        </button>
      </div>

      <Tabs tabs={["Overview", "Payout History"]} value={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <div className="grid grid-3">
            <StatCard icon={Wallet} label="Total Earnings" value={fmt(total)} change="12%" />
            <StatCard icon={Percent} label="Commission (15%)" value={fmt(commission)} />
            <StatCard icon={IndianRupee} label="Net Income" value={fmt(net)} change="12%" />
          </div>

          <Card className="mt">
            <div className="card-head">
              <h3 className="card-title">Earnings Trend</h3>
              <select className="select-sm" value={range} onChange={e => setRange(Number(e.target.value))}>
                <option value={3}>Last 3 months</option>
                <option value={6}>Last 6 months</option>
                <option value={7}>Last 7 months</option>
              </select>
            </div>

            <EarningsAreaChart data={data} />
          </Card>
        </>
      )}

      {(tab === "Payout History" || tab === "Overview") && (
        <Card className="mt">
          <h3 className="card-title">Payout History</h3>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>{fmt(p.amount)}</td>
                  <td><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}