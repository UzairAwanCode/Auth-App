import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
const Dashboard = async () => {
    const session = await getServerSession();
    console.log(session);

    if (!session) {
        redirect('/login')
    }
    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-24'>
            Dashboard
        </div>
    )
}

export default Dashboard
