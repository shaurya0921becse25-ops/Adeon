import { useState } from "react";
import { Wallet, Percent, IndianRupee, Download, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import StatCard from "../ui/StatCard";
import Card from "../ui/card";
import Badge from "../ui/badge";
import Tabs from "../ui/tabs";
import { earnings, payouts } from "../data/mock";
import { useApp } from "../data/AppContext";

const COMMISSION_RATE = 0.15;
const fmt = n => "₹" + n.toLocaleString("en-IN");

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

            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={v => v / 1000 + "k"} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} fill="url(#earnGradient)" />
              </AreaChart>
            </ResponsiveContainer>
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