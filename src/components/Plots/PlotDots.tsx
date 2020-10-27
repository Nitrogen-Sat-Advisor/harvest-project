import React from 'react';
import { select } from 'd3-selection';

import { PlotContext } from './PlotGrid';

interface Props {
    data: Plot.Datum[];
    radius?: number;
    stroke?: string;
    strokeOpacity?: number;
    fill?: string;
    fillOpacity?: number;
}

const PlotDots = (props: Props): JSX.Element => {
    const { data, radius = 10, stroke = '#204c70', strokeOpacity = 1, fill = '#4682b4', fillOpacity = 0.3 } = props;

    const { xScale, yScale } = React.useContext(PlotContext);

    const gRef = React.useRef(null);

    React.useEffect(() => {
        if (gRef.current) {
            const gEl = select(gRef.current);
            gEl.selectAll('*').remove();

            // Enter
            gEl.selectAll('.dot')
                .data(data)
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', (d) => xScale(d.x))
                .attr('cy', (d) => yScale(d.y))
                .attr('r', radius)
                .attr('stroke', stroke)
                .attr('stroke-opacity', strokeOpacity)
                .attr('fill', fill)
                .attr('fill-opacity', fillOpacity);
        }
    });

    return <g ref={gRef} />;
};

export default PlotDots;
