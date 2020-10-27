import React from 'react';
import { select } from 'd3-selection';

import { PlotContext } from './PlotGrid';

interface Props {
    data: Plot.Datum[];
    width?: number;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fill?: string;
    fillOpacity?: number;
}

const PlotBarChart = (props: Props): JSX.Element => {
    const {
        data,
        width = 20,
        stroke = '#204c70',
        strokeWidth = 1,
        strokeOpacity = 1,
        fill = '#4682b4',
        fillOpacity = 0.3
    } = props;

    const { xScale, yScale, height } = React.useContext(PlotContext);

    const gRef = React.useRef(null);

    React.useEffect(() => {
        if (gRef.current) {
            const gEl = select(gRef.current);
            gEl.selectAll('*').remove();

            // Enter
            gEl.selectAll('.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('y', (d) => yScale(d.y))
                .attr('x', (d) => xScale(d.x))
                .attr('width', xScale.bandwidth ? xScale.bandwidth() : xScale(width))
                .attr('height', (d) => height - yScale(d.y))
                .attr('stroke', stroke)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-opacity', strokeOpacity)
                .attr('fill', fill)
                .attr('fill-opacity', fillOpacity);
        }
    });

    return <g ref={gRef} />;
};

export default PlotBarChart;
