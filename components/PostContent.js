import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import MetaTags from './Metatags'

export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === 'number'
      ? new Date(post.createdAt)
      : post.createdAt.toDate()
  return (
    <>
      <MetaTags title={post.title} />
      <div className="card">
        <h1>{post?.title}</h1>
        <span className="text-sm">
          Written by <Link href={`/${post.username}`}>@{post.username}</Link> on{' '}
          {createdAt.toISOString()}
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </span>
      </div>
    </>
  )
}
