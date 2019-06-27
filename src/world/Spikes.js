import WorldObject from './WorldObject'
import ObjectType from './ObjectType'

export default class Spikes extends WorldObject {
  constructor(config, tileWidth, tileHeight) {
    super(config, tileWidth, tileHeight)
    this.enabled = false
    this.triggers = []
    this.parseProperties()
    this.initialyEnabled = this.enabled
  }

  initTriggers(world) {
    if (typeof this.triggers === 'string') {
      let triggerIDs = this.triggers.split(',').map(id => parseInt(id))
      this.triggers = []

      for (let id of triggerIDs) {
        this.triggers.push(world.findWorldObjectByID(id))
      }
    }
  }

  checkTriggers() {
    let triggered = true
    for (let trigger of this.triggers) {
      if (trigger.isDisabled()) {
        triggered = false
        break
      }
    }

    if ((triggered && !this.initialyEnabled) || (!triggered && this.initialyEnabled)) {
      this.enable()
    } else {
      this.disable()
    }
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  isDisabled() {
    return !this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  getObjectType() {
    return ObjectType.spikes
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      enabled: this.enabled,
      triggers: this.triggers.map(trigger => trigger.id)
    })
  }
}