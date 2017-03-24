var category_width = $("#category-chart").width();
var category_height = category_width / 3.5;
var category_svg = d3.select("#category-chart").append("svg").attr("width", category_width).attr("height", category_height + 160);
var category_tooltip = d3.select("body")
    .append("div")
    .attr('class', 'd3-tip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style('font-size', '14')
    .style('font-weight', 'normal')
    .style("fill", '#808080');
queue()
    .defer(d3.csv, 'data/category/2007.csv')
    .defer(d3.csv, 'data/category/2012.csv')
    .defer(d3.csv, 'data/category/2017.csv')
    .defer(d3.json, 'map/uptopo.json')
    .await(makecategorymap);

function makecategorymap(error, data_2007, data_2012, data_2017, up) {
    //Add Year Name
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
                if(data_2017[d.properties.AC_NO - 1]['party'] == 'BJP'){
                  category_bjp_const += 1;
                }
                else if(data_2017[d.properties.AC_NO - 1]['party'] == 'INC'){
                  category_inc_const += 1;
                }
                else if(data_2017[d.properties.AC_NO - 1]['party'] == 'BSP'){
                  category_bsp_const += 1;
                }
                else if(data_2017[d.properties.AC_NO - 1]['party'] == 'SP'){
                  category_sp_const += 1;
                }
                else {
                  category_other_const += 1;
                }

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
            if (event) {
                category_tooltip.style("visibility", "visible")
            }
            category_tooltip.html('<strong>' + data_2017[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2017[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2017[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2017[d.properties.AC_NO - 1]['gender']);
        })
        .on("mousemove", function(d) {
            return category_tooltip.style("top", (event.pageY - 50) + "px").style("left", (event.pageX + 10) + "px");
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
            if (event) {
                category_tooltip.style("visibility", "visible")
            }
            category_tooltip.html('<strong>' + data_2012[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2012[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2012[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2012[d.properties.AC_NO - 1]['gender']);
        })
        .on("mousemove", function(d) {
            return category_tooltip.style("top", (event.pageY - 50) + "px").style("left", (event.pageX + 10) + "px");
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
            if (event) {
                category_tooltip.style("visibility", "visible")
            }
            category_tooltip.html('<strong>' + data_2007[d.properties.AC_NO - 1]['const_name'] + '</strong><br>' + 'Party: ' + data_2007[d.properties.AC_NO - 1]['party'] + '<br>' + 'Category: ' + data_2007[d.properties.AC_NO - 1]['category'] + '<br>Gender: ' + data_2007[d.properties.AC_NO - 1]['gender']);
        })
        .on("mousemove", function(d) {
            return category_tooltip.style("top", (event.pageY - 50) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(d) {
            $(this).removeClass('map-hover');
            return category_tooltip.style("visibility", "hidden");
        });
    // Translate Map
    map_2017.attr("transform", "translate(" + (-category_width / 3) + ", 0)");
    map_2007.attr("transform", "translate(" + (category_width / 3) + ", 0)");
    function select_const(i, data) {
        if (document.getElementById("F").checked && data[i - 1]['gender'] == 'F') {
            return true;
        } else if (document.getElementById("M").checked && data[i - 1]['muslim'] == 'TRUE') {
            return true;
        } else if (document.getElementById("SC").checked && data[i - 1]['category'] == 'S.C.') {
            return true;
        }
        //else if(document.getElementById("ST").checked && data[i - 1]['category'] == 'S.C.'){
        //  return true;
        //}
        else {
            return false;
        }
    }
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
        })
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

        })
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
        })
    });
    }
}
