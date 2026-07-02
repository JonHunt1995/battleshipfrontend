import { useState } from 'react';

const useInviteLink = () => {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create a new game');
      }

      const data = await response.json();
      setLink(data.link);
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
    <main>
      <h1>Battleship</h1>
      <button onClick={handleGenerateLink} className="generate-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Create New Game'}
      </button>
        {link && (
          <input type="text" value={link} readOnly className="invite-link" />
        )}
    </main>
  );
};

export default HomePage;