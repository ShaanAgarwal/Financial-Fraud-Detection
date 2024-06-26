# Financial Fraud Detection

## To Run The Frontend
The frontend runs by default on port 5173. To change the port, modify settings in the Docker/docker-compose.yml and vite.config.js files.

**Commands for Build and Run (Requires rebuilding for each change):**
```sh
docker build -t financial-fraud-detection .
docker run -p 5173:5173 financial-fraud-detection 
```

## To Run The Backend
The backend runs by default on port 8081. To change the port, modify settings in the Docker and application.yml files.

**Commands for Build and Run (Requires rebuilding for each change):**
```sh
docker build -t financial-fraud-detection-backend .
docker run -p 8081:8081 financial-fraud-detection-backend
```

## Changing Backend URL
To change the backend URL used in your frontend, modify the /baseURL.jsx file located in the frontend directory.