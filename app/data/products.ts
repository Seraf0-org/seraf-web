export type Link = {
    url: string;
    text: string;
    color: {
        base: string;
        hover: string;
        shadow: string;
    };
    icon?: string;
};

export type Product = {
    id: number;
    name: string;
    description: string;
    details?: string;
    features?: string;
    genre?: string;
    platform?: string;
    releaseDate?: string;
    image: string;
    links?: Link[];
};

export const products: Product[] = [
    {
        id: 1,
        name: "BluenBrum",
        description: "KTN, しそ, ",
        details: "化け物に占拠された学校から脱出し、悲願の花に火を灯せ。",
        features: "いつも通りに下校しようとすると、校庭で干からびた死体を発見する。辺りを見渡すと既に学校の周りは化け物に占拠されていた。無事に帰宅するため、「花には精霊が宿る」という伝説を頼りに、学校の中を探索していく。探索型ホラーアドベンチャー",
        genre: "ホラーゲーム",
        platform: "PC (Steam)",
        releaseDate: "開発中",
        image: "/images/products/product-1.jpg",
    },
    {
        id: 2,
        name: "Reflectone",
        description: "KTN, あきべ",
        details: "数多の弾丸を一気に塗り替えて敵を一掃しろ。",
        features: "Unity1Weekにて「かえす」のテーマにて作成。敵の弾を塗り替えて自弾としてかえすことができる。ヴァンサバライクなトップダウンシューティング。",
        genre: "トップダウンシューティングゲーム",
        platform: "PC(Web) / iOS / Android",
        releaseDate: "2024年8月21日",
        image: "/images/products/product-2.jpg",
        links: [
            {
                url: "https://unityroom.com/games/reflectone",
                text: "プレイする",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178",
                    shadow: "6, 182, 212"
                },
                icon: "play"
            }
        ]
    },
    {
        id: 3,
        name: "クラリオン",
        description: "KTN, ゆぴる, Mossy, Jiska, こと、すずめ(Studio.zip)",
        details: "せめて美しく散れ。戦場を彩る花として。",
        features: "剣と銃を巧みに扱いながら、スタイリッシュかつ派手に敵を薙ぎ払っていく無双アクションゲーム",
        genre: "3Dアクションゲーム",
        platform: "PC (Steam)",
        releaseDate: "2025年夏予定",
        image: "/images/products/product-3.jpg"
    },
    {
        id: 4,
        name: "ヴォイドライブ",
        description: "KTN, しそ, 白桜, あきべ, はふり(外注), すずめ(Studio.zip)",
        details: "デッキが切れても負けじゃない。表面と裏面を操り勝利を掴め。",
        features: "デッキ切れ=負けなカードゲームとは一風変わったシステム。デッキが切れるとデッキと墓地、そしてフィールドを裏返して続行する。カードの効果やルールすらも異なる裏面を上手く使い、ゲームを有利に進めよう。",
        genre: "カードゲーム",
        platform: "アナログ",
        releaseDate: "2025年秋発売予定",
        image: "/images/products/product-4.jpg",
        links: [
            {
                url: "/voidrive/manual",
                text: "マニュアル",
                color: {
                    base: "16, 185, 129",
                    hover: "5, 150, 105",
                    shadow: "16, 185, 129"
                },
                icon: "book"
            }
        ]
    },
    {
        id: 5,
        name: "Vanishment",
        description: "KTN, Mossy, rapid, Kaz, ゆぴる",
        details: "？？？。", /*"空間を意のままに操り、敵を翻弄しろ。",*/
        features: "？？？。", /*"空間を伸縮させる能力を駆使して、戦闘や探索を有利に進めよう。メトロイドヴァニアライクな2Dアクションゲーム",*/
        genre: "2Dアクションゲーム",
        platform: "PC / Console",
        releaseDate: "2025年秋予定",
        image: "/images/products/product-5.jpg"
    },
    {
        id: 6,
        name: "アイノイロ",
        description: "KTN, 前田ネイト",
        details: "これは、アイを知る物語。",
        features: "とある隔絶された病院の中。ここには目に重大な疾患を持った子供達が閉じ込められていた。外の世界に憧れを持ちながらも、将来への不安を隠せない少年ハジメ。しかし、謎の少女ユキとの出会いから、彼の世界は開かれていく──────。",
        genre: "ビジュアルノベルゲーム",
        platform: "PC(Web) / スマートフォン",
        releaseDate: "2025年4月20日",
        image: "/images/products/product-6.jpg",
        links: [
            {
                url: "https://unityroom.com/games/skiey",
                text: "プレイする",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178",
                    shadow: "6, 182, 212"
                },
                icon: "play"
            }
        ]
    },
    {
        id: 10,
        name: "And more...",
        description: "What's next?",
        image: "/images/products/product-none.jpg"
    }
];
