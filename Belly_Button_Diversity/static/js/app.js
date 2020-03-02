function buildMetadata(sample){
  // Use `d3.json` to fetch the metadata for a sample
  d3.json("data/samples.json").then(function(sample){
    console.log(sample.names);
    // by the first ID 
    var filterID = sample.metadata.filter(s=>s.id.toString()===sample.names[0])[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var  sampleMetadata = d3.select("#sample-metadata");
    //metadata = sample.metadata;
    

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(filterID).forEach(([key,value])=>{
      //console.log(key);
      var row = sampleMetadata.append("h5").text(`${key}:${value}`);
    })
    // BONUS: Build the Gauge Chart
    //https://plot.ly/javascript/gauge-charts/
    // buildGauge(data.WFREQ);
  })
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("data/samples.json").then(function(data){ 
    // @TODO: Build a Bubble Chart using the sample data
    //https://plot.ly/python/bubble-charts/ 
    //console.log(data);
    var filterIDs = data.samples.filter(s=>s.id.toString()===data.names[0])[0];
    //Use otu_ids as the labels for the bar chart.
    var xValues =filterIDs.otu_ids;
    //console.log(xValues);
    //Use sample_values as the values for the bar chart.
    var yValues = filterIDs.sample_values;
    //console.log(yValues);
    //Use otu_labels as the hovertext for the chart.
    var otuLables = filterIDs.otu_labels;
    //console.log(hovertext);
    var sizes=filterIDs.sample_values;
    var colors = filterIDs.otu_ids;
    var trace1 = {
      x: xValues,
      y: yValues,
      text: otuLables,
      mode:'markers',
      marker:{
        size: sizes,
        color:colors
      }
    };

    var data = [trace1];

    var layout = {
      title:'Belly Button Biodiversity',
      showlegend: false,
      height:600,
      width:800
    };
    Plotly.newPlot('bubble',data,layout);
    ////Build a horizontal bar chart 
    //var data = [{
    //  type:'bar',
    //  x:yValues,
    //  y:xValues,
    //  orientation:'h'
    //}];
    //Plotly.newPlot('bar',data,layout);

    //=======
    // @TODO: Build a Pie Chart
    //slice() to grab the top 10 sample_values
    var x2 = yValues.slice(0,10).reverse();
    var y2 = xValues.slice(0,10).reverse();
    //https://stackoverflow.com/questions/20498409/adding-text-to-beginning-of-each-array-element
    var yValues2 = y2.map(i=>"OTU"+i);
    var trace2={
      x:x2,
      y:yValues2,
      orientation:'h',
      type:'bar'
    };

    var data2=[trace2];
    var layout2 ={
      height:500,
      width:600
    };
    Plotly.newPlot('bar',data2,layout2);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace3={
      values:x2,
      labels:yValues2,
      type:'pie'
    };
    var data3=[trace3];
    var layout3 ={
      height:400,
      width:500
    };
    Plotly.newPlot('pie',data3,layout3);
  });


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();