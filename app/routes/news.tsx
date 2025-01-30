import { useLoaderData } from "@remix-run/react";
import { getNewsItems } from "~/data/news";

export const loader = async () => {
    const newsItems = await getNewsItems();
    return { newsItems };
};

export default function NewsPage() {
    const { newsItems } = useLoaderData<typeof loader>();

    return (
        <section className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">All News</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsItems.reverse().map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                        <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{item.date}</p>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <a
                    href="/"
                    className="inline-block bg-cyan-500 text-white font-semibold py-3 px-6 text-lg md:text-xl rounded-lg shadow-2xl hover:shadow-3xl transition-colors duration-300 hover:bg-cyan-600"
                    style={{
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
                    }}
                >
                    <span className="flex items-center justify-center">
                        Back to Home
                        <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </span>
                </a>
            </div>
        </section>
    );
}