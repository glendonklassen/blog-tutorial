import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { getUserWithUsername, db } from '../../lib/firebase'
import { collection, where, limit, getDocs, orderBy } from "firebase/firestore";
import { query as firestoreQuery } from "firebase/firestore";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);
    let posts = null;
    let user = null;
    
    if(userDoc){
        user = userDoc.data();
        const constraints = []
        constraints.push(where('published', '==', true))
        constraints.push(where('uid', '==', userDoc.id))
        constraints.push(orderBy('createdAt', 'desc'))
        constraints.push(limit(5))
        const q = firestoreQuery(collection(db, 'posts'), ...constraints);
        const d = await getDocs(q);
        posts = d.docs.map(postToJSON);
    }

    return {
        props: { user, posts },
    };
}

export default function UsernameIndexPage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    )
}

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data?.createdAt?.toMillis(),
        updatedAt: data?.updatedAt?.toMillis(),
    }
}