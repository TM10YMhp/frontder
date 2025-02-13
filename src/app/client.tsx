"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { startDrag } from "./_lib/draggable";

/* eslint-disable @next/next/no-img-element */
export default function HomePageClient({ data }: { data: Challenge[] }) {
  const initialChallenges = data.toReversed();
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  const router = useRouter();

  useEffect(() => {
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

  async function handleReset() {
    await fetch("http://localhost:3000/api/like", { method: "DELETE" });
    setChallenges(initialChallenges);
  }

  function handleShowLiked() {
    router.push("/liked");
  }

  async function handleLike() {
    await fetch("http://localhost:3000/api/like", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ challenge: challenges[0] }),
    });

    setChallenges((x) => x.slice(1));
  }
  return (
    <div className="flex flex-col gap-4 items-center select-none touch-none overflow-hidden">
      <div className="relative w-80 h-96">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="absolute bg-gray-900 h-full rounded p-4 flex flex-col gap-4 cursor-grab"
            role="card"
          >
            <img
              alt={challenge.title}
              src={challenge.heroImage}
              draggable={false}
            />
            <h3 className="text-xl font-medium">{challenge.title}</h3>
            <p className="line-clamp-3 text-white/80">
              {challenge.description}
            </p>
          </div>
        ))}
        <div className="text-base flex flex-col justify-center h-full border rounded-lg border-gray-600 p-4">
          <p>Esos fueron todos los proyectos...</p>
          <p>
            Haz click{" "}
            <Link className="underline" href={"/liked"}>
              aqui
            </Link>{" "}
            para ver tus elecciones
          </p>
          <br />
          <p>
            Encuentra más proyectos en{" "}
            <a
              className="underline mt-2"
              target="_blank"
              rel="noopener noreferrer"
              href={"https://frontendmentor.io/challenges"}
            >
              Frontend Mentor
            </a>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <button className="rounded bg-red-600 p-2" onClick={handleDislike}>
          <i className="nf nf-cod-error text-xl" /> No me gusta
        </button>
        <button className="rounded bg-green-600 p-2" onClick={handleLike}>
          <i className="nf nf-fa-circle_check text-xl" /> Me gusta
        </button>
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
