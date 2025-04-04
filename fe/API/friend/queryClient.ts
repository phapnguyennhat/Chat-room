import { fetcher } from "@/lib/utils";

import { isErrorResponse } from "@/lib/utils";

export async function getMyFriend (pageParam: number, limit:number,keyword:string,collection:string) {
    const searchParams = new URLSearchParams({
        page: pageParam,
        limit,
        keyword,
        collection,
    } as any);
    const response = await fetcher<{
        data: FriendItem[];
        currentPage: number;
        nextPage: number;
        count: number;
    }>(`user/friend?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
    });
    if (isErrorResponse(response)) {
        return { data: [], currentPage: 1, nextPage: 1, count: 0 };
    }
    return response;
}


export const getFriendRequest =async (pageParam: number, limit: number, collection: string) => {
    const searchParams = new URLSearchParams({
        page: pageParam,
        limit,
        collection,
    } as any);
    const response = await fetcher<{
        data: FriendRequest[];
        currentPage: number;
        nextPage: number;
        count: number;
    }>(`user/friend/request?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
    });
    if (isErrorResponse(response)) {
        return { data: [], currentPage: 1, nextPage: 1, count: 0 };
    }   
    return response;
}

