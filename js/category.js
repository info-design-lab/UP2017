
var party_colors = {
    'INC': '#0392cf', // blue
    'BJP': '#feb24c', // orange
    'SP': '#bd0026', // red
    'BSP': '#7bc043', // green
}
var category_width = document.body.clientWidth;
var category_height = document.body.clientWidth / 3.5;
var category_svg = d3.select("#category-chart").append("svg").attr("width", category_width).attr("height", category_height + 160);
var category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
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
    for(var i=0; i<3; i++){
      category_svg.append('text')
          .attr('x', document.body.clientWidth*(2*i + 1)/6)
          .attr('y', category_height + 20)
          .style('font-size', '20px')
          .attr('text-anchor', 'middle')
          .text(2007 + 5*i);
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6)
              .attr('y', category_height + 40)
              .attr('fill', party_colors['BJP'])
              .attr('text-anchor', 'end')
              .text('BJP:');
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
              .attr('y', category_height + 40)
              .attr('id', 'category-bjp-const' + (2007 + 5*i))
              .attr('fill', '#555555')
              .attr('text-anchor', 'start')
              .text('0');
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6)
              .attr('y', category_height + 60)
              .attr('fill', party_colors['INC'])
              .attr('text-anchor', 'end')
              .text('INC:');
              category_svg.append('text')
                      .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
                      .attr('y', category_height + 60)
                      .attr('id', 'category-inc-const' + (2007 + 5*i))
                      .attr('fill', '#555555')
                      .attr('text-anchor', 'start')
                      .text('0');
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6)
              .attr('y', category_height + 80)
              .attr('fill', party_colors['BSP'])
              .attr('text-anchor', 'end')
              .text('BSP:');
      category_svg.append('text')
                      .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
                      .attr('y', category_height + 80)
                      .attr('id', 'category-bsp-const' + (2007 + 5*i))
                      .attr('fill', '#555555')
                      .attr('text-anchor', 'start')
                      .text('0');
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6)
              .attr('y', category_height + 100)
              .attr('fill', party_colors['SP'])
              .attr('text-anchor', 'end')
              .text('SP:');
              category_svg.append('text')
                      .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
                      .attr('y', category_height + 100)
                      .attr('id', 'category-sp-const' + (2007 + 5*i))
                      .attr('fill', '#555555')
                      .attr('text-anchor', 'start')
                      .text('0');
      category_svg.append('text')
              .attr('x', document.body.clientWidth*(2*i + 1)/6)
              .attr('y', category_height + 120)
              .attr('fill', '#65737e')
              .attr('text-anchor', 'end')
              .text('OTHER:');
              category_svg.append('text')
                      .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
                      .attr('y', category_height + 120)
                      .attr('id', 'category-other-const' + (2007 + 5*i))
                      .attr('fill', '#555555')
                      .attr('text-anchor', 'start')
                      .text('0');
      category_svg.append('line')
              .style("stroke", "#65737e")          // colour the line
              .style("stroke-width", 2)
              .style("stroke-linecap", "round")
              .attr('x1', document.body.clientWidth*(2*i + 1)/6 + 5)
              .attr('y1', category_height + 127)
              .attr('x2', document.body.clientWidth*(2*i + 1)/6 + 25)
              .attr('y2', category_height + 127);
              category_svg.append('text')
                      .attr('x', document.body.clientWidth*(2*i + 1)/6 + 3)
                      .attr('y', category_height + 140)
                      .attr('id', 'category-total-const' + (2007 + 5*i))
                      .attr('fill', '#555555')
                      .attr('text-anchor', 'start')
                      .text('0');
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
                    return 'red';
                }
            } else {
                return '#e5e6eb';
            }
        })
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
    update_numbers(2017);
    category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
    var map_2012 = d.append("path")
        .attr("d", path)
        .attr('fill', function(d) {
          if (select_const(d.properties.AC_NO, data_2012)) {
              if(data_2012[d.properties.AC_NO - 1]['party'] == 'BJP'){
                category_bjp_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'INC'){
                category_inc_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'BSP'){
                category_bsp_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'SP'){
                category_sp_const += 1;
              }
              else {
                category_other_const += 1;
              }
              if (party_colors[data_2012[d.properties.AC_NO - 1]['party']]) {
                  return party_colors[data_2012[d.properties.AC_NO - 1]['party']];
              } else {
                  return 'red';
              }
          } else {
              return '#e5e6eb';
          }

        })
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
    update_numbers(2012);
    category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
    var map_2007 = d.append("path")
        .attr("d", path)
        .attr('fill', function(d) {
          if (select_const(d.properties.AC_NO, data_2007)) {
              if(data_2007[d.properties.AC_NO - 1]['party'] == 'BJP'){
                category_bjp_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'INC'){
                category_inc_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'BSP'){
                category_bsp_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'SP'){
                category_sp_const += 1;
              }
              else {
                category_other_const += 1;
              }

              if (party_colors[data_2007[d.properties.AC_NO - 1]['party']]) {
                  return party_colors[data_2007[d.properties.AC_NO - 1]['party']];
              } else {
                  return 'red';
              }
          } else {
              return '#e5e6eb';
          }
        })
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
    update_numbers(2007);
    // Translate Map
    map_2017.attr("transform", "translate(" + (category_width / 3) + ", 0)");
    map_2007.attr("transform", "translate(" + (-category_width / 3) + ", 0)");

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
        category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
        map_2017.transition().duration(1000).attr('fill', function(d) {
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
                    return 'red';
                }
            } else {
                return '#e5e6eb';
            }
        })
        update_numbers(2017);
        category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
        map_2012.transition().duration(1000).attr('fill', function(d) {
          if (select_const(d.properties.AC_NO, data_2012)) {
              if(data_2012[d.properties.AC_NO - 1]['party'] == 'BJP'){
                category_bjp_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'INC'){
                category_inc_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'BSP'){
                category_bsp_const += 1;
              }
              else if(data_2012[d.properties.AC_NO - 1]['party'] == 'SP'){
                category_sp_const += 1;
              }
              else {
                category_other_const += 1;
              }
              if (party_colors[data_2012[d.properties.AC_NO - 1]['party']]) {
                  return party_colors[data_2012[d.properties.AC_NO - 1]['party']];
              } else {
                  return 'red';
              }
          } else {
              return '#e5e6eb';
          }

        })
        update_numbers(2012);
        category_bjp_const = category_inc_const = category_bsp_const = category_sp_const = category_other_const = 0;
        map_2007.transition().duration(1000).attr('fill', function(d) {
          if (select_const(d.properties.AC_NO, data_2007)) {
              if(data_2007[d.properties.AC_NO - 1]['party'] == 'BJP'){
                category_bjp_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'INC'){
                category_inc_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'BSP'){
                category_bsp_const += 1;
              }
              else if(data_2007[d.properties.AC_NO - 1]['party'] == 'SP'){
                category_sp_const += 1;
              }
              else {
                category_other_const += 1;
              }

              if (party_colors[data_2007[d.properties.AC_NO - 1]['party']]) {
                  return party_colors[data_2007[d.properties.AC_NO - 1]['party']];
              } else {
                  return 'red';
              }
          } else {
              return '#e5e6eb';
          }
        })
        update_numbers(2007);
    });
    function update_numbers(year){
      d3.select('#category-bjp-const'+ year).text(category_bjp_const);
      d3.select('#category-inc-const'+ year).text(category_inc_const);
      d3.select('#category-bsp-const'+ year).text(category_bsp_const);
      d3.select('#category-sp-const'+ year).text(category_sp_const);
      d3.select('#category-other-const'+ year).text(category_other_const);
      d3.select('#category-total-const'+ year).text(category_bjp_const + category_other_const + category_sp_const + category_bsp_const + category_inc_const);
    }
}
