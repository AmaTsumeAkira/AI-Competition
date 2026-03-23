interface ScoreBadgeProps {
  score: number
  level?: string
}

export default function ScoreBadge({ score, level }: ScoreBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
      {level && <span>{level}</span>}
      <span>{score}分</span>
    </span>
  )
}
