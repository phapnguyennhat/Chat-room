import React from 'react'
import AddFriend from '../components/AddFriend'
import SearchResult from '../components/SearchResult'
import InfinityUnReadFriend from '../components/InfinityUnReadFriend';

interface IProps {
  searchParams: Promise<QueryUser>
}

export default async function FriendListPage({ searchParams }: IProps) {
  const { keyword = '' } = await searchParams;
  return (
    <main className=' p-6' >
      <h1 className=" font-bold text-5xl mb-8 uppercase ">
        My Friends
      </h1>
      <AddFriend searchParams={searchParams} textLabel='' />

      <InfinityUnReadFriend />
      
      <section>
        <h3 className=' mb-3' >
          {keyword
            ? `Search result for ${keyword}`
            : 'List of friends'}
        </h3>

      </section>
    </main>
  )
}
