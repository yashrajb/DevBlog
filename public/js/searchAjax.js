var search = document.getElementById("search");
search.addEventListener("keyup", function(e) {
  if (e.target.value !== "") {
    var xhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var responseObject = JSON.parse(this.response);
        var template = document.getElementById("searchResult-template")
          .innerHTML;
        var html;
        responseObject.map(function(obj) {
          html = Mustache.render(template, {
            title: obj.title,
            link: obj.slug
          });
        });

        document.getElementById("search-result").innerHTML = html || `${e.target.value} is not found`;
      }
    };
    xmlhttp.open(
      "GET",
      `/api/search/${document.getElementById("search").value}`,
      true
    );
    xmlhttp.send();
  } else {
    document.getElementById("search-result").innerHTML = null;
  }
});