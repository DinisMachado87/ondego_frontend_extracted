# Step-by-Step Guide to Deploy Your React Frontend to Vercel

## 1. Configure Your Backend for Cross-Origin Requests

First, update your Django backend to accept requests from your future Vercel domain:

```python
CORS_ALLOWED_ORIGINS = [
    os.environ.get('CLIENT_ORIGIN'),
    "http://localhost:3000",
    "https://your-app-name.vercel.app",  # Add your Vercel app domain
]

# Make sure these are also set
CORS_ALLOW_CREDENTIALS = True

# For JWT authentication to work properly
JWT_AUTH_SAMESITE = 'None'
JWT_AUTH_SECURE = True
```

## 2. Update Your Frontend API Configuration

Create or modify your axios configuration:

```javascript
import axios from "axios";

// Create base URLs for API and media
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "https://your-heroku-app-name.herokuapp.com";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
```

## 3. Create Environment Files for Development

``````
// filepath: /Users/dinismachado/Documents/Code/ondego-api/frontend/.env.development
REACT_APP_API_URL=http://localhost:8000
```

``````
// filepath: /Users/dinismachado/Documents/Code/ondego-api/frontend/.env.production
REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com
```

## 4. Create a Build Script for Vercel

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## 5. Create Vercel Configuration File

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 6. Deploy to Vercel

1. **Create a separate repository for your frontend**:
   ```bash
   # Create a new repository for your frontend
   mkdir ~/ondego-frontend
   cp -r ~/Documents/Code/ondego-api/frontend/* ~/ondego-frontend/
   cd ~/ondego-frontend
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

2. **Create a repository on GitHub** for your frontend code

3. **Connect to your GitHub repository**:
   ```bash
   git remote add origin https://github.com/yourusername/ondego-frontend.git
   git push -u origin main
   ```

4. **Deploy through Vercel**:
   - Go to [Vercel](https://vercel.com/) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Root Directory: ondego-api (since the frontend code is now at the root)
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Environment Variables: Add `REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com`
   - Click "Deploy"

## 7. Update Your Heroku Configuration

Make sure your Django app on Heroku has the correct environment variables:

```bash
heroku config:set CLIENT_ORIGIN=https://your-app-name.vercel.app
```

This step-by-step guide should help you successfully migrate your frontend to Vercel while keeping your backend on Heroku. The key aspects are properly configuring CORS on the backend and ensuring your API calls from the frontend are directed to the correct URL.

Similar code found with 1 license type