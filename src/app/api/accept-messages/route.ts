import {getServerSession} from "next-auth"
import {authOptions } from "../auth/[...nextauth]/options"

import dbConnect from "@/lib/dbConnect"

import UserModel from "@/model/User"

import {User} from "next-auth"


export async function POST(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }
    const userId = user._id;

    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage: acceptMessages}, {new: true})
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user's choice to accept messages."
            },{
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status changed successfully.", 
            updatedUser
        },{
            status: 200
        })
    } catch (error) {
        console.log("Failed to update user's choice to accept messages.", error);
        return Response.json({
            success: false,
            message: "Failed to update user's choice to accept messages"
        },{
            status: 500
        })
    }
    
}

export async function GET(){
    // Connect the database
    await dbConnect(); 

    // Find the current user from session 
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }
    const userId = user._id;

    try {
        const currentUser = await UserModel.findById(userId)
        if(!currentUser){
            return Response.json({
                success: false,
                message: "User not found."
            },{
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "User's message acceptance status found successfully.", 
            isAcceptingMessage: currentUser.isAcceptingMessage
        },{
            status: 200
        })
    } catch (error) {
        console.log("Failed to find user's choice to accept messages.", error);
        return Response.json({
            success: false,
            message: "Failed to find user's choice to accept messages"
        },{
            status: 500
        })
    }


}