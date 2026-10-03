import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   HEARTS
========================================================= */

const HeartsContext = createContext(null);

export function HeartsProvider({ children }) {
  const heart = useCallback(() => {
    const el = document.createElement("div");

    el.className = "floating-heart";
    el.textContent = Math.random() > 0.5 ? "❤" : "♡";

    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${14 + Math.random() * 18}px`;
    el.style.animationDuration = `${4 + Math.random() * 3}s`;

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 7000);
  }, []);

  const burst = useCallback(
    (count = 15) => {
      for (let i = 0; i < count; i++) {
        setTimeout(heart, i * 35);
      }
    },
    [heart]
  );

  const value = useMemo(
    () => ({
      heart,
      burst,
    }),
    [heart, burst]
  );

  return (
    <HeartsContext.Provider value={value}>
      {children}
    </HeartsContext.Provider>
  );
}

export function useHearts() {
  return useContext(HeartsContext);
}

/* =========================================================
   TOAST
========================================================= */

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");

  const toast = useCallback((text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/* =========================================================
   LOCAL STORAGE
========================================================= */

export function useStored(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(`anniversary-${key}`);

      return saved !== null
        ? JSON.parse(saved)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        `anniversary-${key}`,
        JSON.stringify(value)
      );
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

/* =========================================================
   REVEAL ANIMATION
========================================================= */

export function Reveal({
  children,
  className = "",
  as = "div",
  ...props
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref}
      {...props}
      className={`reveal ${visible ? "show" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}