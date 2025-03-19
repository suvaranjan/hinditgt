import { allPosts } from ".contentlayer/generated";
import { format, parseISO } from "date-fns";
import { MDXContent } from "@/components/mdx-content";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({
    slug: post._raw.flattenedPath,
  }));

type Params = Promise<{ slug: string }>;

export const generateMetadata = async (props: { params: Params }) => {
  const params = await props.params;
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  return { title: post?.title || "Post not found" };
};

const PostLayout = async (props: { params: Params }) => {
  const params = await props.params;

  // Decode the slug from the URL
  const decodedSlug = decodeURIComponent(params.slug);

  // Compare the decoded slug with post title
  const post = allPosts.find(
    (post) => post.title.replace(/\s+/g, "-") === decodedSlug
  );

  console.log("Decoded Slug:", decodedSlug);
  console.log("All Posts:", allPosts);

  if (!post) {
    return <div>Post not found</div>;
  }
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
