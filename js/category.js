var category_width = $("#category-chart").width();
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
    var g_17 = category_svg
        .append('g')
        .attr('height', category_width / 4)
        .attr('width', 150)
        .append("g").attr("transform", "translate( " + (2*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");
    var g_12 = category_svg
        .append('g')
        .attr('height', category_width / 4)
        .attr('width', 150)
        .append("g").attr("transform", "translate( " + (4*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");
    var g_07 = category_svg
        .append('g')
        .attr('height', category_width / 4)
        .attr('width', 150)
        .append("g").attr("transform", "translate( " + (6*category_width / 6) + ", " + (category_height + 50) + ") rotate(90)");
    var x = d3.scaleBand()
            .rangeRound([0, 100])
            .padding(0.3)
            .align(0.3);
    var y = d3.scaleLinear()
            .rangeRound([category_width / 4, 0]);
    var z = d3.scaleOrdinal(d3.schemeCategory20)
            .range(["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#decbe4"]);
    var stack = d3.stack();
    var stack_data_17, stack_data_12, stack_data_07;
    // Translate Map
    map_2017.attr("transform", "translate(" + (-category_width / 3) + ", 0)");
    map_2007.attr("transform", "translate(" + (category_width / 3) + ", 0)");
    d3.csv("data/category/stack_2017.csv", type, function(error, data) {
        console.log(data)
        stack_data_17 = data;
        stack_data_17.sort(function(a, b) {
            return b.total - a.total;
        });
        x.domain(stack_data_17.map(function(d) {
            return d.party;
        }));
        y.domain([0, d3.max(stack_data_17, function(d) {
            return d.total;
        })]).nice();
        z.domain(stack_data_17.columns.slice(1));
        stack_map_17 = g_17.selectAll(".serie")
            .data(stack.keys(stack_data_17.columns.slice(1))(stack_data_17))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
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
        stack_x_17 = g_17.append("g")
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
        stack_y_17 = g_17.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "s"))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", ".8em")
            .attr("dy", "-1em")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });
    });
    d3.csv("data/category/stack_2012.csv", type, function(error, data) {
        stack_data_12 = data;
        data.sort(function(a, b) {
            return b.total - a.total;
        });
        x.domain(data.map(function(d) {
            return d.party;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.total;
        })]).nice();
        z.domain(data.columns.slice(1));
        stack_map_12 = g_12.selectAll(".serie")
            .data(stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
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
        stack_x_12 = g_12.append("g")
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
        stack_x_07 = g_12.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "s"))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", ".8em")
            .attr("dy", "-1em")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });
    });
    d3.csv("data/category/stack_2007.csv", type, function(error, data) {
        stack_data_07 = data;
        data.sort(function(a, b) {
            return b.total - a.total;
        });
        x.domain(data.map(function(d) {
            return d.party;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.total;
        })]).nice();
        z.domain(data.columns.slice(1));
        stack_map_07 = g_07.selectAll(".serie")
            .data(stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
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
        stack_x_07 = g_07.append("g")
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
        stack_y_07 = g_07.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "s"))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("dx", ".8em")
            .attr("dy", "-1em")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });
    });
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
    function select_const(i, data) {
        if (document.getElementById("F").checked && data[i - 1]['gender'] == 'F') {
            return true;
        } else if (document.getElementById("M").checked && data[i - 1]['muslim'] == 'TRUE') {
            return true;
        } else if (document.getElementById("SC").checked && data[i - 1]['category'] == 'S.C.') {
            return true;
        }
        else {
            return false;
        }
    }
    function type(d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }
}
