
var margin_map_width = $("#margin-map").width();
var margin_map_height = 600;
var margin_map_svg = d3.select("#margin-map").append("svg")
                        //.attr('id', '')
                        .attr("width",margin_map_width)
                        .attr("height",margin_map_width);

d3.json("map/uptopo.json", function(error, up) {
  if (error) throw error;

  var geo_obj=topojson.feature(up,up.objects.up);
  //debugger;
  var projection=d3.geoMercator()
                   .rotate([0,-25])
                   .fitSize([margin_map_width,margin_map_width],geo_obj)
                   ;

  var path = d3.geoPath().projection(projection);

  //debugger;

  margin_map_svg.selectAll("path")
    .data(geo_obj.features)
    .enter().append("path")
    .attr("d", path);

  //margin_map_svg.attr("transform", "translate(" + 100+ ", "+ 100 +")")

});
