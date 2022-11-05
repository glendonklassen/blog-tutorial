import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import { getUserWithUsername } from '../../lib/firebase'

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    // JSON serializable data
    let user = null;
    let posts = null;
    return {
        props: { user, posts },
    };
}

export default function UsernameIndexPage({ user, posts }) {
    return (
        <main>
            <h1>I'm a username page</h1>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    )
}