export class ResetViewControl {
  constructor (flyToParms) {
    this.flyToParms = flyToParms
  }
  onAdd(map) {
    this.map = map
    this.container = document.createElement('div')
    this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group'
    this.button = document.createElement('button')
    this.button.className = 'mapboxgl-ctrl-icon reset-view-control'
    this.container.appendChild(this.button)
    this.button.addEventListener('click', this.repositionMap.bind(this))
    return this.container;
  }
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  repositionMap() {
    this.map.flyTo(this.flyToParms)
  }
}
