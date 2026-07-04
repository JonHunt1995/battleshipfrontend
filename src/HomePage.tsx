import { useState } from 'react';

const useInviteLink = () => {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newgame', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create a new game.');
      }

      const data = await response.json();
      setLink(data.link);
      navigator.clipboard.writeText(data.link)
    } catch (error) {
      console.error('Error generating invite link:', error);
    } finally {
      setLoading(false);
    }
  };

  return { link, handleGenerateLink, loading };
};

const HomePage = () => {
  const { link, handleGenerateLink, loading } = useInviteLink();

  return (
    <main id="home-page">
      <h1>Battleship</h1>
      <section className="game-generator">
      <button onClick={handleGenerateLink} className="generate-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Create New Game'}
      </button>
        {link && (
        <div id="invite-link-container">
          <input type="text" value={link} readOnly className="invite-link" />
          <div id="invite-link-actions">
            <button onClick={() => navigator.clipboard.writeText(link)} className="copy-btn">
                Copy Link
            </button>
            <button onClick={() => window.location.href = link} className="join-btn">
                Join Game
            </button>
          </div>
        </div>
        )}
        </section>
    </main>
  );
};

export default HomePage;