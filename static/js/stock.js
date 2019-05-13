var selected_date='';
var selected_change_of_price=1;
var selected_senti=0;
var height1,height2;
var length=2000;
var i0=0;
var data;
var sentis=[];
var recent_senti=0
var avg_senti=0;



// stock FUNCTION
(function(){
    d3.stock = function() {
        // Candles
        var source, chartStyle = "candles",
            name = "", symbol = "", data,
            count = 200, days = 0,
            node, width, height, margin,
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            indicators = {},
            chart, bgLayer, axisLayer, volumeLayer, priceLayer, indicatorLayer, mouseOverlay,
            x, x1, y, y1, y2,
            position = 0,
            focus, current,
            xTip, yTip, xText, yText,
            ticks = [],
            scale = 1, dragX, begin = 0, end = 0;

        function stock(gParent) {
            node = gParent[0][0];
            gParent.each(function(d, i) {
                source = d;
            });

            chart = d3.select(node);
            var gParentSize = node.getBoundingClientRect();

            width = gParentSize.width - 50;
            height1 = gParentSize.height - 30;
            if (length>source.list.length){
                length=source.list.length;
            }
        
            margin = {top: 0, right: 50, bottom: 50, left: 0};
           
            
            // ticks

            //var parseDate  = d3.time.format('%a %b %d %X %Z %Y').parse;
            var parseDate  = d3.time.format('%Y-%m-%d %X').parse;
            var formatDate= d3.time.format("%Y-%m-%d");
          
            data = source.list.map(function(d){ d.time = parseDate(d.time); return d;})
            selected_date=formatDate(data[data.length-1].time);
            update_data();

            data = source.list.map(function(d){ d.volume = parseFloat(d.volume); return d;})
            data = source.list.map(function(d){ d.open = parseFloat(d.open); return d;})
            data = source.list.map(function(d){ d.close = parseFloat(d.close); return d;})
            data = source.list.map(function(d){ d.high = parseFloat(d.high); return d;})
            data = source.list.map(function(d){ d.low = parseFloat(d.low); return d;})

            // calculate days
            days = (data[length-1].time - data[0].time)/(24*3600*1000);
            

            begin = data.length > length ? data.length - length : 0;
            console.log(begin,"begin",data.length,'end');
            end   = data.length;

            stock.setTicks(); 
            stock.initScale(begin, end);
        
            //Layers
            bgLayer = chart.append("svg:g").attr("class", "background")
            stock.drawBackground();

            axisLayer = chart.append("svg:g").attr("class", "axis")
            stock.drawAxis();

            volumeLayer = chart.append("svg:g").attr("attr", "volume-overlay");
            stock.drawVolume();

            focus = current = data[data.length-1];
            priceLayer = chart.append("svg:g").attr("class", "price-overlay")
            stock.drawPrice();

            indicatorLayer = chart.append("svg:g").attr("class", "indicators")
            stock.drawIndicators();

          


            // Mouse move
            mouseOverlay = chart.append("svg:g")
                .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
                .attr("class", "mouse-overlay")
                .on('mouseover', function() {
                    xLine1.attr("stroke-width", 1)
                    yLine1.attr("stroke-width", 1)
                    yLine2.attr("stroke-width",1)

                })
                .on('mouseleave', function() {
                   
                    var pos = d3.mouse(this);
                    selected_change_of_price=null;
                    selected_senti=null;
                       
                    
                    if(pos[0] > width || pos[0] <= margin.left || pos[1] > height1 || pos[1] <= 0) {
                        selected_date=''
                        xLine1.attr("stroke-width", 0)
                        yLine1.attr("stroke-width", 0)
                        xTip.style("visibility", 'hidden')
                        yTip.style("visibility", 'hidden')
                    }
                })
                .on('mousemove', stock.handleMouseMove);


            stock.drawMouseOverlay();

            // Zoom
            // var zoom = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", zoomed);

            // function zoomed() {
            //     d3.select(this).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            //     var range = (end - begin) * (d3.event.scale/ scale);
            //     begin = range < end ?  end - range : 0;
            //     stock.redraw();

            //     scale = d3.event.scale;
            // }
            // chart.call(zoom);

            // Drag
            var drag = d3.behavior.drag().on('drag', function(d){
                    var distance = (d3.event.dx / width) * (end - begin);
                    if(begin - distance < 0) {
                        distance = begin;
                        end = end-begin;
                        begin = 0;
                    } else if(end - distance > data.length) {
                        distance = data.length - end;
                        begin = data.length - end + begin;
                        end = data.length;
                    } else {
                        begin = begin - distance;
                        end = end - distance;
                    }
                });
            chart.call(drag);

            return stock;
        }

        stock.drawMouseOverlay = function() {
            var mouseArea = mouseOverlay.append("svg:rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height1)
                .attr("width", width)

            xLine1 = chart.append("svg:line")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", "#959595")
                .style("stroke-dasharray", ("3, 3")) 
                .style("stroke-opacity", 0.9)
                .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        
            yLine1 = chart.append("svg:line")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", "#959595")
                .style("stroke-dasharray", ("3, 3")) 
                .style("stroke-opacity", 0.9)
                .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        
            // Position of mouse
            xTip = chart.append("svg:g")
                .attr('transform', 'translate(0,0)')
                .style('visibility', 'hidden')
            xTip.append('svg:rect').attr('width', 70)
                .attr('height', 20)
                .attr('fill', "#7B7B7B")
            xText = xTip.append('svg:text')
                .text('')
                .attr("transform", "translate(3, 3)")
                .attr("dy", "1em")
                .style("fill", "#ffffff")
        
            yTip = chart.append("svg:g")
                .attr('transform', 'translate(0,0)')
                .style('visibility', 'hidden')
            yTip.append('svg:rect').attr('width', 45)
                .attr('height', 18)
                .attr('fill', "#7B7B7B")
            yText = yTip.append('svg:text')
                .text('')
                .attr("transform", "translate(3, 0)")
                .attr("dy", "1em")
                .style("fill", "#ffffff")
        }

        stock.handleMouseMove = function() {
          var pos  = d3.mouse(this);
          var x0   = x.invert(pos[0]);
          var y0   = y.invert(pos[1])
          if(y0>10000){
            y0   = y0.toFixed(0);
          }else{
            y0   = y0.toFixed(1);
          }
          
          var i    = Math.round(x0);
          focus    = data[i];
          selected_change_of_price=data[i].close/data[i].open;
          selected_senti=data[i].daily_senti_average;
        //   selected data
          selected_date=stock.formatDate(data[i].time);
          i0=i;
          var posX = x1(i) + 0.45*width/data.length;
          var posY = pos[1];
          xLine1.attr("x1", 0)
              .attr("x2", width)
              .attr("y1", posY)
              .attr("y2", posY)
          yLine1.attr("x1", posX)
              .attr("x2", posX)
              .attr("y1", 0)
              .attr("y2", height1)
          yLine2.attr("x1", posX)
              .attr("x2", posX)
              .attr("y1", 0)
              .attr("y2", height2)
        
          xTip.attr('transform', 'translate(' + (margin.left+posX-52.5)+', ' + (margin.top+height1)+ ')')
            .style('visibility', '')
          xText.text(stock.formatDate(data[i].time))
          yTip.attr('transform', 'translate(' + (margin.left+width)+', ' + (margin.top+posY-9)+ ')')
            .style('visibility', '')
          yText.text(y0)
        }

    
        stock.formatDate      = d3.time.format("%Y-%m-%d");
        stock.formatDay       = d3.time.format("%Y-%m-%d");
        stock.formatMonth     = d3.time.format("%m");
        stock.formatYearMonth = d3.time.format("%Y-%m");
        stock.formatYear      = d3.time.format("%Y");



        stock.setTicks = function() {
            if (days <= 366) {
                for(i = 1; i < length; i++) {
                    if(stock.formatMonth(data[i].time) != stock.formatMonth(data[i-1].time)) ticks.push(+i);
                }
            } else if (days < 5 * 366) {
                for(i = 1; i < length; i++) {
                    var isSameMonth = stock.formatMonth(data[i].time) != stock.formatMonth(data[i-1].time);
                    if( isSameMonth && ['01', '04', '07', '10'].indexOf(stock.formatMonth(data[i].time)) != -1) ticks.push(+i);
                }
            } else {
                for(i = 1; i < length; i++) {
                    if(stock.formatYear(data[i].time) != stock.formatYear(data[i-1].time)) ticks.push(+i);
                }
            }
        }

        stock.tickFormat = function(t){
            if(days < 1) {
              return stock.formatTime(t);
            } else if(days <= 366) {
              var m = +stock.formatMonth(t);
              return m == 1 ? stock.formatYear(t) : months[m-1];
            } else if(days <= 5 * 366) {
            } else {
            }
        }

        stock.initScale = function(begin, end) {
            // Scale
            x = d3.scale.linear().range([0, width]).domain([begin, end]);
            x1 = d3.scale.linear().range([0, width]).domain([begin, end]);

            // Adjust domain for gap of top and bottom.
            var min = d3.min(data, function(d) { return d.low; });
            var max = d3.max(data, function(d) { return d.high; });
            if(max == min) max += 10;
            var gap = (max - min) / 10;
            var domain = [min-gap, max+gap];

            // y1 is price, y2 is volume.

            y = d3.scale.linear().range([height1,0]).domain(domain),
            y1 = d3.scale.linear().range([height1, 0]).domain(d3.extent(data, function(d) { d.close; })),
            y2 = d3.scale.linear().range([0,height1/5]).domain([0, d3.max(data, function(d) { return d.volume; })]);

        }
       
        stock.drawBackground = function() {
            bgLayer.selectAll("*").remove();

            var bText = bgLayer.append('svg:text')
                .attr("x",  width / 2)
                .attr("y",  height1 / 2 - 200)
                .attr("text-anchor", "middle")
                .style("font-size", 50)
                .style("fill", "#E6E6E6");
            bText.append("tspan").text(symbol).attr("font-size", 90).attr("dy", "1em")
            bText.append("tspan").text(name).attr("x", width / 2).attr("font-size", 60).attr("dy", "1.6em")
        }

        stock.drawAxis = function() {
            axisLayer.selectAll("*").remove();

            // Axis
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function(d){return stock.tickFormat(data[d].time);}).tickValues(ticks),
            yAxis = d3.svg.axis().scale(y).orient("right").ticks(5);

            // xAxis
            axisLayer.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate('+ margin.left +',' + (height1+margin.top) + ')')
                .call(xAxis)
        
            // yAxis 
            axisLayer.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate('+ (margin.left+width) +', '+ margin.top +')')
                .call(yAxis)
        
            // Grid
            var yAxisGrid = yAxis 
               .tickSize(width, 0)
               .tickFormat("")
               .orient("right");
        
            var xAxisGrid = xAxis
               .tickSize(-height1, 0)
               .tickFormat("")
               .orient("top");
        
            axisLayer.append("g")
               .classed('y', true)
               .classed('axis', true)
               .call(yAxisGrid)
               .attr('transform', 'translate('+margin.left+', '+margin.top+')');
        
            axisLayer.append("g")
               .classed('x', true)
               .classed('axis', true)
               .call(xAxisGrid)
               .attr('transform', 'translate('+margin.left+', '+margin.top+')');
        }

        // DRAW VOLUME
        stock.drawVolume = function() {
            volumeLayer.selectAll("*").remove();

            volumeLayer.selectAll("rect.volume")
                .data(data)
                .enter()
                .append("svg:rect")
                .attr("x",function(d,i){
                    return x1(i);
                })
                .attr("y", function(d) {
                   
                    return -y2(d.volume);
                })
                .attr("width",function(d){
                    return width/(end-begin);
                })
                .attr("height",function(d){
                   
                    return y2(d.volume);
                })
                .attr("fill",function(d){ return d.open > d.close ? "#EFE3E3" : "#DEEEE0"; })
                .attr("stroke",function(d){ return d.open > d.close ? "#D9CFCF" : "#C5D3C7"; })
                .attr("stroke-width", 1)
                .attr('transform', 'translate('+ margin.left +',' + (height1+margin.top) + ')')
        }

        // DRAW PRICE
        stock.drawPrice = function() {
            //Remove old ticks.
            priceLayer.selectAll("*").remove();
            var range = end - begin;

            // Price chart.
            switch(chartStyle) {
                // candles
                case "candles":
                    priceLayer.selectAll("line.stem")
                        .data(data)
                        .enter().append("svg:line")
                        .attr("class", "stem")
                        .attr("x1", function(d,i) { return Math.round(x1(i) + 0.5*width/range);})
                        .attr("x2", function(d,i) { return Math.round(x1(i) + 0.5*width/range);})       
                        .attr("y1", function(d) { return y(d.high);})
                        .attr("y2", function(d) { return y(d.low); })
                        .attr("stroke", "#5A5A5A")
                        .attr("stroke-width", 1)
                        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
                    priceLayer.selectAll("rect.k")
                        .data(data)
                        .enter().append("svg:rect")
                        .attr("x", function(d,i) { return x1(i + 0.15); })
                        .attr("y", function(d) { return y(d.open > d.close ? d.open : d.close);})
                        .attr("height", function(d) {return d.open > d.close ? y(d.close) - y(d.open) : y(d.open) - y(d.close);})
                        .attr("width", function(d) { return Math.round(0.7 * (width)/range); })
                        .attr("fill",function(d) { return d.open < d.close ? "#6BA583" : "#D75442";})
                        .attr("stroke",function(d){ return d.open < d.close ? "#386D4E" : "#A03A2D"; })
                        .attr("stroke-width", 1)
                        .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
                    break;
                // line
                case "line":
                    var priceLine = d3.svg.line()
                        .interpolate("monotone")
                        .x(function(d, i){ return x1(i)})
                        .y(function(d){ return y(d.close)});
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .style("stroke", "steelblue")
                        .attr("class", "line")
                        .attr("d", priceLine)
                        .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
                    break;

                case "area":
                    var priceLine = d3.svg.line()
                        .interpolate("monotone")
                        .x(function(d, i){ return x1(i)})
                        .y(function(d){ return y(d.close)});
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .attr("class", "line")
                        .attr("d", priceLine)
                        .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')

                    var priceArea = d3.svg.area()
                        .x(function(d, i) { return x1(i); })
                        .y0(margin.top+height1)
                        .y1(function(d) { return y(d.close); });
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .attr("class", "line")
                        .attr("d", priceArea)
                        .attr("transform", "translate("+ margin.left +", " + margin.top +")")
                        .style("fill", "steelblue")
                        .style("stroke", "none")
                        .style("opacity", 0.2);
                    break;
            }
            stock.drawLastPrice();
        }

        // draw 
        stock.drawLastPrice = function() {
            console.log(current.close);
            var price = priceLayer.append("svg:g")
                .attr('transform', 'translate(' + (margin.left+width)+', ' + (margin.top+y(current.close)-9)+ ')')
            price.append('svg:rect').attr('width', 45)
                .attr('height', 18)
                .attr('fill', current.open > current.close ? "#6BA583" : "#D75442")
            price.append('svg:text')
                .text(current.close)
                .attr("transform", "translate(3, 0)")
                .attr("dy", "1em")
                .style("fill", "#ffffff");
        
            chart.append("svg:line")
                .attr("x1", 0)
                .attr("x2", margin.left+width)
                .attr("y1", margin.top+y(current.close))
                .attr("y2", margin.top+y(current.close))
                .attr("stroke", current.open > current.close ? "#6BA583" : "#D75442")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("3, 3"))
                .style("stroke-opacity", 0.9);
        }

        stock.drawIndicators = function() {
            //Remove old ticks.
            indicatorLayer.selectAll("*").remove();

            for(var i in indicators.active) {
                var indicator = indicators.names[i];
                var line = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d, i){ return x1(i)})
                    .y(function(d){ return y(d[indicator])});
                indicatorLayer.append("path")
                    .datum(data)
                    .style("stroke", indicators.colors[indicator])
                    .attr('transform', 'translate('+ margin.left +',0)')
                    .attr("class", "line")
                    .attr("d", line)
                    .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
            }
        }

        stock.width = function(w) {
            chart.attr("width", w);
            width = w - 50;
            return stock;
        }

        stock.height = function(h) {
            chart.attr("height", h);
            height1 = h - 30;
            return stock;
        }

        stock.style = function(style) {
            chartStyle = style;
            return stock;
        }

        // stock.indicator = function(indicator) {
        //     var idx = indicators.active.indexOf(indicator);
        //     if(idx== -1) {
        //         indicators.active.push(indicator);
        //     } else {
        //         indicators.active.splice(idx, 1);
        //     }
        //     stock.drawIndicators();
        //     return stock;
        // }

        stock.focus = function() {
            return focus;
        }

        stock.redraw = function() {
            stock.initScale(begin, end);
            stock.drawBackground();
            stock.drawAxis();
            stock.drawVolume();
            stock.drawPrice();
            stock.drawIndicators();
        }
        return stock;
    }
})();


