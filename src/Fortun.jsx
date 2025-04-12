import { useState } from 'react';
import './Fortun.css';
import logo from '/image/logo.png'

const WheelOfFortune = () => {
  const [rotation, setRotation] = useState(0); // Загальний оберт
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const segments = [
    'ЗНИЖКА 10%', 'ФЛАКОН В ПОДАРУНОК', 'ЗНИЖКА 20%', 'СЕРТИФІКАТ 200грн', 'ЗНИЖКА 15%', '5мл В ПОДАРУНОК', 'ЗНИЖКА 5%'
  ];

  const weights = [30, 10, 5, 10, 15, 10, 20];
  const segmentAngle = 360 / segments.length; // Кут для кожного сегмента

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
    if (isSpinning) return;
  
    setIsSpinning(true);
  
    // Визначаємо виграшний сегмент
    const winningSegment = getWeightedRandomSegment();
    setSelectedSegment(winningSegment);
  
    // Визначаємо індекс виграшного сегмента
    const winningIndex = segments.indexOf(winningSegment);
  
    // Кількість обертів (16 повних обертів)
    const fullSpins = 16;
  
    // Загальний кут обертання для 16 обертів
    const baseRotation = fullSpins * 360;
  
    // Кут для вирівнювання сегмента зверху
    const extraRotation = (winningIndex * segmentAngle) + (segmentAngle / 2); // Додатковий кут для точного вирівнювання
  
    // Загальна кількість обертів + обертання для точного вирівнювання
    const finalRotation = baseRotation + extraRotation;
  
    // Оновлюємо оберт з урахуванням виграшного сегмента
    setRotation(prevRotation => prevRotation + finalRotation);
  
    // Додаємо затримку для завершення обертання
    setTimeout(() => {
      setIsSpinning(false);
  
      // Показуємо модальне вікно через ще 0.5 секунди після зупинки
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    }, 4000);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
<div className='back'>
    <div className='name'> <h1> PERFUMS BAR</h1> </div>


    <div className="wheel-container">
        <div className="wheel-wrapper">
          <button className='logo1' onClick={handleSpin} disabled={isSpinning}>
            <img src={logo} alt="Логотип" />
          </button>
          <div className="arrow"></div>
          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 4s ease-out'
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

export default WheelOfFortune;
