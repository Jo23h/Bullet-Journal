import TimeDisplay from "./TimeDisplay";
import FilterButtons from "./FilterButtons";
import GeminiChat from "./GeminiChat";
import Weather from "./Weather";

function Header({ currentTime }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1f2937', margin: '0 0 12px 0' }}>
          Daily Log
        </h1>
        <TimeDisplay currentTime={currentTime} />
        <Weather />
      </div>
      <FilterButtons />
      <GeminiChat />
    </div>
  );
}

export default Header;