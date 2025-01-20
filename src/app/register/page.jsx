"use client"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Register() {
    const [error, setError] = useState('')
    const router = useRouter()
    const { data: session, status: sessionStatus } = useSession()

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.replace('/dashboard')
        }
    }, [sessionStatus, router])

    if (sessionStatus === 'loading') {
        return <div>Loading...</div>
    }

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value
        const password = e.target[1].value

        if (!isValidEmail(email)) {
            alert('Invalid Email')
            return
        }

        if (!password || password.length < 8) {
            alert('Password must be atleast 8 characters long')
            return
        }

        // call apu to register user
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (res.status === 400) {
                setError('User already exists')
            }

            if (res.status === 200) {
                setError('')
                router.push('/login')
            }
        } catch (error) {
            setError('Something went wrong')
            console.log(error)

        }
    }

    return (
        sessionStatus != 'authenticated' && <div className='flex min-h-screen flex-col items-center justify-between p-24'>
            <div className='bg-[#212121] p-8 rounded shadow-md w-96'>
                <h1 className='text-4xl text-center font-semibold mb-8'>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" className='w-full border border-grey-300 text-black rounded px-3 py-2 mb-4 focus:text-black' placeholder='Email' required />
                    <input type="password" className='w-full border border-grey-300 text-black rounded px-3 py-2 mb-4 focus:text-black' placeholder='Password' required />
                    <button type='submit' className='w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600'>{" "}Register</button>
                    <p className='text-red-600 texr-[16px] mb-4'>{error && error}</p>
                </form>
                <div className='text-center text-gray-500 mt-4'>- OR -</div>
                <Link className='block text-center text-blue-500 hover:underline mt-2' href='/login'>
                    Already have an account? Login
                </Link>
            </div>
        </div>
    )
}

export default Register
