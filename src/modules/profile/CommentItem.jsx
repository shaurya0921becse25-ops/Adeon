import { useState } from 'react'
import styles from './CommentItem.module.css'

/**
 * CommentItem component
 * Displays a community discussion post/comment either in compact overview mode
 * or expanded detail mode.
 *
 * @param {Object} props
 * @param {Object} props.comment
 * @param {boolean} [props.detailed=false] - Whether to show the full comment view
 */
export default function CommentItem({ comment, detailed = false }) {
  const { community, time, title, excerpt, shortExcerpt, image } = comment
  const [imgSrc, setImgSrc] = useState(image)

  return (
    <article className={styles.communityItem}>
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        className={styles.communityImg}
        onError={() =>
          setImgSrc(
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=120&q=80',
          )
        }
        loading="lazy"
      />
      <div className={styles.communityBody}>
        {detailed ? (
          <div className={styles.subreddit}>
            {community} · {time}
          </div>
        ) : (
          <div className={styles.subreddit}>{community}</div>
        )}

        <div className={styles.commentTitle}>{title}</div>

        {detailed ? (
          <div className={styles.excerptFull}>{excerpt}</div>
        ) : (
          <>
            <div className={styles.excerptTruncated}>
              {shortExcerpt || excerpt}
            </div>
            <div className={styles.time}>{time}</div>
          </>
        )}
      </div>
    </article>
  )
}
