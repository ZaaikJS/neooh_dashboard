import { NextResponse } from 'next/server';
import connectToDatabase from '@/config/mongo';
import User from '@/models/group';

export async function GET(request: any) {
    await connectToDatabase();

    /*
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const email = searchParams.get("email");

    if (!provider || !email) {
        return NextResponse.json({ error: "PROVIDER_AND_EMAIL_REQUIRED" }, { status: 400 });
    }

    try {
        const existingPlayer = await User.findOne({
            "provider": provider,
            "email": email
        });

        if (existingPlayer) {
            return NextResponse.json({ exists: true, message: "USER_EXISTS" }, { status: 200 });
        } else {
            return NextResponse.json({ exists: false, message: "USER_NOT_FOUND" }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
        */

    return NextResponse.json(
        {
            success: true,
            server: { connected: true }
        },
        { status: 200 }
    );
}
