class Router {
  constructor(routes) {
    this.routes = routes
    this.render = {}
    routes.forEach(r => {
      this.render[r.path] = r.component
    })
    this.updateView = this.updateView.bind(this)
    this.init()
  }
  init() {
    document.addEventListener('load', this.updateView, false)
    window.addEventListener('hashchange', this.updateView, false)
  }
  updateView() {
    let path = window.location.hash.slice(1)
    if (this.render[path]) document.querySelector('.content').innerHTML = this.render[path]
  }
}
new Router([
  { path: 'a', component: 'aaaContent' },
  { path: 'b', component: 'bbbContent' },
  { path: 'c', component: 'cccContent' }
])
