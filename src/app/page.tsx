import { load } from "cheerio";
import HomePageClient from "./client";

// async function getChallenges() {
//   type NextData = {
//     props: {
//       initialState: {
//         challenges: {
//           entities: Record<string, Challenge>;
//         };
//       };
//     };
//   };
//
//   const html = await fetch("https://www.frontendmentor.io/challenges").then(
//     (res) => res.text(),
//   );
//   const $ = load(html);
//   const nextData: NextData = JSON.parse($("#__NEXT_DATA__").html()!);
//
//   return Object.values(nextData.props.initialState.challenges.entities);
// }

async function getChallengesV2() {
  type NextData = {
    props: {
      pageProps: {
        challenges: Challenge[];
      };
    };
  };

  const res = await fetch("https://www.frontendmentor.io/challenges");
  const $ = load(await res.text());
  const data: NextData = JSON.parse($("#__NEXT_DATA__").text()!);
  return data.props.pageProps.challenges.slice(0, 10);
}

/* eslint-disable @next/next/no-img-element */
export default async function Home() {
  const challenges = await getChallengesV2();

  return (
    <main>
      <HomePageClient data={challenges} />

      <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {challenges.map((challenge) => (
          <li key={challenge.id} className="bg-gray-900 rounded p-4">
            <div className="flex flex-col gap-4">
              <img alt={challenge.title} src={challenge.heroImage} />
              <div className="flex flex-col">
                <h3 className="text-xl font-medium">{challenge.title}</h3>
                <p className="line-clamp-3 text-white/80">
                  {challenge.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
