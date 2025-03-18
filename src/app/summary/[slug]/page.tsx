import { allPosts } from ".contentlayer/generated";
import { format, parseISO } from "date-fns";
import { MDXContent } from "@/components/mdx-content";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  return { title: post?.title || "Post not found" };
};

const PostLayout = async ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  // Use dynamic import for the MDX component to avoid SSR issues
  //   const Content = getMDXComponent(post.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1>{post.title}</h1>
      </div>
      <div className="prose prose-gray mx-auto dark:prose-invert">
        <MDXContent code={post.body.code} />
      </div>
    </article>
  );
};

export default PostLayout;
