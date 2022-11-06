import {  collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { postToJSON } from ".";
import { db, getUserWithUsername } from "../../lib/firebase";

export async function getStaticProps({ params }){
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if(userDoc){
        const d = doc(db, 'posts', slug);
        post = postToJSON(await getDoc(d))

        path = post.path;
    }

    return {
        props: { post,path },
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

export default function UsernameIndexPage({ }) {
    return (
        <main className={styles.container}>
    
        </main>
    )
}