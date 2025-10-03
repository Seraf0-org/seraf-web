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
    },
    {
        id: 5,
        date: "2025.4.20",
        title: "アイノイロ配信！",
        description: "UnityRoomにて、アイノイロの配信を開始しました。",
        image: "/images/news/news-5.jpg"
    },
    {
        id: 6,
        date: "2025.4.25",
        title: "DHU新入生歓迎会2025にて展示！",
        description: "デジタルハリウッド大学の新入生歓迎会2025にて、ゲームの展示を行いました。",
        image: "/images/news/news-6.jpg"
    },
    {
        id: 7,
        date: "2025.5.18",
        title: "春ゲムマ2025に出展！",
        description: "春のゲームマーケット2025にて、ヴォイドライブの試遊と販売を行いました。",
        image: "/images/news/news-7.jpg"
    },
    {
        id: 8,
        date: "2025.8.30",
        title: "秋-四季/LuCAのMVが公開！",
        description: "Studio.zip様協力のもと、秋 -四季/LuCAのMVを制作いたしました。",
        image: "/images/news/news-8.jpg"
    },
    {
        id: 8,
        date: "2025.9.28",
        title: "TGS2025に出展！",
        description: "TGS2025にて、クラリオンの試遊を行いました。",
        image: "/images/news/news-9.jpg"
    }

];

export const getNewsItems = () => {
    return newsItems;
}; 