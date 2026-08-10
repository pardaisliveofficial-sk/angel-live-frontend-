import { StrictMode, Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

class RuntimeErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Angel Live runtime error', error, info); }
  render() {
    if (this.state.error) {
      return <main style={{minHeight:'100vh',background:'#09090e',color:'#fff',display:'grid',placeItems:'center',padding:24,fontFamily:'system-ui'}}>
        <div style={{maxWidth:420,textAlign:'center'}}>
          <img src='./resources/angel-live-logo.png' alt='Angel Live' style={{width:180,maxWidth:'70vw',margin:'0 auto 24px',display:'block'}} />
          <h1 style={{fontSize:24,fontWeight:800,marginBottom:10}}>Angel Live</h1>
          <p style={{color:'#a1a1aa',fontSize:14}}>The app hit a startup error instead of showing a blank screen.</p>
          <p style={{color:'#71717a',fontSize:11,marginTop:12,wordBreak:'break-word'}}>{this.state.error.message}</p>
        </div>
      </main>;
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RuntimeErrorBoundary><App /></RuntimeErrorBoundary>
  </StrictMode>
);
