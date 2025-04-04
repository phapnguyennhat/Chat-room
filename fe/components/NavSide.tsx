'use client';
import { logout } from '@/API/auth/action';
import { getProfile } from '@/API/user/query';
import NavSideFriend from '@/components/NavSideFriend';
import { NOT_FOUND_AVATAR } from '@/common/constant';
import { setSpinner } from '@/lib/features/spinner/spinnerSlice';
import { LogOut, MessageSquareText, Bell } from 'lucide-react';
import { NotebookTabs } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '@/provider/SocketProvider';
import { toast } from 'sonner';
import NotifyFriendRequest from './NotifyFriendRequest';
import { useQueryClient } from '@tanstack/react-query';

interface IProps {
	user: User;
}
export default function NavSide({ user }: IProps) {
	const pathname = usePathname();
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const keyword = (searchParams.get('keyword') as string) || '';

	const socket = useSocket();

	const queryClient = useQueryClient()

	const handleReceiveActionUser = (message: { action: 'accept_request' | 'reject_request' | 'remove_friend' | 'cancel_request' | 'create_request', sender: User }) => {
		

		if(message.action === 'accept_request'){
			toast.info(<NotifyFriendRequest message="has accepted your friend request" user={message.sender} />, {position: 'top-right'})
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			queryClient.invalidateQueries({ queryKey: ['friend-list'] })
		} else if (message.action === 'reject_request') {
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			
		} else if (message.action === 'remove_friend') {
			queryClient.invalidateQueries({ queryKey: ['friend-list'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			
		} else if (message.action === 'cancel_request') {
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })

			
		} else if (message.action === 'create_request') {
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			toast.info(<NotifyFriendRequest message="has sent a friend request" user={message.sender} />, {position: 'top-right'})
		}
	}

	useEffect(() => {
		if (!socket) return;


		socket.on('receive_action_user', handleReceiveActionUser);
		

		// Cleanup function: Gỡ bỏ sự kiện khi component unmount hoặc socket thay đổi
		return () => {
			socket.off('receive_action_user', handleReceiveActionUser);
			
		};
	}, [socket]);

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
						className={` hover:bg-slate-600 rounded-lg p-3 ${
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
						className={` hover:bg-slate-600 rounded-lg p-3 text-white ${
							pathname.startsWith('/message') && 'bg-slate-600'
						} `}
					>
						<MessageSquareText size={40} />
					</Link>

					<Link
						href={'/friend/list'}
						className={` hover:bg-slate-600 rounded-lg p-3  text-white ${
							pathname.startsWith('/friend') && 'bg-slate-600'
						} `}
					>
						<NotebookTabs size={40} />
					</Link>
				</div>
				<button className=" p-3">
					<LogOut onClick={handleLogout} color="red" size={40} />
				</button>
			</aside>
			<NavSideFriend
				
				visible={pathname.startsWith('/friend')}
			/>
		</>
	);
}
