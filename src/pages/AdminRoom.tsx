import { useNavigate, useParams } from 'react-router-dom'

import deleteImg from '../assets/images/delete.svg'
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';



export function AdminRoom() {
  // const { user } = useAuth()
  const navigate = useNavigate()
  const params = useParams();
  
  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  async function handleEndRoom(){
    if(window.confirm("Deseja realmente encerrar a sala de Q&A?")) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })
  
      navigate('/')
    }
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div className="buttons">
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom} >Encerrar Sala</Button>
          </div>
          
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span> {questions.length} pergunta(s) </span> }
        </div>
        <div className="question-list">
          {questions.map(question => {
              return (
              <Question
                key={question.id}
                content={question.content} 
                author={question.author}
              >
                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
              )
            })}
        </div>
      </main>
    </div>
  )
}