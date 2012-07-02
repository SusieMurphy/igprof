
var names=[];

function createVisual(){
	var everything = readFile("PercentPage");

	var svgWidth= 600;
  var svgHeight = 200;

	var width=20; height=width;
	var rowPadding =width/5;
  var colPadding =1;
	var biggest =svgWidth/((width*(colPadding+0.1)));
  var fontSize= width/4;
  var biggerFont = fontSize+10;
	var numOfCircs=4;
	var biggestShare = width/numOfCircs;
	var r = biggestShare/4;
  
	for(var k=0; k < everything.length;k++){
    // create divs to anchor svg to
  	var div = document.createElement('div');
		div.setAttribute('id','table'+k);
		document.getElementsByTagName('body')[0].appendChild(div);
 		var newP = document.createElement("p");
    newP.appendChild(document.createTextNode(names[k]));
    div.appendChild(newP);
   // create svg
		var svg = d3.select("#table"+k).selectAll("svg")
     					.data(d3.range(0, 1))			
   						.enter().append("svg")
     					.attr("width", svgWidth+(biggerFont*4))
     					.attr("height", svgHeight)
     					.attr("id",function(d){return d;})
		 					.attr("class",function(d){return d;});
		var xcount = 0, ycount = 0;
 		var x = 0-width, y = rowPadding+10;
		var circs =[], xys=[];
		var tmpY = y;
    // create a group node.
		var nodes = svg.selectAll(".node")
    	.data(everything[k])
  		.enter().append("g")
    	.attr("class", "node");
    // add rectangles to group
		nodes.append("rect")
                .attr("id",function(d,i){return "rect"+i;})
 								.attr("x", 
												function(d,i){
													xcount =xcount+1;
                          var subs= d.split(".");
													x=x+ width+colPadding;
  
     											if(xcount> biggest || x >= svgWidth-width){
                            console.log("in");
														xcount=1, x =0; 
														tmpY = tmpY + height+rowPadding;
													}
    											if(subs.length >1 && parseInt(subs[1])>1 ){
                            xcount = xcount +1;
    												var oldX = x;
    												x = x +width+colPadding;// x is where it starts
    												var amountLeft = (biggestShare -(r*2));
    												var cx = x + (amountLeft/2)+ r; // amountLeft should be halved as half goes before circle and half after.
            			          								                // need to add r as cx is middle of circle.
    												var end = (x + biggestShare)- r; // end of that circles share.
    												var cy = tmpY + (height/2);
    												for(var k=0; k < numOfCircs; k++){
    													circs.push([cx, cy]);
    													cx = end + amountLeft + r;
    													end = end+ biggestShare;
														} 
                            xys.push([oldX]);
    												return oldX;   
													}
                          xys.push([x]);
													return x;
												})
		  					.attr("y",function(d,i){
                            var subs= d.split(".");
                            
                            if(subs.length >1 && parseInt(subs[1])>1 ){
                             ycount = ycount +1;
                            }
														ycount =ycount+1;
													 	if(ycount>= biggest){
															ycount=1;
															y =y + height+rowPadding;
														}
                            xys[i].push(y);
														return y;
													})
    						.attr("class",function(d) {
        												var subs= d.split(".");
																var num = subs[0];
																if(num == 100){
																	var first = "10";
																}
																else if ( num > 9){		
																	var first = num.substring(0,1);} 
																else if(num > 0){
																	var first = "0";
																}
																else if(num == 0){
																	var first = "00";
																}
																else if (num < 0){
																	var first = "-1";
																}
																return "c-"+first;
															})
   							.attr("width", width)
   							.attr("height", height)
                .on("mouseover", function(d,i){highlight(false, this);})
    						.on("mouseout", function(d,i){unhighlight(false, this);})
   							.attr("title",function(d) {
																return Math.floor(d)+"%";
															});
		var result = width/(r*r);
    // add circles for indicating compressed data
		svg.selectAll("circle")
      .data(circs)
      .enter().append("circle")
      .attr("class", "here")
      .attr("cx", function(d){return d[0];})
      .attr("cy", function(d){return d[1];})
      .attr("r", r)
      .attr("stroke", "grey")
      .attr("fill", "white");
		var pageNum=0;
		var oldCol ="";

		var highlight = function(text, obj) {
			// make all other text grey
			d3.selectAll("text").attr("opacity","0");
			var number = d3.select(obj);
  		if(!text){
  			var rect= number;
  			number = d3.select(obj.parentNode.childNodes[1]);
			}
			else{
				var rect = d3.select(obj.parentNode.childNodes[0]);
			}
			//outline cell.
			oldCol= rect.attr("stroke");
			rect.attr("stroke","grey");
			//change number
			number.transition().duration(200)
				.attr("font-size", biggerFont )
  			.attr("fill","blue")
  			.attr("font-weight", "bold")
        .attr("opacity","1");
		}

		var unhighlight = function(text, obj) {
			d3.selectAll("text").attr("fill","black").attr("opacity","1");
			var number = d3.select(obj);
  		if(!text){
  			var rect= number;
  			number = d3.select(obj.parentNode.childNodes[1]);
			}
			else{
				var rect = d3.select(obj.parentNode.childNodes[0]);
			}
			rect.attr("stroke",oldCol);
			number.transition().duration(200)
				.attr("font-size", fontSize)
				.attr("font-weight", "normal");
		}
    // add text to group node
		nodes.append("text")
    	.attr("id",function(d,i){return"text"+i;})
    	.attr("dx", function(d,i){ return xys[i][0];})
    	.attr("dy", function(d,i){return xys[i][1];})
    	.attr("font-size", fontSize)
			.on("mouseover", function(d,i){highlight(true, this);})
    	.on("mouseout", function(d,i){unhighlight(true, this);})
    	.text(function(d,i) { 
					var tempPageNum=pageNum; var subs= d.split(".");
					if(subs.length >1 && parseInt(subs[1])>1){
          	pageNum= pageNum + parseInt(subs[1]);
      		}
      		else{
       			pageNum++;
					}
					return tempPageNum.toString(16); });
	}
}

