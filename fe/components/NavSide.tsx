'use client';
import { logout } from '@/API/auth/action';
import { getProfile } from '@/API/user/query';
import NavSideFriend from '@/app/(root)/friend/components/NavSideFriend';
import { NOT_FOUND_AVATAR } from '@/common/constant';
import { setSpinner } from '@/lib/features/spinner/spinnerSlice';
import { LogOut, MessageSquareText } from 'lucide-react';
import { NotebookTabs } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

interface IProps {
	user: User;
}
export default function NavSide({ user }: IProps) {
	const pathname = usePathname();
    const dispatch = useDispatch();

    const [visibleNavFriend, setVisibleNavFriend] = useState(false)
    

    

	const handleLogout = async () => {
		try {
			dispatch(setSpinner(true));
			await logout();
			dispatch(setSpinner(false));
		} catch (error) {
			dispatch(setSpinner(false));
		}
	};
	return (
		<>
			<aside className=" fixed  z-10 top-0 bottom-0 bg-slate-900 flex justify-between flex-col px-2 py-4 ">
				<div className=" flex flex-col gap-y-4">
					<Link
						href={'/profile'}
						className={` rounded-lg p-3 ${
							pathname.startsWith('/profile') && 'bg-slate-600'
						}`}
					>
						<Image
							src={user.avatar?.url || NOT_FOUND_AVATAR}
							width={100}
							height={100}
							alt={user.name}
							className=" size-[40px] rounded-full"
						/>
					</Link>

					<Link
						href={'/message'}
						className={` rounded-lg p-3 text-white ${
							pathname.startsWith('/message') && 'bg-slate-600'
						} `}
					>
						<MessageSquareText size={40} />
					</Link>

                    <button
                        onClick={()=>setVisibleNavFriend(prev=>!prev)}
						
						className={` rounded-lg p-3 text-white ${
							pathname.startsWith('/friend') && 'bg-slate-600'
						} `}
					>
						<NotebookTabs size={40} />
					</button>
				</div>
				<button className=" p-3">
					<LogOut onClick={handleLogout} color="red" size={40} />
				</button>
            </aside>
            <NavSideFriend  visibleNavFriend={visibleNavFriend} setVisibleNavFriend={setVisibleNavFriend} />
		</>
	);
}
