import { useNavigate } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home() {

  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const [ codeRoom, setCodeRoom ] = useState('')

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }
    navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()
    if(codeRoom.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${codeRoom}`).get();

    if(!roomRef.exists()) {
      alert('Room does not exists')
      return
    }

    if(!roomRef.val().endedAt) {
      alert('Room already closed.')
      return
    }

    navigate(`rooms/${codeRoom}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
          <div className="main-content">
            <img src={logoImg} alt="Letmeask" />
            <button className="create-room" onClick={handleCreateRoom}>
              <img src={googleIconImg} alt="Logo Google" />
              Crie sua sala com o Google
            </button>
            <div className="separator">
              ou entre em uma sala
            </div>
            <form onSubmit={handleJoinRoom}>
                <input 
                type="text"
                placeholder="Digite o código da sala"
                onChange={event => {setCodeRoom(event.target.value)}}
                value={codeRoom}
                />
                <Button type="submit">Entrar na Sala</Button>
            </form>
          </div>
      </main>
    </div>
  )
}