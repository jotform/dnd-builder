import { useState, useEffect } from 'react';

const ProcessingAnimation = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    { id: 1, text: 'Creating the perfect layout for your document...' },
    { id: 2, text: 'Preparing typography and layout suggestions...' },
    { id: 3, text: 'Smart design engine is at work...' },
    { id: 4, text: 'Adding the final touches...' },
    { id: 5, text: 'Almost done!' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex === messages.length - 1 ? 0
          : prevIndex + 1));
        setIsVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="">
      <div className="processing-container">
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
