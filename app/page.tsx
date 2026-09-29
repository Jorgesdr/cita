"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [saidYes, setSaidYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ top: 0, left: 0 });
  const arenaRef = useRef<HTMLDivElement | null>(null);

  // Mensajes cachondos que va soltando el botón "No" cuando le intentas pulsar
  const noMessages = [
    "No",
    "¿Segura?",
    "¿De verdad?",
    "Piénsalo mejor...",
    "¡Pero si mola!",
    "¡Ánimo!",
    "¿En serio?",
    "¡Imposible!",
    "Ni de broma",
    "¡Buena suerte!",
    "Sigue soñando",
    "¡No insistas!",
  ];

  // Mueve el botón "No" a una posición aleatoria dentro del contenedor
  const moveNoButton = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const arenaRect = arena.getBoundingClientRect();
    // Tamaño estimado del botón (se va encogiendo, ver CSS)
    const btnWidth = 140 - Math.min(noCount, 12) * 6;
    const btnHeight = 56 - Math.min(noCount, 6) * 4;

    const maxLeft = Math.max(0, arenaRect.width - btnWidth);
    const maxTop = Math.max(0, arenaRect.height - btnHeight);

    let newLeft = Math.random() * maxLeft;
    let newTop = Math.random() * maxTop;

    // Que no quede demasiado cerca de donde estaba (mejor experiencia)
    const minDistance = 80;
    let tries = 0;
    while (
      tries < 8 &&
      Math.abs(newLeft - noPos.left) < minDistance &&
      Math.abs(newTop - noPos.top) < minDistance
    ) {
      newLeft = Math.random() * maxLeft;
      newTop = Math.random() * maxTop;
      tries++;
    }

    setNoPos({ top: newTop, left: newLeft });
    setNoCount((c) => c + 1);
  }, [noCount, noPos]);

  const handleNoInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Evitar que el click real se dispare si por algún casual coincide
      e.preventDefault();
      moveNoButton();
    },
    [moveNoButton]
  );

  if (saidYes) {
    return (
      <main className={styles.main}>
        <div className={styles.backgroundOverlay} />
        <section className={styles.successCard}>
          <div className={styles.hearts}>
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={styles.heart}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${1 + Math.random() * 1.8}rem`,
                }}
              >
                ❤️
              </span>
            ))}
          </div>
          <h1 className={styles.successTitle}>¡Sabía que dirías que sí! 💕</h1>
          <p className={styles.successText}>
            Esto promete. Prepara el outfit, que vamos a pasarlo genial.
          </p>
          <p className={styles.successSubtext}>
            P.D.: El botón &quot;No&quot; lo intentó {noCount} veces.
            Persistente, ¿eh? 😏
          </p>
        </section>
      </main>
    );
  }

  const currentNoText = noMessages[Math.min(noCount, noMessages.length - 1)];

  return (
    <main className={styles.main}>
      <div className={styles.backgroundOverlay} />
      <section className={styles.card}>
        <h1 className={styles.title}>¿Quieres una cita conmigo?</h1>
        <p className={styles.subtitle}>Prometo no ser aburrido/a 🌅</p>

        <div ref={arenaRef} className={styles.buttonsArena}>
          <button
            className={styles.yesButton}
            onClick={() => setSaidYes(true)}
            aria-label="Sí, quiero una cita"
          >
            Sí 💖
          </button>

          <button
            className={styles.noButton}
            style={{
              top: `${noPos.top}px`,
              left: `${noPos.left}px`,
              // El botón se va encogiendo con cada intento
              transform: `scale(${Math.max(0.55, 1 - noCount * 0.04)})`,
            }}
            onMouseEnter={moveNoButton}
            onTouchStart={handleNoInteraction}
            onClick={handleNoInteraction}
            aria-label={`No (intento ${noCount + 1})`}
          >
            {currentNoText}
          </button>
        </div>

        {noCount > 0 && (
          <p className={styles.counter}>
            {noCount === 1
              ? "El 'No' ya se está escapando…"
              : `El 'No' lleva ${noCount} intentos de huir 🤭`}
          </p>
        )}
      </section>
    </main>
  );
}