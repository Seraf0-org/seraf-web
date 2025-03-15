export type Partner = {
    id: number;
    name: string;
    description: string;
    details?: string;
    website?: string;
    image: string;
    logoLight?: string;
    logoDark?: string;
    contactEmail?: string;
    startDate?: string;
    tag?: string;
    color: {
        primary: string;
        secondary: string;
        bg: string;
        shadow: string;
    };
};

export const partners: Partner[] = [
    {
        id: 1,
        name: "Studio.zip",
        description: "Movie / 3DCG / Mix / Design / Illustなど幅広い制作領域において、革新的なクリエイティブを実現する新世代の集団です。",
        website: "https://studiodotzip.studio.site/",
        image: "/images/partners/partner-1.jpg",
        logoLight: "/images/partners/partner-1-logo-light.png",
        logoDark: "/images/partners/partner-1-logo-dark.png",
        startDate: "2025年3月",
        tag: "マルチクリエイション",
        color: {
            primary: '#22c55e', // green-500
            secondary: '#86efac', // green-300
            bg: 'rgba(34, 197, 94, 0.1)',
            shadow: 'rgba(34, 197, 94, 0.5)'
        }
    },
];