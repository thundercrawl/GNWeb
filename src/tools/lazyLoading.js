export default (name) => () => import(`src/components/${name}.vue`)
