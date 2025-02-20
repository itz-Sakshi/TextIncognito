import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // is User accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User not accepting messages",
        },
        {
          status: 401,
        }
      );
    }

    const newMessage: Message = { content, createdAt: new Date() } as Message;
    user.messages.push(newMessage);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to send message.", error);
        return Response.json({
            success: false,
            message: "Failed to send message"
        },{
            status: 500
        })
  }
}
