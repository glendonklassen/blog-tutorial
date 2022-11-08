import Loader from '../components/Loader'
import { useState } from "react";
import { query, where, limit, getDocs, collectionGroup, orderBy, startAfter } from "firebase/firestore";
import { db } from '../lib/firebase';
import { postToJSON } from './[username]';
import PostFeed from '../components/PostFeed';
import { Timestamp } from 'firebase/firestore';

const LIMIT = 1;

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    
    const constraints = []
    constraints.push(where('published', '==', true))
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(startAfter(cursor))
    constraints.push(limit(LIMIT))
    const q = query(collectionGroup(db, 'posts'), ...constraints);
    const newPosts = (await getDocs(q)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));

    setLoading(false);
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}
      <Loader show={loading} />
      {postsEnd && 'You have reached the end!'}
    </main>
  )
}

export async function getServerSideProps(context){
  const constraints = []
  constraints.push(where('published', '==', true))
  constraints.push(orderBy('createdAt', 'desc'))
  constraints.push(limit(LIMIT))
  const q = query(collectionGroup(db, 'posts'), ...constraints);
  const docsRef = await getDocs(q)
  console.log(`now comes docs.map`)
  const posts = docsRef.docs.map(postToJSON);

  return {
    props: { posts }
  }
}