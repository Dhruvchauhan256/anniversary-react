import { CONFIG } from "./config";

export function FutureDreams() {
  return (
    <section className="future-dreams-section">
      <div className="container">
        <h2>{CONFIG.futureDreams.title}</h2>
        <p className="subtitle">{CONFIG.futureDreams.subtitle}</p>

        <div className="dreams-grid">
          {CONFIG.futureDreams.dreams.map((dream, idx) => (
            <div key={idx} className="dream-card">
              <p>{dream}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
