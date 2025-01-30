export type Member = {
    id: number;
    name: string;
    position: string;
    mainImage: string;
    subImage: string;
    description: string;
    skills: string[];
    sns: SNS[];
};

type SNS = {
    url: string;
    label: string;
    color?: {
        base: string;  // "59, 130, 246" のような形式
        hover: string; // "37, 99, 235" のような形式
    };
};

export const members: Member[] = [
    {
        id: 1,
        name: "KTN",
        position: "代表, ゲームデザイナー, シナリオライター, エンジニア",
        mainImage: "/images/member-1.jpg",
        subImage: "/images/member-1-sub.jpg",
        description: "たくさんゲームを作るます。\nゲームデザイン、シナリオ制作をメインに手広く活動していきます。",
        skills: ["Unity", "Unreal Engine", "Web", "Blender", "After Effects", "Game Synth", "Illustrator"],
        sns: [
            {
                url: "https://twitter.com/KTN_PERIOD",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            },
            {
                url: "https://github.com/KTN44295080",
                label: "GitHub",
                color: {
                    base: "34, 210, 54",
                    hover: "22, 172, 32"
                }
            }
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
            {
                url: "https://twitter.com/yupi_yupapa9",
                label: "X(旧Twitter)3DCG",
                color: {
                    base: "34, 210, 54",
                    hover: "22, 172, 32"
                }
            },
            {
                url: "https://x.com/yupi_yupaLive2D",
                label: "X(旧Twitter)Live2D",
                color: {
                    base: "236, 72, 153",
                    hover: "219, 39, 119"
                }
            }
        ]
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, モデラー",
        mainImage: "/images/member-3.jpg",
        subImage: "/images/member-3-sub.jpg",
        description: "Seraf()のサウンドデザイナー、モデラー。\n空間に応じたサウンドエフェクトの制作や背景、プロップのモデリングをやっています。",
        skills: ["Ableton Live", "GameSynth", "Maya", "Substance Painter", "After Effects"],
        sns: [
            {
                url: "https://x.com/Mossy_tw",
                label: "X(旧Twitter)",
                color: {
                    base: "147, 51, 234",
                    hover: "126, 34, 206"
                }
            }
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
            {
                url: "https://x.com/Jiska_i_i",
                label: "X(旧Twitter)",
                color: {
                    base: "59, 130, 246",
                    hover: "37, 99, 235"
                }
            }
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
            {
                url: "https://twitter.com/kasha25_dr25",
                label: "X(旧Twitter)",
                color: {
                    base: "22, 163, 74",
                    hover: "16, 122, 57"
                }
            }
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
            {
                url: "https://twitter.com/Sm_1010_",
                label: "X(旧Twitter)",
                color: {
                    base: "147, 51, 234",  // 紫色
                    hover: "126, 34, 206"  // 紫色のホバー
                }
            }
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
            {
                url: "https://twitter.com/pikobi222",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ]
    }
];