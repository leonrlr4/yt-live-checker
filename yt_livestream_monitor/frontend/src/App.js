import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ url, setUrl ] = useState('');
  const [ results, setResults ] = useState([]);
  const [ error, setError ] = useState('');
  const [ notification, setNotification ] = useState({message: '', type: ''});

  const checkLiveStatus = async () => {
    setError('');
    setNotification({message: '', type: ''});

    if (!url.trim()) {
      setError('Error: Empty URL');
      return;
    }

    if (results.some(result => result.url === url)) {
      setError('This URL has already been checked.');
      return;
    }

    try {
      const response = await axios.get(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(url) }`);

      if (response.status === 200) {
        setResults(prevResults => [
          ...prevResults,
          {
            url,
            liveStatus: response.data.is_live ? 'Live' : 'Offline',
            title: response.data.title || 'No title available',
            thumbnailUrl: response.data.thumbnail_url
          },
        ]);
        setUrl('');
      } else if (response.data && response.data.error) {
        setError(response.data.error);
      } else {
        setError('Failed to check live status. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network or server error. Please try again.');
    }
  };

  const refreshStatus = async (urlToRefresh, index) => {
    try {
      const response = await axios.get(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(urlToRefresh) }`);
      setResults(results.map((result, i) =>
        i === index ? {...result, liveStatus: response.data.is_live ? 'Live' : 'Offline', title: response.data.title || 'No title available', thumbnailUrl: response.data.thumbnail_url} : result  // 在这里添加 thumbnailUrl
      ));
      setNotification({message: 'Status refreshed!', type: 'success'});
      setTimeout(() => setNotification({message: '', type: ''}), 2000);
    } catch (error) {
      console.error('Error refreshing live status', error);
      setNotification({message: 'Error refreshing status.', type: 'danger'});
      setTimeout(() => setNotification({message: '', type: ''}), 2000);
    }
  };

  const removeResult = index => {
    setResults(results.filter((_, i) => i !== index));
    setNotification({message: 'URL removed from the list.', type: 'success'});
    setTimeout(() => setNotification({message: '', type: ''}), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    checkLiveStatus();
  };

  return (
    <div className="app-container">
      <h1>YouTube Live Stream Monitor</h1>
      <div className="app-container">
        <form onSubmit={handleFormSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter YouTube Live URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Check Status
            </button>
          </div>
        </form>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="results-container">
        {notification.message && (
          <div className={`alert alert-${ notification.type }`} role="alert">
            {notification.message}
          </div>
        )}
        {results.map((result, index) => (
          <div
            key={index}
            className={`card result-card ${ getStatusClass(result.liveStatus) }`}
            onClick={() => window.open(result.url, '_blank')}
          >
            <div className="card-body">
              <h5 className="card-title">{result.title}</h5>
              <p className="card-text">{result.liveStatus}</p>
              <img alt='' src={result.thumbnailUrl} className="card-img-right" />
              <button onClick={(e) => {e.stopPropagation(); refreshStatus(result.url, index);}} className="btn btn-sm btn-info">Refresh</button>
              <button onClick={(e) => {e.stopPropagation(); removeResult(index);}} className="btn btn-sm btn-danger">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div >

  );
}

function getStatusClass(status) {
  return status === 'Live' ? 'card-live' : 'card-offline';
}

export default App;
