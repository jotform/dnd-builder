import { useState, useEffect } from 'react';

const ProcessingAnimation = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const messages = [
    { id: 1, text: 'Creating the perfect layout for your document...' },
    { id: 2, text: 'Preparing typography and layout suggestions...' },
    { id: 3, text: 'Smart design engine is at work...' },
    { id: 4, text: 'Adding the final touches...' },
    { id: 5, text: 'Almost done!' },
  ];

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        const nextIndex = currentMessageIndex + 1;

        if (nextIndex >= messages.length) {
          setIsComplete(true);
          clearInterval(interval);
          return;
        }

        setCurrentMessageIndex(nextIndex);
        setIsVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentMessageIndex, messages.length, isComplete]);

  return (
    <div className="">
      <div className="processing-container processing-animation">
        <div
          className={`font-circular color-navy-700 text-lg line-height-xl 
            font-bold processing-message 
            ${isVisible ? 'visible' : 'hidden'}`}
        >
          {messages[currentMessageIndex].text}
        </div>
      </div>
    </div>
  );
};

export default ProcessingAnimation;
