# YT Livestream Monitor

## Description

YT Livestream Monitor is a comprehensive tool designed to track and analyze YouTube livestreams in real-time. This project leverages the power of modern web technologies to provide users with up-to-date information on their favorite livestreams, including viewer counts, chat interactions, and more.

## Installation

### Prerequisites

- Python 3.6+
- Node.js 12+
- Docker (optional)

### Docker Installation

If you have Docker installed, you can set up the project using Docker containers.

1. Build the Docker image:

   ```
   docker build -t yt-livestream-monitor .
   ```

2. Run the Docker container:

   ```
   docker run -d -p 8000:8000 yt-livestream-monitor
   ```

### Backend Installation with Virtualenv

1. Clone the repository:

   ```
   git clone https://github.com/leonrlr4/yt-livestream-monitor.git
   ```

2. Navigate to the project directory:

   ```
   cd yt-livestream-monitor/yt_livestream_monitor/backend
   ```

3. Create a Python virtual environment and activate it:

   install virtualenv with ```pip install virtualenv``` command

   ```
   virtualenv venv
   source venv/bin/activate
   ```

4. Install the required Python packages using pip(or pip3 instead):

   ```
   pip install -r requirements.txt
   ```

5. Launch django server

    ```python3 manage.py runserver```

### Frontend Installation with Node.js

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install Node.js dependencies using `npm`:

   ```
   npm install
   ```

3. To start the frontend server, run:

   ```
   npm start
   ```

## Usage

After installation, you can start monitoring YouTube livestreams by navigating to the web interface provided by the frontend server  <http://localhost:3000> and enter the livestreams url you wish to monitor.

#### status

- green:  live :+1:
- red:    offline :-1:

#### features

- click card to go to the stream page

- remove and update function

- not allowed to check same url if is in the list

- empty or invalid yt live url are not allowed
