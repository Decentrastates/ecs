// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers'

export class BoxShape {
  bb: flatbuffers.ByteBuffer | null = null
  bb_pos = 0
  __init(i: number, bb: flatbuffers.ByteBuffer): BoxShape {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  static getRootAsBoxShape(
    bb: flatbuffers.ByteBuffer,
    obj?: BoxShape
  ): BoxShape {
    return (obj || new BoxShape()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  static getSizePrefixedRootAsBoxShape(
    bb: flatbuffers.ByteBuffer,
    obj?: BoxShape
  ): BoxShape {
    bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH)
    return (obj || new BoxShape()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  withCollisions(): boolean {
    const offset = this.bb!.__offset(this.bb_pos, 4)
    return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false
  }

  isPointerBlocker(): boolean {
    const offset = this.bb!.__offset(this.bb_pos, 6)
    return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false
  }

  visible(): boolean {
    const offset = this.bb!.__offset(this.bb_pos, 8)
    return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false
  }

  uvs(index: number): number | null {
    const offset = this.bb!.__offset(this.bb_pos, 10)
    return offset
      ? this.bb!.readFloat32(
          this.bb!.__vector(this.bb_pos + offset) + index * 4
        )
      : 0
  }

  uvsLength(): number {
    const offset = this.bb!.__offset(this.bb_pos, 10)
    return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0
  }

  uvsArray(): Float32Array | null {
    const offset = this.bb!.__offset(this.bb_pos, 10)
    return offset
      ? new Float32Array(
          this.bb!.bytes().buffer,
          this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset),
          this.bb!.__vector_len(this.bb_pos + offset)
        )
      : null
  }

  static startBoxShape(builder: flatbuffers.Builder) {
    builder.startObject(4)
  }

  static addWithCollisions(
    builder: flatbuffers.Builder,
    withCollisions: boolean
  ) {
    builder.addFieldInt8(0, +withCollisions, +false)
  }

  static addIsPointerBlocker(
    builder: flatbuffers.Builder,
    isPointerBlocker: boolean
  ) {
    builder.addFieldInt8(1, +isPointerBlocker, +false)
  }

  static addVisible(builder: flatbuffers.Builder, visible: boolean) {
    builder.addFieldInt8(2, +visible, +false)
  }

  static addUvs(builder: flatbuffers.Builder, uvsOffset: flatbuffers.Offset) {
    builder.addFieldOffset(3, uvsOffset, 0)
  }

  static createUvsVector(
    builder: flatbuffers.Builder,
    data: number[] | Float32Array
  ): flatbuffers.Offset
  /**
   * @deprecated This Uint8Array overload will be removed in the future.
   */
  static createUvsVector(
    builder: flatbuffers.Builder,
    data: number[] | Uint8Array
  ): flatbuffers.Offset
  static createUvsVector(
    builder: flatbuffers.Builder,
    data: number[] | Float32Array | Uint8Array
  ): flatbuffers.Offset {
    builder.startVector(4, data.length, 4)
    for (let i = data.length - 1; i >= 0; i--) {
      builder.addFloat32(data[i]!)
    }
    return builder.endVector()
  }

  static startUvsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  static endBoxShape(builder: flatbuffers.Builder): flatbuffers.Offset {
    const offset = builder.endObject()
    return offset
  }

  static finishBoxShapeBuffer(
    builder: flatbuffers.Builder,
    offset: flatbuffers.Offset
  ) {
    builder.finish(offset)
  }

  static finishSizePrefixedBoxShapeBuffer(
    builder: flatbuffers.Builder,
    offset: flatbuffers.Offset
  ) {
    builder.finish(offset, undefined, true)
  }

  static createBoxShape(
    builder: flatbuffers.Builder,
    withCollisions: boolean,
    isPointerBlocker: boolean,
    visible: boolean,
    uvsOffset: flatbuffers.Offset
  ): flatbuffers.Offset {
    BoxShape.startBoxShape(builder)
    BoxShape.addWithCollisions(builder, withCollisions)
    BoxShape.addIsPointerBlocker(builder, isPointerBlocker)
    BoxShape.addVisible(builder, visible)
    BoxShape.addUvs(builder, uvsOffset)
    return BoxShape.endBoxShape(builder)
  }

  unpack(): BoxShapeT {
    return new BoxShapeT(
      this.withCollisions(),
      this.isPointerBlocker(),
      this.visible(),
      this.bb!.createScalarList(this.uvs.bind(this), this.uvsLength())
    )
  }

  unpackTo(_o: BoxShapeT): void {
    _o.withCollisions = this.withCollisions()
    _o.isPointerBlocker = this.isPointerBlocker()
    _o.visible = this.visible()
    _o.uvs = this.bb!.createScalarList(this.uvs.bind(this), this.uvsLength())
  }
}

export class BoxShapeT {
  constructor(
    public withCollisions: boolean = false,
    public isPointerBlocker: boolean = false,
    public visible: boolean = false,
    public uvs: number[] = []
  ) {}

  static pack(
    builder: flatbuffers.Builder,
    value: BoxShapeT
  ): flatbuffers.Offset {
    const uvs = BoxShape.createUvsVector(builder, value.uvs)

    return BoxShape.createBoxShape(
      builder,
      value.withCollisions,
      value.isPointerBlocker,
      value.visible,
      uvs
    )
  }
}
