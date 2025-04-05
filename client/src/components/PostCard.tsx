import './PostCard.css';
import { formatDate } from '../utils/dateUtils';

import { Post } from '../../../server/src/posts/interface';
import { User } from '../../../server/src/users/interface';
import { Settings } from '../../../server/src/settings/interface';

type SettingsTemplate = Settings['template'];

interface PostCardProps {
  post: Post;
  template: SettingsTemplate;
  user?: User;
}

const PostCard = ({ post, template, user }: PostCardProps) => {
  const { caption, likes, comments, date, permalink } = post;
  const username = user ? `@${user.username}` : '@user';

  return (
    <div className={`post-card ${template}`}>
      <div className="post-content">
        {template === 'hover' && (
          <div className="post-hover-overlay">
            <a href={permalink} target="_blank" rel="noopener noreferrer">
              View Post
            </a>
          </div>
        )}

        <span className="post-date">{formatDate(date)}</span>

        <span className="username">{username}</span>

        <p className="post-caption">{caption}</p>

        <div className="post-stats">
          <span>❤️ {likes}</span>
          <span>💬 {comments}</span>
        </div>

        {template === 'classic' && (
          <a href={permalink} className="post-link" target="_blank" rel="noopener noreferrer">
            View Post
          </a>
        )}
      </div>
    </div>
  );
};

export default PostCard;
