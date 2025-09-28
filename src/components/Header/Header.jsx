import TimeDisplay from "./TimeDisplay";
import FilterButtons from "./FilterButtons";

function header({ filter, setFilter }) {
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '24px',
      marginBottom: '16px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#1f2937',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          Daily Log
        </h1>
        <TimeDisplay />
      </div>
      <FilterButtons filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default header