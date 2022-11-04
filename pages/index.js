import Loader from '../components/Loader'
import toast  from 'react-hot-toast'

export default function Home() {
  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={() => toast.success('this is my toast!')}>Create Toast</button>
      <Loader show></Loader>
    </div>
  )
}
