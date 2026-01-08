import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Điền thông tin và upload hình ảnh sản phẩm
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
