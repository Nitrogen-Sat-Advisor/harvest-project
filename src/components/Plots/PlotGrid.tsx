import React from 'react';
import { select } from 'd3-selection';

import type { Axis, AxisDomain } from 'd3-axis';

export const PlotContext = React.createContext<Plot.Context>({} as Plot.Context);

interface Props<XDomain extends AxisDomain, YDomain extends AxisDomain> {
    children?: React.ReactNode;
    width: number;
    height: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    xAxisProps: {
        axis: (width: number, height: number) => [Axis<XDomain>, Plot.xScale];
        key?: string | number;
        title?: string;
        titlePadding?: number;
        textColor?: string;
        textOpacity?: number;
    };
    yAxisProps: {
        axis: (width: number, height: number) => [Axis<YDomain>, Plot.yScale];
        key?: string | number;
        title?: string;
        titlePadding?: number;
        textColor?: string;
        textOpacity?: number;
    };
}

const PlotGrid = <XDomain extends AxisDomain, YDomain extends AxisDomain>(
    props: Props<XDomain, YDomain>
): JSX.Element => {
    const gridRef = React.useRef<SVGGElement>(null);

    const {
        children,
        width,
        height,
        marginTop = 0,
        marginBottom = 0,
        marginRight = 0,
        marginLeft = 0,
        xAxisProps,
        yAxisProps
    } = props;

    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginBottom - marginTop;

    const [xAxis, xScale] = xAxisProps.axis(innerWidth, innerHeight);
    const [yAxis, yScale] = yAxisProps.axis(innerWidth, innerHeight);

    React.useEffect(() => {
        if (gridRef.current) {
            const gEl = select(gridRef.current);
            gEl.select('.gridContainer').remove();

            const gridContainer = gEl.append('g').lower().attr('class', 'gridContainer');

            // Add X axis
            gridContainer
                .append('g')
                .attr('class', 'grid')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(xAxis);

            if (xAxisProps.title) {
                gridContainer
                    .append('text')
                    .attr('class', 'xTitle')
                    .attr('x', innerWidth / 2)
                    .attr('y', innerHeight + (xAxisProps.titlePadding || 0))
                    .attr('text-anchor', 'middle')
                    .attr('fill', xAxisProps.textColor || 'currentColor')
                    .attr('fill-opacity', xAxisProps.textOpacity || 0.3)
                    .text(xAxisProps.title);
            }

            // Add Y axis
            gridContainer.append('g').attr('class', 'grid').call(yAxis);

            if (yAxisProps.title) {
                gridContainer
                    .append('text')
                    .attr('class', 'yTitle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -(xAxisProps.titlePadding || 0))
                    .attr('x', -(innerHeight / 2))
                    .attr('text-anchor', 'end')
                    .attr('fill', yAxisProps.textColor || 'currentColor')
                    .attr('fill-opacity', yAxisProps.textOpacity || 0.3)
                    .text(yAxisProps.title);
            }
        }
    });

    return (
        <PlotContext.Provider
            value={{
                xScale,
                yScale,
                width: innerWidth,
                height: innerHeight
            }}
        >
            <svg width={width} height={height}>
                <g
                    ref={gridRef}
                    width={innerWidth}
                    height={innerHeight}
                    transform={`translate(${marginLeft},${marginTop})`}
                >
                    {children}
                </g>
            </svg>
        </PlotContext.Provider>
    );
};

export default PlotGrid;
