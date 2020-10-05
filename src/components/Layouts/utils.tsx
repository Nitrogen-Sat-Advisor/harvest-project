import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

/**
 * A higher-order component that wraps a component with the given Layout
 * @param Layout layout component
 * @param Component the component to wrap in the layout
 * @param layoutProps extra props to pass to the Layout component
 */
export const withLayout = <P extends Record<string, unknown>>(
    Layout: React.ComponentType<P>,
    Component: React.ComponentType<RouteComponentProps>,
    layoutProps: P = {} as P
): ((routeProps: RouteComponentProps) => JSX.Element) => {
    const ComponentWithLayout = (routeProps: RouteComponentProps) => (
        <Layout {...layoutProps}>
            <Component {...routeProps} />
        </Layout>
    );
    ComponentWithLayout.displayName = `${Component.displayName}With${Layout.displayName}`;
    return ComponentWithLayout;
};
