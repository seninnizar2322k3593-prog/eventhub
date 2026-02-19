import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const { data } = await eventsAPI.getAll(params);
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = { search };
      if (statusFilter) params.status = statusFilter;
      
      const { data } = await eventsAPI.getAll(params);
      setEvents(data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Events</h1>

      <div style={styles.filters}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {events.length === 0 ? (
        <p style={styles.noEvents}>No events found</p>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.eventTitle}>{event.title}</h3>
                <span style={styles.badge}>{event.status}</span>
              </div>
              <p style={styles.description}>
                {event.description.substring(0, 150)}...
              </p>
              <div style={styles.eventInfo}>
                <p>
                  <strong>Date:</strong> {formatDate(event.date)}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
              </div>
              <Link to={`/events/${event._id}`} style={styles.link}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#2c3e50',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchForm: {
    display: 'flex',
    flex: 1,
    minWidth: '300px',
  },
  searchInput: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  eventTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
    color: '#2c3e50',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    backgroundColor: '#3498db',
    color: 'white',
  },
  description: {
    color: '#555',
    marginBottom: '1rem',
    lineHeight: '1.6',
  },
  eventInfo: {
    marginBottom: '1rem',
    color: '#666',
  },
  link: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  noEvents: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#888',
    marginTop: '3rem',
  },
};

export default EventList;
