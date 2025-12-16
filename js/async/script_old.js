// 아래 코드는 Promise를 사용한 예제이다.
// 지정된 대용량 이미지 파일을 불러와 <body>의 배경으로 지정한다.

const log = (msg) => {
    const element = document.createElement('div');
    element.className = 'log';
    element.textContent = `> ${msg}`;
    document.getElementById('output').appendChild(element);
    console.log(msg);
}

const attachImage = (selector, blob) => {
    const objectURL = URL.createObjectURL(blob);
    const element = document.querySelector(selector);
    element.style.backgroundImage = `url('${objectURL}')`;
    element.style.backgroundSize = '100% auto';
}

// 1. Promise 생성 함수
const loadImage = (src) => new Promise(function (resolve, reject) {
    log("Promise 객체 안의 executor 함수를 실행합니다.")
    const imageRequest = new XMLHttpRequest();
    imageRequest.open('GET', src);
    log("XMLHttpRequest 객체를 생성하고 GET 요청을 준비합니다.")
    imageRequest.responseType = 'blob';
    log("responseType을 blob으로 설정합니다.")
    log("Promise 객체의 상태는 현재까지 pending입니다.")
    log("요청한 결과에 따라 Promise 객체의 상태를 변경합니다.")
    imageRequest.onload = () => {
        if (imageRequest.status == 200) {
            resolve(imageRequest.response);
            log("Promise 객체의 상태는 fulfilled입니다.")
        } else {
            reject(new Error("Image load failed with status: " + imageRequest.status));
            log("Promise 객체의 상태는 rejected입니다.")
        }
    };

    imageRequest.onerror = () => {
        reject(new Error("Network error occurred during image load"));
        log("Promise 객체의 상태는 rejected입니다.")
    };

    // 여기가 "Executor"
    imageRequest.send();

});

async function loadBG() {
    try {
        const bg = await loadImage('images/marble.jpg');
        attachImage('.card', bg);
    } catch (error) {
        log(error);
    }
}

/* 
 Promise 동작 원리:
 1. 성공(Resolved) -> then 실행 (catch 건너뜀)
 2. 실패(Rejected) -> catch 실행 (then 건너뜀)
 3. then 내부 에러 -> catch가 포착
 마치 if/else 분기문 + 에러 안전장치처럼 동작함.
*/
loadImage('images/gogh.jpg').then(function (data) {
    log("이미지 로딩 완료");
    attachImage('body', data);
}).catch(function (error) {
    log(error);
});


log('init');

await loadBG();
