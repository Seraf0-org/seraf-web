export type Member = {
    id: number;
    name: string;
    position: string;
    mainImage: string;
    subImage: string;
    description: string;
    skills: string[];
    sns: string;
};

export const members: Member[] = [
    {
        id: 1,
        name: "KTN",
        position: "ゲームデザイナー, シナリオライター, エンジニア",
        mainImage: "/images/member-1.jpg",
        subImage: "/images/member-1-sub.jpg",
        description: "たくさんゲームを作るます",
        skills: ["Unity(C#)", "Web", "Blender", "After Effects"],
        sns: "https://twitter.com/KTN_PERIOD"
    },
    {
        id: 2,
        name: "ゆぴる",
        position: "専属デザイナー, イラストレーター, モデラー",
        mainImage: "/images/member-2.jpg",
        subImage: "/images/member-2-sub.jpg",
        description: "準備中。",
        skills: ["Live2D", "Blender", "Clip Studio Paint"],
        sns: "https://twitter.com/yupi_yupapa9"
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, モデラー",
        mainImage: "/images/member-3.jpg",
        subImage: "/images/member-3-sub.jpg",
        description: "準備中。",
        skills: ["Ableton Live", "Blender"],
        sns: "https://x.com/Mossy_tw"
    },
    {
        id: 4,
        name: "Jiska",
        position: "デザイナー, 映像作家",
        mainImage: "/images/member-none.png",
        subImage: "/images/member-4-sub.jpg",
        description: "準備中。",
        skills: ["Illustrator", "After Effects", "Web"],
        sns: "https://twitter.com/re4_2304"
    },
    {
        id: 5,
        name: "ドライバー（+）",
        position: "イラストレーター",
        mainImage: "/images/member-none.png",
        subImage: "/images/member-none.png",
        description: "準備中。",
        skills: [],
        sns: "https://twitter.com/kasha25_dr25"
    },
    {
        id: 6,
        name: "しそ",
        position: "デザイナー",
        mainImage: "/images/member-none.png",
        subImage: "/images/member-none.png",
        description: "準備中。",
        skills: [],
        sns: "https://twitter.com/Sm_1010_"
    },
    {
        id: 7,
        name: "あきべ",
        position: "イラストレーター",
        mainImage: "/images/member-7.jpg",
        subImage: "/images/member-7.jpg",
        description: "準備中。",
        skills: [],
        sns: "https://twitter.com/pikobi222"
    }
];