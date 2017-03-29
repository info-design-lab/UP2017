var c=0;
var category_width = 1000;
var category_height = category_width / 3.5;
var category_svg = d3.select("#category-chart").append("svg").attr("width", category_width).attr("height", category_height + 200);
var category_tooltip = d3.select("#category-chart")
.append("div")
.attr('class', 'd3-tip')
.style("position", "absolute")
.style("z-index", "10")
.style("visibility", "hidden")
.style('font-size', '14')
.style('font-weight', 'normal')
.style("fill", '#808080');

var t = d3.transition()
.duration(1000);

var g_17;
var g_12;
var g_07;
var x,y,z;

Array.prototype.removeIf = function(callback) {
	var i = 0;
	while (i < this.length) {
		if (callback(this[i])) {
			this.splice(i, 1);
		}
		else {
			++i;
		}
	}
};

var catnames=["SC","S&F","F","F&M","M"];
var partynames=["BJP","INC","BSP","SP","OTHERS"];

var stack_data_17=[
{
	"party":"BJP",
	"SC": {name:"SC",value:59},
	"S&F": {name:"S&F",value:10},
	"F": {name:"F",value:25},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:0},
},
{
	"party":"INC",
	"SC": {name:"SC",value:0},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:2},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:2},
},
{
	"party":"BSP",
	"SC": {name:"SC",value:1},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:2},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:5},
},
{
	"party":"SP",
	"SC": {name:"SC",value:7},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:1},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:17},
},
{
	"party":"OTHERS",
	"SC": {name:"SC",value:6},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:0},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:1},
}
];

var stack_data_12=[
{
	"party":"BJP",
	"SC": {name:"SC",value:1},
	"S&F": {name:"S&F",value:2},
	"F": {name:"F",value:5},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:0},
},
{
	"party":"INC",
	"SC": {name:"SC",value:4},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:3},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:2},
},
{
	"party":"BSP",
	"SC": {name:"SC",value:15},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:3},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:15},
},
{
	"party":"SP",
	"SC": {name:"SC",value:48},
	"S&F": {name:"S&F",value:10},
	"F": {name:"F",value:8},
	"F&M": {name:"F&M",value:3},
	"M": {name:"M",value:36},
},
{
	"party":"OTHERS",
	"SC": {name:"SC",value:4},
	"S&F": {name:"S&F",value:1},
	"F": {name:"F",value:1},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:6},
}
];

var stack_data_07=[
{
	"party":"BJP",
	"SC": {name:"SC",value:6},
	"S&F": {name:"S&F",value:1},
	"F": {name:"F",value:4},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:0},
},
{
	"party":"INC",
	"SC": {name:"SC",value:5},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:1},
	"F&M": {name:"F&M",value:0},
	"M": {name:"M",value:0},
},
{
	"party":"BSP",
	"SC": {name:"SC",value:56},
	"S&F": {name:"S&F",value:5},
	"F": {name:"F",value:7},
	"F&M": {name:"F&M",value:1},
	"M": {name:"M",value:30},
},
{
	"party":"SP",
	"SC": {name:"SC",value:8},
	"S&F": {name:"S&F",value:2},
	"F": {name:"F",value:4},
	"F&M": {name:"F&M",value:1},
	"M": {name:"M",value:17},
},
{
	"party":"OTHERS",
	"SC": {name:"SC",value:3},
	"S&F": {name:"S&F",value:0},
	"F": {name:"F",value:2},
	"F&M": {name:"F&M",value:1},
	"M": {name:"M",value:4},
}
];

queue()
.defer(d3.csv, 'data/category/2007.csv')
.defer(d3.csv, 'data/category/2012.csv')
.defer(d3.csv, 'data/category/2017.csv')
.defer(d3.json, 'map/uptopo.json')
.await(makecategorymap);

