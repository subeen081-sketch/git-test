const progressBar = document.getElementById("progressBar");
const heroBg = document.getElementById("heroBg");
const topAppBar = document.getElementById("topAppBar");
const fab = document.getElementById("fab");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* FAB 클릭 시 맨 위로 이동 */
fab.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});

/* ===== [효과 1] 아래에서 위로 페이드인 =====
   IntersectionObserver로 요소가 화면에 들어오는 순간을 감지해
   is-visible 클래스를 붙여 CSS 트랜지션을 실행 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  {
    threshold: 0.15,               // 요소가 15% 보이면 실행
    rootMargin: "0px 0px -10% 0px" // 화면 하단보다 살짝 위에서 실행
  }
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

/* ===== 스크롤 시 실행되는 효과 (2, 3) =====
   requestAnimationFrame으로 프레임당 한 번만 계산해 부드럽고 가볍게 처리 */
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;

  /* [효과 3] 스크롤 진행률 프로그래스 바
     현재 스크롤 위치 / 전체 스크롤 가능한 길이 = 0 ~ 1 */
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  /* [효과 2] 히어로 배경 패럴랙스
     스크롤 양의 30%만큼만 배경을 아래로 이동 → 콘텐츠보다 느리게 움직이는 느낌
     히어로가 화면에 보이는 동안에만 계산 */
  if (!reduceMotion && scrollY <= window.innerHeight) {
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
  }

  /* M3 Top app bar: 히어로를 지나면 surface-container 색으로 전환 */
  topAppBar.classList.toggle("is-scrolled", scrollY > window.innerHeight - topAppBar.offsetHeight);

  /* M3 FAB: 히어로 절반 이상 내려가면 표시 */
  fab.classList.toggle("is-visible", scrollY > window.innerHeight * 0.5);

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", onScroll);
onScroll(); // 초기 상태 반영