// SENTIMENT GRAPH
(function(){
    d3.senti = function() {
        var source, chartStyle = "line",
            name = "", symbol = "", data,
            count = 160, days = 0,
            node, width, height, margin,
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            indicators = {
                names: ["sentibycnn_bitcoin","sentibycnn_blockchain","sentibyft_bitcoin","sentibyft_blockchain","sentibyreuters_bitcoin","sentibyreuters_blockchain","sentibywsj_bitcoin","sentibywsj_blockchain"],
                colors: {sentibycnn_bitcoin: "#2E5C6E", sentibycnn_blockchain: "#F9BF45", sentibyft_bitcoin: "#81C7D4", sentibyft_blockchain: "#FAD689",sentibyreuters_bitcoin: "#305A56", sentibyreuters_blockchain: "#BA9132", sentibywsj_bitcoin: "#1E88A8", sentibywsj_blockchain: "#D19826"},
                active: [],
            },
            chart, bgLayer, axisLayer, volumeLayer, priceLayer, indicatorLayer, mouseOverlay,
            x, x1, y, y1, y2,
            position = 0,
            focus, current,
            xTip, yTip, xText, yText,
            ticks = [],
             scale = 1, dragX, begin = 0, end = 0;

        function senti(gParent) {
            node = gParent[0][0];
            gParent.each(function(d, i) {
                source = d;
            });

            chart = d3.select(node);
            var gParentSize = node.getBoundingClientRect();

            width = gParentSize.width - 50;
            height2 = gParentSize.height - 30;
        
            margin = {top: 0, right: 50, bottom: 50, left: 0};
           
            //var parseDate  = d3.time.format('%a %b %d %X %Z %Y').parse;
            var parseDate  = d3.time.format('%Y-%m-%d %X').parse;
       
            data = source.list.map(function(d){ d.time = parseDate(d.time); return d;})
            data = source.list.map(function(d){ d.volume = parseFloat(d.volume); return d;})
            data = source.list.map(function(d){ d.open = parseFloat(d.open); return d;})
            data = source.list.map(function(d){ d.close = parseFloat(d.close); return d;})
            data = source.list.map(function(d){ d.high = parseFloat(d.high); return d;})
            data = source.list.map(function(d){ d.low = parseFloat(d.low); return d;})
            for (i=0;i<data.length-1;i++){
                if (data[i].daily_senti_average!=null){
                    sentis.push(data[i].daily_senti_average);
                }
            }
            avg_senti=d3.mean(sentis);
            recent=sentis.slice(Math.max(sentis.length - 5, 1));
            recent_senti=d3.mean(recent);
            $(".recent").html(' '+recent_senti.toFixed(2)+' ');
            $(".average").html(' '+avg_senti.toFixed(2)+' ');
           

            days = (data[length-1].time - data[0].time)/(24*3600*1000);

            begin = data.length > length ? data.length - length : 0;
            end   = data.length;

            senti.setTicks(); 
            senti.initScale(begin, end);
        
            //Layers
            bgLayer = chart.append("svg:g").attr("class", "background")
            senti.drawBackground();

            axisLayer = chart.append("svg:g").attr("class", "axis")
            senti.drawAxis();

            focus = current = data[data.length-1];
            priceLayer = chart.append("svg:g").attr("class", "price-overlay")
            senti.drawPrice();

            indicatorLayer = chart.append("svg:g").attr("class", "indicators")
            senti.drawIndicators();

            // Mouse move
            mouseOverlay = chart.append("svg:g")
                .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
                .attr("class", "mouse-overlay")
                .on('mouseover', function() {
                    xLine2.attr("stroke-width", 1)
                    yLine2.attr("stroke-width", 1)
                    yLine1.attr("stroke-width", 1)
                })
                .on('mouseleave', function() {
                    var pos = d3.mouse(this);
                    if(pos[0] > width || pos[0] <= margin.left || pos[1] > height2 || pos[1] <= 0) {
                        selected_change_of_price=null;
                        selected_senti=null;
                        
                        selected_date='';
                        xLine2.attr("stroke-width", 0)
                        yLine2.attr("stroke-width", 0)
                        xTip.style("visibility", 'hidden')
                        yTip.style("visibility", 'hidden')
                    }
                })
                .on('mousemove', senti.handleMouseMove);

            senti.drawMouseOverlay();

            var drag = d3.behavior.drag().on('drag', function(d){
                    var distance = (d3.event.dx / width) * (end - begin);
                    if(begin - distance < 0) {
                        distance = begin;
                        end = end-begin;
                        begin = 0;
                    } else if(end - distance > data.length) {
                        distance = data.length - end;
                        begin = data.length - end + begin;
                        end = data.length;
                    } else {
                        begin = begin - distance;
                        end = end - distance;
                    }
                });
            chart.call(drag);

            return senti;
        }

        senti.drawMouseOverlay = function() {
            var mouseArea = mouseOverlay.append("svg:rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height2)
                .attr("width", width)

            xLine2 = chart.append("svg:line")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", "#959595")
                .style("stroke-dasharray", ("3, 3")) 
                .style("stroke-opacity", 0.9)
                .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        
            yLine2 = chart.append("svg:line")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", "#959595")
                .style("stroke-dasharray", ("3, 3")) 
                .style("stroke-opacity", 0.9)
                .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
        
            // Position of mouse
            xTip = chart.append("svg:g")
                .attr('transform', 'translate(0,0)')
                .style('visibility', 'hidden')
            xTip.append('svg:rect').attr('width', 70)
                .attr('height', 20)
                .attr('fill', "#7B7B7B")
            xText = xTip.append('svg:text')
                .text('')
                .attr("transform", "translate(3, 3)")
                .attr("dy", "1em")
                .style("fill", "#ffffff")
        
            yTip = chart.append("svg:g")
                .attr('transform', 'translate(0,0)')
                .style('visibility', 'hidden')
            yTip.append('svg:rect').attr('width', 43)
                .attr('height', 18)
                .attr('fill', "#7B7B7B")
            yText = yTip.append('svg:text')
                .text('')
                .attr("transform", "translate(3, 0)")
                .attr("dy", "1em")
                .style("fill", "#ffffff")
        }

        senti.handleMouseMove = function() {
          var pos  = d3.mouse(this);
          var x0   = x.invert(pos[0]);
          var y0   = y.invert(pos[1]).toFixed(3);
          var i    = Math.round(x0);
          focus    = data[i];
          selected_change_of_price=data[i].close/data[i].open;
          selected_senti=data[i].daily_senti_average;
          selected_date=senti.formatDate(data[i].time);
          i0=i;
          var posX = x1(i) + 0.45*width/data.length;
          var posY = pos[1];
          xLine2.attr("x1", 0)
              .attr("x2", width)
              .attr("y1", posY)
              .attr("y2", posY)
          yLine2.attr("x1", posX)
              .attr("x2", posX)
              .attr("y1", 0)
              .attr("y2", height2)
          yLine1.attr("x1", posX)
              .attr("x2", posX)
              .attr("y1", 0)
              .attr("y2", height1)
          xTip.attr('transform', 'translate(' + (margin.left+posX-52.5)+', ' + (margin.top+height2)+ ')')
            .style('visibility', '')
          xText.text(senti.formatDate(data[i].time))
          yTip.attr('transform', 'translate(' + (margin.left+width)+', ' + (margin.top+posY-9)+ ')')
            .style('visibility', '')
          yText.text(y0)
        }

        //  format
        senti.formatDate      = d3.time.format("%Y-%m-%d");
        senti.formatDay       = d3.time.format("%Y-%m-%d");
        senti.formatMonth     = d3.time.format("%m");
        senti.formatYearMonth = d3.time.format("%Y-%m");
        senti.formatYear      = d3.time.format("%Y");
        

        // setTicks
        senti.setTicks = function() {
            if (days <= 366) {
                for(i = 1; i < length; i++) {
                    if(senti.formatMonth(data[i].time) != senti.formatMonth(data[i-1].time)) ticks.push(+i);
                }
            } else if (days < 5 * 366) {
                for(i = 1; i < length; i++) {
                    var isSameMonth = senti.formatMonth(data[i].time) != senti.formatMonth(data[i-1].time);
                    if( isSameMonth && ['01', '04', '07', '10'].indexOf(senti.formatMonth(data[i].time)) != -1) ticks.push(+i);
                }
            } else {
                for(i = 1; i < length; i++) {
                    if(senti.formatYear(data[i].time) != senti.formatYear(data[i-1].time)) ticks.push(+i);
                }
            }
        }

        // tickFormat
        senti.tickFormat = function(t){
            if(days < 1) {
              return senti.formatTime(t);
            } else if(days <= 366) {
              var m = +senti.formatMonth(t);
              return m == 1 ? senti.formatYear(t) : months[m-1];
            } else if(days <= 5 * 366) {
            } else {
            }
        }

        // initScale
        senti.initScale = function(begin, end) {
            // Scale
            x = d3.scale.linear().range([0, width]).domain([begin, end]);
            x1 = d3.scale.linear().range([0, width]).domain([begin, end]);

            // Adjust domain for gap of top and bottom.
            var min = -1;
            var max = 1;
            if(max == min) max += 10;
            var gap = (max - min) / 10;
            var domain = [min-gap, max+gap];

            // y1 is price, y2 is volume.
            y = d3.scale.linear().range([height2,0]).domain(domain),
            y1 = d3.scale.linear().range([height2, 0]).domain(d3.extent(data, function(d) { d.close; }));
          
        }
        
        senti.drawBackground = function() {
            bgLayer.selectAll("*").remove();

            var bText = bgLayer.append('svg:text')
                .attr("x",  width / 2)
                .attr("y",  height2 / 2 - 200)
                .attr("text-anchor", "middle")
                .style("font-size", 50)
                .style("fill", "#E6E6E6");
            bText.append("tspan").text(symbol).attr("font-size", 90).attr("dy", "1em")
            bText.append("tspan").text(name).attr("x", width / 2).attr("font-size", 60).attr("dy", "1.6em")
        }

        senti.drawAxis = function() {
            axisLayer.selectAll("*").remove();

            // Axis
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function(d){return senti.tickFormat(data[d].time);}).tickValues(ticks),
            yAxis = d3.svg.axis().scale(y).orient("right").ticks(5);

            // xAxis
            axisLayer.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate('+ margin.left +',' + (height2+margin.top) + ')')
                .call(xAxis)
        
            // yAxis 
            axisLayer.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate('+ (margin.left+width) +', '+ margin.top +')')
                .call(yAxis)
        
            // Grid
            var yAxisGrid = yAxis 
               .tickSize(width, 0)
               .tickFormat("")
               .orient("right");
        
            var xAxisGrid = xAxis
               .tickSize(-height2, 0)
               .tickFormat("")
               .orient("top");
        
            axisLayer.append("g")
               .classed('y', true)
               .classed('axis', true)
               .call(yAxisGrid)
               .attr('transform', 'translate('+margin.left+', '+margin.top+')');
        
            axisLayer.append("g")
               .classed('x', true)
               .classed('axis', true)
               .call(xAxisGrid)
               .attr('transform', 'translate('+margin.left+', '+margin.top+')');
        }

       

        senti.drawPrice = function() {
            //Remove old ticks.
            priceLayer.selectAll("*").remove();
            var range = end - begin;

            // chartStyle
            switch(chartStyle) {
               
                // line
                case "line":
                    var priceLine = d3.svg.line()
                        .interpolate("monotone")
                        .x(function(d, i){ return x1(i)})
                        .y(function(d){ return y(d.daily_senti_average)});
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .style("stroke", "steelblue")
                        .attr("stroke-width", 30)
                        .attr("class", "line")
                        .attr("d", priceLine)
                        .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
                    break;

                // area
                case "area":
                    var priceLine = d3.svg.line()
                        .interpolate("monotone")
                        .x(function(d, i){ return x1(i)})
                        .y(function(d){ return y(d.daily_senti_average)});
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .attr("class", "line")
                        .attr("d", priceLine)
                        .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')

                    var priceArea = d3.svg.area()
                        .x(function(d, i) { return x1(i); })
                        .y0(margin.top+height2)
                        .y1(function(d) { return y(d.daily_senti_average); });
                    priceLayer.append("path")
                        .datum(data)
                        .attr('transform', 'translate('+ margin.left +',0)')
                        .attr("class", "line")
                        .attr("d", priceArea)
                        .attr("transform", "translate("+ margin.left +", " + margin.top +")")
                        .style("fill", "steelblue")
                        .style("stroke", "none")
                        .style("opacity", 0.2);
                    break;
            }
            // senti.drawLastPrice();
        }

        
        senti.drawIndicators = function() {
            //Remove old ticks.
            indicatorLayer.selectAll("*").remove();

            for(var i in indicators.active) {

                var indicator = indicators.active[i];
                console.log(indicator,indicators.colors[indicator]);
                var line = d3.svg.line()
                    .interpolate("monotone")
                    .x(function(d, i){ return x1(i)})
                    .y(function(d){ return y(d[indicator])});
                // console.log(indicator)
                indicatorLayer.append("path")
                    .datum(data)
                    .style("stroke", indicators.colors[indicator])
                    .attr('transform', 'translate('+ margin.left +',0)')
                    .attr("class", "line")
                    .attr("d", line)
                    .attr('transform', 'translate('+ margin.left +', ' + margin.top +')')
            }
        }

        senti.width = function(w) {
            chart.attr("width", w);
            width = w - 50;
            return senti;
        }

        senti.height = function(h) {
            chart.attr("height", h);
            height2 = h - 30;
            return senti;
        }

        // senti.style = function(style) {
        //     chartStyle = style;
        //     return senti;
        // }

        senti.indicator = function(indicator) {
            var idx = indicators.active.indexOf(indicator);
            if(idx== -1) {
                indicators.active.push(indicator);
            } else {
                indicators.active.splice(idx, 1);
            }
            console.log(indicators.active);
            senti.drawIndicators();
            return senti;
        }

        senti.focus = function() {
            return focus;
        }

        senti.redraw = function() {
            senti.initScale(begin, end);
            senti.drawBackground();
            senti.drawAxis();
            //senti.drawVolume();
            senti.drawPrice();
            senti.drawIndicators();
        }
        return senti;
    }
})();
