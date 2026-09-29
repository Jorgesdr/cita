"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [saidYes, setSaidYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  // Posición del "No" como % del contenedor (centro del botón).
  // Inicial: 75% horizontal y 50% vertical → al lado del "Sí" (que está al 25%).
  const [noPos, setNoPos] = useState<{ left: number; top: number }>({
    left: 75,
    top: 50,
  });
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);

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

  // Mueve el botón "No" a una posición aleatoria que NUNCA se superpone con "Sí"
  const moveNoButton = useCallback(() => {
    const arena = arenaRef.current;
    const yesBtn = yesRef.current;
    if (!arena || !yesBtn) return;

    const arenaRect = arena.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    // Tamaño visual del botón "No" (se va encogiendo con cada intento)
    const nextCount = noCount + 1;
    const scale = Math.max(0.55, 1 - nextCount * 0.04);
    const noVisualW = 140 * scale;
    const noVisualH = 56 * scale;

    // Centro del botón "Sí" en coords relativas al arena
    const yesCx = yesRect.left - arenaRect.left + yesRect.width / 2;
    const yesCy = yesRect.top - arenaRect.top + yesRect.height / 2;

    // Distancia mínima entre centros para que NO se toquen (con padding)
    const padding = 28;
    const minDistX = (yesRect.width + noVisualW) / 2 + padding;
    const minDistY = (yesRect.height + noVisualH) / 2 + padding;

    // Límites del arena para que el "No" no se salga
    const minCx = noVisualW / 2 + 4;
    const maxCx = arenaRect.width - noVisualW / 2 - 4;
    const minCy = noVisualH / 2 + 4;
    const maxCy = arenaRect.height - noVisualH / 2 - 4;

    // Si el arena es tan pequeño que no hay zona libre, movemos al rincón más lejano
    if (minDistX > maxCx - minCx || minDistY > maxCy - minCy) {
      // Coloca el "No" lo más lejos posible del "Sí"
      const farCx = yesCx > arenaRect.width / 2 ? minCx : maxCx;
      const farCy = yesCy > arenaRect.height / 2 ? minCy : maxCy;
      setNoPos({
        left: (farCx / arenaRect.width) * 100,
        top: (farCy / arenaRect.height) * 100,
      });
      setNoCount((c) => c + 1);
      return;
    }

    // Genera candidatos aleatorios hasta encontrar uno FUERA de la "zona prohibida"
    let cx = minCx;
    let cy = minCy;
    let found = false;
    for (let tries = 0; tries < 80 && !found; tries++) {
      cx = minCx + Math.random() * (maxCx - minCx);
      cy = minCy + Math.random() * (maxCy - minCy);
      const dx = Math.abs(cx - yesCx);
      const dy = Math.abs(cy - yesCy);
      // No overlap si en AL MENOS un eje la distancia es >= la mitad de la suma
      if (dx >= minDistX || dy >= minDistY) {
        found = true;
      }
    }

    setNoPos({
      left: (cx / arenaRect.width) * 100,
      top: (cy / arenaRect.height) * 100,
    });
    setNoCount((c) => c + 1);
  }, [noCount]);

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
            ref={yesRef}
            className={styles.yesButton}
            onClick={() => setSaidYes(true)}
            aria-label="Sí, quiero una cita"
          >
            Sí 💖
          </button>

          <button
            className={styles.noButton}
            style={{
              // Posición en % del arena → el transform translate(-50%,-50%) lo centra ahí
              left: `${noPos.left}%`,
              top: `${noPos.top}%`,
              transform: `translate(-50%, -50%) scale(${Math.max(
                0.55,
                1 - noCount * 0.04
              )})`,
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