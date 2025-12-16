const started = performance.now() / 1000;
const log = (msg) => {
    const element = document.createElement('div');
    element.className = 'log';
    element.textContent = `> ${msg}`;
    document.getElementById('output').appendChild(element);
    console.log(msg);
}

log(`메인 함수 시작 ${started}초부터`);

const attachImage = (selector, blob) => {
    const objectURL = URL.createObjectURL(blob);
    const element = document.querySelector(selector);
    element.style.backgroundImage = `url('${objectURL}')`;
    element.style.backgroundSize = '100% auto';
}

// async 함수로 선언한다. 따라서 반환값이 Promise 객체로 고정된다.
async function loadImage(src) {
    log(`${src} image loading started`);
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status} for ${src}`);
    }
    const blob = await response.blob();
    log(`${src} image loaded ${performance.now() / 1000 - started}초 소요`);

    return blob;
}

const imagesConfig = [
    { src: './images/marble.jpg', selector: '.card' },
    { src: './images/gogh.jpg', selector: 'body' }
];

// Promise 객체이므로 변수 results가 선언되는 즉시 비동기 로딩이 시작된다.
// imagesConfig.map(config => loadImage(config.src))를 먼저 실행한다.
const results = Promise.allSettled(
    imagesConfig.map(config => loadImage(config.src)
    )
);
results.then(() => {
    log("비동기 로딩 완료!");
    console.log(results);
});
const resultsArray = await results;

for (const [index, result] of resultsArray.entries()) {
    const { selector, src } = imagesConfig[index];
    if (result.status === 'fulfilled') {
        attachImage(selector, result.value);
    } else {
        log(`${selector} (src: ${src}) failed: ${result.reason}`);
    }
}