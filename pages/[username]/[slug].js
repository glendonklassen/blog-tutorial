import styles from './Post.module.css'
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore'
import { postToJSON } from '.'
import { db, getUserWithUsername } from '../../lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import PostContent from '../../components/PostContent'
import MetaTags from '../../components/Metatags'
import AuthCheck from '../../components/AuthCheck'
import HeartButton from '../../components/HeartButton'
import Link from 'next/link'
import { UserContext } from '../../lib/context'
import { useContext } from 'react'

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  let post
  let path

  if (userDoc) {
    const ref = doc(collection(db, 'users', userDoc.id, 'posts'), slug)
    const dbDoc = await getDoc(ref)
    if (!dbDoc) {
      return { notFound: true }
    }
    post = postToJSON(dbDoc)
    path = ref.path
  }

  return {
    props: { post, path },
    revalidate: 5000,
  }
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(db, 'posts'))

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export default function UsernameIndexPage(props) {
  const postRef = doc(db, props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post
  const { user: currentUser } = useContext(UserContext)

  return (
    <main className={styles.container}>
      <MetaTags
        title={post.title}
        description={post.title}
      />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  )
}
