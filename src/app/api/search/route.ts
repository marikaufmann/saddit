import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const q = url.searchParams.get("q");
  console.log(q);

  if (!q) return new Response("Invalid query", { status: 400 });
  const results = await db.subsaddit.findMany({
    where: {
      name: {
        startsWith: q,
        mode: "insensitive",
      },
    },
  });
  return new Response(JSON.stringify(results));
}
