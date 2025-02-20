import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request: Request){
    await dbConnect();
    try {
        const{username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({
            username: decodedUsername
        })
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 500
            })
        }

        // validate with zod
        const result = verifySchema.safeParse({ code: String(code) })
        if(!result.success){
            const codeErrors = result.error.format().code?._errors || []
            return Response.json({
                success: false,
                message: codeErrors?.length > 0? codeErrors.join(", "): "Verification code is invalid"
            },{
                status: 500
            })
        }
        // console.log(result);
        const {code: validatedCodeWithZod} = result.data; // const validatedCode = result.data.code;

        const isCodeValid = user.verifyCode === validatedCodeWithZod;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            },{
                status: 200
            })
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code"
            },{
                status: 400
            })
        }
        else{
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            },{
                status: 400
            })
        }

    } catch (error) {
        console.error("Error verifying user",error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },{
            status: 500
        })
    }
}