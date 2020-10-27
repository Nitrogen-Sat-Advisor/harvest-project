import React from 'react';
import { select } from 'd3-selection';

interface Props {
    data: Plot.LegendDatum[];
    width: number;
    itemHeight: number;
    itemGap?: number;
    marginTop?: number;
    marginBottom?: number;
    marginRight?: number;
    marginLeft?: number;
}

const Legend = (props: Props): JSX.Element => {
    const {
        width,
        itemHeight,
        itemGap = 15,
        marginTop = 0,
        marginBottom = 0,
        marginRight = 0,
        marginLeft = 0,
        data
    } = props;

    const rowHeight = itemHeight + itemGap;
    const height = data.length * rowHeight;

    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - itemGap - marginTop - marginBottom;

    const svgRef = React.useRef(null);

    React.useEffect(() => {
        if (svgRef.current) {
            const svgEl = select(svgRef.current);
            svgEl.selectAll('*').remove();

            const gEl = svgEl
                .append('g')
                .attr('width', innerWidth)
                .attr('height', innerHeight)
                .attr('transform', `translate(${marginLeft},${marginTop})`);

            data.forEach(({ label, type, color, width: strokeWidth = 2, opacity = 1, size = 16 }, idx) => {
                const baseY = itemGap + idx * rowHeight;

                if (type === 'line') {
                    gEl.append('line')
                        .attr('x1', 0)
                        .attr('y1', baseY - itemHeight / 2)
                        .attr('x2', 20)
                        .attr('y2', baseY - itemHeight / 2)
                        .attr('stroke', color)
                        .attr('stroke-width', strokeWidth)
                        .attr('stroke-opacity', opacity);
                } else if (type === 'polygon') {
                    gEl.append('rect')
                        .attr('x', 0)
                        .attr('y', baseY - itemHeight)
                        .attr('width', 20)
                        .attr('height', itemHeight)
                        .attr('fill', color)
                        .attr('fill-opacity', opacity);
                }

                gEl.append('text').text(label).attr('x', 25).attr('y', baseY).attr('font-size', size);
            });
        }
    });

    return <svg ref={svgRef} width={width} height={height} />;
};

export default Legend;
