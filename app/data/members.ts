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
        position: "代表, ゲームデザイナー, シナリオライター, エンジニア, モデラー、映像クリエイター",
        mainImage: "/images/members/member-1.jpg",
        subImage: "/images/members/member-1-sub.jpg",
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
        mainImage: "/images/members/member-2.jpg",
        subImage: "/images/members/member-2-sub.jpg",
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
                url: "https://x.com/yupi_yupaLemon9",
                label: "X(旧Twitter)Live2D",
                color: {
                    base: "255, 0, 157",
                    hover: "219, 39, 119"
                }
            }
        ]
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, モデラー",
        mainImage: "/images/members/member-3.jpg",
        subImage: "/images/members/member-3-sub.jpg",
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
        position: "デザイナー, 映像クリエイター",
        mainImage: "/images/members/member-4.jpg",
        subImage: "/images/members/member-4.jpg",
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
        name: "白桜",
        position: "イラストレーター,マルチクリエイター",
        mainImage: "/images/members/member-5.jpg",
        subImage: "/images/members/member-5.jpg",
        description: "準備中。",
        skills: [],
        sns: [
            {
                url: "https://twitter.com/4696_dr25",
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
        position: "UIデザイナー",
        mainImage: "/images/members/member-6.jpg",
        subImage: "/images/members/member-6.jpg",
        description: "準備中。",
        skills: ["Illustrator"],
        sns: [
            /*{
                url: "https://twitter.com/Sm_1010_",
                label: "X(旧Twitter)",
                color: {
                    base: "147, 51, 234",  // 紫色
                    hover: "126, 34, 206"  // 紫色のホバー
                }
            }*/
        ]
    },
    {
        id: 7,
        name: "あきべ",
        position: "イラストレーター、デザイナー",
        mainImage: "/images/members/member-7.jpg",
        subImage: "/images/members/member-7.jpg",
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
    },
    {
        id: 8,
        name: "rapid",
        position: "モデラー、リガー",
        mainImage: "/images/members/member-8.jpg",
        subImage: "/images/members/member-8.jpg",
        description: "準備中。",
        skills: ["Blender", "Substance Painter"],
        sns: [
            {
                url: "https://x.com/pasuta023593",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ]
    },
    {
        id: 9,
        name: "前田ネイト",
        position: "イラストレーター、キャラクターデザイン、背景画",
        mainImage: "/images/members/member-9.jpg",
        subImage: "/images/members/member-9.jpg",
        description: "画家です。\n第96回新構造展奨励賞、第1回Gates Art Competition審査員特別賞、第4回ホキ美術館大賞展入選など実績多数。\nめざましテレビ「キラビト」、NHK「沼ハマ」、ニコニコニュース等にて紹介されました。\nオンライン芸術教室を運営。",
        skills: ["iBisPaint", "Procreate", "InfinitePainter", "artset4", "油彩", "アクリル", "水彩", "日本画"],
        sns: [
            {
                url: "https://x.com/_N_eko_",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            },
            {
                url: "https://www.instagram.com/cat_painter__n/",
                label: "Instagram",
                color: {
                    base: "214, 41, 118",
                    hover: "150, 47, 191"
                }
            }
        ]
    }
];