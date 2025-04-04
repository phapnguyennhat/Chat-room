'use client';
import { useInfinityGetMyFriend } from '@/hook/friend';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { LuUserRoundSearch } from 'react-icons/lu';
import { PiUserList } from 'react-icons/pi';

interface IProps {
	visible: boolean;

}
export default function NavSideFriend({
	visible,

}: IProps) {
	const pathname = usePathname();

	const { data: friendlist } = useInfinityGetMyFriend('unRead', '')

	const countUnread = friendlist?.pages[0]?.data.length || 0

	const navItems = [
		{
			href: '/friend/list',
			icon: <PiUserList size={30} />,
			title: 'Friends list',


		},
		{
			href: '/friend/request',
			icon: <AiOutlineUserAdd size={30} />,
			title: 'Friend requests',

		},
		{
			href: '/friend/search',
			icon: <LuUserRoundSearch size={30} />,
			title: 'Search Friends',
		},
	];


	return (
		<aside
			className={`${visible ? 'fixed' : 'hidden'
				} left-[80px] top-0 bottom-0 bg-slate-100 min-w-3xs flex flex-col py-4 shadow-lg 
			transition-transform duration-300 ease-in-out
			`}
		>
			{navItems.map((navItem) => (
				<Link
					key={navItem.title}
					href={navItem.href}
					className={` ${pathname.startsWith(navItem.href)
							? 'bg-blue-100 hover:bg-blue-100'
							: 'hover:bg-slate-200'
						}  flex items-center gap-3 py-2 px-3   `}
				>
					<div className=' relative'>
						{navItem.icon}
						{countUnread > 0 && navItem.href.includes('/friend/list') && <div className=' absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1'>
							{countUnread < 10 ? countUnread : '9+'}
						</div>}
					</div>
					<span className=" text-lg">{navItem.title}</span>


				</Link>
			))}
		</aside>
	);
}
