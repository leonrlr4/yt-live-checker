import React, {useState} from 'react';
import axios from 'axios';
import './App.css'; // Ensure you have this CSS file in your project

function App() {
  const [ url, setUrl ] = useState('');
  const [ results, setResults ] = useState([]);
  const [ error, setError ] = useState('');

  const checkLiveStatus = async () => {
    setError('');
    if (results.some(result => result.url === url)) {
      setError('This URL has already been checked.');
      return;
    }

    try {
      const response = await axios.get(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(url) }`);
      setResults(prevResults => [
        ...prevResults,
        {
          url,
          liveStatus: response.data.is_live ? 'Live' : 'Offline',
          title: response.data.title || 'No title available'
        },
      ]);
      setUrl('');
    } catch (err) {
      setError('Error checking live status. Please try again.');
    }
  };

  const refreshStatus = async (urlToRefresh, index) => {
    try {
      const response = await axios.get(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(urlToRefresh) }`);
      setResults(results.map((result, i) =>
        i === index ? {...result, liveStatus: response.data.is_live ? 'Live' : 'Offline', title: response.data.title || 'No title available'} : result
      ));
    } catch (error) {
      console.error('Error refreshing live status', error);
    }
  };

  const removeResult = index => {
    setResults(results.filter((_, i) => i !== index));
  };


  return (
    <div className="app-container">
      <h1>YouTube Live Stream Monitor</h1>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter YouTube Live URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button className="btn btn-primary" onClick={checkLiveStatus}>
          Check Status
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className={`card result-card ${ getStatusClass(result.liveStatus) }`}>
            <div className="card-body">
              <h5 className="card-title">{result.title}</h5>
              <p className="card-text">{result.liveStatus}</p>
              <button onClick={() => refreshStatus(result.url, index)} className="btn btn-sm btn-info">Refresh</button>
              <button onClick={() => removeResult(index)} className="btn btn-sm btn-danger">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusClass(status) {
  return status === 'Live' ? 'card-live' : 'card-offline';
}

export default App;
