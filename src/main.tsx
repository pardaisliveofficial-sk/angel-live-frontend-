import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(<App />);
} else {
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif">Angel Live failed to initialize.</div>';
}
