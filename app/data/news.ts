export type NewsItem = {
    id: number;
    date: string;
    title: string;
    description: string;
    image: string;
};

export const newsItems: NewsItem[] = [
    {
        id: 1,
        date: "2024.11.23",
        title: "Seraf()設立！",
        description: "本チームが立ち上げられ、活動を開始しました。",
        image: "/images/news/news-1.jpg"
    },
    {
        id: 2,
        date: "2024.11.24",
        title: "DHU学園祭に展示！",
        description: "デジタルハリウッド大学の2024年度学園祭にて、ゲームの展示を行いました。",
        image: "/images/news/news-2.jpg"
    },
    {
        id: 3,
        date: "2024.08.21",
        title: "Reflectone配信！",
        description: "UnityRoomにて、Reflectoneの配信を開始しました。",
        image: "/images/news/news-3.jpg"
    },
    {
        id: 4,
        date: "2025.1.31",
        title: "Webサイトを公開！",
        description: "Seraf()のWebサイトを公開しました。",
        image: "/images/news/news-1.jpg"
    }
];

export const getNewsItems = () => {
    return newsItems;
}; 