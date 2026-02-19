import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to EventHub</h1>
        <p style={styles.heroSubtitle}>
          Discover and participate in amazing events
        </p>
        <div style={styles.heroButtons}>
          <Link to="/events" style={styles.primaryButton}>
            Browse Events
          </Link>
          <Link to="/upload" style={styles.secondaryButton}>
            Upload Images
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Discover Events</h3>
          <p>Find upcoming events and register with ease</p>
        </div>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Share Memories</h3>
          <p>Upload and share your event photos</p>
        </div>
        <div style={styles.feature}>
          <h3 style={styles.featureTitle}>Stay Updated</h3>
          <p>Get the latest updates on all events</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    marginBottom: '3rem',
  },
  heroTitle: {
    fontSize: '3.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '2rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  feature: {
    padding: '2rem',
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
};

export default Home;
