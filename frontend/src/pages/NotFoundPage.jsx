import { ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
	return (
		<div className='container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center h-screen gap-[10.0625rem]'>
			<div className='flex flex-col sm:items-start gap-3 text-center sm:text-left w-[19.5rem]'>
				<span className='font-bold text-3xl text-primary'>Oops...</span>
				<span className='text-2xl font-semibold'>Page Not Found</span>
				<p className='text-base text-gray-600'>
					This page doesn’t exist or was removed! We suggest you go back to the
					home page.
				</p>
				<div className='flex sm:justify-start justify-center mt-6'>
					<a
						href='/'
						className='inline-flex items-center gap-2 bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors'
					>
						<ArrowLeft size={20} />
						Go to Home
					</a>
				</div>
			</div>

			<div className='hidden sm:block'>
				<img
					src='/404.png'
					alt='Not Found'
					className='object-contain w-[320px] md:w-[400px] lg:w-[526px] h-auto'
				/>
			</div>
		</div>
	)
}

export default NotFoundPage
