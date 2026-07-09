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
const summarySection = document.querySelector("#videoSummary");
const summaryList = document.querySelector("#summaryList");
const anchorsSection = document.querySelector("#videoAnchors");
const anchorList = document.querySelector("#anchorList");

function formatMeta(video) {
  return [video.date, video.duration].filter(Boolean).join(" · ");
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = Math.floor(seconds % 60);
  const minuteText = hours ? String(minutes).padStart(2, "0") : String(minutes);
  const secondText = String(remainder).padStart(2, "0");
  return hours ? `${hours}:${minuteText}:${secondText}` : `${minuteText}:${secondText}`;
}

function renderSummary(video) {
  const items = Array.isArray(video.summary) ? video.summary : [];
  summaryList.innerHTML = "";
  summarySection.hidden = !items.length;

  items.forEach((item) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = item;
    summaryList.appendChild(paragraph);
  });
}

function renderAnchors(video) {
  const anchors = Array.isArray(video.anchors) ? video.anchors : [];
  anchorList.innerHTML = "";
  anchorsSection.hidden = !anchors.length;

  anchors.forEach((anchor) => {
    const button = document.createElement("button");
    button.className = "anchor-card";
    button.type = "button";
    button.innerHTML = `
      <span class="anchor-time">${formatTime(anchor.time)}</span>
      <span class="anchor-copy">
        <strong></strong>
        <small></small>
      </span>
    `;
    button.querySelector("strong").textContent = anchor.title || "视频片段";
    button.querySelector("small").textContent = anchor.text || "";
    button.addEventListener("click", () => {
      player.currentTime = Math.max(0, Number(anchor.time) || 0);
      player.play().catch(() => {});
      player.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    anchorList.appendChild(button);
  });
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
  renderSummary(video);
  renderAnchors(video);

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
    summarySection.hidden = true;
    anchorsSection.hidden = true;
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
