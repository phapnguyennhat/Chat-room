'use client'
import { useInView } from "react-intersection-observer";
import { useInfinityGetMyFriend } from "@/hook/friend";
import { useEffect } from "react";
import CardUser from "./CardUser";
import { Loader2 } from "lucide-react";
import CardFriend from "./CardFriend";
export default function InfinityUnReadFriend() {
    const { ref, inView } = useInView();

    const { data, error, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfinityGetMyFriend( 'unRead', '')

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView, hasNextPage]);

 



    return (
        <section>
            <h6>New Friends</h6>

            <ul className='  gap-4 w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{data?.pages.map((page) => {
					return page.data.map((friendItem, index) => (
						<li key={index}>
                            {/* <CardUser user={friendItem.friend   } /> */}
                            <CardFriend friendItem={friendItem} />
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
        </section>
    )
}
