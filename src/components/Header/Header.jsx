import TimeDisplay from "./TimeDisplay";
import FilterButtons from "./FilterButtons";
import GeminiChat from "./GeminiChat";
import Weather from "./Weather";

function Header({ currentTime }) {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">Daily Log</h1>
        <TimeDisplay currentTime={currentTime} />
        <Weather />
      </div>
      <FilterButtons />
      <GeminiChat />
    </div>
  );
}

export default Header;