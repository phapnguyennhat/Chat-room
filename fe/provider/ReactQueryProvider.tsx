'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5,
			retry: false,
			retryDelay: 1000,
			retryOnMount: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchInterval: false,
			refetchIntervalInBackground: false,
			
		},
		
		
	},
	});
export default function ReactQueryProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={true} />
		</QueryClientProvider>
	);
}
