const tracks = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    duration: "6:12",
  },
  {
    title: "Dreamscape",
    artist: "Ambient Lab",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    duration: "5:32",
  },
  {
    title: "Night Drive",
    artist: "Synthwave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80",
    duration: "5:48",
  },
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("track-title");
const artist = document.getElementById("track-artist");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const loopToggle = document.getElementById("loop");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");

let trackIndex = 0;
let isPlaying = false;

const formatTime = (value) => {
  if (!value || Number.isNaN(value)) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const loadTrack = (index) => {
  const track = tracks[index];
  title.textContent = track.title;
  artist.textContent = track.artist;
  cover.src = track.cover;
  cover.alt = `Bìa bài hát ${track.title}`;
  audio.src = track.src;
  durationEl.textContent = track.duration;
  updatePlaylist();
};

const updatePlaylist = () => {
  playlist.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.classList.toggle("active", index === trackIndex);
    li.innerHTML = `
      <div>
        <strong>${track.title}</strong>
        <div>${track.artist}</div>
      </div>
      <span>${track.duration}</span>
    `;
    li.addEventListener("click", () => {
      trackIndex = index;
      loadTrack(trackIndex);
      playTrack();
    });
    playlist.appendChild(li);
  });
};

const playTrack = () => {
  audio.play();
  isPlaying = true;
  playButton.textContent = "⏸";
};

const pauseTrack = () => {
  audio.pause();
  isPlaying = false;
  playButton.textContent = "▶";
};

const togglePlay = () => {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
};

const nextTrack = () => {
  trackIndex = (trackIndex + 1) % tracks.length;
  loadTrack(trackIndex);
  playTrack();
};

const prevTrack = () => {
  trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(trackIndex);
  playTrack();
};

playButton.addEventListener("click", togglePlay);
prevButton.addEventListener("click", prevTrack);
nextButton.addEventListener("click", nextTrack);

loopToggle.addEventListener("change", (event) => {
  audio.loop = event.target.checked;
});

volume.addEventListener("input", (event) => {
  audio.volume = event.target.value;
});

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  currentTimeEl.textContent = formatTime(currentTime);
  if (duration) {
    progress.value = (currentTime / duration) * 100;
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (!audio.loop) {
    nextTrack();
  }
});

progress.addEventListener("input", (event) => {
  const newTime = (event.target.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

loadTrack(trackIndex);
audio.volume = volume.value;
