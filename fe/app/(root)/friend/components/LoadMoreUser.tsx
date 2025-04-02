'use client';
import { fetcher, isErrorResponse } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CardUser from './CardUser';

const findUser = async (query: QueryUser) => {
	const searchParams = new URLSearchParams(query as any);
	const response = await fetcher<{ users: User[]; count: number }>(
		`user?${searchParams.toString()}`,
		{
			method: 'GET',
			credentials: 'include',
			cache: 'no-cache',
		},
	);

	if (isErrorResponse(response)) {
		return { users: [], count: 0 };
	}

	return response;
};

let page = 1;

export default function LoadMoreUser() {
	const { ref, inView } = useInView();
	const [users, setUsers] = useState<User[]>([]);
	const searchParams = useSearchParams();
	const keyword = (searchParams.get('keyword') as string) || '';
	const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(-1);
    
    useEffect(() => {
        page=1
    },[])

    useEffect(() => {
        if (isLoading) {
            return
        }
		if (use.length === count) {
			return;
        } else if (inView) {
            const timeOutId = setTimeout(async () => {
                setIsLoading(true)
				const response = await findUser({ page, limit: 10, keyword });
				setUsers([...users, ...response.users]);
				setCount(response.count);
                page++;
                setIsLoading(false)
			}, 500);

			return () => clearTimeout(timeOutId);
		}
	}, [inView, users, isLoading, count]);

	return (
		<div className=" ">
			<ul className=" gap-4 w-full grid grid-cols-4">
				{users.map((user, index) => (
					<li key={index}>
						<CardUser user={user} />
					</li>
				))}
			</ul>
			{users.length === count ? (
				<p className=' mt-3 text-gray-500 text-lg text-center' >End of list</p>
			) : (
				<Loader2 ref={ref} className=" mt-3 animate-spin mx-auto size-[50px]" />
			)}
		</div>
	);
}
