'use client';

import { RootState } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

export default function Spinner() {
	const isVisible = useSelector((state: RootState) => state.spinner.value);
	return (
		<div
			className={` ${
				isVisible ? 'fixed' : 'hidden'
			}  inset-0 bg-black/40 z-[9999] grid min-h-[140px] w-full place-items-center   `}
		>
			<Loader2 className=' text-slate-900 size-[80px] animate-spin '/>
		</div>
	);
}
