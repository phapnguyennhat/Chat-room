
import { createFriendRequest, cancelRequeset, actionRequest, removeFriend } from "@/API/friend/action";
import { getFriendRequest, getMyFriend } from "@/API/friend/queryClient";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useInfinityGetMyFriend = ( collection: string, keyword: string) => {
    return useInfiniteQuery({
        queryKey: ['friend-list', collection, keyword],
        queryFn: ({ pageParam }) => getMyFriend(pageParam, 10, keyword, collection),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })
}

export const useInfinityGetFriendRequest = (collection: string) => {
    return useInfiniteQuery({
        queryKey: ['friend-request', collection],
        queryFn: ({ pageParam }) => getFriendRequest(pageParam, 10, collection),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })
}



export const useCreateFriendRequest = (receiverId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => createFriendRequest(receiverId),
        onSuccess:  () => {
              queryClient.invalidateQueries({ queryKey: ['friend-request'] })
             queryClient.invalidateQueries({ queryKey: ['users'] })
        }
    })  
}

export const useCancelFriendRequest = (receiverId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => cancelRequeset(receiverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friend-request'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }

    })
}




export const useRemoveFriend = (friendId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => removeFriend(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friend-list'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        }

    })
}
