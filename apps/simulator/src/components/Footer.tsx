import React from 'react';
import { Compass, Sparkles, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { AppPage } from './Navbar';

interface FooterProps {
  setCurrentPage: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand" onClick={() => setCurrentPage('home')}>
              <div className="brand-logo-icon">
                <Compass size={18} />
              </div>
              <span className="brand-name">CareerPilot <span className="brand-accent">AI</span></span>
            </div>
            <p className="footer-description">
              Agentic Career Preparation Assistant built for the Amazon Developer Hackathon 2026, Alexa+ Track.
              Empowering engineers and tech professionals with precision skill gap analysis, adaptive study roadmaps, and realistic technical simulations.
            </p>
            <div className="footer-tech-badges">
              <span className="tech-badge"><Cpu size={12} /> Alexa+ Agent Protocol</span>
              <span className="tech-badge"><Code2 size={12} /> Model Context Protocol (MCP)</span>
              <span className="tech-badge"><Sparkles size={12} /> Qdrant RAG</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links-list">
              <li><button type="button" onClick={() => setCurrentPage('home')}>Home Overview</button></li>
              <li><button type="button" onClick={() => setCurrentPage('dashboard')}>Candidate Dashboard</button></li>
              <li><button type="button" onClick={() => setCurrentPage('simulator')}>AI Career Copilot</button></li>
              <li><button type="button" onClick={() => setCurrentPage('login')}>Account Portal</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Core Workflows</h4>
            <ul className="footer-links-list">
              <li><button type="button" onClick={() => setCurrentPage('simulator')}>Skill Gap Engine</button></li>
              <li><button type="button" onClick={() => setCurrentPage('simulator')}>Personalized Study Plans</button></li>
              <li><button type="button" onClick={() => setCurrentPage('simulator')}>Adaptive Technical Quizzes</button></li>
              <li><button type="button" onClick={() => setCurrentPage('simulator')}>Live MCP Tool Tracing</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Security & Trust</h4>
            <div className="trust-card">
              <div className="trust-icon"><ShieldCheck size={16} /></div>
              <p className="trust-text">
                Candidate resumes and job data are processed strictly in private isolated session memory and verified PostgreSQL storage.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="copyright-text">
            Â© 2026 CareerPilot AI Team â€¢ Built with React 19, TypeScript, PostgreSQL, and Alexa+ Architecture.
          </p>
          <div className="footer-meta-tags">
            <span className="status-indicator">
              <span className="status-dot green" />
              All Systems Operational (v0.1.0)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
