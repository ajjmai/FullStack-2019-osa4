const _ = require("lodash");

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

const mostBlogs = blogs => {
  const authors = _.map(blogs, "author");
  const result = _.chain(authors)
    .countBy()
    .toPairs()
    .orderBy(_.last, "desc")
    .head()
    .value();

  return result === undefined
    ? undefined
    : { author: result[0], blogs: result[1] };
};

const mostLikes = blogs => {
  const authors = blogs.map(b => [b.author, b.likes]);

  let helperArray = _.uniqBy(blogs, "author").map(b => ({
    author: b.author,
    likes: 0
  }));

  const calculateLikes = (a, l) => {
    const item = _.find(helperArray, ["author", a]);
    item.likes += l;
  };

  _.forEach(authors, ([a, l]) => calculateLikes(a, l));
  return _.maxBy(helperArray, "likes");
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
