class Scratch2Mip {

  constructor() {
    this.ws = undefined;
  }

  getInfo() { // 拡張機能の各種情報
    return {
      id: 'scratch2mip',
      name: 'Scratch2Mip', // 拡張機能の名前
      blocks: [ // 各ブロックの定義
        {
          opcode: 'connect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect'
        },
        {
          opcode: 'move_forward',
          blockType: Scratch.BlockType.COMMAND,
          text: 'move forward [STEPS] steps',
          arguments: {
            STEPS: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10
            }
          }
        },
        {
          opcode: 'move_backward',
          blockType: Scratch.BlockType.COMMAND,
          text: 'move backward [STEPS] steps',
          arguments: {
            STEPS: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10
            }
          }
        },
        {
          opcode: 'turn_right',
          blockType: Scratch.BlockType.COMMAND,
          text: 'turn right [DEGREES] degrees',
          arguments: {
            DEGREES: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 90
            }
          }
        },
        {
          opcode: 'turn_left',
          blockType: Scratch.BlockType.COMMAND,
          text: 'turn left [DEGREES] degrees',
          arguments: {
            DEGREES: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 90
            }
          }
        }
      ]
    }
  }
  connect() {
    this.ws = new WebSocket('ws://localhost:8080');
  }
  move_forward({STEPS}) {
    this.ws.send(JSON.stringify({command: 'forward', steps: STEPS}));
  }
  move_backward({STEPS}) {
    this.ws.send(JSON.stringify({command: 'backward', steps: STEPS}));
  }
  turn_right({DEGREES}) {
    this.ws.send(JSON.stringify({command: 'right', degrees: DEGREES}));
  }
  turn_left({DEGREES}) {
    this.ws.send(JSON.stringify({command: 'left', degrees: DEGREES}));
  }
}

Scratch.extensions.register(new Scratch2Mip());
