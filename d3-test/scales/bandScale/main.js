const scaleTest = d3.scaleBand(['apple', 'banana', 'watermelon', 'pear', 'grape'], [0, 100])

console.log(scaleTest('grape'), 'is the beginning of the band, grape between 0 to 100');

console.log(scaleTest.paddingInner());
// 구간 폭을 반환한다.
console.log(scaleTest.bandwidth());