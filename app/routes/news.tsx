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
        </section>
    );
}