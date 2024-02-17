import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import App from './App';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('App', () => {
  const mock = new MockAdapter(axios);
  const mockUrl = 'https://example.com/live';
  const mockApiResponse = {
    is_live: true,
    title: 'Live Stream Title',
    thumbnail_url: 'https://example.com/thumbnail.jpg'
  };

  beforeEach(() => {
    mock.reset();
  });

  it('checks live status successfully', async () => {
    mock.onGet(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(mockUrl) }`).reply(200, mockApiResponse);

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter YouTube Live URL/i), {target: {value: mockUrl}});
    fireEvent.click(screen.getByRole('button', {name: /Check Status/i}));

    await waitFor(() => {
      expect(screen.getByText(mockApiResponse.title)).toBeInTheDocument();
    });
  });

  it('handles empty URL input error', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', {name: /Check Status/i}));
    expect(screen.getByText(/Error: Empty URL/i)).toBeInTheDocument();
  });

  it('refreshes status of a URL successfully', async () => {
    mock.onGet(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(mockUrl) }`).reply(200, mockApiResponse);

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter YouTube Live URL/i), {target: {value: mockUrl}});
    fireEvent.click(screen.getByRole('button', {name: /Check Status/i}));

    await waitFor(() => {
      expect(screen.getByText(mockApiResponse.title)).toBeInTheDocument();
    });

    const updatedApiResponse = {...mockApiResponse, title: 'Updated Live Stream Title'};
    mock.onGet(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(mockUrl) }`).reply(200, updatedApiResponse);

    fireEvent.click(screen.getByText(/Refresh/i));

    await waitFor(() => {
      expect(screen.getByText(updatedApiResponse.title)).toBeInTheDocument();
    });
  });

  it('removes a URL from the list successfully', async () => {
    mock.onGet(`${ process.env.REACT_APP_API_URL }/monitor/check/?url=${ encodeURIComponent(mockUrl) }`).reply(200, mockApiResponse);
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter YouTube Live URL/i), {target: {value: mockUrl}});
    fireEvent.click(screen.getByRole('button', {name: /Check Status/i}));

    await waitFor(() => {
      expect(screen.getByText(mockApiResponse.title)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/Remove/i)[ 0 ]);

    await waitFor(() => {
      expect(screen.queryByText(mockApiResponse.title)).toBeNull();
    });
  });

});
