export default function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-amber-500 tracking-wider">
      {'★'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}
