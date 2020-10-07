import React from 'react';

import type { RouteProps } from 'react-router-dom';

import { withLayout } from './components/Layouts/utils';
import MainLayout from './components/Layouts/MainLayout';
import Home from './components/Home';
import { Header as HomeHeader } from './components/Home/layout';
import NAdvisor from './components/NAdvisor';
import { Header as NAdvisorHeader } from './components/NAdvisor/layout';
import SatViewer from './components/SatViewer';
import { Header as SatViewerHeader } from './components/SatViewer/layout';

const routes: { [key: string]: RouteProps } = {
    '/': {
        exact: true,
        component: withLayout(MainLayout, Home, { header: <HomeHeader /> })
    },
    '/nitrogen-advisor': { exact: true, component: withLayout(MainLayout, NAdvisor, { header: <NAdvisorHeader /> }) },
    '/satellite-viewer': { exact: true, component: withLayout(MainLayout, SatViewer, { header: <SatViewerHeader /> }) }
};

export default routes;
