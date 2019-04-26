const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  return blogs.map(b => b.likes).reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  const reducer = (acc, curr) => {
    return acc.likes > curr.likes ? acc : curr;
  };
  return blogs.length === 0 ? undefined : blogs.reduce(reducer, 0);
};

const mostBlogs = blogs => {};

const mostLikes = blogs => {};

module.exports = { dummy, totalLikes, favoriteBlog };
