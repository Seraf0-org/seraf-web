export type Member = {
    id: number;
    name: string;
    position: string;
    mainImage: string;
    subImage: string;
    description: string;
    skills: string[];
    sns: { url: string; label: string }[];
};

export const members: Member[] = [
    {
        id: 1,
        name: "KTN",
        position: "代表, ゲームデザイナー, シナリオライター, エンジニア",
        mainImage: "/images/member-1.jpg",
        subImage: "/images/member-1-sub.jpg",
        description: "たくさんゲームを作るます。\nゲームデザイン、シナリオ制作をメインに手広く活動していきます。",
        skills: ["Unity", "Unreal Engine", "Web", "Blender", "After Effects", "Illustrator"],
        sns: [
            { url: "https://twitter.com/KTN_PERIOD", label: "Twitter" }
        ]
    },
    {
        id: 2,
        name: "ゆぴる",
        position: "代表補佐, 専属デザイナー, イラストレーター, モデラー",
        mainImage: "/images/member-2.jpg",
        subImage: "/images/member-2-sub.jpg",
        description: "専属デザイナーしてます。\n3DCGは背景、Live2Dはイラストからキャラクターリグとアニメーションまでやってます。",
        skills: ["Blender", "Live2D", "CLIP STUDIO PAINT", "VTuber Studio", "Substance Painter"],
        sns: [
            { url: "https://twitter.com/yupi_yupapa9", label: "Twitter(3DCG)" },
            { url: "https://x.com/yupi_yupaLive2D", label: "Twitter(Live2D)" }
        ]
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, モデラー",
        mainImage: "/images/member-3.jpg",
        subImage: "/images/member-3-sub.jpg",
        description: "準備中。",
        skills: ["Cubase", "Ableton Live", "Blender", "Maya"],
        sns: [
            { url: "https://x.com/Mossy_tw", label: "Twitter" }
        ]
    },
    {
        id: 4,
        name: "Jiska",
        position: "デザイナー, 映像作家",
        mainImage: "/images/member-4.jpg",
        subImage: "/images/member-4.jpg",
        description: "準備中。",
        skills: ["Illustrator", "After Effects", "Web"],
        sns: [
            { url: "https://twitter.com/re4_2304", label: "Twitter" }
        ]
    },
    {
        id: 5,
        name: "ドライバー（+）",
        position: "イラストレーター",
        mainImage: "/images/member-5.jpg",
        subImage: "/images/member-5.jpg",
        description: "準備中。",
        skills: [],
        sns: [
            { url: "https://twitter.com/kasha25_dr25", label: "Twitter" }
        ]
    },
    {
        id: 6,
        name: "しそ",
        position: "デザイナー",
        mainImage: "/images/member-none.png",
        subImage: "/images/member-none.png",
        description: "準備中。",
        skills: ["Illustrator"],
        sns: [
            { url: "https://twitter.com/Sm_1010_", label: "Twitter" }
        ]
    },
    {
        id: 7,
        name: "あきべ",
        position: "イラストレーター",
        mainImage: "/images/member-7.jpg",
        subImage: "/images/member-7.jpg",
        description: "準備中。",
        skills: [],
        sns: [
            { url: "https://twitter.com/pikobi222", label: "Twitter" }
        ]
    }
];