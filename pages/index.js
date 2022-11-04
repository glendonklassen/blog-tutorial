import Loader from '../components/Loader'
import toast  from 'react-hot-toast'
import { useContext } from "react";
import { UserContext } from "../lib/context";


export default function Home() {
  const { user, username } = useContext(UserContext);
  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={() => toast.success(`${username} is logged in`)}>Create Toast</button>
      <Loader show></Loader>
    </div>
  )
}
