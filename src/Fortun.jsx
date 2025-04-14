import { useState, useEffect } from 'react';
import './Fortun.css';
import logo from '/image/logo.png';

const segments = [
  'ЗНИЖКА 10%', 'ФЛАКОН В ПОДАРУНОК', 'ЗНИЖКА 20%', 'СЕРТИФІКАТ 200грн',
  'ЗНИЖКА 15%', '5мл В ПОДАРУНОК', 'ЗНИЖКА 5%'
];

const weights = [30, 0, 15, 15, 30, 10, 0];

const getSegmentAngles = (weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  const angles = [];
  let startAngle = 0;

  for (let i = 0; i < weights.length; i++) {
    const portion = (weights[i] / total) * 360;
    angles.push({
      index: i,
      startAngle,
      midAngle: startAngle + portion / 2,
      endAngle: startAngle + portion
    });
    startAngle += portion;
  }

  return angles;
};

const segmentAngles = getSegmentAngles(weights);

const WheelOfFortune = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    const savedSegment = localStorage.getItem('winningSegment');
    if (savedSegment) {
      const index = segments.indexOf(savedSegment);
      const segmentData = segmentAngles[index];

      if (segmentData) {
        const targetAngle = 360 - segmentData.midAngle;
        setRotation(targetAngle);
        setSelectedSegment(savedSegment);
        setHasSpun(true);
      }
    }
  }, []);

  const getWeightedRandomSegment = () => {
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    const randomNum = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (randomNum <= cumulativeWeight) {
        return segments[i];
      }
    }
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    const winningSegment = getWeightedRandomSegment();
    setSelectedSegment(winningSegment);
    localStorage.setItem('winningSegment', winningSegment);

    const winningIndex = segments.indexOf(winningSegment);
    const segmentData = segmentAngles[winningIndex];

    const fullSpins = 12;
    const targetAngle = 360 - segmentData.midAngle;
    const finalRotation = (fullSpins * 360) + targetAngle;

    setRotation(prev => prev + finalRotation);
    setHasSpun(true);

    setTimeout(() => {
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className='back'>
      <div className='name'><h1>PERFUMS BAR</h1></div>

      <div className="wheel-container">
        <div className="wheel-wrapper">
          <button className='logo1' onClick={handleSpin} disabled={isSpinning || hasSpun}>
            <img src={logo} alt="Логотип" />
          </button>
          <div className="arrow"></div>
          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s ease-out' : 'none'
            }}
          >
            {segments.map((segment, index) => (
              <div key={index} className={`segment segment-${index}`}>
                <div className="segment-inner">
                  <span>{segment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bulbs-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bulb"></div>
        ))}
      </div>
    </div>
  );
};
localStorage.removeItem('winningSegment');

export default WheelOfFortune;
