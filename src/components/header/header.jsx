

function header({formatCurrentTime, currentTime, formatTime}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="text-center">
        <h1 className="text-lg font-medium text-gray-800 mb-2">Daily Log</h1>
        <p className="text-sm text-gray-600 mb-1">{formatCurrentTime(currentTime)}</p>
        <p className="text-xs text-gray-500 font-mono">
          Current time: {formatTime(currentTime)}
        </p>
      </div>
    </div>
  )
}

export default header