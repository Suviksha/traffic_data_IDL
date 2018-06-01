function scatterplot(){
	var margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = 1360 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
	
	var x = d3.scalePoint()
	        .range([0,width]);
			 
	var y = d3.scaleLinear()
            .range([height, 0]);
			
	
	var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	
		
	
	//Load csv and define values.route=Array of every row.
    d3.csv("Mumbai_traffic_sec.csv").then( function( data) { 	
	        var route=[];
            d3.map(data,function(d){
				 route.push(d);
                 d.start_end_address=d["star_end_address"];
				 d.index=+d["index"];
                 
				 
		
});

//create arrays of values for each routes.
var days_of_week=["0","Monday_avg","Tuesday_avg","Wednesday_avg","Thursday_avg","Friday_avg","Saturday_avg","Sunday_avg"] ;
var days_of_week_min=["0","Monday_q1","Tuesday_q1","Wednesday_q1","Thursday_q1","Friday_q1","Saturday_q1","Sunday_q1"] ;
var days_of_week_max=["0","Monday_q3","Tuesday_q3","Wednesday_q3","Thursday_q3","Friday_q3","Saturday_q3","Sunday_q3"] ;
var value=0;
var route_avg=[];
    var item;
    for(item of days_of_week){
	route_avg.push(parseFloat(route[value][item]));
	   };
	   

	
var route_min=[];
var item_min;
for(item_min of days_of_week_min){
	route_min.push(parseFloat(route[value][item_min]));
};

var route_max=[];
var item_max;
for(item_max of days_of_week_max){
	route_max.push(parseFloat(route[value][item_max]));
};



//calculate.	
x.domain(days_of_week);
y.domain(d3.extent(route_avg)).nice();

// Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .text("days_of_week")
	  .call(d3.axisBottom().scale(x).tickPadding(10).tickArguments(11))
	  .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
	  .style("opacity",1)
	  .style("fill","black")
      .text(" days_of_week ");

  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
	  .text("traffic_duration")
      .call(d3.axisLeft().scale(y).tickPadding(10).tickArguments(11))
	  .append("text")
      .attr("class", "label1")
      .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .style("opacity",1)
      .attr("dy", ".50em")
      .style("text-anchor", "end")
	  .style("fill","black")
      .text("traffic_duration")	;		


//function to make gridlines.
function makeGrid(){
	return d3.axisTop().scale(x);
}
	 
   // add the X gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(makeGrid().tickSizeInner(-height).tickFormat(" "))
	  .style("fill","none")
	  .style("stroke","gray")
	  .style("stroke-width",0.5)
	  .style("opacity",0.3);	  
	
	

	  



//update function for dropdown.
function newRoute(newValue){
	//calculate new array based on newValue from the dropdown.
	
	route_avg=[];
    var item;
    for(item of days_of_week){
	route_avg.push(parseFloat(route[newValue][item]));
	};
    
	
	route_min=[];
    var item_min;
    for(item_min of days_of_week_min){
	
	route_min.push(parseFloat(route[newValue][item_min]));
};
    

    route_max=[];
    var item_max;
    for(item_max of days_of_week_max){
	
	route_max.push(parseFloat(route[newValue][item_max]));
	
};
    
	
	//change axis.
	y.domain(d3.extent(route_avg)).nice();
	d3.selectAll(".y").call(d3.axisLeft().scale(y).tickPadding(10).tickArguments(11));
	
	//transition the points.
	var t=d3.transition().duration(1000).delay(250).ease(d3.easeLinear);
	d3.selectAll(".traffic").transition(t).attr("cy",function(d,i){return y(route_avg[i])});
	d3.selectAll(".traffic_min").transition(t).attr("cy",function(d,i){return y(route_avg[i])});
	d3.selectAll(".traffic_max").transition(t).attr("cy",function(d,i){return y(route_avg[i])});

    
}



//Add the dropdown menu.
d3.select("#dropdown")
          .selectAll("option")
          .data(data)
          .enter()
          .append("option")
          .attr("value", function(d) { return d.index; })
          .text(function(d) { return d.start_end_address; });
		  

//Change the values in dropdown.
d3.select("#dropdown")
            .on("change",function(){
            var newValue=d3.select(this).property('value');
            newRoute(newValue);
});

//Add the min points.
    svg.selectAll("points_min")
       .data(data).enter()
       .append("circle")
       .attr("class","traffic_min")
       .attr("id","trafficdots_min")
       .attr("cx",function(d,i){return x(days_of_week[i])})
       .attr("cy",function(d,i){return y(route_avg[i])})
       .attr("r",4.5)
       .style("fill","#00ff00")
       .style("opacity",0.5)
       
                           
		
   ;	  
   
//Add the max points.
    svg.selectAll("points_max")
       .data(data).enter()
       .append("circle")
       .attr("class","traffic_max")
       .attr("id","trafficdots_max")
       .attr("cx",function(d,i){return x(days_of_week[i])})
       .attr("cy",function(d,i){return y(route_avg[i])})
       .attr("r",4.5)
       .style("fill","#ff0000")
       .style("opacity",0.5)
       
                           
		
   ;		
			
//Add the points.
    svg.selectAll("points_1")
       .data(data).enter()
       .append("circle")
       .attr("class","traffic")
       .attr("id","trafficdots")
       .attr("cx",function(d,i){return x(days_of_week[i])})
       .attr("cy",function(d,i){return y(route_avg[i])})
       .attr("r",4.5)
       .style("fill","#0000ff")
       .style("opacity",1)
	   .on('click',function(d){
		   r=d3.merge([route_min,route_max]);
		   console.log(r);
		   y.domain(d3.extent(r)).nice();
		   var t=d3.transition().duration(1000).delay(250).ease(d3.easeLinear);
	       d3.selectAll(".y").call(d3.axisLeft().scale(y).tickPadding(10).tickArguments(11));
		   d3.selectAll(".traffic_min").transition(t).attr("cy",function(d,i){return y(route_min[i])});
		   d3.selectAll(".traffic_min").transition(t).style("opacity",1);
		   d3.selectAll(".traffic_max").transition(t).attr("cy",function(d,i){return y(route_max[i])});
		   d3.selectAll(".traffic_max").transition(t).style("opacity",1);
		   d3.selectAll(".traffic").transition(t).attr("cy",function(d,i){return y(route_avg[i])});
		   d3.selectAll(".traffic").transition(t).style("opacity",1);
                           
	   })
   ;

   
});

}