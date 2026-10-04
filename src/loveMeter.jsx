import { CONFIG } from "./config";
import { useEffect, useState } from "react";

export function LoveMeter() {
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat((prev) => !prev);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="love-meter-section">
      <div className="container">
        <h2>{CONFIG.loveMeter.title}</h2>
        <p className="subtitle">{CONFIG.loveMeter.subtitle}</p>

        <div className="love-meter-container">
          <div className={`heartbeat ${heartbeat ? "beat" : ""}`}>
            ❤️
          </div>

          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{ width: `${CONFIG.loveMeter.percentage}%` }}
            ></div>
          </div>

          <p className="meter-percentage">{CONFIG.loveMeter.percentage}% Love</p>
          <p className="meter-description">{CONFIG.loveMeter.description}</p>
        </div>
      </div>
    </section>
  );
}
