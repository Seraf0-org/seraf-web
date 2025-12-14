export type Work = {
    title: string;
    period: string;
    summary: string;
    contribution: string;
    tech: string[];
    link?: string;
    tag: string;
    image?: string;
};

export const works: Work[] = [
    {
        title: "Seraf() Official Web",
        period: "2024",
        summary: "スタジオ紹介・プロダクト紹介・問い合わせ導線を包含した公式Web体験。ノード状3D背景やカーソルインタラクションを備えたインタラクティブ構成。",
        contribution: "情報設計 / UI実装 / アニメーション / 3D演出",
        tech: ["Remix", "TypeScript", "Three.js", "Tailwind CSS", "Motion One"],
        link: "/",
        tag: "Web",
        image: "/images/works/seraf.png"
    },
    /*
    {
        title: "Invasion Camera",
        period: "2025-11",
        summary: "スマートフォンの姿勢推定とリアルタイム合成を組み合わせ、イベント会場向けに即時印刷できるカメラ体験を構築。",
        contribution: "Three.js / WebRTC / 姿勢推定ロジック / UI実装",
        tech: ["Unity", "TypeScript", "DeviceOrientation"],
        link: "/cam",
        tag: "Web",
        image: "/images/works/invasion-camera.jpg"
    },
    */
    {
        title: "Kuron様 ポートフォリオサイト",
        period: "2025-10",
        summary: "音楽制作スタジオの紹介サイト。サービス概要と問い合わせ導線をシンプルに構成。",
        contribution: "Webデザイン / 設計 / 実装等…すべての業務",
        tech: ["Remix", "TypeScript", "Tailwind CSS"],
        link: "https://ksmusicworks.com/",
        tag: "Web",
        image: "/images/works/ksmusicworks.png"
    },
    {
        title: "Travelers 2025",
        period: "2025-08",
        summary: "旅の世界観を伝えるティザー/告知サイト。軽量な演出で雰囲気を表現。",
        contribution: "UI実装 / アニメーション",
        tech: ["Remix", "TypeScript", "Tailwind CSS"],
        link: "https://travelers2025.com/",
        tag: "Web",
        image: "/images/works/travelers2025.png"
    },
    {
        title: "Enju Cocktail EC",
        period: "2024-05",
        summary: "クラフトカクテルブランドEnjuのECサイト。プロダクト購入フローや在庫・カート周りのシステム実装を担当。",
        contribution: "ECシステム実装 / カート・在庫 / 購入フロー",
        tech: ["Liquid", "Shopify", "EC Integration"],
        link: "https://enju-cocktail.com/",
        tag: "Web",
        image: "/images/works/enju.png"
    },
    {
        title: "未来の扉 インスタレーション（大阪・関西万博）",
        period: "2025-06",
        summary: "非接触ハンドル体験のソフト一部開発とデモ映像のアニメーション・エフェクト制作。ホログラフィック演出で身体性を拡張するインスタレーション。",
        contribution: "体験ソフト実装 / デモ映像アニメーション / エフェクト制作",
        tech: ["Unity", "VFX", "Realtime Animation"],
        link: "https://www.tengun-label.com/post/%E3%80%90%E5%A4%A7%E9%98%AA%E3%83%BB%E9%96%A2%E8%A5%BF%E4%B8%87%E5%8D%9A-%E5%87%BA%E5%B1%95%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%80%91-%E6%9C%AA%E6%9D%A5%E3%81%AE%E6%89%89-%E4%BA%BA%E3%82%92%E5%B0%8A%E9%87%8D%E3%81%97%E3%80%81%E5%81%A5%E5%BA%B7%E3%82%92%E8%A6%8B%E5%AE%88%E3%82%8B%E4%BD%93%E9%A8%93%E5%9E%8B%E3%83%89%E3%82%A2%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AB%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3",
        tag: "VJ / Interactive",
        image: "/images/works/future-door.jpg"
    },
    {
        title: "Reverie - リヴェリー -",
        period: "2024-06",
        summary: "アセットモデリングとバーチャルプロダクションワークフローで構築した映像デモ。リアルタイム環境で質感とライティングを最適化。",
        contribution: "3Dアセットモデリング / バーチャルプロダクションパイプ構築",
        tech: ["Unreal Engine 5", "3D Modeling", "Virtual Production"],
        link: "https://youtu.be/U2_wbV4zbpA?si=0RPBNjgxO0KJLifI",
        tag: "Movie / 3DCG",
        image: "https://i.ytimg.com/vi/U2_wbV4zbpA/maxresdefault.jpg"
    },
    {
        title: "春のオープンキャンパス2024【デジタルハリウッド大学】",
        period: "2024-03",
        summary: "司会のマイク音声から感情を解析し、リアルタイムで背景映像を変化させるライブ配信演出。",
        contribution: "音声感情解析連携 / 映像生成ロジック / ライブ演出",
        tech: ["Python", "WebSocket", "Audio Emotion Analysis", "Realtime VFX"],
        link: "https://www.youtube.com/watch?v=Mh2YSNUX6EA",
        tag: "VJ / Interactive",
        image: "https://i.ytimg.com/vi/Mh2YSNUX6EA/maxresdefault.jpg"
    },
    {
        title: "DHUハロウィンパーティー 前後二層投影VJ",
        period: "2025-10",
        summary: "大学ハロウィンパーティーで前景・背景の二系統プロジェクターを用いた立体的なVJ演出を実施。",
        contribution: "VJ / 映像演出 / 投影オペレーション",
        tech: ["Dual Projection", "VJ", "Realtime VFX"],
        tag: "VJ / Interactive",
        image: "/images/works/halloween-vj.jpg"
    },
    {
        title: "【Valorant】 Virturs Valorant Cup",
        period: "2024-04",
        summary: "大学内VALORANT大会向けに、スコアボードとリアルタイムリプレイを含む配信支援システムを実装。",
        contribution: "配信システム実装 / スコアボード / リアルタイムリプレイ",
        tech: ["TypeScript", "WebSocket", "OBS連携", "Overwolf"],
        link: "https://www.youtube.com/live/PtQmuo7dHss?si=07tDuMz-6ZJHMSad",
        tag: "Live",
        image: "https://i.ytimg.com/vi/PtQmuo7dHss/maxresdefault.jpg"
    },
    {
        title: "DHU学園祭2025 照明演出",
        period: "2025-11",
        summary: "学園祭でのライブ・ダンスステージ向け照明演出。バンド演奏に合わせたリアルタイム照明と、ダンスに合わせた事前プログラム照明を実施。",
        contribution: "ライティングプログラム / ライブオペレーション",
        tech: ["Lighting", "DMX", "QLC+5", "MagicQ"],
        tag: "Live",
        image: "/images/works/campus-lighting.jpg"
    },
    {
        title: "秋 - 四季 / LuCA Music Video",
        period: "2025-09",
        summary: "3DCGキャラクターとモーションキャプチャを用いたMV。モーション編集、UE実装、テクニカルディレクション、FXを担当。",
        contribution: "3DCG / Motion Capture / Motion Editing / UE 実装 & TD / FX",
        tech: ["Unreal Engine 5", "Motion Capture", "3DCG", "FX"],
        link: "https://youtu.be/ToBZkpOmon8?si=TkbFis-vEVFShzFH",
        tag: "Movie / 3DCG",
        image: "https://i.ytimg.com/vi/ToBZkpOmon8/maxresdefault.jpg"
    },
    {
        title: "DHU七夕音楽祭 オーディオリアクティブVJ",
        period: "2025-07",
        summary: "大学七夕音楽祭でGLSLベースのオーディオリアクティブVJを実施。ライブ音源に反応するシェーダ表現で演出を構築。",
        contribution: "VJ / GLSLシェーダ / ライブ演出",
        tech: ["GLSL", "Audio Reactive", "VJ"],
        tag: "VJ / Interactive",
        image: "/images/works/tanabata-vj.jpg"
    },
    {
        title: "Reflectone",
        period: "2024-08-21",
        summary: "敵弾を塗り替えて自弾として返すトップダウンシューティング。Unity1Week『かえす』テーマ作品。",
        contribution: "ゲームデザイン /ディレクション / プログラミング / 演出/ FX",
        tech: ["トップダウンSTG", "PC(Web) / iOS / Android"],
        link: "https://unityroom.com/games/reflectone",
        tag: "Games / Products",
        image: "/images/products/product-2.jpg"
    },
    {
        title: "クラリオン",
        period: "2025-09",
        summary: "剣と銃で派手に敵を薙ぎ払う無双系3Dアクション。戦場を彩る花がテーマ。",
        contribution: "ゲームデザイン / ディレクション / プログラミング / 演出 / FX",
        tech: ["3Dアクション", "PC (Steam)"],
        tag: "Games / Products",
        image: "/images/products/product-3.jpg"
    },
    {
        title: "BluenBrum",
        period: "2024-02",
        summary: "化け物に占拠された学校から脱出する探索型ホラーアドベンチャー。伝説の花に火を灯すため校舎を巡る。",
        contribution: "ゲームデザイン / ディレクション / プログラミング / レベル設計",
        tech: ["ホラーゲーム", "PC (Steam)", "In Production"],
        tag: "Games / Products",
        image: "/images/products/product-1.jpg"
    },
    {
        title: "ヴォイドライブ",
        period: "2025-05",
        summary: "デッキを裏返して続行する二面性カードゲーム。表裏でルールが変化する独自システム。",
        contribution: "ゲームデザイン / ディレクション / プロトタイプ",
        tech: ["カードゲーム", "アナログ"],
        link: "/voidrive/manual",
        tag: "Games / Products",
        image: "/images/products/product-4.jpg"
    },
    {
        title: "アイノイロ",
        period: "2025-04",
        summary: "隔絶された病院を舞台にしたビジュアルノベル。少年ハジメと謎の少女ユキの出会いから始まる物語。",
        contribution: "シナリオ / ディレクション / プログラミング / 演出 / FX",
        tech: ["ビジュアルノベル", "PC(Web) / スマートフォン"],
        link: "https://unityroom.com/games/skiey",
        tag: "Games / Products",
        image: "/images/products/product-6.jpg"
    }
];

