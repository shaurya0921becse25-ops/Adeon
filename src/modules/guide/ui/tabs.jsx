export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <button key={t} className={"tab" + (value === t ? " active" : "")} onClick={() => onChange(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}