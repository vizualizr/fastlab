# Async/Await 심화 가이드

작성하신 `loadBG` 함수는 `async/await`와 `try/catch`를 사용한 아주 모범적인 **단일 요청** 처리 방식입니다.

하지만 실무에서 더 복잡한 요구사항을 만났을 때, 현재 방식만으로는 성능 문제나 의도치 않은 동작을 겪을 수 있습니다. 다음 3가지 핵심 내용을 반드시 추가로 알아두세요.

## 1. 직렬 처리 vs 병렬 처리 (가장 흔한 실수)
`await`는 **"기다린다"**는 뜻입니다. 여러 작업을 할 때 무턱대고 `await`를 쓰면 **하나씩 차례대로** 실행되어 시간이 오래 걸립니다.

### ❌ 비효율적인 방식 (직렬)
이미지 3개를 불러올 때, 하나가 끝나야 다음 것을 요청합니다. (총 3초 소요 가정)
```javascript
// A 완료 -> B 완료 -> C 완료 (느림)
const img1 = await loadImage('1.jpg');
const img2 = await loadImage('2.jpg');
const img3 = await loadImage('3.jpg'); // 앞의 두 개가 다 끝나야 시작됨
```

### ✅ 효율적인 방식 (병렬)
여러 개를 **동시에** 출발시키고, 결과만 기다려야 합니다. 이때 `Promise.all`과 `await`를 같이 씁니다.
```javascript
// A, B, C 동시에 출발! (빠름)
const [img1, img2, img3] = await Promise.all([
    loadImage('1.jpg'),
    loadImage('2.jpg'),
    loadImage('3.jpg')
]);
```

## 2. 반복문 안에서의 await 주의
**실무 활용 상황:**
예를 들어 **파일 10개를 순서대로 업로드**하거나, **API 요청 제한(Rate Limit) 때문에 하나씩 요청**을 보내야 할 때가 많습니다. 이때 익숙한 `forEach`를 쓰면 비동기 작업이 완료되기를 기다리지 않고 다음 루프로 넘어가버려 의도치 않은 **동시 실행**이나 **순서 엉킴**이 발생합니다.

### ⚠️ forEach는 기다려주지 않음
```javascript
urls.forEach(async (url) => {
    await loadImage(url); // 각자 따로 놈. forEach 자체는 바로 끝나버림.
});
console.log('완료?'); // 이미지가 로딩되기도 전에 출력됨
```

### ✅ for...of 문 사용 (순서대로 처리 필요 시)
```javascript
for (const url of urls) {
    await loadImage(url); // 확실하게 하나씩 순서대로 처리
}
console.log('이 로그는 모든 이미지가 로딩된 후에 찍힙니다!'); // (O)
```
*병렬로 처리하려면 `map`으로 Promise 배열을 만들고 `Promise.all`을 쓰세요.*

## 3. Async 함수는 무조건 Promise를 반환함
`async` 키워드가 붙은 함수는 내부에서 무엇을 리턴하든(숫자, 문자열 등) **자동으로 Promise 객체로 감싸서** 반환합니다.

즉, `loadBG` 함수가 비동기 작업을 하니까 그냥 실행하면 끝나는 게 아니라, 이 함수 자체가 **또 하나의 Promise**가 된다는 뜻입니다.

```javascript
// loadBG가 끝난 뒤에 "초기화 완료"를 띄우고 싶다면?
// loadBG(); console.log("완료"); // (X) 로딩 중에 "완료"가 떠버림

await loadBG();
console.log("초기화 완료"); // (O) 로딩이 다 끝난 뒤 실행
```
