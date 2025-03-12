import React, { useRef, useState, useEffect } from 'react';
import './ScratchCard.css';
import { useParams } from 'react-router-dom';

function ScratchCard({ amount: propAmount }) {
  const { id } = useParams();
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isScratching, setIsScratching] = useState(false);
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    if (id) {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cards/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch card: ${response.status}`);
        }
        const data = await response.json();
          setCardData(data);
        if (data) {
          setAmount(data.amount);
        }
      } catch (error) {
        console.error('Error fetching card data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setAmount(propAmount);
    }
  };
  fetchData();
}, [id, propAmount]);


useEffect(() => {
  if (cardData?.scratched) return;
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  if(!context) return;
  // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 250;

    // Initialize canvas
    // Create a metallic gradient
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');    // Gold
    gradient.addColorStop(0.5, '#FFFFFF');  // White (for highlight)
    gradient.addColorStop(1, '#C0C0C0');    // Silver

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-out'; // To "erase" when scratching

    setCtx(context);
  }, [cardData]);

  const handleMouseDown = () => {
    setIsScratching(true);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleScratch = (e) => {
    if (!isScratching || !ctx || cardData?.scratched) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
    checkIfScratched();
  };

    const checkIfScratched = async () => {
        if (!ctx) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let scratchedPixels = 0;

    // Count transparent pixels (alpha = 0)
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        scratchedPixels++;
      }
    }
const threshold = (scratchedPixels / (pixels.length / 4)) > 0.6;
    if (threshold && id) {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cards/${id}/scratch`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to update card: ${response.status}`);
            }

            const updatedCard = await response.json();
            setCardData(updatedCard); // Update card data with scratched status

        } catch (error) {
            console.error('Error updating card:', error);
        }
    }
};
  useEffect(() => {
    if (cardData?.scratched) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if(!context) return;
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 250;

    // Initialize canvas
    // Create a metallic gradient
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');    // Gold
    gradient.addColorStop(0.5, '#FFFFFF');  // White (for highlight)
    gradient.addColorStop(1, '#C0C0C0');    // Silver

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-out'; // To "erase" when scratching

    setCtx(context);
    }, [cardData]);

const displayMessage = cardData?.scratched
    ? amount === 0
        ? 'Ahh! Better luck next time'
        : `You won: ₹${amount}`
    : 'Scratch to reveal your prize!';


return (
<>
  <div className="scratch-message">
    <h2>Scratch to reveal your prize!</h2>
  </div>
  <div className="scratch-card-container">
    {loading ? (
      <div>Loading...</div>
    ) : (
      <>
        <div className="scratch-message">
          <h2>{displayMessage}</h2>
        </div>
        {cardData?.scratched ? (
          // <div className="winning-amount">
          //   {amount === 0 ? (
          //     <p>Ahh! Better luck next time</p>
          //   ) : (
          //     <p>You won: ₹{amount}</p>
          //   )}
          // </div>
          <div></div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleScratch}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleScratch} />
        )}
      </>
    )}
  </div>
</>
);
}

export default ScratchCard;