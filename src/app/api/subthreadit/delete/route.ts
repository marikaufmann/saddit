import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeleteSubthreaditValidator } from "@/lib/validators/subthreadit";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });
    const body = await req.json();
    const { name } = DeleteSubthreaditValidator.parse(body);

    await db.subthreadit.delete({
      where: {
        name,
      },
    });

    return new Response("OK");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 400 });
    }

    return new Response("Could not delete a subthreadit. Please try later", {
      status: 500,
    });
  }
}
