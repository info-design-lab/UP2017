
var party_colors = {
    'INC': '#0392cf', // blue
    'BJP': '#f37736', // orange
    'SP': '#ee4035', // red
    'BSP': '#7bc043', // green
    'IND': '#65737e'
}
var width = document.body.clientWidth * 0.90,
    height = 275;
var card_circle_radius = 6;
var selected_const_code = 0;
var current_mode = 'margin'; // = 'percent' for percentage mode
var svg = d3.select('#margin-chart').append('svg')
    .attr('width', document.body.clientWidth)
    .attr('height', height)
    .attr('transform', "translate(0, 100)");
var margin_map_width = $("#margin-map").width();
var margin_map_height = 600;
var margin_map_svg = d3.select("#margin-map").append("svg")
    .attr("width", margin_map_width)
    .attr("height", margin_map_width);
queue()
    //.defer(d3.csv, 'data/margins/2002.csv')
    .defer(d3.csv, 'data/margins/2007.csv')
    .defer(d3.csv, 'data/margins/2012.csv')
    .defer(d3.csv, 'data/margins/2017.csv')
    .defer(d3.json, 'map/uptopo.json')
    .await(makeMyMap);

var margin_scale_2002, margin_scale_2007, margin_scale_2012, margin_scale_2017, colorScale;

