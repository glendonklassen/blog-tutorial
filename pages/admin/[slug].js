import styles from './Admin.module.css'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import AuthCheck from '../../components/AuthCheck'
import { auth, db } from '../../lib/firebase'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import ImageUploader from '../../components/ImageUploader'

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </main>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)
  const router = useRouter()
  const { slug } = router.query

  const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug)
  const [post] = useDocumentData(postRef)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: 'onChange',
  })
  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    })
    reset({ content, published })
    toast.success('Updated successfully!')
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <>
          <div className="card">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
          <fieldset>
            <input
              name="published"
              type="checkbox"
              {...register('published')}
            />
            <label>Published</label>
          </fieldset>
          <button
            type="submit"
            className="btn-green"
          >
            Save Changes
          </button>
        </>
      )}
      {!preview && (
        <div className={preview ? styles.hidden : styles.controls}>
          <ImageUploader />
          <textarea
            name="content"
            className={styles.textarea}
            {...register('content')}
          ></textarea>
        </div>
      )}
    </form>
  )
}
