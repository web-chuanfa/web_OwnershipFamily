import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home'
import InfoDetail from './pages/infoDetail'
import China from './components/tabContent/china'
import ChinaL from './components/tabContent/chinaL'
import World from './components/tabContent/world'
import WorldL from './components/tabContent/worldL'
import Table from './components/table/table'
import detailTable from './components/table/detailTable'
import vTable from './components/table/vTable'
import vDetailTable from './components/table/vDetailTable'
import Province from './components/region/province'
import AllViewChina from './components/region/allViewChina'
import vChina from './components/region/vChina'
import vChinaL from './components/region/vChinaL'
import vWorld from './components/region/vWorld'
import vWorldL from './components/region/vWorldL'
import vProvince from './components/region/vProvince'
import vCity from './components/region/vCity'
import vState from './components/region/vState'
import vTrade from './components/region/vTrade'
import BasicInfo from './components/tabContent/basicInfo';
import StockInfo from './components/tabContent/stockInfo';
import allLevel from './components/stockInfo/allLevel';
import RegionSubstance from './components/tabContent/regionSubstance';
import State from './components/region/state';
import Trade from './components/region/trade';
import City from './components/region/city';
import count from './components/count'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/count',
            component: count
        },
        {
            path: '/allViewChina',
            component: AllViewChina,
            children: [
                {
                    path: 'vChina',
                    component: vChina,
                    children: [
                        {
                            path: 'vChinaL',
                            component: vChinaL
                        },
                        {
                            path: 'vProvince',
                            component: vProvince
                        },
                        {
                            path: 'vCity',
                            component: vCity
                        },
                    ]
                },
                {
                    path: 'vWorld',
                    component: vWorld,
                    children: [
                        {
                            path: 'vWorldL',
                            component: vWorldL
                        },
                        {
                            path: 'vState',
                            component: vState
                        },
                        {
                            path: 'vTrade',
                            component: vTrade
                        }
                    ]
                }
            ]
        },
        {
            path: '/vTable',
            component: vTable
        },
        {
            path: '/vDetailTable',
            component: vDetailTable
        },
        {
            path: '/infoDetail/',
            component: InfoDetail,
            children: [
                {
                    path: 'basicInfo/:id/',
                    component: BasicInfo
                },
                {
                    path: 'stockInfo/',
                    component: StockInfo,
                    children: [
                        {
                            path: 'allLevel/:id',
                            component: allLevel
                        }
                    ]
                },
                {
                    path: 'regionSubstance/',
                    component: RegionSubstance,
                    children: [
                        {
                            path: 'china',
                            component: China,
                            children: [
                                {
                                    path: 'chinaL/:id',
                                    component: ChinaL
                                },
                                {
                                    path: 'province/:id',
                                    component: Province
                                },
                                {
                                    path: 'city/:id',
                                    component: City
                                }
                            ]
                        },
                        {
                            path: 'world',
                            component: World,
                            children: [
                                {
                                    path: 'worldL/:id',
                                    component: WorldL
                                },
                                {
                                    path: 'trade/:id',
                                    component: Trade
                                },
                                {
                                    path: 'state/:id',
                                    component: State
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'table/:id',
                    component: Table
                },
                {
                    path: 'detailTable/:id',
                    component: detailTable
                }
            ]
        }
    ]
})