var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}
(function () {
  let template = document.createElement('template');
  template.innerHTML = `
    <style>
    * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  /* center in the viewport */
  body {
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background: hsl(230, 29%, 19%);
    color: hsl(184, 30%, 70%);
  }
  /* cap the width of the visualization */
  svg {
    width: 90vw;
    max-width: 900px;
  }
  svg text {
    font-family: '72-Web', Arial, monospace;
    fill: currentColor;
    font-size: 10px;
    fill: rgb(166, 168, 171);
  }
  
  /* animation for the path elements included through the tooltip
  ! the offset needs to match the length of a dash and an empty space to avoid jumping from state to state
  stroke-dasharray: 7 4; --> stroke-dashoffset: 11;
  */
  @keyframes dashOffset {
    to {
      stroke-dashoffset: -11;
    }
  }		
    </style>
            <div id="rootquadrant" class="viz"></div>
    `;

  class QuadrantChart extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById('rootquadrant');

      this.$style = this._shadowRoot.querySelector('style');
      this.$svg = this._shadowRoot.querySelector('svg');

      this.addEventListener("click", event => {
        var event = new Event("onClick");
        this.dispatchEvent(event);
      });

      this._props = {};
      //      this.render();
    }

    async render() {
      /* DATA
starting from an object describing the possible categories and matching colors
the idea is to fabricate an array of data points with random percentage and count values
*/
      await getScriptPromisify('https://fhasba1204.github.io/SAC/D3library/d3.v7.min.js')
      
      
      const legend = [
        {
          name: 'Purple',
          color: 'hsl(259, 48%, 55%)',
        },
        {
          name: 'Green',
          color: 'hsl(137, 68%, 61%)',
        },
        {
          name: 'Yellow',
          color: 'hsl(57, 96%, 64%)',
        },
        {
          name: 'Orange',
          color: 'hsl(0, 99%, 71%)',
        },
      ];


      const dataLabelVisible = false;
      const legendVisible = true;
      const xLabelVisible = false;
      const yLabelVisible = false;

      const xLabel = "User Count";
      const yLabel = "Satisfaction Percentage";

      // utility functions
      const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);
      const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

      // minimum and maximum values for the percentage and user count
      const percentages = {
        min: 0,
        max: 100,
      };
      const counts = {
        min: 0,
        max: 100,
      };


      const percmin = Math.abs(percentages.min);

      // function called to fabricate random data points
      const randomDataPoint = () => {
        // compute a random percentage and count
        const percentage = randomBetween(percentages.min, percentages.max);
        const count = randomBetween(counts.min, counts.max);

        // call the function once more if the data point were to be located in the bottom right corner of the viz
        // this to avoid overlaps with the legend
        if (percentage < 20 && count > 7000) {
          return randomDataPoint();
        }
        // retrieve an item from the legend array
        const item = randomItem(legend);

        /* return an object marrying the name and color with the percentage and user count */
        return Object.assign({}, item, {
          percentage,
          count,
        });
      };

      // number of data points
      const dataPoints = 15;
      // create an array of data points leveraging the utility functions
      const data = Array(dataPoints).fill('').map(randomDataPoint);


      // VIZ
      // in the .viz container include an SVG element following the margin convention
      const margin = {
        top: 20,
        right: 65,
        bottom: 50,
        left: 65,
      };

      // the chart ought to be wider than taller
      const width = 600 - (margin.left + margin.right);
      const height = 400 - (margin.top + margin.bottom);
      const svg = d3
        .select(this._shadowRoot.querySelector('#rootquadrant'))
        .append('svg')
        .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

      const group = svg
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top})`);

      // scales
      // for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
      const countScale = d3
        .scaleLinear()
        .domain(d3.extent(Object.values(counts)))
        .range([0, width]);

      const percentageScale = d3
        .scaleLinear()
        .domain(d3.extent(Object.values(percentages)))
        .range([height, 0]);

      // quadrants and labels
      // position four rectangles and text elements to divvy up the larger shape in four sections
      const quad = [
        {label:'Assess',  color: '#fbb4ae'},
        {label:'Adopt',   color: '#b3cde3'},
        {label:'Avoid',   color: '#ccebc5'},
        {label:'Analyze', color: '#decbe4'}, // add more text
      ];

      const quadrantsGroup = group
        .append('g')
        .attr('class', 'quadrants');

      const index = d3.local();
      // include one group for each quadrant
      const quadrants = quadrantsGroup
        .selectAll('g.quadrant')
        .data(quad)
        .enter()
        .append('g')
        .attr('class', 'quadrant')
        // position the groups at the four corners of the viz
        .attr('transform', ({ count, percentage }, i) => (counts.min < 0 && percentages.min < 0) ?
          `translate(${i % 2 === 0 ? 0 : countScale(0)} ${i < 2 ? 0 : percentageScale(0)})` :
          (counts.min < 0 || percentages.min < 0) ?
          (counts.min < 0) ?
          `translate(${(i % 2 === 0) ? 0 : countScale(0)}
          ${ i < 2 ? 0 : height / 2 })` :
          (percentages.min < 0) ?
          `translate(${(i < 2) ? 0 : width / 2}
          ${ i % 2 === 0 ? 0 : percentageScale(0)})` :
          `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})` :
          `translate(${i % 2 === 0 ? 0 : width / 2} ${i < 2 ? 0 : height / 2})`)
				.each(function (d, i)
		
          // for each quadrant add a rectangle and a label
           {
            let parent = d3.select(this); // g.quadrants
                index.set(this, i);
              
            // background rectangle width fill color
            // if min scales are negative then position the 
            // quandrant to the x-0 and y-0
            // else check which axis has negative min and
            // position the quadrant to x or y 0 scale
            let rect = 
              parent.append('rect')
              .attr("fill", d.color)
               .attr('width', function (d, i) {
               if (percentages.min < 0 && counts.min < 0)
               {
               if (index.get(this) === 0 || index.get(this) === 2)
               {return countScale(0)} else
               {return width - countScale(0)}
               }
               if (counts.min < 0) 
               {if (index.get(this) === 0 || index.get(this) === 2)
               {return countScale(0)} else { return width - countScale(0)}
               } else {return width / 2}
               }
                )
               .attr('height', function (d, i) {
               if (percentages.min < 0 && counts.min < 0)
               {
               if (index.get(this) === 0 || index.get(this) === 1)
               {return percentageScale(0)} else
               {return height - percentageScale(0)}
               }
               else if (percentages.min < 0) 
               {if (index.get(this) === 0 || index.get(this) === 2)
               {return percentageScale(0)} else if
               (index.get(this) === 1 || index.get(this) === 3){ 
               return height - percentageScale(0)}
               } else {return height / 2}
               })
              .attr('opacity', (d, i) => ((index.get(this) === 1 || index.get(this) === 2) ? 0.45 : 0.65));
            
            let rectsel = parent
              .selectAll('rect');
            
            let rectprop = rect.node().getBBox();
            console.log("Width: "+rectprop.width);
            // insert label rectangle and label text in sequence
            let labelRect = 
            parent.
            append('rect').attr("rx", 4).attr("fill", 'white');
            let label = 
            parent.
            append("text")
            .text(d.label)
            .attr("text-anchor", 'middle')
            .style('text-transform', 'uppercase')
            .style('font-weight', '300')
            .style('font-size', '0.55rem')
             .attr('opacity', 0.9)
            .attr("x", rectprop.width / 2);
            
            // calculate label box width native api: getBBox or getBoundingClientRect
            // https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
            let labelBox = label.node().getBBox(); // or label.node().getBoundingClientRect()
          
            
            // assign label text and label rectangle appropriate position
            labelRect.attr("width", labelBox.width + 10)
              .attr("height", labelBox.height + 10)
              .attr("x", (rectprop.width - (labelBox.width + 10)) / 2);
            
            label.attr('y', labelBox.height + 5);
            }
          );

      // legend
      // include the categories in the bottom right corner of the viz
      const legendGroup = group
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width + 20} 10)`)
        .style('visibility', (i) => (legendVisible == false) ? 'hidden' : 'visible');
      //.attr('transform', `translate(${countScale(8500)} ${percentageScale(16)})`);

      // separate the groups vertically
      const legendItems = legendGroup
        .selectAll('g.legend-item')
        .data(legend)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0 ${i * 15})`);

      // for each group add a colored circle and the matching text
      legendItems
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 4)
        .attr('fill', ({ color }) => color);

      legendItems
        .append('text')
        .attr('x', 12)
        .attr('y', 0)
        .attr('dominant-baseline', 'middle')
        .text(d => d.name)
        .style('font-size', '0.5rem')
        .style('letter-spacing', '0.05rem');

      // axes
      const countAxis = d3
        .axisBottom(countScale)
        .tickFormat(d => d);

      const percentageAxis = d3
        .axisLeft(percentageScale)
        .tickFormat(d => `${d}%`);

      // add classes to later identify the axes individually and jointly
      group
        .append('g')
        .attr('transform', `translate(0 ${height})`)
        .attr('class', 'axis axis-count')
        .call(countAxis);

      group
        .append('g')
        .attr('class', 'axis axis-percentage')
        .call(percentageAxis);

      // remove the path describing the axes
      d3
        .select(this._shadowRoot)
        .selectAll('.axis')
        .select('path')
        .remove();

      // style the ticks to be shorter
      d3
        .select(this._shadowRoot.querySelector('.axis-count'))
        .selectAll('line')
        .attr('y2', 3);

      d3
        .select(this._shadowRoot.querySelector('.axis-percentage'))
        .selectAll('line')
        .attr('x2', -3);

      d3
        .selectAll(this._shadowRoot.querySelector('.axis'))
        .selectAll('text')
        .attr('font-size', '0.55rem');

      // grid
      // include dotted lines for each tick and for both axes
      d3
        .select(this._shadowRoot.querySelector('.axis-count'))
        .selectAll('g.tick')
        .append('path')
        .attr('d', `M 0 0 v -${height}`)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2')
        .attr('opacity', 0.3);

      d3
        .select(this._shadowRoot.querySelector('.axis-percentage'))
        .selectAll('g.tick')
        .append('path')
        .attr('d', `M 0 0 h ${width}`)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2')
        .attr('opacity', 0.3);


      // labels
      // add a group to position the label where needed
      // for the percentage label, this allows to also modify the transform-origin as to rotate the label from the center of the axis
      d3
        .select(this._shadowRoot.querySelector('.axis-count'))
        .append('g')
        .attr('class', 'label label-count')
        .attr('transform', `translate(${width / 2} ${margin.bottom})`);

      d3
        .select(this._shadowRoot.querySelector('g.label-count'))
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .text(xLabel)
        .attr('text-anchor', 'middle')
        .style('visibility', (i) => (xLabelVisible == true) ? 'hidden' : 'visible');

      d3
        .select(this._shadowRoot.querySelector('.axis-percentage'))
        .append('g')
        .attr('class', 'label label-percentage')
        .attr('transform', `translate(-${margin.left} ${height / 2})`);

      d3
        .select(this._shadowRoot.querySelector('g.label-percentage'))
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .text(yLabel)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'hanging')
        .attr('transform', 'rotate(-90)')
        .style('visibility', (i) => (yLabelVisible == true) ? 'hidden' : 'visible');

      // style both labels with a heavier weight
      d3
        .select(this._shadowRoot)
        .selectAll('g.label text')
        .style('font-size', '0.65rem')
        .style('font-weight', '600')
        .style('letter-spacing', '0.05rem')
        .style('fill', '#000000');


      // data points
      // add a group for each data point, to group circle and text elements
      const dataGroup = group
        .append('g')
        .attr('class', 'data');

      const dataPointsGroup = dataGroup
        .selectAll('g.data-point')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'data-point')
        .attr('transform', ({ count, percentage }) => `translate(${countScale(count)} ${percentageScale(percentage)})`);

      // circles using the defined color
      dataPointsGroup
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', ({ color }) => color);

      // labels describing the circle elements
      dataPointsGroup
        .append('text')
        .attr('x', 8)
        .attr('y', 0)
        .attr('class', 'name')
        .text(({ name }, i) => `${name} ${i}`)
        .attr('dominant-baseline', 'central')
        .style('font-size', '0.55rem')
        .style('letter-spacing', '0.05rem')
        .style('pointer-events', 'none')
        .style('visibility', (i) => (dataLabelVisible == false) ? 'hidden' : 'visible');


      // on hover highlight the data point
      dataPointsGroup
        .on('mouseenter', function (d) {
          // slightly translate the text to the left and change the fill color
          const text = d3
            .select(this)
            .select('text.name')

          text
            .transition()
            .attr('transform', 'translate(12 0)')
            .style('color', 'hsl(0, 0%, 0%)')
            .style('text-shadow', 'none')
            .style('visibility', 'visible');

          /* as the first child of the group add another group in which to gather the elements making up the tooltip
          - rectangle faking the text's background
          - circle highlighting the selected data point
          - path elements connecting the circle to the values on the axes
          - rectangles faking the background for the labels on the axes
          - text elements making up the labels on the axes
          */
          const tooltip = d3
            .select(this)
            .insert('g', ':first-child')
            .attr('class', 'tooltip')
            .attr('opacity', 0)
            .style('pointer-events', 'none');


          // for the rectangle retrieve the width and height of the text elements to have the rectangle match in size
          const textElement = text['_groups'][0][0];
          const { x, y, width: textWidth, height: textHeight } = textElement.getBBox();

          tooltip
            .append('rect')
            .attr('x', x - 3)
            .attr('y', y - 1.5)
            .attr('width', textWidth + 6)
            .attr('height', textHeight + 3)
            .attr('fill', 'hsl(227, 9%, 81%)')
            .attr('rx', '2')
            .transition()
            // transition the rectangle to match the text translation
            .attr('transform', 'translate(12 0)');


          // include the two dotted lines in a group to centralize their common properties
          const dashedLines = tooltip
            .append('g')
            .attr('fill', 'none')
            .attr('stroke', 'hsl(227, 9%, 81%)')
            .attr('stroke-width', 2)
            // have the animation move the path with a stroke-dashoffset considering the cumulative value of a dash and an empty space
            .attr('stroke-dasharray', '7 4');
          // animate the path elements to perennially move toward the axes
          //  .style('animation', 'dashOffset 1.5s linear infinite')


          dashedLines
            .append('path')
            .attr('d', ({ percentage }) => `M 0 0 v ${(height - percentageScale(percentage))}`);

          dashedLines
            .append('path')
            .attr('d', ({ count }) => `M 0 0 h -${countScale(count)}`);

          // include two labels centered on the axes, highlighting the matching values
          const labels = tooltip
            .append('g')
            .attr('font-size', '0.6rem')
            .attr('fill', 'hsl(227, 9%, 81%)');

          const labelCount = labels
            .append('g')
            .attr('transform', ({ percentage }) => `translate(0 ${(height - percentageScale(percentage))})`);

          const textCount = labelCount
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('color', 'hsl(230, 29%, 19%)')
            .text(({ count }) => count);

          const labelPercentage = labels
            .append('g')
            .attr('transform', ({ count }) => `translate(-${countScale(count)} 0)`);

          const textPercentage = labelPercentage
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('color', 'hsl(230, 29%, 19%)')
            .text(({ percentage }) => `${percentage}%`);

          // behind the labels include two rectangles, replicating the faux background specified for the original text element
          const { width: countWidth, height: countHeight } = textCount['_groups'][0][0].getBBox();
          const { width: percentageWidth, height: percentageHeight } = textPercentage['_groups'][0][0].getBBox();

          labelCount
            .insert('rect', ':first-child')
            .attr('x', -countWidth / 2 - 4)
            .attr('y', -countHeight / 2 - 2)
            .attr('width', countWidth + 8)
            .attr('height', countHeight + 4)
            .attr('rx', 3);

          labelPercentage
            .insert('rect', ':first-child')
            .attr('x', -percentageWidth / 2 - 4)
            .attr('y', -percentageHeight / 2 - 2)
            .attr('width', percentageWidth + 8)
            .attr('height', percentageHeight + 4)
            .attr('rx', 3);


          // detail a circle, with a darker fill and a larger radius
          tooltip
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('fill', 'hsl(0, 0%, 0%)')
            .attr('stroke', 'hsl(227, 9%, 81%)')
            .attr('stroke-width', 2)
            .attr('r', 0)
            // transition the circle its full radius
            .transition()
            .attr('r', 9.5);

          // transition the tooltip to be fully opaque
          tooltip
            .transition()
            .attr('opacity', 1);

        })
        // when exiting the hover state reset the appearance of the data point and remove the tooltip
        .on('mouseout', function (d) {
          d3
            .select(this)
            .select('text.name')
            .transition()
            .delay(100)
            .attr('transform', 'translate(0 0)')
            .style('color', 'inherit')
            .style('text-shadow', 'inherit')
            .style('visibility', (i) => (dataLabelVisible == false) ? 'hidden' : 'visible');

          // remove the tooltip after rendering it fully transparent
          d3
            .select(this)
            .select('g.tooltip')
            .transition()
            .attr('opacity', 0)
            .remove();
        });
    }


    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      // if ("value" in changedProperties) {
      // 	this.$value = changedProperties["value"];
      // }

      // if ("info" in changedProperties) {
      // 	this.$info = changedProperties["info"];
      // }

      // if ("color" in changedProperties) {
      // 	this.$color = changedProperties["color"];
      // }

      this.render();
    }
  }
  customElements.define("com-voith-quadrantchart", QuadrantChart);
})();