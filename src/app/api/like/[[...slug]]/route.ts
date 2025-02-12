import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  // req: NextRequest,
  // { params }: { params: { slug?: string } },
) {
  // const id = params.slug?.[0];
  // if (id) liked.push(id);
  const cookieStore = await cookies();
  const data = cookieStore.get("liked")?.value ?? "[]";
  const liked = JSON.parse(data);
  return NextResponse.json({ liked });
}

const toMinimalChallenge = (challenge: Challenge): MinimalChallenge => {
  return {
    title: challenge.title,
    heroImage: challenge.heroImage,
    id: challenge.id,
    description: challenge.description,
    slug: challenge.slug,
  };
};

export async function POST(req: Request) {
  const { challenge } = await req.json();

  const cookieStore = await cookies();
  const data = cookieStore.get("liked")?.value ?? "[]";
  const liked: MinimalChallenge[] = JSON.parse(data);
  if (challenge && !liked.some((x) => x.id === challenge.id)) {
    liked.push(toMinimalChallenge(challenge));
  }
  cookieStore.set("liked", JSON.stringify(liked));
  return NextResponse.json({ ok: true });
}

export async function DELETE(/* req: NextRequest */) {
  const cookieStore = await cookies();
  cookieStore.set("liked", "[]");
  return NextResponse.json({ ok: true });
}
