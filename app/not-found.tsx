import Link from 'next/link'

export const runtime = 'edge'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-9xl font-bold text-red-100">404</h1>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-500">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/20"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Về trang chủ
                </Link>
            </div>
        </div>
    )
}
