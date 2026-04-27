import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';

const ThankYouPage = () => {
  return (
    <div style={styles.page}>
      
      {/* Soft Background Glow */}
      <div style={styles.glow}></div>

      <div style={styles.card}>
        
        {/* Icon */}
        <div style={styles.iconWrapper}>
          <CheckCircle size={64} color="#22c55e" />
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>
          Interview <span style={styles.highlight}>Completed</span>
        </h1>

        {/* Description */}
        <p style={styles.description}>
          Thank you for completing your interview. Your responses have been 
          successfully recorded and are now being processed by our AI system.
        </p>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Info Section */}
        <div style={styles.infoBox}>
          <div style={styles.infoContent}>
            <Mail size={22} color="#2563eb" style={{ marginTop: 3 }} />
            <div>
              <p style={styles.infoTitle}>What happens next?</p>
              <p style={styles.infoText}>
                Our system is generating a detailed evaluation report. The hiring 
                team will review your profile and contact you via your registered 
                email within a few business days.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          Powered by <span style={styles.brand}>InductAI</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },

  glow: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(37, 99, 235, 0.08)",
    filter: "blur(120px)",
    borderRadius: "50%",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "50px 40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  },

  iconWrapper: {
    marginBottom: "25px",
    display: "flex",
    justifyContent: "center",
  },

  heading: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  },

  highlight: {
    color: "#2563eb",
  },

  description: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: "1.6",
    marginBottom: "30px",
    maxWidth: "480px",
    marginInline: "auto",
  },

  divider: {
    height: "1px",
    width: "100%",
    background: "#e2e8f0",
    marginBottom: "30px",
  },

  infoBox: {
    background: "#f1f5f9",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
  },

  infoContent: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },

  infoTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "4px",
  },

  infoText: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.5",
  },

  footer: {
    marginTop: "35px",
    fontSize: "12px",
    color: "#94a3b8",
    letterSpacing: "0.08em",
  },

  brand: {
    color: "#2563eb",
    fontWeight: "500",
  },
};

export default ThankYouPage;