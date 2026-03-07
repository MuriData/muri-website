import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { Header, Footer } from './components'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import OrderDetail from './pages/dashboard/OrderDetail'
import Explorer from './pages/Explorer'
import BlockDetail from './pages/explorer/BlockDetail'
import DocsLayout from './layouts/DocsLayout'
import DocsIndex from './pages/DocsIndex'
import DocsPage from './pages/DocsPage'
import BlogLayout from './layouts/BlogLayout'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import PageTransition from './components/PageTransition'

function App() {
  const location = useLocation()

  return (
    <div className="main-wrapper">
      <Header />
      <PageTransition locationKey={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/order/:orderId" element={<OrderDetail />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/explorer/block/:blockNumber" element={<BlockDetail />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<DocsIndex />} />
            <Route path="*" element={<DocsPage />} />
          </Route>
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogIndex />} />
            <Route path=":slug" element={<BlogPost />} />
          </Route>
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  )
}

export default App
