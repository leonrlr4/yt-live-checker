import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import App from './App';
import {cleanup} from '@testing-library/react';

jest.mock('axios');
window.open = jest.fn();

describe('App Component', () => {
  test('enters URL and submits form', async () => {
    axios.get.mockResolvedValueOnce({
      data: {is_live: true, title: 'Test Video', thumbnail_url: 'https://example.com/thumbnail.jpg'},
    });

    render(<App />);
    const input = screen.getByPlaceholderText('Enter YouTube Live URL');
    fireEvent.change(input, {target: {value: 'https://example.com/live'}});
    fireEvent.click(screen.getByRole('button', {name: /check status/i}));

    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByRole('img', {name: ''})).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
  });

  test('deletes a result', async () => {
    axios.get.mockResolvedValueOnce({
      data: {is_live: true, title: 'Test Video', thumbnail_url: 'https://example.com/thumbnail.jpg'},
    });

    render(<App />);
    const input = screen.getByPlaceholderText('Enter YouTube Live URL');
    fireEvent.change(input, {target: {value: 'https://example.com/live'}});
    fireEvent.click(screen.getByRole('button', {name: /check status/i}));

    await waitFor(() => {
      expect(screen.getByText('Test Video')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', {name: /remove/i})[ 0 ]);

    await waitFor(() => {
      expect(screen.queryByText('Test Video')).not.toBeInTheDocument();
    });
  });

  afterEach(cleanup);
});
