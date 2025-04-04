export {};

declare global {
	interface Token {
		token: string;
		accessTime: number;
		cookie: string;
	}

	interface LoginToken {
		accessTokenCookie: Token;
		refreshTokenCookie: Token;
	}

	interface User {
		name: string;
		id: string;
		email: string
		avatar: File;
		friendItems: FriendItem[]
		requestReceived: FriendRequest[]
		requestSent: FriendRequest[]

	}

	interface File {
		key: string;
		url: string;
		format: string;
		name: string;
	}

	interface QueryPagination {
		page?: number,
		limit?	: number
	}

	interface QueryUser extends QueryPagination{
		keyword?:string
	}

	interface FriendItem {
		id: string
		friend: User
	}

	interface FriendRequest {
		senderId: string,
		sender: User,
		receiverId: string,
		receiver: User
	}

}


