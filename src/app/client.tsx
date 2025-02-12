"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function HomePageClient(props: { challenges: Challenge[] }) {
  const { challenges: initialState } = props;
  const [challenges, setChallenges] = useState<Challenge[]>(initialState);

  const router = useRouter();

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
    <div className="flex flex-col gap-4 items-center">
      <div className="bg-gray-900 rounded p-4 max-w-xs flex flex-col gap-4">
        <img alt={challenge.title} src={challenge.heroImage} />
        <h3 className="text-xl font-medium">{challenge.title}</h3>
        <p className="line-clamp-3 text-white/80">{challenge.description}</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button className="rounded bg-red-600 p-2" onClick={handleDislike}>
          No me gusta
        </button>
        <button className="rounded bg-green-600 p-2" onClick={handleLike}>
          Me gusta
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
