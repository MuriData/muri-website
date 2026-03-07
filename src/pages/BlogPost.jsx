import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useBlogContent } from '../hooks/useContentLoader'
import MarkdownRenderer from '../components/MarkdownRenderer/MarkdownRenderer'
import Badge from '../components/Badge/Badge'
import Divider from '../components/Divider/Divider'
import './BlogPost.css'

function BlogPost() {
  const { slug } = useParams()
  const { loading, content, frontmatter } = useBlogContent(slug)

  if (loading) {
    return <div className="blog-post__loading">Loading...</div>
  }

  if (!content) {
    return (
      <div className="blog-post__not-found">
        <h1>Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
      </div>
    )
  }

  const formattedDate = frontmatter?.date
    ? new Date(frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <article className="blog-post">
      <Helmet>
        <title>{frontmatter?.title ? `${frontmatter.title} — MuriData Blog` : 'MuriData Blog'}</title>
        {frontmatter?.description && <meta name="description" content={frontmatter.description} />}
      </Helmet>
      <Link to="/blog" className="blog-post__back">← Back to Blog</Link>
      <div className="blog-post__header">
        <div className="blog-post__meta">
          {formattedDate && <span className="blog-post__date">{formattedDate}</span>}
          {frontmatter?.author && <span className="blog-post__author">{frontmatter.author}</span>}
        </div>
        {frontmatter?.tags && frontmatter.tags.length > 0 && (
          <div className="blog-post__tags">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="value">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
      <MarkdownRenderer content={content} />
    </article>
  )
}

export default BlogPost
