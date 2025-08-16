
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl text-amber-300 font-title tracking-wider">
        TTRPG Character Generator
      </h1>
      <p className="text-gray-400 mt-2 text-lg">
        Bring your heroes and villains to life with a spark of AI.
      </p>
    </header>
  );
};

export default Header;
