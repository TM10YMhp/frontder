"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function HomePageClient(props: { challenges: Challenge[] }) {
  const { challenges: initialState } = props;
  const [challenges, setChallenges] = useState<Challenge[]>(initialState);

  const router = useRouter();

  useEffect(() => {
    const DECISION_THRESHOLD = 170;

    let isAnimating = false;
    let pullDeltaX = 0; // distance from the card being dragged

    function startDrag(event: MouseEvent | TouchEvent) {
      if (isAnimating) return;

      // get the first article element
      if (!(event.target instanceof Element)) return;
      const actualCard = event.target.closest<HTMLDivElement>("#card");
      if (!actualCard) return;

      // get initial position of mouse or finger
      const startX =
        event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;

      // listen the mouse and touch movements
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onEnd);

      document.addEventListener("touchmove", onMove, { passive: true });
      document.addEventListener("touchend", onEnd, { passive: true });

      function onMove(event: MouseEvent | TouchEvent) {
        if (!actualCard) return;

        // current position of mouse or finger
        const currentX =
          event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;

        pullDeltaX = currentX - startX;
        if (pullDeltaX === 0) return;

        isAnimating = true;

        const deg = pullDeltaX / 15;
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = "grabbing";

        // change opacity of the choice info
        const isRight = pullDeltaX > 0;
        const choiceEl: HTMLElement | null = isRight
          ? actualCard.querySelector(".choice.like")
          : actualCard.querySelector(".choice.nope");
        if (!choiceEl) return;

        const opacity = Math.abs(pullDeltaX) / 150;
        choiceEl.style.opacity = String(opacity);
      }

      function onEnd() {
        if (!actualCard) return;

        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onEnd);

        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);

        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;
        if (decisionMade) {
          const goRight = pullDeltaX >= 0;

          actualCard.style.transition = "transform 0.3s ease, rotate 0.3s ease";
          actualCard.style.transform = goRight
            ? "translateX(150%) rotate(30deg)" // go-right
            : "translateX(-150%) rotate(-30deg)"; // go-left
          actualCard.addEventListener(
            "transitionend",
            () => actualCard.remove(),
            { once: true },
          );
        } else {
          // reset position
          actualCard.style.transition = "transform 0.3s ease";
          actualCard.style.transform = "translateX(0)";

          // reset the choice info opacity
          actualCard
            .querySelectorAll<HTMLElement>(".choice")
            .forEach((x) => (x.style.opacity = "0"));
        }

        // reset variables
        actualCard.addEventListener(
          "transitionend",
          () => {
            actualCard.removeAttribute("style");
            pullDeltaX = 0;
            isAnimating = false;
          },
          { once: true },
        );
      }
    }

    document.addEventListener("mousedown", startDrag);
    document.addEventListener("touchstart", startDrag, { passive: true });

    return () => {
      document.removeEventListener("mousedown", startDrag);
      document.removeEventListener("touchstart", startDrag);
    };
  }, []);

  function handleDislike() {
    setChallenges((challenges) => challenges.slice(1));
  }

  async function handleLike() {
    await fetch("http://localhost:3000/api/like", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ challenge }),
    });

    setChallenges((x) => x.slice(1));
  }

  async function handleReset() {
    await fetch("http://localhost:3000/api/like", { method: "DELETE" });
    setChallenges(initialState);
  }

  function handleShowLiked() {
    router.push("/liked");
  }

  const [challenge] = challenges;
  return (
    <div className="flex flex-col gap-4 items-center select-none touch-none overflow-hidden">
      <div
        className="bg-gray-900 rounded p-4 max-w-xs flex flex-col gap-4 relative cursor-grab"
        id="card"
      >
        <img
          alt={challenge.title}
          src={challenge.heroImage}
          draggable={false}
        />
        <h3 className="text-xl font-medium">{challenge.title}</h3>
        <p className="line-clamp-3 text-white/80">{challenge.description}</p>
        <div className="choice nope opacity-0 absolute top-4 text-red-600 text-5xl right-5">
          <i className="nf nf-cod-error" />
        </div>
        <div className="choice like opacity-0 absolute top-4 text-green-500 text-5xl left-5">
          <i className="nf nf-fa-circle_check" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="rounded bg-red-600 p-2" onClick={handleDislike}>
          <i className="nf nf-cod-error text-xl" /> No me gusta
        </button>
        <button className="rounded bg-green-600 p-2" onClick={handleLike}>
          <i className="nf nf-fa-circle_check text-xl" /> Me gusta
        </button>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="rounded bg-gray-800 p-2" onClick={handleReset}>
          Volver a empezar
        </button>
        <button className="rounded bg-gray-800 p-2" onClick={handleShowLiked}>
          Ver seleccion
        </button>
      </div>
    </div>
  );
}
