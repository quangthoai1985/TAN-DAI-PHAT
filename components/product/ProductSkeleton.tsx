export default function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                {/* Image Skeleton */}
                <div className="relative aspect-square bg-gray-200" />

                {/* Content Skeleton */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col">
                    {/* Code Skeleton */}
                    <div className="h-3 bg-gray-200 rounded w-20 mb-2" />

                    {/* Name Skeleton */}
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>

                    {/* Price Skeleton */}
                    <div className="h-5 bg-gray-200 rounded w-24 mt-3" />
                </div>
            </div>
        </div>
    );
}
