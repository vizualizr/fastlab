

const data = ["heading", "is", "not", "here"]

const headings = d3.select("container")
.selectAll("h3")
.data(data)
.join("h3")
.text(d => d)

console.log(headings);