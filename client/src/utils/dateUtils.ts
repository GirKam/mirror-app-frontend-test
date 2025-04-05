export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'день' : 'дня'} назад`;
  }

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
