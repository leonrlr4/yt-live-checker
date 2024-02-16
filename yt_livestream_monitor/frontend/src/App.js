import React, {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ url, setUrl ] = useState('');
  const [ results, setResults ] = useState([]);


  const checkLiveStatus = async () => {
    try {
      const response = await axios.get(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(url) }`);
      const newResult = {
        id: Date.now(),
        url,
        liveStatus: response.data.is_live ? 'Live' : 'Offline',
        title: response.data.title || 'No title available',
      };

      setResults(prevResults => [ newResult, ...prevResults ]); // 添加新結果到列表頂部
      setUrl(''); // 清空輸入框

    } catch (error) {
      console.error('Error checking live status', error);
      // 這裡可以設置錯誤處理邏輯
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
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                onClick={checkLiveStatus}
              >
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>
      {results.map((result, index) => (
        <div className={`card ${ result.liveStatus.toLowerCase() }`}>
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{result.title}</h5>
              <p className="card-text">{result.liveStatus}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
