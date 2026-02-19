import { useState, useEffect } from 'react';
import { uploadsAPI, eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const ImageManagement = () => {
  const [uploads, setUploads] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [statusFilter, eventFilter]);

  const fetchData = async () => {
    try {
      const [uploadsRes, eventsRes] = await Promise.all([
        uploadsAPI.getAll(),
        eventsAPI.getAll(),
      ]);
      setUploads(uploadsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUploads = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (eventFilter) params.eventId = eventFilter;

      const { data } = await uploadsAPI.getAll(params);
      setUploads(data);
    } catch (error) {
      toast.error('Failed to load uploads');
    }
  };

  const handleApprove = async (id) => {
    try {
      await uploadsAPI.approve(id);
      toast.success('Image approved');
      fetchUploads();
    } catch (error) {
      toast.error('Failed to approve image');
    }
  };

  const handleReject = async (id) => {
    try {
      await uploadsAPI.reject(id);
      toast.success('Image rejected');
      fetchUploads();
    } catch (error) {
      toast.error('Failed to reject image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await uploadsAPI.delete(id);
        toast.success('Image deleted');
        fetchUploads();
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Image Management</h1>

      <div style={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>

        <div style={styles.statsBox}>
          <strong>Total: {uploads.length}</strong>
          <span>
            Pending: {uploads.filter((u) => u.status === 'pending').length}
          </span>
        </div>
      </div>

      {uploads.length === 0 ? (
        <p style={styles.noData}>No images found</p>
      ) : (
        <div style={styles.grid}>
          {uploads.map((upload) => (
            <div key={upload._id} style={styles.card}>
              <div style={styles.imageContainer}>
                <img
                  src={upload.imageUrl}
                  alt="Upload"
                  style={styles.image}
                />
                <div
                  style={{
                    ...styles.statusBadge,
                    ...(upload.status === 'pending' && styles.pendingBadge),
                    ...(upload.status === 'approved' && styles.approvedBadge),
                    ...(upload.status === 'rejected' && styles.rejectedBadge),
                  }}
                >
                  {upload.status}
                </div>
              </div>

              <div style={styles.cardContent}>
                <p>
                  <strong>Event:</strong> {upload.eventId?.title || 'N/A'}
                </p>
                {upload.uploadedBy && (
                  <p>
                    <strong>Uploaded by:</strong> {upload.uploadedBy}
                  </p>
                )}
                {upload.uploaderEmail && (
                  <p>
                    <strong>Email:</strong> {upload.uploaderEmail}
                  </p>
                )}
                <p>
                  <strong>Uploaded:</strong>{' '}
                  {new Date(upload.uploadedAt).toLocaleString()}
                </p>

                <div style={styles.buttonGroup}>
                  {upload.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(upload._id)}
                        style={styles.approveButton}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(upload._id)}
                        style={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(upload._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  statsBox: {
    display: 'flex',
    gap: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginLeft: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '250px',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pendingBadge: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
  approvedBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
  },
  rejectedBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
  cardContent: {
    padding: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  approveButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  rejectButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  deleteButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  noData: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#888',
    marginTop: '3rem',
  },
};

export default ImageManagement;
