import styles from './Admin.module.css'
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import AuthCheck from '../../components/AuthCheck'
import { auth, db } from '../../lib/firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import PostFeed from '../../components/PostFeed'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { UserContext } from '../../lib/context'
import { async } from '@firebase/util'
import toast from 'react-hot-toast'
import kebabCase from 'lodash.kebabcase'

export default function AdminPostsPage({}) {
  return (
    <main className={styles.input}>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = collection(doc(db, 'users', auth.currentUser.uid), 'posts')
  const constraints = []
  constraints.push(orderBy('createdAt'))
  const q = query(ref, ...constraints)
  const [snapshot] = useCollection(q)

  const posts = snapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed
        posts={posts}
        admin
      />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')
  const slug = encodeURI(kebabCase(title))
  const isValid = title.length > 3 && title.length < 100
  const createPost = async e => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = doc(collection(db, 'users', uid, 'posts'), slug)
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# Put your content here!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }
    await setDoc(ref, data)
    toast.success('Post created!')
    router.push(`/admin/${slug}`)
  }
  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Article"
        className="input"
      />
      <p>
        <strong>Slug:</strong>
        {slug}
      </p>
      <button
        type="submit"
        disabled={!isValid}
        className="btn-green"
      >
        Create New Post
      </button>
    </form>
  )
}
