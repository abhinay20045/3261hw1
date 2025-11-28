import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Application</h1>
      <button 
        onClick={() => alert('Button Clicked!')} 
        style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Click Me
      </button>
      <button 
        onClick={() => alert('New Button Clicked!')} 
        style={{ padding: '10px 20px', backgroundColor: '#28A745', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
      >
        New Button
      </button>
    </div>
  );
};

export default App;