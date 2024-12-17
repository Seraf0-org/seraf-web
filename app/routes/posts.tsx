import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const posts = await getPosts(); // データベースからの取得
  return json({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
