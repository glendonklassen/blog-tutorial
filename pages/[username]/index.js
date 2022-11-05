import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

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