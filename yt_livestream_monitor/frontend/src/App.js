import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ url, setUrl ] = useState('');
  const [ liveStatus, setLiveStatus ] = useState(null);

  const checkLiveStatus = async () => {
    try {
      const response = await axios.get(`
      ${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(url) }
      `);
      setLiveStatus(response.data.is_live ? 'Live' : 'Offline');
    } catch (error) {
      setLiveStatus('Error checking live status');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">YouTube Live Stream Monitor</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter YouTube Live URL"
              aria-label="YouTube Live URL"
              aria-describedby="button-addon2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={checkLiveStatus}
              >
                Check Status
              </button>
            </div>
          </div>
          {liveStatus && <div className="alert alert-info" role="alert">{liveStatus}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
