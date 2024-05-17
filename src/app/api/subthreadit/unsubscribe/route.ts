import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubthreaditSubscriptionValidator } from "@/lib/validators/subthreadit";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subthreaditId } = SubthreaditSubscriptionValidator.parse(body);
    const subthreaditExists = await db.subthreadit.findFirst({
      where: {
        id: subthreaditId,
      },
    });
    if (!subthreaditExists) {
      return new Response("Subthreadit does not exist", { status: 400 });
    }
    const subscriptionExsists = await db.subscription.findFirst({
      where: {
        subthreaditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExsists) {
      return new Response("You're not a member of this subthreadit, yet.", {
        status: 400,
      });
    }
    await db.subscription.delete({
      where: {
        userId_subthreaditId: {
          subthreaditId,
          userId: session.user.id,
        },
      },
    });
    return new Response(subthreaditId);
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(err.message, { status: 400 });
    }
    return new Response(
      "Could not unsubscribe at this time. Please try again later.",
      { status: 500 }
    );
  }
}
