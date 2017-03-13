var projection = d3.geoMercator();

var path = d3.geoPath()
      .projection(projection)
      .pointRadius(2);
