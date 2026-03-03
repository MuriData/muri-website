import './BrandMark.css'

function BrandMark({ color }) {
  const style = color ? { backgroundColor: color } : undefined
  return (
    <div className="brand-mark">
      <div className="brand-line" style={style} />
      <div className="brand-line" style={style} />
    </div>
  )
}

export default BrandMark
