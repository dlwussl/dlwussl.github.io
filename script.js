let selectedMood = "";

    function signup() {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const users = JSON.parse(localStorage.getItem("users")) || {};

      if (!email || !password) {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
      }

      if (users[email]) {
        alert("이미 등록된 이메일입니다.");
        return;
      }

      users[email] = { password, entries: [] };
      localStorage.setItem("users", JSON.stringify(users));
      alert("회원가입 성공! 다시 로그인 해주세요.");
    }

    function login() {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const users = JSON.parse(localStorage.getItem("users")) || {};

      if (!email || !password) {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
      }

      if (!users[email] || users[email].password !== password) {
        alert("로그인에 실패했습니다. 이메일 혹은 비밀번호를 다시 한번 확인해주세요.");
        return;
      }

      localStorage.setItem("currentUser", email);
      showMoodSection();
    }

    function logout() {
      localStorage.removeItem("currentUser");
      location.reload();
    }

    function showMoodSection() {
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("mood-section").style.display = "block";
      document.getElementById("history-section").style.display = "none";
      showRandomQuote();

      const today = new Date();
      const formattedDate = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });

      document.getElementById("today-date").textContent = `📅 ${formattedDate}`;
      loadHistory();
    }

    function selectMood(mood) {
      selectedMood = mood;
    }

    function saveEntry() {
      const journal = document.getElementById("journal").value;
      const tags = document.getElementById("tags").value;
      const email = localStorage.getItem("currentUser");
      const users = JSON.parse(localStorage.getItem("users"));
      const date = new Date().toLocaleDateString();
      const entry = { date, mood: selectedMood, journal, tags };

      if (!selectedMood || !journal.trim()) {
        alert("감정과 내용을 모두 입력해주세요.");
        return;
      }

      users[email].entries.push(entry);
      localStorage.setItem("users", JSON.stringify(users));

      document.getElementById("journal").value = "";
      document.getElementById("tags").value = "";
      selectedMood = "";

      showHistory();
    }

    function showHistory() {
      document.getElementById("mood-section").style.display = "none";
      document.getElementById("history-section").style.display = "block";
      loadHistory();
    }

    function backToMood() {
      document.getElementById("history-section").style.display = "none";
      document.getElementById("mood-section").style.display = "block";
    }

    function loadHistory() {
      const email = localStorage.getItem("currentUser");
      const users = JSON.parse(localStorage.getItem("users")) || {};
      const user = users[email];
      const historyDiv = document.getElementById("history");

      if (!user || !user.entries || user.entries.length === 0) {
        historyDiv.innerHTML = "<p>아직 기록이 없습니다.</p>";
        return;
      }

      historyDiv.innerHTML = user.entries.map((e, index) => `
        <div style="margin-bottom: 15px;">
          <strong>📅 ${e.date} ${e.mood}</strong><br>
          ${e.journal}<br>
          <em style="color:#ccc">${e.tags}</em><br>
          <button onclick="deleteEntry(${index})" style="margin-top:8px; background:#ff8080; color:#fff;">삭제</button>
          <hr style="border-color:#444">
        </div>
      `).join("");
    }

    function deleteEntry(index) {
      const email = localStorage.getItem("currentUser");
      const users = JSON.parse(localStorage.getItem("users"));

      if (!confirm("정말 이 기록을 삭제할까요?")) return;

      users[email].entries.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      loadHistory();
    }

    function showRandomQuote() {
      const quotes = [
        "분노, 증오, 질투, 교만, 자만, 두려움은 우리 모두의 눈을 멀게 할 수 있다.",
        "가장 강한 사람은 자신의 감정을 조절할 줄 아는 사람이다.",
        "당신의 감정은 상대방에게 전이된다는 사실을 명심하라.",
        "마음이란 이랬다 저랬다 물결치는 것과 같다.",
        "감정을 관리한다는 것은 자유롭게 감정을 느끼되, 그 감정에 얽매이지 않는 것이다.",
        "이성을 사용하지 못하는 사람은 감정을 동원한다.",
        "생각과 감정에 절대 속지 마라.",
        "감정은 인생의 중요한 부분이지만, 그것에 휘둘리지 않고 현명하게 대처해야 한다.",
      ];
      const quoteBox = document.getElementById("quote-box");
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteBox.innerText = randomQuote;
    }

    if (localStorage.getItem("currentUser")) {
      showMoodSection();
    }