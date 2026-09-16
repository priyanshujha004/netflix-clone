import React from 'react';

function Tagline({ text }) {
  return (
    <h1 className="text-4xl font-bold text-center text-primary">
      {text}
    </h1>
  );
}

export default Tagline;
