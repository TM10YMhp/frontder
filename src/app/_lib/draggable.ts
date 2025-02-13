// https://www.nextjet.dev/
const DECISION_THRESHOLD = 170;

let isAnimating = false;
let pullDeltaX = 0; // distance from the card being dragged

export const startDrag = (event: MouseEvent | TouchEvent) => {
  if (isAnimating) return;

  // get the first article element
  if (!(event.target instanceof Element)) return;
  const actualCard = event.target.closest<HTMLDivElement>("[role=card]");
  if (!actualCard) return;

  // get initial position of mouse or finger
  const startX =
    event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;

  // create icons
  const iconLike = document.createElement("i");
  iconLike.className =
    "opacity-0 absolute top-5 text-green-500 text-5xl left-5 nf nf-fa-circle_check";
  actualCard.appendChild(iconLike);

  const iconNope = document.createElement("i");
  iconNope.className =
    "opacity-0 absolute top-5 text-red-600 text-5xl right-5 nf nf-cod-error";
  actualCard.appendChild(iconNope);

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
    const choiceEl = isRight ? iconLike : iconNope;
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
      actualCard.addEventListener("transitionend", () => actualCard.remove(), {
        once: true,
      });
    } else {
      // reset position
      actualCard.style.transition = "transform 0.3s ease";
      actualCard.style.transform = "translateX(0)";
      actualCard.style.cursor = "grab";

      // reset the choice info opacity
      iconLike.style.opacity = "0";
      iconNope.style.opacity = "0";
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
};
