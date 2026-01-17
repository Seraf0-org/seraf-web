export type Member = {
    id: number;
    name: string;
    position: string;
    mainImage: string;
    subImage: string;
    description: string;
    skills: string[];
    sns: SNS[];
    achievements: {
        title: string;
        image: string;
        period?: string;
        link?: string;
        summary?: string;
        contribution?: string;
        tech?: string[];
    }[];
};

type SNS = {
    url: string;
    label: string;
    color?: {
        base: string;
        hover: string;
    };
};

export const members: Member[] = [
    {
        id: 1,
        name: "KTN",
        position: "代表, ゲームデザイナー, シナリオライター, プログラマー, 3DCG, 照明、映像",
        mainImage: "/images/members/member-1.jpg",
        subImage: "/images/members/member-1-sub.jpg",
        description: "たくさんゲームを作るます。\nゲームデザイン、シナリオ制作をメインに手広く活動していきます。",
        skills: ["Unity", "Unreal Engine", "Web", "Blender", "After Effects", "Aviutl", "QLC+", "DasLight", "Game Synth"],
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
        ],
        achievements: [
            {
                title: "【映像合作】ねぇ、どろどろさん",
                image: "https://img.youtube.com/vi/WqXmKZ1jfnY/hqdefault.jpg",
                period: "2025-02",
                link: "https://youtu.be/WqXmKZ1jfnY",
                summary: "映像合作。イントロとAメロを担当。",
                contribution: "Intro / A-melody",
                tech: ["After Effects", "Blender"]
            },
            {
                title: "Unition",
                image: "/images/works/ktn/unition.png",
                period: "2026-01",
                link: "https://github.com/Seraf0-org/Unition",
                summary: "NotionからAPIを介してリアルタイムにUnityでデータを受け取るためのライブラリ。",
                contribution: "Developer",
                tech: ["Unity", "C#", "Notion API"]
            }
        ]
    },
    {
        id: 2,
        name: "ゆぴる",
        position: "代表補佐, 専属デザイナー, イラストレーター, 背景モデラー",
        mainImage: "/images/members/member-2.jpg",
        subImage: "/images/members/member-2-sub.jpg",
        description: "代表補佐と専属デザイナーしてます。\n3DCGは背景、Live2Dはイラストからキャラクターリグとアニメーションまでやってます。",
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
            },
            {
                url: "https://skima.jp/profile?id=444412",
                label: "SKIMA",
                color: {
                    base: "235, 90, 70",
                    hover: "200, 70, 50"
                }
            },
            {
                url: "https://skeb.jp/@yupi_yupaLemon9",
                label: "Skeb",
                color: {
                    base: "0, 160, 160",
                    hover: "0, 130, 130"
                }
            }
        ],
        achievements: [
            {
                title: "魔女見習いの休日Re",
                image: "/images/works/yupiru/witch-apprentice-re.jpg",
                period: "2025-10",
                link: "https://x.com/yupi_yupapa9/status/1977871975319245306?s=20",
                summary: "高校生の頃に制作した作品のリメイク。\n魔女見習いの少女の休日をイメージした作品。",
                contribution: "All",
                tech: ["Blender", "Clip Studio Paint", "Photoshop"]
            },
            {
                title: "カフェ",
                image: "/images/works/yupiru/cafe.jpg",
                period: "2023-08",
                link: "https://x.com/yupi_yupapa9/status/1691744107071177109?s=20",
                summary: "魔女見習いの少女通うカフェをイメージした作品。",
                contribution: "All",
                tech: ["Blender", "Clip Studio Paint", "Photoshop"]
            },
            {
                title: "Seraf()- Webサイト風Live2D動画",
                image: "https://img.youtube.com/vi/xYhPwO2abjQ/maxresdefault.jpg",
                period: "2025-01",
                link: "https://youtu.be/xYhPwO2abjQ",
                summary: "Seraf()のイベントサイトをイメージしたLive2D動画。",
                contribution: "イラスト / Live2D Rigging & Animation",
                tech: ["Blender", "Clip Studio Paint", "Live2D"]
            },
            {
                title: "AbbyLive2DModel",
                image: "https://img.youtube.com/vi/N7eIj-kdMIQ/maxresdefault.jpg",
                period: "2023-11",
                link: "https://youtu.be/N7eIj-kdMIQ",
                summary: "魔女見習いの少女、アビーのLive2Dモデル。",
                contribution: "イラスト / Live2D",
                tech: ["Clip Studio Paint", "Live2D"]
            },
            {
                title: "Sky Blue Angel-Live2DModel",
                image: "https://img.youtube.com/vi/MPmohnk9A1U/hqdefault.jpg",
                period: "2025-11",
                link: "https://youtu.be/MPmohnk9A1U",
                summary: "水色天使をイメージしたLive2Dモデル。",
                contribution: "イラスト / Live2D",
                tech: ["Clip Studio Paint", "Live2D"]
            },
            {
                title: "ポートフォリオサイト",
                image: "/images/works/yupiru/portfolio-site.png",
                link: "https://yy9portfoliosite.myportfolio.com/work",
                summary: "個人のポートフォリオサイト。",
                contribution: "Webデザイン / 構成",
                tech: ["Adobe Portfolio"]
            }
        ]
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, 背景モデラー, 音響",
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
        ],
        achievements: []
    },
    {
        id: 4,
        name: "Jiska",
        position: "デザイナー, 映像クリエイター",
        mainImage: "/images/members/member-4.jpg",
        subImage: "/images/members/member-4.jpg",
        description: "色々なところでフライヤー等を中心としたグラフィックデザインをしています。映像もちょっとやります。",
        skills: ["Illustrator", "After Effects", "Web", "Aviutl"],
        sns: [
            {
                url: "https://x.com/Jiska_i_i",
                label: "X(旧Twitter)",
                color: {
                    base: "59, 130, 246",
                    hover: "37, 99, 235"
                }
            }
        ],
        achievements: [
            {
                title: "ポートフォリオサイト",
                image: "/images/works/jiska/portfolio-site.png",
                link: "https://jiska.work/",
                summary: "個人のポートフォリオサイト。",
                contribution: "All",
                tech: ["Web"]
            },
            {
                title: "秋 - 四季 / LuCA Music Video",
                image: "https://i.ytimg.com/vi/ToBZkpOmon8/maxresdefault.jpg",
                period: "2025-09",
                link: "https://youtu.be/ToBZkpOmon8",
                summary: "秋 - 四季 / LuCA Music Video。グラフィックデザインとクレジットデザインを担当。",
                contribution: "Graphic Design / Credit & UI Design",
                tech: ["Graphic Design"]
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
        ],
        achievements: []
    },

    {
        id: 7,
        name: "あきべ",
        position: "イラストレーター、ピクセルアーティスト、コンセプトアーティスト",
        mainImage: "/images/members/member-7.jpg",
        subImage: "/images/members/member-7.jpg",
        description: "ゲームのコンセプトアートやキャラクターデザイン、ピクセルアニメーションを主にやらせていただいてます！ ",
        skills: ["CLIP STUDIO PAINT", "Procreate", "Photoshop", "Aseprite", "Maya"],
        sns: [
            {
                url: "https://twitter.com/pikobi222",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ],
        achievements: []
    },
    {
        id: 8,
        name: "rapid",
        position: "キャラモデラー、リガー",
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
        ],
        achievements: []
    },
    {
        id: 9,
        name: "前田ネイト",
        position: "イラストレーター、キャラクターデザイナー、背景画",
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
        ],
        achievements: []
    },
    {
        id: 10,
        name: "こと",
        position: "背景モデラー",
        mainImage: "/images/members/member-10.jpg",
        subImage: "/images/members/member-10.jpg",
        description: "背景モデラーを目指して勉強中",
        skills: ["Maya", "Substance Painter"],
        sns: [
            {
                url: "https://x.com/koto_koto724",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ],
        achievements: []
    },
    /*
    {
        id: 11,
        name: "成瀬にぁ",
        position: "グラフィックデザイナー",
        mainImage: "/images/members/member-11.jpg",
        subImage: "/images/members/member-11.jpg",
        description: "Unity1weekを経てチームに参加させていただく事になりました。チームと支え合ってみんなと自分の作りたいものを作っていければと思います。よろしくお願いします。",
        skills: ["Illustrator", "Photoshop"],
        sns: [
            {
                url: "https://x.com/TakeANoWorries",
                label: "X(旧Twitter)",
                color: {
                    base: "59, 130, 246",
                    hover: "37, 99, 235"
                }
            },
            {
                url: "https://www.instagram.com/takano_ri_/",
                label: "Instagram",
                color: {
                    base: "214, 41, 118",
                    hover: "150, 47, 191"
                }
            }
        ],
        achievements: []
    },
    */
    {
        id: 12,
        name: "カーリー",
        position: "プログラマー",
        mainImage: "/images/members/member-12.jpg",
        subImage: "/images/members/member-12.jpg",
        description: "ジャンルやデジタル・アナログ問わず様々なゲームが好きです。最近はシェーダーにお熱。",
        skills: ["C#", "C++", "Unity"],
        sns: [
            {
                url: "https://x.com/Carly7766",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            },
            {
                url: "https://github.com/Carly7766/",
                label: "GitHub",
                color: {
                    base: "34, 210, 54",
                    hover: "22, 172, 32"
                }
            }
        ],
        achievements: []
    },
    {
        id: 13,
        name: "タカノリ",
        position: "グラフィックデザイナー",
        mainImage: "/images/members/member-13.jpg",
        subImage: "/images/members/member-13.jpg",
        description: "Unity1weekを経てチームに参加させていただく事になりました。チームと支え合ってみんなと自分の作りたいものを作っていければと思います。よろしくお願いします。",
        skills: ["Illustrator", "Photoshop"],
        sns: [
            {
                url: "https://x.com/TakeANoWorries",
                label: "X(旧Twitter)",
                color: {
                    base: "59, 130, 246",
                    hover: "37, 99, 235"
                }
            },
            {
                url: "https://www.instagram.com/takano_ri_/",
                label: "Instagram",
                color: {
                    base: "214, 41, 118",
                    hover: "150, 47, 191"
                }
            }
        ],
        achievements: [
            {
                title: "ポートフォリオサイト",
                image: "/images/works/takanori/portfolio-site.png",
                link: "https://fori.io/TAKANORI",
                summary: "個人のポートフォリオサイト。",
                contribution: "All",
                tech: ["Web"]
            }
        ]
    },

    {
        id: 14,
        name: "ぽち。",
        position: "プログラマー、映像クリエイター、3DCG、UI/Webデザイナー",
        mainImage: "/images/members/member-14.jpg",
        subImage: "/images/members/member-14.jpg",
        description: "１年のぽちです～ プログラミングと映像主にやってます！ MV/ PV作れます👀お手柔らかにこれからよろしくお願いします🫡",
        skills: ["C#", "JavaScript", "Rust", "C++", "CSS", "Unity", "AviUtl", "Blender", "FL Studio"],
        sns: [
            {
                url: "https://twitter.com/potistudio",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            },
            {
                url: "https://github.com/potistudio",
                label: "Instagram",
                color: {
                    base: "214, 41, 118",
                    hover: "150, 47, 191"
                }
            }
        ],
        achievements: []
    },
    {
        id: 15,
        name: "はふり",
        position: "イラストレーター",
        mainImage: "/images/members/member-15.jpg",
        subImage: "/images/members/member-15.jpg",
        description: "イラストやデザインをメインに、3DCGや映像、Live2Dなど創作の幅を広げています！",
        skills: ["Blender", "IbisPaint", "Unreal Engine5", "Adobe After Effects"],
        sns: [
            {
                url: "https://x.com/hafuri_illust",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ],
        achievements: []
    },
    {
        id: 16,
        name: "Kazuki/千煌",
        position: "背景モデラー",
        mainImage: "/images/members/member-16.jpg",
        subImage: "/images/members/member-16.jpg",
        description: "背景モデラー目指して勉強中",
        skills: ["MAYA", "Substance Painter", "Unity"],
        sns: [
            {
                url: "https://x.com/kazuki_cg",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            },
            {
                url: "https://www.instagram.com/kazuki_cg",
                label: "Instagram",
                color: {
                    base: "214, 41, 118",
                    hover: "150, 47, 191"
                }
            }
        ],
        achievements: []
    },
    {
        id: 17,
        name: "楚々 ",
        position: "イラストレーター",
        mainImage: "/images/members/member-17.jpg",
        subImage: "/images/members/member-17.jpg",
        description: "イラスト担当で参加させていただきます！全力で楽しみながら良い作品を作りたいです✨",
        skills: ["CLIP STUDIO PAINT", "Procreate", "Maya"],
        sns: [
            {
                url: "https://x.com/nmm_soso",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ],
        achievements: []
    },
    {
        id: 18,
        name: "みはる",
        position: "イラストレーター, キャラクターデザイナー",
        mainImage: "/images/members/member-18.jpg",
        subImage: "/images/members/member-18.jpg",
        description: "一年のみはるです！\nイラストを主にやっていて最近はモデリング練習中です（マヤとブレンダー両方）\nフリフリが大好きで、動きがあった構図やロリータや細かいデザインの服を描くのが好きです！",
        skills: ["Illustrator", "Photoshop", "IbisPaint", "Procreate", "Maya", "Blender"],
        sns: [
            {
                url: "https://x.com/puepue_mi",
                label: "X(旧Twitter)",
                color: {
                    base: "6, 182, 212",
                    hover: "8, 145, 178"
                }
            }
        ],
        achievements: []
    }
];
