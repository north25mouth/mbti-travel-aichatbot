// 「MBTI別プランを見る」ボタンをクリック → 専用ページへ遷移
document.getElementById("mbti-btn").addEventListener("click", () => {
    window.location.href = "https://north25mouth.github.io/mbti-travel-aichatbot/public/diagnose";
});


// ────── ５枚スライダー初期化 ──────
const mySwiper = new Swiper('.my-swiper', {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // 表示枚数を画面幅に応じて変える
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 16,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 24,
        }
    }
});
