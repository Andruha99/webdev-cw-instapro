import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { addLike, deleteLike } from "../api.js";

export function renderUserPostsComponent({ appEl }) {
  const postsHtml = posts
    .map((post, index) => {
      return `<li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
           <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-index=${index} data-post-id="${
        post.id
      }" data-post-isLiked=${post.isLiked} data-user-id=${
        post.user.id
      } class="like-button">
            ${
              post.isLiked
                ? '<img src="./assets/images/like-active.svg">'
                : '<img src="./assets/images/like-not-active.svg">'
            }
            
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${post.createdAt}
        </p>
      </li>`;
    })
    .join("");

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${postsHtml}</ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  const likesBtn = document.querySelectorAll(".like-button");
  console.log(likesBtn);

  for (let likeBtn of likesBtn) {
    likeBtn.addEventListener("click", () => {
      console.log(likeBtn.dataset);
      console.log(typeof likeBtn.dataset.postIsliked);
      if (likeBtn.dataset.postIsliked === "false") {
        addLike({ postId: likeBtn.dataset.postId, token: getToken() }).then(
          (response) => {
            // likeBtn.dataset.isLiked = true;
            goToPage(USER_POSTS_PAGE, {
              userId: likeBtn.dataset.userId,
            });
            console.log(response);
          }
        );
      } else {
        deleteLike({ postId: likeBtn.dataset.postId, token: getToken() }).then(
          (response) => {
            // likeBtn.dataset.isLiked = true;
            goToPage(USER_POSTS_PAGE, {
              userId: likeBtn.dataset.userId,
            });
            console.log(response);
          }
        );
      }
      // if (likeBtn.dataset.isliked === "true") {
      //   deleteLike({ postId: likeBtn.dataset.postId, token: getToken() }).then(
      //     () => {
      //       // likeBtn.dataset.isLiked = false;
      //       // goToPage(POSTS_PAGE);
      //     }
      //   );
      // } else {
      //   addLike({ postId: likeBtn.dataset.postId, token: getToken() }).then(
      //     () => {
      //       // likeBtn.dataset.isLiked = true;
      //       // goToPage(POSTS_PAGE);
      //     }
      //   );
      // }
    });
  }
}
