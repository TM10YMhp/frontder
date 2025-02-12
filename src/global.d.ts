interface Challenge {
  id: string;
  createdAt: string;
  description: string;
  difficulty: number;
  heroImage: string;
  languages: string[];
  slug: string;
  startedCount: number;
  title: string;
  type: string;
}

interface MinimalChallenge {
  id: string;
  description: string;
  heroImage: string;
  slug: string;
  title: string;
}
