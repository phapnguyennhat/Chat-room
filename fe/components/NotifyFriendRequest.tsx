import { NOT_FOUND_AVATAR } from "@/common/constant"
import Image from "next/image"
import Link from "next/link"


interface IProps {
  user: User
  message: string
}

export default function NotifyFriendRequest({user, message}: IProps) {
  return (
    <Link href={'/friend/request'} className=" inline-flex items-center gap-3" >
          <Image alt={'image'} src={user.avatar?.url || NOT_FOUND_AVATAR} width={40} height={40} className=" size-[40px] rounded-full" />
      <p className=" text-wrap" >{ `${user.name} ${message}`}</p>
    </Link>
  )
}
