// https://www.nextjet.dev/
const DECISION_THRESHOLD = 170;

let isAnimating = false;
let pullDeltaX = 0; // distance from the card being dragged

export const startDrag = (cb: (liked: boolean) => void) => {
  return (event: MouseEvent | TouchEvent) => {
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
      "opacity-0 absolute top-5 left-5 text-2xl leading-none bg-green-500 rounded-full w-fit h-fit p-2.5 nf nf-fa-check";
    actualCard.appendChild(iconLike);

    const iconNope = document.createElement("i");
    iconNope.className =
      "opacity-0 absolute top-5 right-5 text-xl leading-none bg-red-600 rounded-full w-fit h-fit p-3 nf nf-fa-close";
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

        actualCard.style.transition = "transform 0.1s ease, rotate 0.1s ease";
        actualCard.style.transform = goRight
          ? "translateX(150%) rotate(30deg)" // go-right
          : "translateX(-150%) rotate(-30deg)"; // go-left
        actualCard.addEventListener(
          "transitionend",
          () => {
            // actualCard.remove();
            cb(goRight);
          },
          { once: true },
        );
      } else {
        // reset position
        actualCard.style.transition = "transform 0.1s ease";
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
          pullDeltaX = 0;
          isAnimating = false;
        },
        { once: true },
      );
    }
  };
};
