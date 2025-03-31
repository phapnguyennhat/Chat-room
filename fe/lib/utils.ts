import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function fetcher<T>(input: string, init?: RequestInit) {
	try {
		const response = await fetch(
			`${process.env.BACKEND_URL}/${input}`,
			init,
		);
		const json = await response.json();

		return json as T;
	} catch (error: any) {
		console.log({error})
		return {
			statusCode: 500,
			message: 'Server Error',
		};
	}
}

export function isErrorResponse(response: any): response is { statusCode: number, message: string } {
	if(!response){
	  return false
	}
	return 'statusCode' in response;
  }