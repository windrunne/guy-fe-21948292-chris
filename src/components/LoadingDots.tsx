// Loading dots animation component

export const LoadingDots: React.FC = () => {
  return (
    <span className="inline-flex gap-1.5 ml-2 align-middle">
      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
      <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
    </span>
  )
}

