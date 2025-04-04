import { removeFriend } from "@/API/friend/action"
import { NOT_FOUND_AVATAR } from "@/common/constant"
import Button from "@/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { isErrorResponse } from "@/lib/utils"
import { useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface IProps {
    friendItem: FriendItem
}

export default function CardFriend({ friendItem }: IProps) {

    const [isLoading, setIsLoading] = useState(false)

    const queryClient = useQueryClient()

    const handleRemoveFriend = async (friendId: string) => {
		setIsLoading(true);
		const response = await removeFriend(friendId);
		if (isErrorResponse(response)) {
			toast.error('Something went wrong', {
				description: response.message,
			});
        } else {
            queryClient.invalidateQueries({ queryKey: ['friends', 'unRead'] })
        }
		setIsLoading(false);
    };
    
    
    const {friend} = friendItem
    return (
        <Card className="w-full">
        <CardHeader>
        <CardTitle>{friend.name}</CardTitle>
            <CardDescription>{friendItem.friend.email}</CardDescription>
        </CardHeader>
        <CardContent className="">
            <div className=" flex items-center justify-center  rounded-md border p-4">
                <Image
                    src={friend .avatar?.url || NOT_FOUND_AVATAR}
                    width={300}
                    height={300}
                    alt={friend.name}
                    className=" size-[200px] object-cover   "
                />
            </div>
        </CardContent>
        <CardFooter>
          
            <div className=" w-full grid grid-cols-2 items-center gap-3">
				<Button
					onClick={() => handleRemoveFriend(friend.id)}
					isLoading={isLoading}
				>
					Remove Friend
				</Button>
				<Link
					className=" inline-flex items-center justify-center border h-full   border-slate-700 rounded-lg"
					href={`/message/${friend.id}`}
				>
					Chat
				</Link>
			</div>
        </CardFooter>
    </Card>
    )
}
