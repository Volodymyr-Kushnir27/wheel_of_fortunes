import { useState, useEffect } from 'react';
import './Fortun.css';
import logo from '/image/logo.png';

const segments = [
  'ЗНИЖКА 10%', 'ФЛАКОН В ПОДАРУНОК', 'ЗНИЖКА 20%', 'СЕРТИФІКАТ 200грн (-20% від сумми)',
  'ЗНИЖКА 15%', '5мл В ПОДАРУНОК', 'ЗНИЖКА 5%'
];

const weights = [30, 0, 15, 15, 30, 10, 0];

const getSegmentAngles = (weights) => {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const angles = [];
  let startAngle = 0;

  for (let i = 0; i < weights.length; i++) {
    const portion = weights[i] > 0 ? (weights[i] / totalWeight) * 360 : 360 / segments.length;
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

const getWeightedRandomIndex = () => {
  const validSegments = weights
    .map((weight, index) => ({ index, weight }))
    .filter(({ weight }) => weight > 0);

  const totalWeight = validSegments.reduce((sum, seg) => sum + seg.weight, 0);
  const rand = Math.random() * totalWeight;

  let cumulative = 0;
  for (let { index, weight } of validSegments) {
    cumulative += weight;
    if (rand < cumulative) return index;
  }

  return validSegments[validSegments.length - 1].index;
};

const WheelOfFortune = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('winningSegmentData');
    if (savedData) {
      const { segment, timestamp } = JSON.parse(savedData);

      const now = Date.now();
      const diff = now - timestamp;

      if (diff < 1 * 60 * 1000) {
        // Якщо ще не пройшло 24 години
        const index = segments.indexOf(segment);
        const segmentData = segmentAngles[index];

        if (segmentData) {
          const targetAngle = 360 - segmentData.midAngle;
          setRotation(targetAngle);
          setSelectedSegment(segment);
          setHasSpun(true);
        }
      } else {
        // Минуло 24 години → видаляємо збережений виграш
        localStorage.removeItem('winningSegmentData');
      }
    }
  }, []);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);

    const winningIndex = getWeightedRandomIndex();
    const winningSegment = segments[winningIndex];
    setSelectedSegment(winningSegment);

    // Зберігаємо виграш і час
    localStorage.setItem(
      'winningSegmentData',
      JSON.stringify({ segment: winningSegment, timestamp: Date.now() })
    );

    const fullSpins = 10;
    const targetAngle = fullSpins * 360 - segmentAngles[winningIndex].midAngle;

    setRotation(targetAngle);
    setHasSpun(true);

    setTimeout(() => {
      setIsSpinning(false);
    }, 4000);
  };

  return (
    <div className='back'>
      <div className='click' onClick={handleSpin}>
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
    </div>
  );
};

export default WheelOfFortune;
