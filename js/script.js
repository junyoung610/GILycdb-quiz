const quizzes = [
  {
    date: "20260201",
    title: "13과 하나님께서 모세를 부르셨어요",
    desc: "하나님께서 모세를 부르시고 인도하신 말씀 퀴즈입니다.",
  },
  {
    date: "20260118",
    title: "12과 하나님의 인도 따라",
    desc: "하나님께서 요셉을 인도하신 퀴즈입니다.",
  },
  {
    date: "20251109",
    title: "8과 하나님 나라의 백성이 지켜야 할 두 가지 원칙",
    desc: "정의와 공의에 관한 말씀을 배우는 퀴즈입니다.",
  },
  {
    date: "20251019",
    title: "7과 보이지 않는 하나님 나라를 우리에게 보여주시기 위해",
    desc: "아브라함의 믿음과 순종에 관한 문제들입니다.",
  },
];

// 퀴즈 카드 렌더링
const list = document.getElementById("quizList");
list.innerHTML = quizzes
  .map((q) => {
    // ⭐ 이 부분을 수정합니다: 날짜에 하이픈을 넣어 YYYY-MM-DD 형식으로 만듭니다. ⭐
    const formattedDate = `${q.date.slice(0, 4)}-${q.date.slice(4, 6)}-${q.date.slice(6, 8)}`;

    return `
            <div class="quiz-card" onclick="location.href='quiz.html?date=${formattedDate}'">
                <div class="date">📅 ${formattedDate}</div>
                <div class="title">${q.title}</div>
                <div class="desc">${q.desc}</div>
            </div>
        `;
  })
  .join("");
