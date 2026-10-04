import { fill, CONFIG } from "./config";
import { useState } from "react";

export function MessageFromFuture() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="message-future-section">
      <div className="container">
        <div className="letter-envelope">
          <h2>{CONFIG.messageFromFuture.title}</h2>
          <p className="subtitle">{CONFIG.messageFromFuture.subtitle}</p>

          {!isOpen ? (
            <div className="envelope-closed">
              <div className="envelope-icon">✉️</div>
              <button
                onClick={() => setIsOpen(true)}
                className="open-letter-btn"
              >
                Open Letter
              </button>
            </div>
          ) : (
            <div className="letter-content">
              <p>{fill(CONFIG.messageFromFuture.text)}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="close-letter-btn"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
