import React from 'react';

const styles = `
  .overlay-container {
    width: 100%;
    height: 320px;
    overflow: hidden;
    position: relative;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .overlay-container {
      width: 1440px;
      max-width: none;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .overlay-container .clip-3,
  .overlay-container .clip-4,
  .overlay-container .clip-6,
  .overlay-container .clip-7,
  .overlay-container .clip-9,
  .overlay-container .clip-10,
  .overlay-container .clip-12,
  .overlay-container .clip-13 {
    clip-path: polygon(0 0, 1440 0, 1440 810, 0 810);
  }

  .overlay-container .clip-2 {
    clip-path: polygon(0 352.1955, 1440 352.1955, 1440 437.8376, 0 437.8376);
  }

  .overlay-container .clip-5 {
    clip-path: polygon(-63.5545 423.6438, 1385.4455 423.6438, 1408.4535 377.7806, -40.5505 377.7806);
  }

  .overlay-container .clip-8 {
    clip-path: polygon(54.1224 367.2257, 1494.1224 367.2257, 1471.3523 560.1817, 31.3523 560.1817);
  }

  .overlay-container .clip-11 {
    clip-path: polygon(-66.5075 266.5739, 1267.4925 266.5739, 1244.2205 546.5225, -89.7795 546.5225);
  }

  .overlay-container .clip-14 {
    clip-path: polygon(-37.4338 243.0031, 1507.5662 243.0031, 1484.7971 435.9591, -60.2029 435.9591);
  }

  .overlay-container .rect-blue {
    position: absolute;
    width: 4553px;
    height: 256px;
    background: #4294ce;
    transform: matrix(0.3354774, 0, 0, 0.3354774, -41.841085, 118);
    transform-origin: 0 0;
  }

  .overlay-container .rect-dark-blue-1 {
    position: absolute;
    width: 5449px;
    height: 256px;
    background: #0c2e75;
    transform: matrix(0.2801019, -0.021570264, 0.021570264, 0.2801019, -63.554517, 189);
    transform-origin: 0 0;
  }

  .overlay-container .rect-dark-blue-2 {
    position: absolute;
    width: 6422px;
    height: 256px;
    background: #133e9f;
    transform: matrix(0.2182515, 0.021347046, -0.021347046, 0.2182515, 54.12237, 133);
    transform-origin: 0 0;
  }

  .overlay-container .rect-orange {
    position: absolute;
    width: 3334px;
    height: 256px;
    background: #fea500;
    transform: matrix(0.47558714, 0.047404976, -0.047404976, 0.47558714, -66.50746, 33);
    transform-origin: 0 0;
  }

  .overlay-container .rect-dark-blue-3 {
    position: absolute;
    width: 6282px;
    height: 256px;
    background: #133e9f;
    transform: matrix(0.21825157, 0.021346365, -0.021346365, 0.21825157, -37.433774, 9);
    transform-origin: 0 0;
  }
`;

export const CenterOverlay: React.FC = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="overlay-container">
        {/* Blue rectangle */}
        <div className="rect-blue clip-2"></div>

        {/* Dark blue rectangle 1 */}
        <div className="rect-dark-blue-1 clip-3 clip-4 clip-5"></div>

        {/* Dark blue rectangle 2 */}
        <div className="rect-dark-blue-2 clip-6 clip-7 clip-8"></div>

        {/* Orange rectangle */}
        <div className="rect-orange clip-9 clip-10 clip-11"></div>

        {/* Dark blue rectangle 3 */}
        <div className="rect-dark-blue-3 clip-12 clip-13 clip-14"></div>
      </div>
    </>
  );
};