function makecategorymap(error, data_2007, data_2012, data_2017, up) {
    //Add Year Name
    for(var i=0; i<3; i++){
    	category_svg.append('text')
    	.attr('x', (2*i+1)*category_width/6)
    	.attr('y', category_height)
    	.text(2017 - i*5)
    	.style('font-size', '20px');
    }
    var geo_obj = topojson.feature(up, up.objects.up);
    var projection = d3.geoMercator()
    .fitSize([category_width, category_height], geo_obj);
    var path = d3.geoPath().projection(projection);
    var d = category_svg.append('g').selectAll("path").data(geo_obj.features)
    .enter();
    var map_2017 = d.append("path")
    .attr("d", path)
    .attr('fill', function(d) {
    	if (select_const(d.properties.AC_NO, data_2017)) {

    		if (party_colors[data_2017[d.properties.AC_NO - 1]['party']]) {
    			return party_colors[data_2017[d.properties.AC_NO - 1]['party']];
    		} else {
    			return '#6a51a3';
    		}
    	} else {
    		return '#e5e6eb';
    	}
    })
    .attr('stroke-width', '0.2px')
    .style('stroke', 'black')
    .on('mouseover', function(d) {
    	$(this).addClass('map-hover');
    	category_tooltip.style("visibility", "visible");
    	category_tooltip.html('<strong>' + data_2017[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2017[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2017[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2017[d.properties.AC_NO - 1]['gender']);
    })
    .on("mousemove", function(d) {
    	var mouse = d3.mouse(this);
    	return category_tooltip.style("top", (mouse[1] - 90) + "px").style("left", (mouse[0] + 20 - category_width/3) + "px");
    })
    .on("mouseout", function(d) {
    	$(this).removeClass('map-hover');
    	return category_tooltip.style("visibility", "hidden");
    });
    var map_2012 = d.append("path")
    .attr("d", path)
    .attr('fill', function(d) {
    	if (select_const(d.properties.AC_NO, data_2012)) {

    		if (party_colors[data_2012[d.properties.AC_NO - 1]['party']]) {
    			return party_colors[data_2012[d.properties.AC_NO - 1]['party']];
    		} else {
    			return '#6a51a3';
    		}
    	} else {
    		return '#e5e6eb';
    	}
    })
    .attr('stroke-width', '0.2px')
    .style('stroke', 'black')
    .on('mouseover', function(d) {
    	$(this).addClass('map-hover');
    	category_tooltip.style("visibility", "visible");
    	category_tooltip.html('<strong>' + data_2012[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2012[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2012[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2012[d.properties.AC_NO - 1]['gender']);
    })
    .on("mousemove", function(d) {
    	var mouse = d3.mouse(this);
    	return category_tooltip.style("top", (mouse[1] - 90) + "px").style("left", (mouse[0] + 20) + "px");
    })
    .on("mouseout", function(d) {
    	$(this).removeClass('map-hover');
    	return category_tooltip.style("visibility", "hidden");
    });
    var map_2007 = d.append("path")
    .attr("d", path)
    .attr('fill', function(d) {
    	if (select_const(d.properties.AC_NO, data_2007)) {
    		if (party_colors[data_2007[d.properties.AC_NO - 1]['party']]) {
    			return party_colors[data_2007[d.properties.AC_NO - 1]['party']];
    		} else {
    			return '#6a51a3';
    		}
    	} else {
    		return '#e5e6eb';
    	}
    })
    .attr('stroke-width', '0.2px')
    .style('stroke', 'black')
    .on('mouseover', function(d) {
    	$(this).addClass('map-hover');
    	category_tooltip.style("visibility", "visible");
    	category_tooltip.html('<strong>' + data_2007[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2007[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2007[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2007[d.properties.AC_NO - 1]['gender']);
    })
    .on("mousemove", function(d) {
    	var mouse = d3.mouse(this);
    	return category_tooltip.style("top", (mouse[1] - 90) + "px").style("left", (mouse[0] + 20 + category_width/3) + "px");
    })
    .on("mouseout", function(d) {
    	$(this).removeClass('map-hover');
    	return category_tooltip.style("visibility", "hidden");
    });

    map_2017.attr("transform", "translate(" + (-category_width / 3) + ", 0)");
    map_2007.attr("transform", "translate(" + (category_width / 3) + ", 0)");

    $(".category-checkbox").change(function() {
    	map_2017.transition().duration(1000).attr('fill', function(d) {
    		if (select_const(d.properties.AC_NO, data_2017)) {
    			if (party_colors[data_2017[d.properties.AC_NO - 1]['party']]) {
    				return party_colors[data_2017[d.properties.AC_NO - 1]['party']];
    			} else {
    				return 'red';
    			}
    		} else {
    			return '#e5e6eb';
    		}
    	});
    	map_2012.transition().duration(1000).attr('fill', function(d) {
    		if (select_const(d.properties.AC_NO, data_2012)) {
    			if (party_colors[data_2012[d.properties.AC_NO - 1]['party']]) {
    				return party_colors[data_2012[d.properties.AC_NO - 1]['party']];
    			} else {
    				return 'red';
    			}
    		} else {
    			return '#e5e6eb';
    		}

    	});
    	map_2007.transition().duration(1000).attr('fill', function(d) {
    		if (select_const(d.properties.AC_NO, data_2007)) {
    			if (party_colors[data_2007[d.properties.AC_NO - 1]['party']]) {
    				return party_colors[data_2007[d.properties.AC_NO - 1]['party']];
    			} else {
    				return 'red';
    			}
    		} else {
    			return '#e5e6eb';
    		}
    	});


    });

    createStackChart();

}

function categoryOnly(cate,event){

	event.preventDefault();

	d3.selectAll(".category-checkbox").each(
		function(){
			if(d3.select(this).attr("checked")==="checked"&&d3.select(this).attr("value")!==cate)
			{
				this.click();               
            }            
       });
	if(d3.select("#"+cate).attr("checked")==="checked")
            {
            	debugger;
            	d3.select("#"+cate)._groups[0][0].click();
            	//this.click();
               //d3.select(this).attr("checked","checked");
           }
           debugger;
           setTimeout(function(){
           	d3.select("#"+cate)._groups[0][0].click();
           },500);
    

	//if(cate==="F")
	//{
		//if(stack_data_17[0]["S&F"].disabled)
			//toggleCategory(null,"S&F",true);
		//if(stack_data_17[0]["F&M"].disabled)
			//toggleCategory(null,"F&M",true);
		//if(!stack_data_17[0]["S"].disabled)
			//toggleCategory(null,"S",true);
		//if(!stack_data_17[0]["M"].disabled)
			//toggleCategory(null,"M",true);
	//}
	//if(cate==="M")
	//{
		//if(!stack_data_17[0]["S&F"].disabled)
			//toggleCategory(null,"S&F",true);
		//if(stack_data_17[0]["F&M"].disabled)
			//toggleCategory(null,"F&M",true);
		//if(!stack_data_17[0]["S"].disabled)
			//toggleCategory(null,"S",true);
		//if(!stack_data_17[0]["F"].disabled)
			//toggleCategory(null,"F",true);
	//}
	//if(cate==="SC")
	//{
		//if(stack_data_17[0]["S&F"].disabled)
			//toggleCategory(null,"S&F",true);
		//if(!stack_data_17[0]["F&M"].disabled)
			//toggleCategory(null,"F&M",true);
		//if(!stack_data_17[0]["M"].disabled)
			//toggleCategory(null,"M",true);
		//if(!stack_data_17[0]["F"].disabled)
			//toggleCategory(null,"F",true);
	//}

}


function createStackChart(){
	var category_svg=d3.select("#category-chart").select("svg");

	x = d3.scaleBand()
	.rangeRound([0, 100])
	.padding(0.3)
	.align(0.3);
	y = d3.scaleLinear()
	.rangeRound([category_width / 4, 0]);
	z = d3.scaleOrdinal(d3.schemeCategory20)
	.range(["#1D5C7B", "#317FB0", "#99E2E8", "#CDF6EE", "#FEDEC9"]);
	var stack = d3.stack();

    // Translate Map
    g_17 = category_svg
    .data([stack_data_17])
    .append('g')
    .attr("class","g_17")
    .attr('height', category_width / 4)
    .attr('width', 150)
    .attr("transform", "translate( " + (2*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");

    g_12 = category_svg
    .data([stack_data_12])
    .append('g')
    .attr("class","g_12")
    .attr('height', category_width / 4)
    .attr('width', 150)
    .attr("transform", "translate( " + (4*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");

    g_07 = category_svg
    .data([stack_data_07])
    .append('g')
    .attr("class","g_07")
    .attr('height', category_width / 4)
    .attr('width', 150)
    .attr("transform", "translate( " + (6*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");


    x.domain(partynames);
    z.domain(catnames);

    stack=stack.keys(catnames).value(function(d,key){
    	return d[key]["value"];
    });

    var stacks=[stack_data_07,stack_data_12,stack_data_17];
    var garr=[g_07,g_12,g_17];
    var years=["07","12","17"];

    var max=0;

    for (var i=0;i<stacks.length;i++){
    	total(stacks[i]);
    	max=Math.max(max,d3.max(stacks[i], function(d) {
    		return d.total;
    	}))
    }
    

    y.domain([0,max]);


    for (var i=0;i<stacks.length;i++){
    	stacked=stack(stacks[i]); 
        //debugger;


        stack_map = garr[i].selectAll(".layers")
        .data(stacked)
        .enter().append("g")
        .attr("class", "layers y"+years[i])
        .attr("fill", function(d) {
        	return z(d.key);
        })
        .selectAll("rect")
        .data(function(d) {
        	return d;
        })
        .enter().append("rect")
        .attr("class",function(d){
        	return d3.select(this.parentElement).data()[0]["key"]+"rect"})
        .attr("x", function(d) {
        	return x(d.data.party);
        })
        .attr("y", function(d) {

        	return y(d[1]);
        })
        .attr("height", function(d) {
        	return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());


        stack_x = garr[i].append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + category_width / 4 + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .style('fill', function(d){
        	if(party_colors[d]){
        		return party_colors[d];
        	} else{
        		return '#6a51a3';
        	}
        })
        .attr("dx", "-1em")
        .attr("dy", "-0.5em")
        .attr("transform", function(d) {
        	return "rotate(-90)"
        });
        stack_y = garr[i].append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("dx", ".8em")
        .attr("dy", "-1em")
        .attr("transform", function(d) {
        	return "rotate(-90)"
        });
    }   

    d3.selectAll(".category-checkbox").data(catnames).enter();
}

function select_const(i, data) {
	if (document.getElementById("F").checked && data[i - 1]['gender'] == 'F') {
		return true;
	}
	else if (document.getElementById("M").checked && data[i - 1]['muslim'] == 'TRUE') {
		return true;
	}
	else if (document.getElementById("SC").checked && data[i - 1]['category'] == 'S.C.') {
		return true;
	}
	else {
		return false;
	}
}
function total(d) {

	var total=0;
	for (i = 0; i < d.length; ++i) {
		for (j=1;j<=Object.keys(d).length;j++)
		{

			total+=d[i][catnames[j-1]]["value"];
		}
		d[i].total=total;

		total=0;
	}      

	return d;
}

function toggleCategory(cat,name){


	d3.select(cat).attr("checked",function(){return d3.select(cat).attr("checked")==="unchecked"?"checked":"unchecked";});


	var series,
	isDisabling;

	var stacks=[stack_data_07,stack_data_12,stack_data_17];
	var garr=[g_07,g_12,g_17];
	var years=["07","12","17"];

	for (var k=stacks.length-1;k>=0;k--)
	{

		for(var i=stacks.length-1;i>=0;i--){

			isDisabling=!stacks[k][i][name]["disabled"];
			stacks[k][i][name]["disabled"]=isDisabling;
		}


		var newdata = jQuery.extend(true, {}, stacks[k]);
		for (var i=0;i<stacks[k].length;i++)
		{
			var object=stacks[k][i];
			for (var property in object) {
				if (object.hasOwnProperty(property)) {
					if (newdata[i][property].disabled){
						delete newdata[i][property];
					}
				}
			}
		}
		var newcatnames=catnames.slice();
		newcatnames.removeIf(function(item){
			return stacks[k][0][item]["disabled"];
		});

		var newdata=$.map(newdata, function(value, index) {
			return [value];
		})
		var junk=newdata.splice(-1,1);

		var stack=d3.stack().keys(newcatnames).value(function(d,key){
			return d[key]["value"];
		});

		var newstack=stack(newdata);



		var joinKey=function(d){return d.key;}

		layers=garr[k].selectAll(".layers").data(newstack,joinKey); 
        //debugger ;
        redraw(garr[k],years[k]);
        
    }  
    

    if(name==="F")
    {
    	if(stack_data_17[0]["F"].disabled)
    	{
    		if(!stack_data_17[0]["S&F"].disabled)
    			toggleCategory(null,"S&F");
    		if(!stack_data_17[0]["F&M"].disabled){   
    			toggleCategory(null,"F&M");
    		}
    	}
    	else{
    		if(stack_data_17[0]["S&F"].disabled)
    			toggleCategory(null,"S&F");
    		if(stack_data_17[0]["F&M"].disabled)    
    			toggleCategory(null,"F&M");
    	}
    }
    if(name==="M")
    {
    	if(stack_data_17[0]["M"].disabled)
    	{
    		if(!stack_data_17[0]["F&M"].disabled)    
    			toggleCategory(null,"F&M");
    	}
    	else{
    		if(stack_data_17[0]["F&M"].disabled)    
    			toggleCategory(null,"F&M");
    	}
    }
    if(name==="SC")
    {
    	if(stack_data_17[0]["SC"].disabled)
    	{
    		if(!stack_data_17[0]["S&F"].disabled)    
    			toggleCategory(null,"S&F");
    	}
    	else{
    		if(stack_data_17[0]["S&F"].disabled)    
    			toggleCategory(null,"S&F");
    	}
    }

}

function redraw(g,year){
	var layerstoberemoved;

	layerstoberemoved=layers.exit();



	layerstoberemoved.selectAll("rect")
	.transition(t)
	.attr("y",function(d){
		return y(d[0]);
	})
	.attr("height","0")
	.on("end",function(){
		c+=1;
		console.log(c);
		if(c===15)
		{

			c=0;
			layerstoberemoved.remove();
		}
	});

    //d3.selectAll(this).remove();
    //debugger;

    

    
    var layerstobeadded=layers.enter().append("g")
    .attr("class", "layers y"+year)
    .attr("fill", function(d) {
    	return z(d.key);
    })
    .selectAll("rect")
    .data(function(d) {
    	return d;
    })
    .enter()
    .append("rect")
    .attr("class",function(d){
        //debugger;
        return d3.select(this.parentElement).data()[0]["key"]+"rect"})
    .attr("x", function(d) {
    	return x(d.data.party);
    })
    .transition(t)      
    .attr("y", function(d) {
    	return y(d[1]);
    })
    .attr("height", function(d) {
    	return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());


    layers.each(function(d){
    	d3.select(this).selectAll("rect").data(function(d) {
    		return d;
    	})
    	.attr("class",function(d){
    		return d3.select(this.parentElement).data()[0]["key"]+"rect"})
    	.attr("x", function(d) {
    		return x(d.data.party);
    	})
    	.transition(t)  
    	.attr("y", function(d) {
    		return y(d[1]);
    	})

    	.attr("height", function(d) {

    		return y(d[0]) - y(d[1]);
    	})
    	.attr("width", x.bandwidth());
    });


}

function endAll (transition, callback) {
	var n;
//    debugger;

if (transition.empty()) {
	callback();
}

else {
        //debugger;
        n = transition.size();
        transition.on("end", function () {
            ////debugger;
            --n;
            if (n === 0) {
                //debugger;
                callback();
            }
        });
    }
}