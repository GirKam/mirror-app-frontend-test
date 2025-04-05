import PostCard from './PostCard';
import './Posts.css';
import { User } from '../../../server/src/users/interface';
import { Settings } from '../../../server/src/settings/interface';
import { Post } from '../../../server/src/posts/interface';

interface PostsProps {
  posts: Post[];
  settings: Settings;
  onLoadMore: () => void;
  hasMore: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  users: Record<string, User>;
}

const Posts = ({
  posts,
  settings,
  onLoadMore,
  hasMore,
  pagination,
  onPageChange,
  users,
}: PostsProps) => {
  const { layout, template, navigation } = settings;
  const { current, params } = layout;
  const { columns, rows } = params[current];

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, auto)`,
    gap: '20px',
  };

  const masonryStyle = {
    columnCount: columns,
    gap: '20px',
  };

  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            «
          </button>
        )}
        {pages}
        {currentPage < totalPages && (
          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
            »
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="posts-container">
      <div
        className={`posts-layout ${current}`}
        style={current === 'grid' ? gridStyle : masonryStyle}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} template={template} user={users[post.userId]} />
        ))}
      </div>

      {navigation === 'load-more' && hasMore && (
        <button className="load-more" onClick={onLoadMore}>
          Загрузить еще
        </button>
      )}

      {navigation === 'pagination' && renderPagination()}
    </div>
  );
};

export default Posts;
