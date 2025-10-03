import TimeDisplay from "./TimeDisplay";
import FilterButtons from "./FilterButtons";
import GeminiChat from "./GeminiChat";

function Header({ setFilter }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '16px' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
          Daily Log
        </h1>
        <TimeDisplay />
      </div>
      <FilterButtons setFilter={setFilter} />
      <GeminiChat />
    </div>
  );
}

export default Header;