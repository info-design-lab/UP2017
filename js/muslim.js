
var party_colors = {

	"Turnout":"#762a83",
    'INC': '#0392cf', // blue
    'BJP': '#feb24c', // orange //#ffd296
    'BSP': '#7bc043', // green #9ac677
    'SP': '#bd0026', // red #d37689
    'IND': '#65737e',
    "SBSP":"#feb24c",
    "QED":"#D1FF3F",
    "IEMC":"#00BF25",
    "PECP":"#FF33CC"
};

function show_m_tool(){
	mouse=d3.mouse(this);

	var consti=".a"+d3.select(this).data()[0].properties["AC_NO"];

	d3.select(".mviz_container").selectAll(consti).each(function(){

		d3.select(this).style("stroke-width","1");
	});

	var g12=d3.select(".mviz12");
	var g17=d3.select(".mviz17");

	d3.select(".mviz_container").selectAll(".description").each(function(){
		d3.select(this).selectAll("text").remove();
	});

	g12.select(".description")
	.append("text")
	.text(d3.select(this).data()[0].properties["AC_NAME"])
	.attr("x",5)
	.attr("y",15)
	.style("font-size","13px")
	.style("font-weight",600);

	g12.select(".description")
	.append("text")
	.text("Turnout: "+((d3.select(this).data()[0].properties["Turnout17"]*100)/100)+"%")
	.attr("x",5)
	.attr("y",30)
	.style("font-size","13px");

	g17.select(".description")
	.append("text")
	.text(d3.select(this).data()[0].properties["W_P17"])
	.attr("x",5)
	.attr("y",15)
	.style("font-size","13px")
	.style("font-weight","600")
	.style("fill",party_colors[d3.select(this).data()[0].properties["W_P17"]]);

	g17.select(".description")
	.append("text")
	.text(d3.select(this).data()[0].properties["AC_NAME"])
	.attr("x",5)
	.attr("y",30)
	.style("font-size","13px");

	var win_votes=d3.select(this).data()[0].properties["W_V17"];
	var win_party=d3.select(this).data()[0].properties["W_P17"];
	var old_party=d3.select(this).data()[0].properties["W_P12"];
	var runnerup_party=d3.select(this).data()[0].properties["RU_P17"];
	var runnerup_votes=d3.select(this).data()[0].properties["RU_V17"];
	var margin=+win_votes-(+runnerup_votes);

	g17.select(".description")
	.append("text")
	.text("Margin: "+margin)
	.attr("x",5)
	.attr("y",43)
	.style("font-size","13px");

	g17.select(".description")
	.append("text")
	.text(function(){
		if(win_party==old_party) return "Seat was retained";
		else return "Seat was won";
	})
	.attr("x",5)
	.attr("y",56)
	.style("font-size","13px");

	g12.select(".tool")
	.attr("transform",function(){return "translate("+(mouse[0]-110)+","+(mouse[1]-78)+")"})
	.classed("hidden",false);

	g17.select(".tool")
	.attr("transform",function(){return "translate("+(mouse[0]-110)+","+(mouse[1]-78)+")"})
	.classed("hidden",false);

}

d3.json("map/uptopo.json",function(error,up){

	if (error) throw error;


	var geo_obj=topojson.feature(up,up.objects.up);

	var width=1000;
	var height=350;
	var padding=20;

	var projection=d3.geoMercator()
	.fitSize([(width/2-padding),(height-padding)],geo_obj);

	var path=d3.geoPath().projection(projection);

	var svg=d3.select(".mviz_container")
	.append("svg")
	.attr("width",width)
	.attr("height",height);

	var g12=svg.append("g")
	.attr("class","mviz12")
	.attr("width",width/2)
	.attr("height",height);

	var g17=svg.append("g")
	.attr("class","mviz17")
	.attr("width",width/2)
	.attr("height",height)
	.attr("transform",function(){return "translate("+(width/2-2*padding)+",0)"});

	g12.selectAll("path")
	.data(geo_obj.features)
	.enter().append("path")
	.attr("d",path)
	.attr("class",function(d){
		return "a"+d.properties["AC_NO"];
	})
	.style("fill",function(d){
		if(d.properties["Muslim"]!=null){

			d3.select(this)
			.on("mouseover",show_m_tool)
			.on("mouseout",function(d){
				consti=".a"+d.properties["AC_NO"];
				d3.selectAll(".tool").each(function(){
					d3.select(this).classed("hidden",true);
					d3.select(".mviz_container").selectAll(consti).each(function(){d3.select(this).style("stroke-width","0.2");});
				});
			});

			return party_colors[d.properties["W_P12"]];
		}
		else{
			return "#eee";
		}
	})
	.style("stroke-width",0.2)
	.style("stroke","black");

	g12.append("text").text("Muslim Constituencies").attr("transform",function(){return "translate("+((width/3-55))+","+(20)+")";}).attr("class","map_label").attr("text-anchor","middle");

	g17.append("text").text("2017 Results").attr("transform",function(){return "translate("+((width/3-55))+","+(20)+")";}).attr("class","map_label").attr("text-anchor","middle");

	var reflist=['INC','BJP','BSP','SP',"SBSP","QED","IEMC","PECP"];
	for (i=0;i<reflist.length;i++){
		//debugger;
		g17.append("circle").attr("r","8px").attr("transform",("translate("+(width/2-padding)+","+i*20+")")).attr("fill",party_colors[reflist[i]]);
		g17.append("text").text(reflist[i]).attr("font-size","14px").attr("transform",("translate("+(width/2-padding/2)+","+(i*20+6)+")")).attr("text-anchor","start");
	}

	g17.selectAll("path")
	.data(geo_obj.features)
	.enter().append("path")
	.attr("d",path)
	.attr("class",function(d){
		return "a"+d.properties["AC_NO"];
	})
	.style("fill",function(d){
		if(d.properties["Muslim"]!=null){
			d3.select(this)
			.on("mouseover",show_m_tool)
			.on("mouseout",function(d){
				consti=".a"+d.properties["AC_NO"];
				d3.selectAll(".tool").each(function(){
					d3.select(this).classed("hidden",true);
					d3.select(".mviz_container").selectAll(consti).each(function(){d3.select(this).style("stroke-width","0.2");});
				});
			});
			return party_colors[d.properties["W_P17"]];
		}
		else{
			return "#eee";
		}
	})
	.style("stroke-width",0.2)
	.style("stroke","black");

	var tool=g12.append("g")
	.attr("class","tool hidden");
	tool.append("g").attr("class","description")
	.append("rect")
	.attr("width",150)
	.attr("height",65);

	var tool=g17.append("g")
	.attr("class","tool hidden");
	tool.append("g").attr("class","description")
	.append("rect")
	.attr("width",150)
	.attr("height",65);


});
