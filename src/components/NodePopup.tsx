// src/components/NodePopup.tsx
interface NodePopupProps {
  name: string
  onClose: () => void
}

export default function NodePopup({ name, onClose }: NodePopupProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 w-64 text-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-gray-800">{name}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <ul className="space-y-1">
        <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">
          📚 View classes in this room
        </li>
        <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">
          🗺️ Get directions here
        </li>
        <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">
          💡 Check lighting conditions
        </li>
      </ul>
    </div>
  )
}