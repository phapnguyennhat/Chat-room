import { findUser } from "@/API/user/queryClient";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfinityUser = (keyword: string) => {
    return useInfiniteQuery({
        
        queryKey: ['users', keyword],
        queryFn: ({ pageParam }) =>
            findUser({ pageParam, limit: 10, keyword }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });
}

