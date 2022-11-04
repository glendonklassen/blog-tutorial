import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'

export default function App({ Component, pageProps }) {
  return (
    <UserContext.Provider value={{ user:{}, username: 'glendon'}}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}
