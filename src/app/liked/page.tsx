import { cookies } from "next/headers";
import Link from "next/link";

async function getLiked() {
  // https://stackoverflow.com/questions/76309154/next-js-typeerror-failed-to-parse-url-from-when-targeting-api-route-relati
  const cookieStore = await cookies();
  const data = cookieStore.get("liked")?.value ?? "[]";
  const liked = JSON.parse(data);
  return liked;
}

/* eslint-disable @next/next/no-img-element */
export default async function LikedPage() {
  const liked: MinimalChallenge[] = await getLiked();

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/" className="underline">
        {"<"} Regresar
      </Link>

      <ul className="flex flex-col gap-2 max-w-2xl">
        {liked.map((challenge) => (
          <li key={challenge.id} className="flex items-center gap-4">
            <img alt={challenge.title} src={challenge.heroImage} width={120} />
            <div className="flex flex-col justify-between">
              <p>{challenge.title}</p>
              <p className="line-clamp-1 text-white/80">
                {challenge.description}
              </p>
              <a
                className="underline mt-2"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://frontendmentor.io/challenges/${challenge.slug}`}
              >
                Ver challenge
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
