export default function Toggle({ on, onChange }) {
  return (
    <button className={"toggle" + (on ? " on" : "")} onClick={() => onChange(!on)}>
      <span className="toggle-knob" />
    </button>
  );
}