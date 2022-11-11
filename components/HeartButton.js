import { collection, doc, increment, writeBatch } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useDocument } from 'react-firebase-hooks/firestore'

export default function HeartButton({ postRef }) {
  const addHeart = async () => {
    const id = auth.currentUser.uid
    const batch = writeBatch(db)
    batch.update(postRef, { heartCount: increment(1) })
    batch.set(doc(heartRef, auth.currentUser.uid), { id })
    await batch.commit()
  }
  const removeHeart = async () => {
    const batch = writeBatch(db)
    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(doc(heartRef, auth.currentUser.uid))
    await batch.commit()
  }

  const heartRef = collection(postRef, 'hearts')

  const [heartDoc] = useDocument(doc(heartRef, auth.currentUser.uid))
  return heartDoc?.data() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  )
}
