import React from 'react';
import { select } from 'd3-selection';
import { line } from 'd3-shape';

import { PlotContext } from './PlotGrid';

interface Props {
    data: Plot.Datum[];
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    fill?: string;
    fillOpacity?: number;
}

const PlotLine = ({
    data,
    stroke = '#000',
    strokeWidth = 1,
    strokeOpacity = 1,
    fill = '#000',
    fillOpacity = 0.3
}: Props): JSX.Element => {
    const { xScale, yScale } = React.useContext(PlotContext);
    const gRef = React.useRef<SVGGElement>(null);

    const l = line<{ x: number | string; y: number }>();

    React.useEffect(() => {
        if (gRef.current) {
            const gEl = select(gRef.current);
            gEl.selectAll('*').remove();
            gEl.append('path')
                .datum(data)
                .attr('fill', fill)
                .attr('fill-opacity', fillOpacity)
                .attr('stroke', stroke)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-opacity', strokeOpacity)
                .attr(
                    'd',
                    l.x((d) => xScale(d.x)).y((d) => yScale(d.y))
                );
        }
    });
    return <g ref={gRef} />;
};

export default PlotLine;
