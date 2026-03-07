import { useEffect, useCallback } from 'react'
import { useOrderDetail } from '../../hooks/useOrderDetail'
import { formatMuri, formatChunks, truncateAddress } from '../../hooks/useDashboardData'
import './OrderDetailModal.css'

function OrderDetailModal({ orderId, onClose }) {
  const { details, financials, isLoading } = useOrderDetail(orderId)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  if (orderId == null) return null

  return (
    <div className="order-modal-overlay" onClick={handleClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal__header">
          <h3 className="order-modal__title">Order #{orderId.toString()}</h3>
          <button className="order-modal__close" onClick={handleClose} aria-label="Close">
            &times;
          </button>
        </div>

        {isLoading ? (
          <div className="order-modal__loading">Loading order data...</div>
        ) : (
          <div className="order-modal__body">
            {details && (
              <div className="order-modal__section">
                <h4 className="order-modal__section-title">Details</h4>
                <Row label="Owner" value={truncateAddress(details[0])} />
                <Row label="URI" value={details[1] || '—'} mono />
                <Row label="Root Hash" value={details[2] ? `0x${details[2].toString(16).slice(0, 12)}...` : '—'} />
                <Row label="Size" value={formatChunks(details[3])} />
                <Row label="Periods" value={details[4]?.toString()} />
                <Row label="Replicas" value={`${details[6]?.toString()} / ${details[5]?.toString()}`} />
              </div>
            )}

            {financials && (
              <div className="order-modal__section">
                <h4 className="order-modal__section-title">Financials</h4>
                <Row label="Escrow" value={`${formatMuri(financials[0])} MURI`} />
                <Row label="Withdrawn" value={`${formatMuri(financials[1])} MURI`} />
                <Row label="Start Period" value={financials[2]?.toString()} />
                <Row
                  label="Status"
                  value={
                    <span className={`order-status order-status--${financials[3] ? 'expired' : 'active'}`}>
                      {financials[3] ? 'Expired' : 'Active'}
                    </span>
                  }
                />
                {financials[4] && financials[4].length > 0 && (
                  <div className="order-modal__nodes">
                    <span className="order-modal__label">Assigned Nodes</span>
                    <div className="order-modal__node-list">
                      {financials[4].map((addr) => (
                        <span key={addr} className="order-modal__node-pill">{truncateAddress(addr)}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!details && !financials && (
              <div className="order-modal__empty">No data available for this order.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="order-modal__row">
      <span className="order-modal__label">{label}</span>
      <span className={`order-modal__value${mono ? ' order-modal__value--mono' : ''}`}>{value ?? '—'}</span>
    </div>
  )
}

export default OrderDetailModal
