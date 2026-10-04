import { fill } from "./config";
import { CONFIG } from "./config";

export function PromisesWall() {
  return (
    <section className="promises-wall-section">
      <div className="container">
        <h2>{CONFIG.promisesWall.title}</h2>
        <p className="subtitle">{CONFIG.promisesWall.subtitle}</p>

        <div className="promises-container">
          <div className="promises-column from-you">
            <h3>From {CONFIG.yourName}</h3>
            <div className="promises-list">
              {CONFIG.promisesWall.fromYou.map((promise, idx) => (
                <div key={idx} className="promise-card">
                  <p>{promise}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="promises-column from-her">
            <h3>From {CONFIG.herName}</h3>
            <div className="promises-list">
              {CONFIG.promisesWall.fromHer.map((promise, idx) => (
                <div key={idx} className="promise-card">
                  <p>{promise}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
