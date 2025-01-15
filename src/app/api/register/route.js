import User from '@/models/User.js'
import connect from '@/utils/db.js'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export const POST = async (request) => {
    const { email, password } = await request.json()
    await connect()

    // check email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return new NextResponse({
            status: 400,
            body: "User already exists"
        })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 5)

    // create user
    const user = new User({ email, password: hashedPassword })
    try {
        await user.save()
        return new NextResponse("User created successfully", {
            status: 200,
        })
    }
    catch (err) {
        return new NextResponse(err, {
            status: 500,
        })
    }
}