function makeMyMap(error, data_2007, data_2012, data_2017, up) {
    //Add years texts
    for (var i = 0; i < 3; i++) {
        svg.append('text')
            .attr('x', 30)
            .attr('y', height * (3 - i) / 3 - height / 6 - 6)
            .attr('text-anchor', 'start')
            .style("font-size", "13px")
            .text(2007 + i * 5);
    }

    // Important ! domain is given manually
    //margin_scale_2002 = d3.scaleLinear().domain([26, 183899]).range([75, width]);
    margin_scale_2007 = d3.scaleLinear().domain([9, 53128]).range([75, width]);
    margin_scale_2012 = d3.scaleLinear().domain([18, 88255]).range([75, width]);
    margin_scale_2017 = d3.scaleLinear().domain([171, 150685]).range([75, width]);
    colorScale = d3.scaleLinear().range(['red', 'blue']).domain([26, 183899]);
    highlight_line = svg.append("path")
        .datum(create_path(1))
        .attr("class", "line")
        .attr("d", d3.line()
            //.curve(d3.curveBundle.beta(1))
            .curve(d3.curveMonotoneY)
            .x(function(d) {
                return d[0];
            })
            .y(function(d) {
                return d[1];
            })
        )
        .style('stroke', 'transparent')
        .style('opacity', 0.5);

    var year_scale_functions = [{
            "func": margin_scale_2017,
            "data": data_2017
        },
        {
            "func": margin_scale_2012,
            "data": data_2012
        },
        {
            "func": margin_scale_2007,
            "data": data_2007
        },
        //{"func":margin_scale_2002, "data":data_2002},
    ];
    var info_cards = []; //Svg group which stores margins, names, etc
    year_scale_functions.forEach(function(year, i) {
        for (var j = 0; j < 403; j++) {
            //Create cards for each datapoint
            card = svg.append('g').on('mouseover', highlight)
                //.on('mouseout', normalCard)
                .attr('id', 'yr' + (2017 - 5 * i) + 'id' + j);
            card.append('rect')
                .attr("x", 5)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", height / 4)
                .attr('fill', 'transparent');
            card.append('circle')
                .attr('cx', 10)
                .attr('cy', height / 8)
                .attr('r', card_circle_radius)
                .attr('fill', function() {
                    if (party_colors[year.data[j]['win_party']]) {
                        return party_colors[year.data[j]['win_party']];
                    } else {
                        return '#65737e';
                    }
                })
                .attr('opacity', 0.25);
            card.attr("transform", "translate(" + (year.func(year.data[j][current_mode]) - 5) + ", " + (height * (i / 3)) + ")");
        }
        info_cards.push(
            svg.append('g').attr('id', 'info' + (2017 - 5 * i))
        );
        info_cards[i].append('text')
            .attr('id', 'yr' + (2017 - 5 * i) + 'info_right_top')
            .attr('x', 30)
            .attr('y', height / 3 - height / 6 - 30)
            .attr('text-anchor', 'start')
            .text('')
            .style("font-size", "18px")
            .style('fill', 'transparent');
        info_cards[i].append('text')
            .attr('id', 'yr' + (2017 - 5 * i) + 'info_right_win')
            .attr('x', 30)
            .attr('y', height / 3 - height / 6 - 20)
            .attr('text-anchor', 'start')
            .text('')
            .style("font-size", "12px")
            .style('fill', 'transparent');
        info_cards[i].append('text')
            .attr('id', 'yr' + (2017 - 5 * i) + 'info_right_bottom')
            .attr('x', 30)
            .attr('y', height / 3 - height / 6 + 10)
            .attr('text-anchor', 'start')
            .style("font-size", "18px")
            .text('')
            .style('fill', 'transparent');
        info_cards[i].append('text')
            .attr('id', 'yr' + (2017 - 5 * i) + 'info_right_second')
            .attr('x', 30)
            .attr('y', height / 3 - height / 6 + 20)
            .attr('text-anchor', 'start')
            .text('')
            .style("font-size", "12px")
            .style('fill', 'transparent');
        info_cards[i].append('text')
            .attr('id', 'yr' + (2017 - 5 * i) + 'info_left')
            .attr('x', -10)
            .attr('y', height / 3 - height / 6 - 25)
            .attr('text-anchor', 'end')
            .text('')
            .style("font-size", "18px")
            .style('fill', 'transparent');
    });
    var geo_obj = topojson.feature(up, up.objects.up);
    var projection = d3.geoMercator()
        .rotate([0, -25])
        .fitSize([margin_map_width, margin_map_width], geo_obj);
    var path = d3.geoPath().projection(projection);
    margin_map_svg.selectAll("path")
        .data(geo_obj.features)
        .enter().append("path")
        .attr("d", path)
        .style('fill', function(d) {
            return colorScale(data_2017[d.properties.AC_NO - 1][current_mode]);
        })
        .on('mouseover', function(d) {
            $(".js-example-basic-single").val(d.properties.AC_NO).change();
        });

    function highlight() {
        normalCard();
        selected_const_code = parseInt(this.getAttribute('id').split('id')[1]);
        $(".js-example-basic-single").val(selected_const_code + 1).change();
        highlight_line.datum(create_path(selected_const_code))
            .attr("class", "line")
            .attr("d", d3.line()
                .curve(d3.curveBundle.beta(1))
                .x(function(d) {
                    return d[0];
                })
                .y(function(d) {
                    return d[1];
                })
            )
            .style('stroke', '#c0c5ce');
        for (var i = 0; i < 3; i++) {
            highlightCard(document.getElementById('yr' + (2007 + 5 * i) + 'id' + selected_const_code));
        }
    }

    function highlightCard(c) {
        d3.select(c).moveToFront();
        d3.select(c.getElementsByTagName("circle")[0])
            .attr('r', card_circle_radius + 4)
            .attr('opacity', 1);

        year_scale_functions.forEach(function(year, i) {
            info_cards[i].attr("transform", "translate(" + (year.func(year.data[selected_const_code][current_mode]) - 5) + ", " + (height * (i / 3)) + ")");
            if(current_mode == 'margin'){
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_top')).text(year.data[selected_const_code]['win_votes'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['win_party']]) {
                          return party_colors[year.data[selected_const_code]['win_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_left')).text((year.data[selected_const_code][current_mode])).style('fill', '#65737e');
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_bottom')).text(year.data[selected_const_code]['second_votes'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['second_party']]) {
                          return party_colors[year.data[selected_const_code]['second_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_win')).text(year.data[selected_const_code]['win_party'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['win_party']]) {
                          return party_colors[year.data[selected_const_code]['win_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_second')).text(year.data[selected_const_code]['second_party'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['second_party']]) {
                          return party_colors[year.data[selected_const_code]['second_party']];
                      } else {
                          return '#65737e';
                      }
                  });
            } else{
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_top')).text((year.data[selected_const_code]['win_votes']*year.data[selected_const_code][current_mode]/year.data[selected_const_code]['margin']).toFixed(2))
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['win_party']]) {
                          return party_colors[year.data[selected_const_code]['win_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_left')).text((year.data[selected_const_code][current_mode])).style('fill', '#65737e');
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_bottom')).text((year.data[selected_const_code]['second_votes']*year.data[selected_const_code][current_mode]/year.data[selected_const_code]['margin']).toFixed(2))
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['second_party']]) {
                          return party_colors[year.data[selected_const_code]['second_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_win')).text(year.data[selected_const_code]['win_party'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['win_party']]) {
                          return party_colors[year.data[selected_const_code]['win_party']];
                      } else {
                          return '#65737e';
                      }
                  });
              d3.select(document.getElementById('yr' + (2017 - 5 * i) + 'info_right_second')).text(year.data[selected_const_code]['second_party'])
                  .style('fill', function() {
                      if (party_colors[year.data[selected_const_code]['second_party']]) {
                          return party_colors[year.data[selected_const_code]['second_party']];
                      } else {
                          return '#65737e';
                      }
                  });
            }

        });
    }

    function normalCard() {
        for (var i = 0; i < 3; i++) {
            d3.select(document.getElementById('yr' + (2007 + 5 * i) + 'id' + selected_const_code).getElementsByTagName("circle")[0])
                .attr('r', card_circle_radius)
                .attr('opacity', 0.5);
        }
    }

    function create_path(i) {
        var path_array = [];
        path_array.push([margin_scale_2017(data_2017[i][current_mode]) + 5, height / 6 - 10]);
        path_array.push([margin_scale_2017(data_2017[i][current_mode]) + 5, height / 6 * 2 - 10 - 10]);
        path_array.push([margin_scale_2017(data_2017[i][current_mode]) + 5, height / 6 * 2 - 5 - 10]);

        var d1 = margin_scale_2017(data_2017[i][current_mode]) + 5;
        var d2 = margin_scale_2012(data_2012[i][current_mode]) + 5;
        path_array.push([d1 + Math.sign(d2 - d1) * d3.min([5, Math.abs((d2 - d1))]), height / 6 * 2 - 10]);
        path_array.push([(d1 + d2) / 2, height / 6 * 2 - 10]);
        path_array.push([d2 - Math.sign(d2 - d1) * d3.min([5, Math.abs((d2 - d1))]), height / 6 * 2 - 10]);

        path_array.push([margin_scale_2012(data_2012[i][current_mode]) + 5, height / 6 * 2 + 5 - 10]);
        path_array.push([margin_scale_2012(data_2012[i][current_mode]) + 5, height / 6 * 2 + 10 - 10]);
        path_array.push([margin_scale_2012(data_2012[i][current_mode]) + 5, height / 6 * 3 - 10]);
        path_array.push([margin_scale_2012(data_2012[i][current_mode]) + 5, height / 6 * 4 - 10 - 10]);
        path_array.push([margin_scale_2012(data_2012[i][current_mode]) + 5, height / 6 * 4 - 5 - 10]);

        d1 = margin_scale_2012(data_2012[i][current_mode]) + 5;
        d2 = margin_scale_2007(data_2007[i][current_mode]) + 5;
        path_array.push([d1 + Math.sign(d2 - d1) * d3.min([5, Math.abs((d2 - d1))]), height / 6 * 4 - 10]);
        path_array.push([(d1 + d2) / 2, height / 6 * 4 - 10]);
        path_array.push([d2 - Math.sign(d2 - d1) * d3.min([5, Math.abs((d2 - d1))]), height / 6 * 4 - 10]);

        path_array.push([margin_scale_2007(data_2007[i][current_mode]) + 5, height / 6 * 4 + 5 - 10]);
        path_array.push([margin_scale_2007(data_2007[i][current_mode]) + 5, height / 6 * 4 + 10 - 10]);
        path_array.push([margin_scale_2007(data_2007[i][current_mode]) + 5, height / 6 * 5 - 10]);
        /*
        path_array.push([margin_scale_2007(data_2007[i][current_mode]) + 5, height/8*6 - 10]);
        path_array.push([margin_scale_2007(data_2007[i][current_mode]) + 5, height/8*6 - 5]);

        d1 = margin_scale_2007(data_2007[i][current_mode]) + 5;
        d2 = margin_scale_2002(data_2002[i][current_mode]) + 5;
        path_array.push([d1+Math.sign(d2-d1)*d3.min([5,Math.abs((d2-d1))]), height/8*6]);
        path_array.push([(d1+d2)/2, height/8*6]);
        path_array.push([d2-Math.sign(d2-d1)*d3.min([5,Math.abs((d2-d1))]), height/8*6]);

        path_array.push([margin_scale_2002(data_2002[i][current_mode]) + 5, height/8*6 + 5]);
        path_array.push([margin_scale_2002(data_2002[i][current_mode]) + 5, height/8*6 + 10]);
        path_array.push([margin_scale_2002(data_2002[i][current_mode]) + 5, height/8*7]);
        */
        return path_array;
    }
    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };
    $(".js-example-basic-single").select2();
    $(".js-example-basic-single").on("change", function() {
        normalCard();
        selected_const_code = parseInt($(this).val()) - 1;
        highlight_line.datum(create_path(selected_const_code))
            .attr("class", "line")
            .attr("d", d3.line()
                .curve(d3.curveBundle.beta(1))
                .x(function(d) {
                    return d[0];
                })
                .y(function(d) {
                    return d[1];
                })
            )
            .style('stroke', '#c0c5ce');
        for (var i = 0; i < 3; i++) {
            highlightCard(document.getElementById('yr' + (2007 + 5 * i) + 'id' + selected_const_code));
        }
    });
    $(".js-example-basic-single").val("87").change();
    $('.switch .margin-percent').change(function(e) {
        if (this.checked) {
            current_mode = 'margin';
            //margin_scale_2002.domain([26, 183899]);
            margin_scale_2007.domain([9, 53128]);
            margin_scale_2012.domain([18, 88255]);
            margin_scale_2017.domain([171, 150685]);
            colorScale.domain([26, 183899]);
        } else {
            current_mode = 'percent';
            //margin_scale_2002.domain([0, 100]);
            margin_scale_2007.domain([0, 46.81]);
            margin_scale_2012.domain([0, 53.84]);
            margin_scale_2017.domain([0, 51.56]);
            colorScale.domain([0, 51]);
        }
        year_scale_functions.forEach(function(year, i) {
            for (var j = 0; j < 403; j++) {
                d3.select('#yr' + (2017 - 5 * i) + 'id' + j)
                    .transition()
                    .duration(1000)
                    .attr("transform", "translate(" + (year.func(year.data[j][current_mode]) - 5) + ", " + (height * (i / 3)) + ")");
            }
        });
        margin_map_svg.selectAll("path")
            .data(geo_obj.features)
            .transition()
            .duration(1000)

            .style('fill', function(d) {
                return colorScale(data_2017[d.properties.AC_NO - 1][current_mode]);
            });

        $(".js-example-basic-single").val("87").change();
    });
}
