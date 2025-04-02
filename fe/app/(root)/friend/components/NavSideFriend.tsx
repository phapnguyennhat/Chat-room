'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { LuUserRoundSearch } from 'react-icons/lu';
import { PiUserList } from 'react-icons/pi';

interface IProps {
	visibleNavFriend: boolean;
	setVisibleNavFriend: any
}
export default function NavSideFriend({ visibleNavFriend, setVisibleNavFriend }: IProps) {
	const pathname = usePathname();

	useEffect(() => {
		setVisibleNavFriend(false)
	},[pathname])

	return (
		<aside
			className={`fixed left-0 top-0 bottom-0 bg-slate-100 min-w-3xs flex flex-col py-4 shadow-lg 
			transition-transform duration-300 ease-in-out
			${visibleNavFriend ? 'translate-x-[80px]' : '-translate-x-full'}`}
		>
			<Link
				href={'/friend/list'}
				className=" flex items-center gap-3 py-2 px-3 hover:bg-slate-200 "
			>
				<PiUserList size={30} />
				<span className=" text-lg">Friends list</span>
			</Link>
			<Link
				className=" flex items-center gap-3 p-2 py-3 hover:bg-slate-200"
				href={'/friend/request'}
			>
				<AiOutlineUserAdd size={30} />
				<span className=" text-lg">Friend requests</span>
			</Link>
			<Link
				className=" flex items-center gap-3 py-2 px-3 hover:bg-slate-200"
				href={'/friend/search'}
			>
				<LuUserRoundSearch size={30} />
				<span className=" text-lg">Search Friends</span>
			</Link>
		</aside>
	);
}
