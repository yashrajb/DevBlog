(function(){
		var btn = document.getElementById("addComment");
		btn.addEventListener("click",function(){
			var xhttp;
			if(window.addEventListener){
				xhttp = new XMLHttpRequest();
			} else {
				xhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xhttp.onreadystatechange = function() {
				  if (this.readyState == 4 && this.status == 200) {
				    var responseObject = JSON.parse(this.response);
				    	commentSection(responseObject.loggedin);
				    }
				  };
				  xhttp.open("GET", "/isloggedIn", true);
				  xhttp.send();
		})


		function commentSection(param){
			if(param){
document.getElementById("enterComment").style.display = "block";
			} else {
				window.location.href = "/";
			}
		}
var form = document.getElementsByTagName("form")[0];
form.addEventListener("submit",function(e){
	e.preventDefault();

	if(!e.target.comment.value){
		document.getElementById("error").innerHTML = "Please add comment";
		return;
	}
	document.getElementById("error").innerHTML = "";
	var xhttp;
			if(window.addEventListener){
				xhttp = new XMLHttpRequest();
			} else {
				xhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xhttp.onreadystatechange = function() {
				  if (this.readyState == 4 && this.status == 200) {
				    var responseObject = JSON.parse(this.response);
				    	var template = document.getElementById("commentSection-template").innerHTML;
				    	var html = Mustache.render(template,{
							        comment:responseObject.comment,
							        user:responseObject.name
    						});
				    	document.getElementById("commentSection").innerHTML = document.getElementById("commentSection").innerHTML + html;
				    }
				  };
			xhttp.open("POST",e.target.action, true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("comment="+e.target.comment.value);
			e.target.comment.value = "";
});


	document.getElementById("cancel-btn").addEventListener("click",function(){
		document.getElementById("enterComment").style.display = "none";
		document.getElementById("enterComment").getElementsByTagName("textarea")[0].value = "";
	})

}());