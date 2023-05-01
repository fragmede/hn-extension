// Select all the reply links
// This seems suboptimal, but I couldn't get 
//const replyLinks = document.querySelectorAll('a:contains("reply")');
// to work, a:contains is invalid syntax, as is a[text*="reply"],
// so we use document.evalulate xpath selector instead.
const replyLinks = []

const docEval = document.evaluate('//a[text()="reply"]',document,null,XPathResult.UNORDERED_NODE_ITERATOR_TYPE,null);

const noShallowText = `> Please don't post shallow dismissals, especially of other people's work. A good critical comment teaches us something.\n\nhttps://news.ycombinator.com/newsguidelines.html`;

let node = docEval.iterateNext();
while (node) {
  replyLinks.push(node);
  node = docEval.iterateNext();
}
var theForm;
replyLinks.forEach((replyLink) => {

  function createInlineLink() {
    const link = document.createElement("a");
    link.href = "javascript:void(0)";
    link.textContent = "inline";
    link.addEventListener("click", function() {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          const responseText = this.responseText;
          const parser = new DOMParser();
          const doc = parser.parseFromString(responseText, "text/html");
          const form = doc.querySelector("form");
          const targetDiv = document.createElement("div");
          //console.log(form.outerHTML)
          targetDiv.innerHTML = form.outerHTML;
          replyLink.parentNode.parentNode.replaceChild(targetDiv, link)

          // add (x) link to close reply
		  const x_link = document.createElement('a');
			x_link.href = "javascript:void(0)";
			x_link.textContent = "(x)";
			x_link.addEventListener("click", function() {
			  replyLink.parentNode.parentNode.replaceChild(link, targetDiv)
			  x_link.parentNode.removeChild(x_link)
			});
		  targetDiv.parentNode.insertBefore(x_link, targetDiv)
        }
      };
      xhr.open("GET", replyLink.href, true);
      xhr.send();
    });
    return link;
  } 
  inline = createInlineLink();
  replyLink.parentNode.parentNode.appendChild(inline);
});
