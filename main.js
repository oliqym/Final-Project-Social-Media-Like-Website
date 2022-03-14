/*
 * main.js
 * Name: Olivia Qianyi Ma
 * Student numbers: A00975805
 * Date:3/28/2021
 * comp2132 final project
 */

//fetch the data if the localStorage has no posts
if (!localStorage.getItem("posts")) {
  fetch("https://comp2132.herokuapp.com/posts")
    //convert data to json
    .then(function (response) {
      return response.json();
    })
    //save the json to localStorage as strings
    .then(function (posts) {
      renderContent(posts);
      localStorage.setItem("posts", JSON.stringify(posts));
    });
}

//get the saved content if theres posts in localStorage
else {
  renderContent(JSON.parse(localStorage.getItem("posts")));
}

//create the search events for hashtags and usernames
const searchInput = document.getElementsByClassName("search")[0];
document
  .getElementsByClassName("search")[0]
  .addEventListener("keyup", function (event) {
    const searchValue = searchInput.value;
    let posts = JSON.parse(localStorage.getItem("posts"));
    posts = posts.filter(function (post) {
      return (
        post.body.hashtags.includes(searchValue) ||
        post.username.includes(searchValue)
      );
    });
    renderContent(posts);
  });

//click on like icon
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("icon-like")) {
    const postID = event.target.id.split("-")[
      event.target.id.split("-").length - 1
    ];
    handleLike(postID);
  }

  //focus to the comment input
  if (event.target.classList.contains("icon-comment")) {
    const postID = event.target.id.split("-")[
      event.target.id.split("-").length - 1
    ];
    handleCommentFocus(postID);
  }

  // handle post comment
  if (event.target.classList.contains("comment-submit")) {
    // all the solution for part 4 goes inside this if block
    const postID = event.target.getAttribute("data-target");
    handleComment(postID);
  }

  // expand the except
  if (event.target.classList.contains("more")) {
    const postID = event.target.id;
    handleMoreText(postID);
  }

  // handle more text click
  if (event.target.classList.contains("post-body-hashtags")) {
    const postID = event.target.id;
    handleMoreText(postID);
  }

  // handle hashtag click
  if (event.target.classList.contains("hashtag")) {
    const hashtag = event.target.innerHTML.slice(1);
    handleHashTagSearch(hashtag);
  }

  // handle hashtag remove click
  if (event.target.classList.contains("remove")) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    renderContent(posts);
  }
});

//adding the likes count
function handleLike(postID) {
  const targetElement = document.getElementById(`post-meta-likes-${postID}`);
  let currentLikes = parseInt(targetElement.innerHTML);
  currentLikes++;
  targetElement.innerHTML = currentLikes;
}

//focus the comment input field via the comment icon
function handleCommentFocus(postID) {
  document.getElementById(`add-comment-${postID}`).focus();
}

//adding comments
function handleComment(postID) {
  const content = document.getElementById(`add-comment-${postID}`).value;
  if (content) {
    const newHtmlContent = `<p class="comment">
  <span class="user-name">you</span>
  <span class="comment-text">${content}</span>
  </p>`;

    let originalHTMLContent = document.getElementById(`comments-${postID}`)
      .innerHTML;
    originalHTMLContent += newHtmlContent;
    document.getElementById(
      `comments-${postID}`
    ).innerHTML = originalHTMLContent;
    document.getElementById(`add-comment-${postID}`).value = "";
  }
}

//display hashtag in search
function handleHashTagSearch(hashTag) {
  let posts = JSON.parse(localStorage.getItem("posts"));
  posts = posts.filter(function (post) {
    return post.body.hashtags.includes(hashTag);
  });
  renderContent(posts, hashTag);
}

//the excerpt of post for >= 70 characters
function textExcerpt(id, text, excerpt) {
  let displayContent = text;
  if (text.length >= 70) {
    displayContent = excerpt + ` <span class="more" id="${id}">more</span>`;
  }
  const content = `<span class="post-body-text" id="post-body-${id}" data-full-content="${text}" data-excerpt-content="${excerpt}">
    ${displayContent}
    </span>`;

  return content;
}

//expand excerpts
function handleMoreText(postID) {
  const targetElement = document.getElementById(`post-body-${postID}`);
  const newContent = targetElement.getAttribute("data-full-content");
  targetElement.innerHTML = newContent;
}

//the number of days since the post was created
function calDates(datePosted) {
  const past = new Date(datePosted);
  const now = new Date();
  const timeInterval = now.getTime() - past.getTime();
  const dateDiff = timeInterval / (1000 * 24 * 60 * 60);
  return Math.round(dateDiff);
}

//display the hashtags
function renderHashTags(hashTags, currentHashTag) {
  let content = "";
  hashTags.forEach(function (hashTag) {
    if (currentHashTag === hashTag) {
      content += `<span class="hashtag current-hashtag">#${hashTag} <img src="images/times-circle-regular.svg" class="remove icon"></span>`;
    } else {
      content += `<span class="hashtag">#${hashTag}</span>`;
    }
  });
  return content;
}

//display comments
function renderComents(comments) {
  let commentSection = "";
  for (let comment of comments) {
    const { username, commentText } = comment;
    commentSection += `<p class="comment"><span class="user-name">${username}</span> <span class="comment-text">${commentText}</span></p>`;
  }
  return commentSection;
}

//display posts
function renderContent(posts, currentHashTag = "") {
  document.querySelector(".posts").innerHTML = "";
  for (let post of posts) {
    document.querySelector(".posts").innerHTML += `<div class="post">
          <header class="post-header">
          <img src="${post.iconUrl}" alt="" class="user-icon">
          <p class="user-name">${post.username}</p> </header>
          <div class="post-image">
          <img src="${post.imageUrl}"> </div>
          <div class="post-meta">
          <div class="post-meta-actions">
          <img src="images/heart-regular.svg" class="icon icon-like" id="post-meta-like-${
            post.id
          }">
          <img src="images/comment-regular.svg" class="icon icon-comment" id="post-meta-comment-${
            post.id
          }"> </div>
          <div class="post-meta-likes"> Liked by
          <span class="user-name">${post.likes[0].username}</span>
          and
          <span class="likes-count" id="post-meta-likes-${post.id}">${
      post.likes.length - 1
    }</span> others
              </div>
          </div>
          <div class="post-body">
          <div class="post-body-user">
          <p>
          <span class="user-name">${post.username}</span>
         ${textExcerpt(post.id, post.body.text, post.body.excerpt)}
          </p> </div>
          <div class="post-body-hashtags">${renderHashTags(
            post.body.hashtags,
            currentHashTag
          )}</div> </div>
          <div class="post-comments" id="comments-${post.id}">${renderComents(
      post.comments
    )}</div> <div class="post-date">${calDates(post.datePosted)} days ago</div>
          <div class="post-add-comment">
          <input type="text" placeholder="Add a comment..." class="comment-value" id="add-comment-${
            post.id
          }">
          <input type="submit" value="Post" class="comment-submit" data-target="${
            post.id
          }"> </div>
      </div>`;
  }
}
