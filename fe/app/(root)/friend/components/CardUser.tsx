import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { NOT_FOUND_AVATAR } from '@/common/constant';
import Link from 'next/link';
import ButtonActionUser from './ButtonActionUser';

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
				{/* {user.friendItems.length === 0 ? (
					<ButtonActionUser user={user} />
				) : (
					<Link
						className=" w-full bg-transparent border text-slate-900 hover:text-white border-slate-700"
						href={`/message/${user.id}`}
					>
						Chat
					</Link>
				)} */}
				<ButtonActionUser user={user} />
			</CardFooter>
		</Card>
	);
}
