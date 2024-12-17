export type Product = {
    id: number;
    name: string;
    description: string;
    image: string;
};

export const products: Product[] = [
    {
        id: 1,
        name: "BluenBrum",
        description: "KTN, しそ",
        image: "/images/products/product-1.jpg"
    },
    {
        id: 2,
        name: "Reflectone",
        description: "KTN, あきべ",
        image: "/images/products/product-2.jpg"
    },
    {
        id: 3,
        name: "クラリオン",
        description: "KTN, ゆぴる, Mossy",
        image: "/images/products/product-3.jpg"
    },
    {
        id: 4,
        name: "ヴォイドライブ",
        description: "KTN, しそ, ドライバー（+）",
        image: "/images/products/product-4.jpg"
    },
    {
        id: 5,
        name: "Vanishment",
        description: "KTN, Mossy, rapid",
        image: "/images/products/product-5.jpg"
    },
    {
        id: 10,
        name: "And more...",
        description: "What's next?",
        image: "/images/products/product-none.jpg"
    }
];