/*
Reads the file and transforms the data into a double array.
Each line in file is changed into a number percent+.+numberofentries
10318,28 
10318,28
-> [0.10318,28.0,28.0]
*/
function readFile(theName) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.overrideMimeType('text/plain');
  xmlhttp.open("GET",theName,false);
  xmlhttp.send(null); 
  var allFilePages = xmlhttp.responseText.split('\n\n');
  var list=[];

  for (var i=0; i < allFilePages.length;i++){
  	var eachFilePages = allFilePages[i].split('\n');
		var li=[];
		var number = 1;//number of ones that have the same percent
    var nextPageNum=0;
		var last = -1;//the percent of last one
    var flatten = false;

    if(eachFilePages.length> 50){
			flatten = true;
		}
    if(eachFilePages.length>1){ 
			var theName= eachFilePages[0];
    	names.push(theName);
      var flattenEffect=0;
    	for(var j=1; j < eachFilePages.length;j++){
      	if(eachFilePages[j].length==0) continue;
  			var pageInfo = eachFilePages[j].split(',');
   	  	var pageNumber = parseInt(pageInfo[0], 16);
      	var percentFull = pageInfo[1];
      	if(j==1 && pageNumber > nextPageNum){
			 		li.push("0."+(pageNumber-nextPageNum));
				}
				if(flatten && percentFull == last && pageNumber==nextPageNum){
          flattenEffect++;
					number++;
        	nextPageNum++;
				}
				else{
					// not equal so add previous to list
        	if(last>0){
        		theName= last+"."+number;
						li.push(""+theName);
          	if(pageNumber !=nextPageNum){
            	var num = pageNumber - nextPageNum;
							li.push("0."+num);
        		}
					}
        	last = percentFull;
					number =1;
					nextPageNum= pageNumber;
        	nextPageNum++;
				}
			}
    
		// do any left over
		li.push(last+"."+number);
		list.push(li);

    }
	}
  return list;
}


