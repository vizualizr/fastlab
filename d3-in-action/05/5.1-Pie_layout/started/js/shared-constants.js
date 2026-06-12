const margin = { top: 50, right: 0, bottom: 50, left: 70 };
const width = 900;
const height = 350;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// const formatsInfo = [
//   { id: "vinyl", label: "Vinyl", color: "DarkSlateGrey" },
//   { id: "eight_track", label: "8-Track", color: "DimGrey" },
//   { id: "cassette", label: "Cassette", color: "brown" },
//   { id: "cd", label: "CD", color: "greenYellow" },
//   { id: "download", label: "Download", color: "coral" },
//   { id: "streaming", label: "Streaming", color: "crimson" },
//   { id: "other", label: "Other", color: "black" },
// ];

const formatsInfo = [
  { id: "vinyl", label: "Vinyl", color: "#6A777A" }, // 차분한 민트빛 회색
  { id: "eight_track", label: "8-Track", color: "#8E8B8B" }, // 따뜻한 느낌의 웜 그레이
  { id: "cassette", label: "Cassette", color: "#C4A497" }, // 부드러운 코랄 브라운/베이지
  { id: "cd", label: "CD", color: "#D4E79E" }, // 은은한 파스텔 연두
  { id: "download", label: "Download", color: "#4CCFC6" }, // 파스텔 터콰이즈 ➔ 더 선명하고 맑은 청록빛 민트
  { id: "streaming", label: "Streaming", color: "#6CA6DD" }, // 파스텔 하늘색 ➔ 농도가 짙어진 또렷한 스카이 블루
  { id: "other", label: "Other", color: "#4A4A4A" }, // 조화를 이루는 다크 그레이
];
