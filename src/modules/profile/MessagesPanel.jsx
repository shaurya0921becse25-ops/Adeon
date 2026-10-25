import React from 'react'
import { Link } from 'react-router-dom'
import styles from './MessagesPanel.module.css'

/**
 * MessagesPanel component
 * Renders active chat threads and communications with local guides and hosts.
 *
 * @param {Object} props
 * @param {Array} props.threads
 */
export default function MessagesPanel({ threads = [] }) {
  if (!threads || threads.length === 0) {
    return (
      <article className={styles.panel} aria-labelledby="messages-panel-heading">
        <div className={styles.panelHead}>
          <div className={styles.panelTitle} id="messages-panel-heading">
            <span className={styles.symbol} aria-hidden="true">✉</span>
            Messages & Conversations
          </div>
        </div>
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No messages yet</h3>
          <p>You haven’t started any conversations with local guides yet.</p>
        </div>
      </article>
    )
  }

  return (
    <article className={styles.panel} aria-labelledby="messages-panel-heading">
      <div className={styles.panelHead}>
        <div className={styles.panelTitle} id="messages-panel-heading">
          <span className={styles.symbol} aria-hidden="true">✉</span>
          Messages & Conversations ({threads.length})
        </div>
      </div>

      <div className={styles.threadsList}>
        {threads.map((thread) => {
          const lastMsg =
            thread.messages && thread.messages.length > 0
              ? thread.messages[thread.messages.length - 1]
              : null

          return (
            <div key={thread.threadId || thread.id} className={styles.threadCard}>
              <img
                src={
                  thread.providerAvatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                }
                alt={thread.providerName || 'Guide'}
                className={styles.avatar}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
                }}
              />
              <div className={styles.threadInfo}>
                <div className={styles.threadTop}>
                  <span className={styles.providerName}>{thread.providerName || 'Local Guide'}</span>
                  <span className={styles.time}>
                    {lastMsg?.time || 'Recent'}
                  </span>
                </div>
                {thread.serviceTitle && (
                  <div className={styles.serviceTitle}>{thread.serviceTitle}</div>
                )}
                <div className={styles.lastMessage}>
                  {lastMsg ? lastMsg.text : 'Click to start chatting...'}
                </div>
              </div>
              <div className={styles.chatActions}>
                {thread.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{thread.unreadCount}</span>
                )}
                <Link to="/chat" className={styles.openChatBtn}>
                  Open Chat
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
