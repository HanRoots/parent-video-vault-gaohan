const videos = Array.isArray(window.PARENT_MEETING_VIDEOS)
  ? window.PARENT_MEETING_VIDEOS
  : [];

const player = document.querySelector("#videoPlayer");
const title = document.querySelector("#videoTitle");
const meta = document.querySelector("#videoMeta");
const description = document.querySelector("#videoDescription");
const openLink = document.querySelector("#openVideoLink");
const list = document.querySelector("#videoList");
const count = document.querySelector("#videoCount");
const template = document.querySelector("#videoCardTemplate");

function formatMeta(video) {
  return [video.date, video.duration].filter(Boolean).join(" · ");
}

function selectVideo(index) {
  const video = videos[index];
  if (!video) return;

  title.textContent = video.title || "家长会视频";
  meta.textContent = formatMeta(video);
  description.textContent = video.description || "";
  description.hidden = !video.description;
  openLink.href = video.url;
  player.src = video.url;
  player.poster = video.poster || "";

  document.querySelectorAll(".video-card").forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === index);
  });
}

function renderList() {
  count.textContent = String(videos.length);
  list.innerHTML = "";

  if (!videos.length) {
    title.textContent = "暂无视频";
    meta.textContent = "";
    description.textContent = "请先在 videos.js 中添加 OSS 视频地址。";
    openLink.hidden = true;
    player.hidden = true;
    return;
  }

  videos.forEach((video, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector("[data-field='title']").textContent = video.title || `视频 ${index + 1}`;
    card.querySelector("[data-field='meta']").textContent = formatMeta(video) || "家长会视频";
    card.addEventListener("click", () => selectVideo(index));
    list.appendChild(card);
  });

  selectVideo(0);
}

renderList();
