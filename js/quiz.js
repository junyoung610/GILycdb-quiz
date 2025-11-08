(async function () {
  // 비동기 함수로 전체 코드를 감싸 await를 사용할 수 있게 합니다.

  // 1. URL 파라미터에서 날짜 가져오기 및 초기 설정
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  const quizContent = document.getElementById("quizContent");

  if (!date) {
    quizContent.innerHTML = `<p style="text-align:center">URL에 'date' 파라미터가 없습니다.</p>`;
    return;
  }

  let quizData = null;

  // 2. 퀴즈 데이터(JSON 파일) 로드 및 에러 처리
  try {
    // fetch는 비동기 요청을 보냅니다.
    const response = await fetch("../data/quizzes.json");

    if (!response.ok) {
      throw new Error(
        `퀴즈 데이터 로드 실패: ${response.status} ${response.statusText}`
      );
    }

    // 응답을 실제 JSON 객체로 변환합니다. (⭐가장 중요⭐)
    const quizBank = await response.json();
    quizData = quizBank[date];
  } catch (error) {
    console.error("JSON 파일 처리 중 오류 발생:", error);
    quizContent.innerHTML = `<p style="text-align:center">데이터 로드 중 오류가 발생했습니다. 경로(../data/quizzes.json) 및 파일 형식을 확인하세요.</p>`;
    return;
  }

  // 3. 퀴즈 데이터 유효성 확인 및 로직 시작
  if (!quizData || quizData.length === 0) {
    quizContent.innerHTML = `<p style="text-align:center">해당 날짜(${date})의 퀴즈가 없습니다.</p>`;
  } else {
    let currentIndex = 0;
    // {문제_인덱스: 선택한_옵션_인덱스} 형태로 저장
    let answers = {};

    function renderQuestion() {
      const q = quizData[currentIndex];
      const selectedOptionIndex = answers[currentIndex];
      const hasAnswered = selectedOptionIndex !== undefined;

      let explanationText = hasAnswered
        ? q.options[selectedOptionIndex].explanation
        : "정답을 선택하시면 설명이 나타납니다.";

      quizContent.innerHTML = `
                <div class="meta">${currentIndex + 1} / ${quizData.length}</div>
                <div class="question">${q.question}</div>
                <div class="options">
                    ${q.options
                      .map((opt, i) => {
                        let classes = "option";
                        const optionText = opt.text;

                        if (hasAnswered) {
                          classes += " disabled";
                          // 정답 확인: isCorrect 속성 사용
                          if (opt.isCorrect) classes += " correct";
                          // 오답 확인: 선택한 옵션이면서 정답이 아닐 때
                          else if (i === selectedOptionIndex)
                            classes += " incorrect";
                        }
                        return `<div class="${classes}" data-index="${i}">${String.fromCharCode(
                          65 + i
                        )}. ${optionText}</div>`;
                      })
                      .join("")}
                </div>
                <div class="explanation" style="display: ${
                  hasAnswered ? "block" : "none"
                };">
                    ${explanationText}
                </div>
                <div class="controls">
                    <button class="btn secondary" id="prevBtn" ${
                      currentIndex === 0 ? "disabled" : ""
                    }>이전</button>
                    <div>
                        <button class="btn secondary" id="explainBtn">설명 보기/숨기기</button>
                        <button class="btn primary" id="nextBtn">${
                          currentIndex === quizData.length - 1
                            ? "결과 보기"
                            : "다음"
                        }</button>
                    </div>
                </div>
            `;

      // 이벤트 리스너 재등록
      document
        .querySelectorAll(".option:not(.disabled)")
        .forEach((el) => el.addEventListener("click", () => selectOption(el)));

      document.getElementById("prevBtn").addEventListener("click", prev);
      document.getElementById("nextBtn").addEventListener("click", next);
      document.getElementById("explainBtn").addEventListener("click", () => {
        const e = document.querySelector(".explanation");
        e.style.display = e.style.display === "block" ? "none" : "block";
        document.getElementById("explainBtn").textContent =
          e.style.display === "block" ? "설명 숨기기" : "설명 보기/숨기기";
      });
    }

    function selectOption(el) {
      const i = +el.dataset.index;

      if (answers[currentIndex] !== undefined) return; // 이미 답했으면 무시

      answers[currentIndex] = i; // 선택한 옵션 인덱스 저장

      // 정답 표시 및 설명 업데이트를 위해 렌더링 함수를 다시 호출합니다.
      renderQuestion();
    }

    function next() {
      if (currentIndex < quizData.length - 1) {
        currentIndex++;
        renderQuestion();
      } else showResult();
    }

    function prev() {
      if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
      }
    }

    function showResult() {
      const total = quizData.length;
      let correct = 0;
      quizData.forEach((q, i) => {
        const selectedIndex = answers[i];
        if (selectedIndex !== undefined) {
          // 정답 확인: 선택된 옵션의 isCorrect가 true인지 확인
          if (q.options[selectedIndex].isCorrect === true) {
            correct++;
          }
        }
      });
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      quizContent.innerHTML = `
                <div id="resultBox">
                    <h2>수고하셨습니다. 퀴즈가 완료되었습니다 🎉</h2>
                    <div class="result-stats">
                        <div class="result-card"><h3>점수</h3><p>${correct} / ${total}</p></div>
                        <div class="result-card"><h3>정확도</h3><p>${accuracy}%</p></div>
                    </div>
                    <br><br>
                    <button class="btn primary" onclick="location.href='index.html'">목록으로</button>
                </div>
            `;
    }

    renderQuestion();
  }
})();
