import { Helmet } from 'react-helmet-async'
import manifest from 'virtual:content-manifest'
import BlogCard from '../components/BlogCard/BlogCard'
import './BlogIndex.css'

function BlogIndex() {
  return (
    <div className="blog-index">
      <Helmet>
        <title>Blog — MuriData</title>
      </Helmet>
      <h1 className="blog-index__title">Blog</h1>
      <p className="blog-index__desc">
        Updates, announcements, and technical deep-dives from the MuriData team.
      </p>
      <div className="blog-index__grid">
        {manifest.blog.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  )
}

export default BlogIndex
