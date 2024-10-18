import { useState } from 'react';
import './Fortun.css';

const WheelOfFortune = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const segments = [
    'ЗНИЖКА 10%', 'ФЛАКОН У ПОДАРУНОК', 'ЗНИЖКА 20%', 'СЕРТЕФІКАТ 200грн', 'ЗНИЖКА 15%', '5мл В ПОДАРУНОК', 'ЗНИЖКА 5%' 
  ];

  const weights = [90, 1, 2, 2, 1, 2, 2]; 
  const segmentAngle = 360 / segments.length;

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

    const randomSpin = Math.floor(Math.random() * 1000) + 2000;

    // Визначаємо виграшний сегмент перед обертанням
    const winningSegment = getWeightedRandomSegment();
    setSelectedSegment(winningSegment);

    // Визначаємо індекс виграшного сегмента
    const winningIndex = segments.indexOf(winningSegment);

    // Рахуємо скільки потрібно крутити, щоб виграшний сегмент був зверху
    const finalRotation = rotation + randomSpin + (360 - (winningIndex * segmentAngle)) % 360;

    // Оновлюємо стан обертання
    setRotation(finalRotation);

    // Додаємо затримку для завершення обертання (4 секунди)
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
    <div className='container'>
      <div className="wheel-container">
        <div className="wheel-wrapper">
          <button className='center' onClick={handleSpin} disabled={isSpinning}>
            Крути
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
                <span>{segment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>ВІТАЄМО</h2>
            <p>Ви виграли: {selectedSegment}</p>
            <button className='button-close' onClick={closeModal}>Закрити</button>
          </div>
        </div>
      )}

      <div className="bulbs-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bulb"></div>
        ))}
      </div>
    </div>
  );
};

export default WheelOfFortune;
