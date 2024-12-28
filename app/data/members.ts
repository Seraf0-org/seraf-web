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
        description: "本スタジオのリーダー。シナリオ制作、ゲームデザインをメインに活動を引っ張っていく。",
        skills: ["Unity(C#)", "UE5", "Python", "HTML, CSS", "TypeScript", "Blender", "After Effects"],
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
        sns: "https://twitter.com/CaZ_Mossy"
    },
    {
        id: 4,
        name: "Jiska",
        position: "デザイナー, 映像作家",
        mainImage: "/images/member-4.jpg",
        subImage: "/images/member-4-sub.jpg",
        description: "準備中。",
        skills: ["Illustrator", "After Effects"],
        sns: "https://twitter.com/re4_2304"
    },
    {
        id: 5,
        name: "ドライバー（+）",
        position: "イラストレーター",
        mainImage: "/images/member-5.jpg",
        subImage: "/images/member-5-sub.jpg",
        description: "準備中。",
        skills: [],
        sns: "https://twitter.com/kasha25_dr25"
    },
    {
        id: 6,
        name: "しそ",
        position: "デザイナー",
        mainImage: "/images/member-6.jpg",
        subImage: "/images/member-6-sub.jpg",
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