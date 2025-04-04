'use client';

import { fetcher, isErrorResponse } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import CardUser from './CardUser';
import { Loader2 } from 'lucide-react';
import { findUser } from '@/API/user/queryClient';
import { useInfinityUser } from '@/hook/user';


export default function InfinityUser() {
	const { ref, inView } = useInView();
	const searchParams = useSearchParams();
	const keyword = (searchParams.get('keyword') as string) || '';

	
	const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfinityUser(keyword)

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [fetchNextPage, inView, hasNextPage]);

	return (
		<div>
			<ul className='  gap-4 w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{data?.pages.map((page) => {
					return page.data.map((user, index) => (
						<li key={index}>
							<CardUser user={user} />
						</li>
					));
				})}
			</ul>

			<div ref={ref} className=" flex justify-center mt-3">
				{status === 'pending' || isFetchingNextPage ? (
					<Loader2 className=" size-[50px] animate-spin " />
				) : (
					<p className=" mt-3 text-gray-500 text-lg ">End of list</p>
				)}
			</div>
		</div>
	);
}
