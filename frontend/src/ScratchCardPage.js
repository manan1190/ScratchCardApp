import React, { useState } from 'react';
import ScratchCard from './ScratchCard';

function ScratchCardPage() {
  const [amount, setAmount] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);
  const [shareLink, setShareLink] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount < 0) {
      alert('Please enter a valid non-negative amount');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parsedAmount }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create card: ${response.status}`);
      }

      const newCard = await response.json();

      setGeneratedCard({ amount: newCard.amount, id: newCard.id });
      setShareLink(`${window.location.origin}/scratch-card/${newCard.id}`);
    } catch (error) {
      console.error('Error saving scratch card:', error);
      alert('Failed to generate scratch card');
    }
  };

  return (
    <div className="scratch-card-page">
      <h1>Create Scratch Card</h1>
      <div className="form-container">
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </label>
        <button onClick={handleGenerate}>Generate Scratch Card</button>
      </div>

      {generatedCard && (
        <div className="share-section">
          <h3>Share this card:</h3>
          <input
            type="text"
            value={shareLink}
            readOnly
            onClick={(e) => e.target.select()}
          />
          <div className="share-buttons">
            <a
              href={`https://api.whatsapp.com/send?text=Check out this scratch card! ${encodeURIComponent(shareLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-share"
            >
              Share on WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=Check out this scratch card!`}
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-share"
            >
              Share on Telegram
            </a>
          </div>
        </div>
      )}
      {generatedCard && (
        <ScratchCard amount={generatedCard.amount} />
      )}
    </div>
  );
}

export default ScratchCardPage;