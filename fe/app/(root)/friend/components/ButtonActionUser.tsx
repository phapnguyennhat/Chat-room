'use client';
import {
	actionRequest,
	cancelRequeset,
	createFriendRequest,
	removeFriend,
} from '@/API/friend/action';
import Button from '@/components/button';

import { isErrorResponse } from '@/lib/utils';
import { useSocket } from '@/provider/SocketProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface IProps {
	user: User;
}

export default function ButtonActionUser({ user }: IProps) {
	const socket = useSocket();




	const queryClient = useQueryClient();

	const useRemoveFriend = useMutation({
		mutationFn: () => removeFriend(user.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friend-list'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			if(socket){
				socket.emit('send_action_user', { action: 'remove_friend', receiverId: user.id })
			}
		}
	})

	const useActionRequest = useMutation({
        mutationFn: actionRequest,
	})
	
	const useCancelRequest = useMutation({
		mutationFn: cancelRequeset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			if(socket){
				socket.emit('send_action_user', { action: 'cancel_request', receiverId: user.id })
			}
		}
	})
	
	const useCreateRequest = useMutation({
		mutationFn: createFriendRequest,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['friend-request'] })
			queryClient.invalidateQueries({ queryKey: ['users'] })
			if(socket){
				socket.emit('send_action_user', { action: 'create_request', receiverId: user.id })
			}
		}
	})


	if (user.friendItems.length !== 0) {
		return (
			<div className=" w-full grid grid-cols-2 items-center gap-3">
				<Button
					onClick={() => useRemoveFriend.mutate()}
					isLoading={useRemoveFriend.isPending}
				>
					Remove Friend
				</Button>
				<Link
					className=" inline-flex items-center justify-center border h-full   border-slate-700 rounded-lg"
					href={`/message/${user.id}`}
				>
					Chat
				</Link>
			</div>
		)
	} else if (user.requestSent.length !== 0) {
		return (
			<div className="w-full grid grid-cols-2 gap-3 items-center">
				<Button
					onClick={() => useActionRequest.mutate({ senderId: user.id, action: 'accept' }, {
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: ['friend-request'] })
							queryClient.invalidateQueries({ queryKey: ['friend-list'] })
							queryClient.invalidateQueries({ queryKey: ['users'] })
							if(socket){
								socket.emit('send_action_user', { action: 'accept_request', receiverId: user.id })
							}
						}
					})}
					isLoading={useActionRequest.isPending}
					
				>

					<Check size={25} /> Accept
				</Button>
				<Button
					onClick={()=>useActionRequest.mutate({ senderId: user.id, action: 'reject' }, {
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: ['friend-request'] })
							queryClient.invalidateQueries({ queryKey: ['users'] })
							if(socket){
								socket.emit('send_action_user', { action: 'reject_request', receiverId: user.id })
							}
						}
					})}
					isLoading={useActionRequest.isPending}
					className=" bg-red-500 hover:bg-red-400"

				>

					<X size={25} /> Reject
				</Button>
			</div>
		);

	} else if (user.requestReceived.length !== 0) {
		return (
			<Button
				onClick={() => useCancelRequest.mutate(user.id)}
				isLoading={useCancelRequest.isPending}
				className=" w-full"
		>
			Cancel Request
			</Button>
		)
	}

	// const sendFriendRequest = (receiverId: string) => {
	// 	if(socket){
	// 		socket.emit('send_friend_request', { receiverId })
	// 		setStatus('hasSent')
	// 	}
	// };

	


	return (
		<Button 
			onClick= {()=>useCreateRequest.mutate(user.id)}
			isLoading={useCreateRequest.isPending}	
			className=" w-full">
		
			Add Friend
		</Button>
	);
}
