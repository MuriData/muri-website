import { Link } from 'react-router-dom'
import Panel from '../Panel/Panel'
import Badge from '../Badge/Badge'
import Divider from '../Divider/Divider'
import './BlogCard.css'

function BlogCard({ slug, title, date, author, tags, description }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <Link to={`/blog/${slug}`} className="blog-card__link">
      <Panel variant="surface" className="blog-card">
        <div className="blog-card__meta">
          {formattedDate && <span className="blog-card__date">{formattedDate}</span>}
          {author && <span className="blog-card__author">{author}</span>}
        </div>
        <h3 className="blog-card__title">{title}</h3>
        {description && <p className="blog-card__desc">{description}</p>}
        <Divider tight />
        {tags && tags.length > 0 && (
          <div className="blog-card__tags">
            {tags.map((tag) => (
              <Badge key={tag} variant="value">{tag}</Badge>
            ))}
          </div>
        )}
      </Panel>
    </Link>
  )
}

export default BlogCard
