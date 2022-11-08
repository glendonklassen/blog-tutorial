import { collection, collectionGroup, doc, where, getDocs, query } from "firebase/firestore";
import { postToJSON } from ".";
import { db, getUserWithUsername } from "../../lib/firebase";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from "../../components/PostContent";


export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const d = doc(db, 'users', userDoc.id);
        const q = query(collection(d, 'posts'), where('slug', '==', slug))
        const pDocs = await getDocs(q)
        post = postToJSON(pDocs.docs[0])

        path = pDocs.docs[0].ref.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    }
}

export async function getStaticPaths() {
    const snapshot = await getDocs(collectionGroup(db, 'posts'))

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug }
        }
    })

    return {
        paths,
        fallback: 'blocking',
    }
}

export default function UsernameIndexPage(props) {
    const postRef = doc(db, props.path);
    const test = useDocumentData(postRef);
    console.log(`this is test: \n ${test}`)
    const [ realtimePost ] = useDocumentData(postRef);

    const post = realtimePost || props.post

    return (
        <main>
            <section>
                <PostContent post={post} />
            </section>

            <aside className="card">
                <p>
                    <strong>{post.heartCount || 0} 🤍</strong>
                </p>

            </aside>
        </main>
    )
}