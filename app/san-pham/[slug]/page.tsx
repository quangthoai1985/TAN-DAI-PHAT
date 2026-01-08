export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div className="p-24">
            <h1 className="text-3xl font-bold mb-4">Chi tiết sản phẩm: {params.slug}</h1>
            <p>Thông tin chi tiết về sản phẩm sẽ hiển thị ở đây.</p>
        </div>
    )
}
