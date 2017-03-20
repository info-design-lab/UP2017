var party_colors = {
    'INC': '#0392cf', // blue
    'BJP': '#feb24c', // orange
    'SP': '#bd0026', // red
    'BSP': '#7bc043', // green
}
var category_width = document.body.clientWidth;
var category_height= document.body.clientWidth/3.5;
var category_svg = d3.select("#margin-chart").append("svg").attr("width",category_width).attr("height",category_height);

queue()
    //.defer(d3.csv, 'data/margins/2002.csv')
    .defer(d3.csv, 'data/category/2007.csv')
    .defer(d3.csv, 'data/category/2012.csv')
    .defer(d3.csv, 'data/category/2017.csv')
    .defer(d3.json, 'map/uptopo.json')
    .await(makecategorymap);

function makecategorymap(error, data_2007, data_2012, data_2017, up){
  var geo_obj = topojson.feature(up, up.objects.up);
  var projection = d3.geoMercator()
      .fitSize([category_width, category_height], geo_obj);
  var path = d3.geoPath().projection(projection);
  var d = category_svg.append('g').selectAll("path").data(geo_obj.features)
      .enter();
  var map_2017 = d.append("path")
      .attr("d", path)
      .attr('fill', function(d){
        if(party_colors[data_2017[d.properties.AC_NO - 1]['party']]){
          return party_colors[data_2017[d.properties.AC_NO - 1]['party']];
        } else{
          return 'red';
        }
      });
  map_2017.attr("transform", "translate(" + (category_width / 3) + ", 0)");
  var map_2012 = d.append("path")
      .attr("d", path)
      .attr('fill', function(d){
        if(party_colors[data_2012[d.properties.AC_NO - 1]['party']]){
          return party_colors[data_2012[d.properties.AC_NO - 1]['party']];
        } else{
          return 'red';
        }
      });
  var map_2007 = d.append("path")
      .attr("d", path)
      .attr('fill', function(d){
        if(party_colors[data_2007[d.properties.AC_NO - 1]['party']]){
          return party_colors[data_2007[d.properties.AC_NO - 1]['party']];
        } else{
          return 'red';
        }
      });
  map_2007.attr("transform", "translate(" + (-category_width / 3) + ", 0)");
}
