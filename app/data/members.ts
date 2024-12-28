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
        position: "ゲームデザイナー, 脚本家, エンジニア, モデラー, 映像作家",
        mainImage: "/images/member-1.jpg",
        subImage: "/images/member-1-sub.jpg",
        description: "ゲーム制作が大好きなプログラマー。企画からプログラミングまで幅広く担当。",
        skills: ["Unity", "C#", "TypeScript", "React", "Blender"],
        sns: "https://twitter.com/KTN_PERIOD"
    },
    {
        id: 2,
        name: "ゆぴる",
        position: "専属デザイナー, イラストレーター, モデラー",
        mainImage: "/images/member-2.jpg",
        subImage: "/images/member-2-sub.jpg",
        description: "デザインとイラストレーションが得意なデザイナー。",
        skills: ["Illustrator", "Photoshop", "Blender"],
        sns: "https://twitter.com/yupi_yupapa9"
    },
    {
        id: 3,
        name: "Mossy",
        position: "サウンドクリエイター, モデラー",
        mainImage: "/images/member-3.jpg",
        subImage: "/images/member-3-sub.jpg",
        description: "音楽が大好きなサウンドクリエイター。",
        skills: ["FL Studio", "Logic Pro", "Ableton Live"],
        sns: "https://twitter.com/CaZ_Mossy"
    },
    {
        id: 4,
        name: "Jiska",
        position: "デザイナー, 映像作家",
        mainImage: "/images/member-4.jpg",
        subImage: "/images/member-4-sub.jpg",
        description: "デザインと映像制作が得意なデザイナー。",
        skills: ["After Effects", "Premiere Pro", "Photoshop"],
        sns: "https://twitter.com/re4_2304"
    },
    {
        id: 5,
        name: "ドライバー（+）",
        position: "イラストレーター",
        mainImage: "/images/member-5.jpg",
        subImage: "/images/member-5-sub.jpg",
        description: "イラストレーションが得意なイラストレーター。",
        skills: ["Illustrator", "Procreate"],
        sns: "https://twitter.com/kasha25_dr25"
    },
    {
        id: 6,
        name: "しそ",
        position: "デザイナー",
        mainImage: "/images/member-6.jpg",
        subImage: "/images/member-6-sub.jpg",
        description: "デザインが得意なデザイナー。",
        skills: ["Figma", "Sketch", "Adobe XD"],
        sns: "https://twitter.com/Sm_1010_"
    },
    {
        id: 7,
        name: "あきべ",
        position: "イラストレーター",
        mainImage: "/images/member-7.jpg",
        subImage: "/images/member-7.jpg",
        description: "イラストレーションが得意なイラストレーター。",
        skills: ["Illustrator", "Procreate"],
        sns: "https://twitter.com/pikobi222"
    }
];