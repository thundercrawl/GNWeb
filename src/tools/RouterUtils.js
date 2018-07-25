import lazyLoading from './lazyLoading'
export default (routers, data, mode) => {
    if ('menu' == mode) {
        generaMenu(routers, data)
    } else {
        generaRouter(routers, data);
    }
}
function generaRouter(routers, routerData) {
    for (var key in routerData) {
        var menu = routerData[key];
        menu.component = lazyLoading(menu.componentSrc)
        routers.push(menu);
    }
}
function generaMenu(routers,userMenus) {
    for (let i = 0; i < userMenus.length; i++) {
        let item = userMenus[i];
        let menu = {
            path: item.router,
            name: item.resourceName,
            componentSrc: item.component,
            component: ''
        };
        menu.component = lazyLoading(item.component);
        routers.push(menu);
    }
}
