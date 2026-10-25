import CommentItem from './CommentItem'
import styles from './CommentsPanel.module.css'

/**
 * CommentsPanel component
 * Displays full list of user community discussions and replies.
 *
 * @param {Object} props
 * @param {Array} props.comments
 * @param {number} [props.totalCount=28]
 */
export default function CommentsPanel({ comments, totalCount = 28 }) {
  return (
    <article className={styles.panel} aria-labelledby="all-comments-heading">
      <div className={styles.panelHead}>
        <div className={styles.panelTitle} id="all-comments-heading">
          <span className={styles.symbol} aria-hidden="true">
            ☏
          </span>
          Community comments
        </div>
        <span className={styles.muted}>{totalCount} posts and replies</span>
      </div>
      <div>
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} detailed={true} />
        ))}
      </div>
    </article>
  )
}
