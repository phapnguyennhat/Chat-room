'use server'

import getAuthCookies from "@/lib/getAuthCookie"
import { fetcher, isErrorResponse } from "@/lib/utils"


export const removeFriend = async (friendId: string) => {
    const authCookie= await getAuthCookies()
    const response = await fetcher(`user/friend/${friendId}`, {
        method: 'DELETE',
        headers: {
            Cookie: authCookie
        }
    })
    return response
}

export const actionRequest = async ({senderId, action}: {senderId: string, action: string}) => {
    const authCookie = await getAuthCookies()
    const response = await fetcher(`user/friend/request/${senderId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: authCookie
        },
        body: JSON.stringify({action})
    })
    return response
}

export const cancelRequeset= async (receiverId: string)=>{
    const authCookie = await getAuthCookies()
    const response = await fetcher(`user/friend/request/${receiverId}`, {
        method: 'DELETE',
        headers: {
            Cookie: authCookie
        }
    })
    return response
    
}


export const createFriendRequest = async (receiverId: string) => {
    const authCookie = await getAuthCookies()
    const response = await fetcher(`user/friend/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: authCookie
        },
        body: JSON.stringify({receiverId})
    })
    return response
    
}

