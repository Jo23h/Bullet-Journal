import GeminiChat from "./GeminiChat";
import FilterButtons from "./FilterButtons";
import TimeDisplay from "./TimeDisplay";

function header() {
  

  return (
    <div style={styles.header}>
      <div style={styles.container}>
        <TimeDisplay />
        <GeminiChat />
        <FilterButtons />
      </div>
    </div>
  );
};

export default header