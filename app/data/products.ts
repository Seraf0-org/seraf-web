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
    link?: string;
    storeLink?: string;
};

export const products: Product[] = [
    {
        id: 1,
        name: "BluenBrum",
        description: "KTN, しそ",
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
        platform: "PC (Browser) / iOS / Android",
        releaseDate: "2024年8月21日",
        image: "/images/products/product-2.jpg",
        link: "https://unityroom.com/games/reflectone"
    },
    {
        id: 3,
        name: "クラリオン",
        description: "KTN, ゆぴる, Mossy",
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
        description: "KTN, しそ, ドライバー（+）",
        details: "？？？。", /*"デッキが切れても負けじゃない。表面と裏面を操り勝利を掴め。",*/
        features: "？？？。", /*"デッキ切れ=負けなカードゲームとは一風変わったシステム。デッキが切れるとデッキと墓地、そしてフィールドを裏返して続行する。カードの効果やルールすらも異なる裏面を上手く使い、ゲームを有利に進めよう。",*/
        genre: "カードゲーム",
        platform: "アナログ",
        releaseDate: "2025年春予定",
        image: "/images/products/product-4.jpg"
    },
    {
        id: 5,
        name: "Vanishment",
        description: "KTN, Mossy, rapid",
        details: "？？？。", /*"空間を意のままに操り、敵を翻弄しろ。",*/
        features: "？？？。", /*"空間を伸縮させる能力を駆使して、戦闘や探索を有利に進めよう。メトロイドヴァニアライクな2Dアクションゲーム",*/
        genre: "2Dアクションゲーム",
        platform: "PC / Console",
        releaseDate: "2025年秋予定",
        image: "/images/products/product-5.jpg"
    },
    {
        id: 10,
        name: "And more...",
        description: "What's next?",
        image: "/images/products/product-none.jpg"
    }
];
