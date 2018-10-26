var search = document.getElementById("search");
search.addEventListener("keyup",function(e){
	if(e.target.value!==""){

		var xhttp;
	if (window.XMLHttpRequest) {
    	xmlhttp = new XMLHttpRequest();
 	} else {
    	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
           	  var responseObject = JSON.parse(this.response);
           	  console.log(responseObject)
				    	var template = document.getElementById("searchResult-template").innerHTML;
				    	var html;
				    	responseObject.map(function(obj){

				    		html = Mustache.render(template,{
							        title:obj.title,
							        link:obj.slug
    						});

    						console.log(html);

				    	})
				    		
				    document.getElementById("search-result").innerHTML = html;
				    			    	
       }
	}
	xmlhttp.open("GET",`/api/search/${document.getElementById("search").value}`,false);
	xmlhttp.send();

	}else {

		document.getElementById("search-result").innerHTML = null;

	}
	

});