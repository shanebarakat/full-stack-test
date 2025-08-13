"""
This module serves as the main entry point for the application, responsible for bootstrapping and rendering the React components.

The application bootstrap process involves importing necessary React modules, locating the DOM element for rendering, and initializing the React root to display the App component within StrictMode for enhanced error detection and warnings.
"""

# Import StrictMode from 'react' to enable strict mode, which helps identify potential problems
import { StrictMode } from 'react'

# Import createRoot from 'react-dom/client' to create a root for rendering the React application
import { createRoot } from 'react-dom/client'

# Import CSS for styling the application
import './index.css'

# Import the main App component from its module
import App from './App.tsx'

# Create the React root and render the App component inside StrictMode to the DOM element with id 'root'
# This bootstraps the application by setting up the initial UI structure
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)