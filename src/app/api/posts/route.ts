import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subthreadit: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      (sub) => sub.subthreadit.id
    );
  }

  try {
    const { limit, page, subthreaditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subthreaditName: z.string().nullish().optional(),
      })
      .parse({
        subthreaditName: url.searchParams.get("subthreaditName"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let whereClause = {};

    if (subthreaditName) {
      whereClause = {
        subthreadit: {
          name: subthreaditName,
        },
      };
    } else if (session) {
      whereClause = {
        subthreadit: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }

    let posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subthreadit: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    });
    if (posts.length > 0) {
      return new Response(JSON.stringify(posts));
    } else {
      let whereClause = {}
      if (subthreaditName) {
        whereClause = {
          subthreadit: {
            name: subthreaditName,
          },
        };
      }
      posts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
        orderBy: {
          createdAt: "desc",
        },
        include: {
          subthreadit: true,
          votes: true,
          author: true,
          comments: true,
        },
        where: whereClause,
      });
      return new Response(JSON.stringify(posts));
    }
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
