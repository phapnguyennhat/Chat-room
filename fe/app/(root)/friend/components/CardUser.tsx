
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Button from '@/components/button';
import Image from 'next/image';
import { NOT_FOUND_AVATAR } from '@/common/constant';

interface IProps {
	user: User;
}
export default function CardUser({ user }: IProps) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>{user.name}</CardTitle>
				<CardDescription>{user.email}</CardDescription>
			</CardHeader>
			<CardContent className="">
				<div className=" flex items-center justify-center  rounded-md border p-4">
					<Image
						src={user.avatar?.url || NOT_FOUND_AVATAR}
						width={300}
						height={300}
						alt={user.name}
						className=" size-[200px] object-cover   "
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Button className={`w-full ${user.friendItems.length!==0&& 'bg-transparent border text-slate-900 hover:text-white border-slate-700'} `}  >
				{ user.friendItems.length ===0?	'Add Friend': "Chat"}
				</Button>
			</CardFooter>
		</Card>
	);
}
