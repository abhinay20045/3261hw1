import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Application</h1>
      <button onClick={() => alert('Button Clicked!')}>Click Me</button>
    </div>
  );
};

export default App;