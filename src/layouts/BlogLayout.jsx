import { Outlet } from 'react-router-dom'
import './BlogLayout.css'

function BlogLayout() {
  return (
    <div className="blog-layout">
      <Outlet />
    </div>
  )
}

export default BlogLayout
