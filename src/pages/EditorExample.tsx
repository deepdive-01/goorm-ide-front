import Editor from '../components/Editor/Editor'
import { mockTimer } from '../mocks/fixtures'

function EditorExample() {
  return (
    <div className="bg-background h-full w-full">
      <div className="w-150 p-10">
        <Editor width="w-full" height="30vh" roomId={mockTimer.room_id} />
      </div>
    </div>
  )
}

export default EditorExample
