import { AllAcceptedTypes, Integer } from './built-in-types'
import { Entity } from './entity'
import { readonly } from './utils'

export type Handler<T = any> = (value: string, name: string, previousValue?: T) => T

export interface Spec {
  [key: string]: string | Handler | [Handler] | any
}

export type Result<T extends Spec> = {
  [K in keyof T]:
  T[K] extends Handler ? ReturnType<T[K]>
  : T[K] extends [Handler] ? Array<ReturnType<T[K][0]>>
  : T[K] extends Spec ? Result<T[K]>
  : never
}

export type ComponentDefinition<T extends Spec> = {
  _id: number
  // removeFrom(entity: Entity): void
  getFrom(entity: Entity): Readonly<Result<T>>

  getOrNull(entity: Entity): Readonly<Result<T>> | null

  // adds this component to the list "to be reviewed next frame"
  create(entity: Entity, val: Result<T>): Result<T>

  // adds this component to the list "to be reviewed next frame"
  mutable(entity: Entity): Result<T>

  deleteFrom(entity: Entity): Result<T> | null

  updateFromBinary(entity: Entity, data: Uint8Array, offset: number): void
  toBinary(entity: Entity): Uint8Array

  iterator(): Iterable<[Entity, Result<T>]>
  dirtyIterator(): Iterable<Entity>
}

export type CustomSerializerParser<T> = {
  toBinary: (data: Result<T>) => Uint8Array,
  fromBinary: (data: Uint8Array, offset: number) => Result<T>
}

export function defineComponent<T extends Spec>(componentId: number, spec: T, customBridge?: CustomSerializerParser<T>) {
  type ComponentType = Result<T>
  const data = new Map<Entity, ComponentType>()
  const dirtyIterator = new Set<Entity>()

  type TreeValue = {
    key: string
    valueType: any
    getValue: (obj: ComponentType) => any
    setValue: (obj: ComponentType, value: any) => void
  }

  const tree: TreeValue[] = []

  function generateTree(values: any, keyPrefix: string[], tree: any[], deepIndex: number, topLevelValue: any) {
    for (const key of Object.keys(values)) {
      const typeConstructor = values[key]

      if (AllAcceptedTypes.includes(values[key])) {
        tree.push({
          key: ['this', ...keyPrefix, key].join('.'),
          valueType: values[key],
          getValue: (obj: ComponentType) => {
            let objRef: any = obj
            keyPrefix.forEach(key => objRef = objRef[key])
            return objRef[key]
          },
          setValue: (obj: ComponentType, value: typeof typeConstructor) => {
            let objRef: any = obj
            keyPrefix.forEach(key => objRef = objRef[key])
            objRef[key] = value
          }
        })
      } else if (typeof values[key] === 'object') {
        generateTree(values[key], [...keyPrefix, key], tree, deepIndex + 1, topLevelValue)
      } else {
        throw new Error(`unidentified type '${key}' ${typeof values[key]} = ${values[key]}`)
      }
    }
  }

  generateTree(spec, [], tree, 0, spec)

  return {
    _id: componentId,
    deleteFrom: function (entity: Entity): ComponentType | null {
      const component = data.get(entity)
      data.delete(entity)
      return component || null
    },
    getOrNull: function (entity: Entity): Readonly<ComponentType> | null {
      const component = data.get(entity)
      return component ? readonly(component) : null
    },
    getFrom: function (entity: Entity): Readonly<ComponentType> {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }
      return readonly(component)
    },
    create: function (entity: Entity, value: ComponentType): ComponentType {
      data.set(entity, value)
      dirtyIterator.add(entity)
      return value
    },
    mutable: function (entity: Entity): ComponentType {
      // TODO cach the ?. case
      dirtyIterator.add(entity)
      // TODO !
      return data.get(entity)!
    },
    iterator: function* (): Iterable<[Entity, ComponentType]> {
      for (const [entity, component] of data) {
        yield [entity, component]
      }
    },
    dirtyIterator: function* (): Iterable<Entity> {
      for (const entity of dirtyIterator) {
        yield entity
      }
    },
    toBinary(entity: Entity): Uint8Array {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      if (customBridge) {
        return customBridge.toBinary(component)
      }

      for (const value of tree) {
        console.log(`${value.key} = ${value.getValue(component)}`)
      }

      return new Uint8Array()
    },
    updateFromBinary(entity: Entity, dataArray: Uint8Array, offset: number = 0) {
      const component = data.get(entity)
      if (!component) {
        throw new Error(`Component ${componentId} for ${entity} not found`)
      }

      if (customBridge) {
        const newValue = customBridge.fromBinary(dataArray, offset)
        data.set(entity, newValue)
        return
      }

      let newValue: any = {}
      for (const value of tree) {
        const newFieldValue = null

        if (value.valueType === Integer) {
          // newFieldValue = getInt32(dataArray, offset)
        } else {

        }

        value.setValue(newValue, newFieldValue)
      }
      data.set(entity, newValue as ComponentType)

    }
  }
}
