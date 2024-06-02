import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Profile() {
    const {user , isLoading , error} = useAuth0();
    if(isLoading){
        return <div>...Loading</div>
    }
    if(error){
        return<div>Error</div>
    }
    return (
        <div className='w-full my-3 max-w-[1200px] m-auto'>
            <div className='w-full flex justify-center'>
                <h1 className='text-3xl text-[#FF5733] font-bold'>Welcome To Profile</h1>
            </div>
            <div className='flex space-x-5 items-center'>
                {/* photo */}
                <div className='border rounded-full overflow-hidden w-fit'>
                    <img src={user.picture} alt='userImage' />
                </div>
                {/* details */}
                <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            </div>
            {/* History */}
            <div className='w-full h-1 border bg-[#FF5733] border-[#FF5733] my-3'></div>
            <div className='p-4'>
                Working on your history.....
            </div>

        </div>
    )
}

export default Profile
