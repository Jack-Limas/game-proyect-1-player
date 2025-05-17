import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock para howler
vi.mock('howler', () => {
  const play = vi.fn()
  const stop = vi.fn()
  const playing = vi.fn(() => false)

  return {
    Howl: vi.fn().mockImplementation(() => ({
      play,
      stop,
      playing,
    })),
    Howler: {
      ctx: {
        state: 'running',
        resume: vi.fn().mockResolvedValue()
      }
    }
  }
})

// Mock para Sound.js que devuelve un objeto con play() y stop()
const soundMock = {
  play: vi.fn(),
  stop: vi.fn()
}

vi.mock('../Experience/World/Sound', () => {
  return {
    default: vi.fn(() => soundMock)
  }
})

import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Robot from '../Experience/World/Robot'
import { AnimationClip } from 'three'

beforeEach(() => {
  vi.spyOn(THREE.AnimationMixer.prototype, 'clipAction').mockImplementation(() => {
    return {
      play: vi.fn(),
      stop: vi.fn(),
      reset: vi.fn(),
      crossFadeFrom: vi.fn(),
      setLoop: vi.fn(),
      clampWhenFinished: true,
      onFinished: null,
      dispatchEvent: vi.fn()
    }
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

const createMockExperience = () => {
  const animations = [
    new AnimationClip('dance', -1, []),
    new AnimationClip('death', -1, []),
    new AnimationClip('idle', -1, []),
    new AnimationClip('jump', -1, []),
    new AnimationClip('walk', -1, []),
    new AnimationClip('extra1', -1, []),
    new AnimationClip('extra2', -1, []),
    new AnimationClip('extra3', -1, []),
    new AnimationClip('extra4', -1, []),
    new AnimationClip('extra5', -1, []),
    new AnimationClip('walking', -1, [])
  ]

  return {
    scene: new THREE.Scene(),
    resources: {
      items: {
        robotModel: {
          scene: new THREE.Group(),
          animations
        }
      }
    },
    time: {
      delta: 16
    },
    physics: {
      world: {
        addBody: vi.fn()
      },
      robotMaterial: new CANNON.Material('robotMaterial')
    },
    keyboard: {
      getState: vi.fn(() => ({
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
      }))
    },
    debug: false
  }
}

describe('Robot', () => {
  let robot, experience

  beforeEach(() => {
    experience = createMockExperience()
    robot = new Robot(experience)
  })

  it('se crea correctamente con grupo en escena', () => {
    expect(experience.scene.children.includes(robot.group)).toBe(true)
  })

  it('inicializa la posición física del cuerpo', () => {
    expect(robot.body.position.y).toBe(1)
  })

  it('tiene animaciones disponibles', () => {
    expect(robot.animation.actions).toHaveProperty('idle')
    expect(robot.animation.actions).toHaveProperty('jump')
    expect(robot.animation.actions).toHaveProperty('walking')
  })

  it('inicia con animación idle', () => {
    expect(robot.animation.actions.current).toBe(robot.animation.actions.idle)
  })

  it('ejecuta animación jump y vuelve a idle', () => {
    const playSpy = vi.spyOn(robot.animation, 'play')
    robot.animation.play('jump')
    expect(playSpy).toHaveBeenCalledWith('jump')
    robot.animation.actions.jump.onFinished() // simula final de jump
    expect(playSpy).toHaveBeenCalledWith('idle')
  })

  it('limita la velocidad máxima del robot', () => {
    robot.body.velocity.set(100, 0, -100)
    robot.update()
    expect(robot.body.velocity.x).toBeLessThanOrEqual(15)
    expect(robot.body.velocity.z).toBeGreaterThanOrEqual(-15)
  })

  it('reubica al robot si cae del escenario', () => {
    robot.body.position.set(0, 11, 0)
    robot.update()
    expect(robot.body.position.y).toBeLessThanOrEqual(1)
  })

  it('ejecuta animación idle cuando no hay teclas presionadas', () => {
    const playSpy = vi.spyOn(robot.animation, 'play')
    robot.animation.actions.current = robot.animation.actions.walking
    robot.update()
    expect(playSpy).toHaveBeenCalledWith('idle')
  })

  it('aplica fuerza al cuerpo cuando se presiona down', () => {
    experience.keyboard.getState = vi.fn(() => ({
      up: false,
      down: true,
      left: false,
      right: false,
      space: false
    }))
    const initialZ = robot.body.velocity.z
    robot.update()
    expect(robot.body.velocity.z).not.toBeGreaterThan(initialZ)
  })

  it('gira a la izquierda cuando se presiona left', () => {
    const initialRotationY = robot.group.rotation.y
    experience.keyboard.getState.mockReturnValue({
      up: false,
      down: false,
      left: true,
      right: false,
      space: false
    })
    robot.update()
    expect(robot.group.rotation.y).toBeGreaterThan(initialRotationY)
  })

  it('gira a la derecha cuando se presiona right', () => {
    const initialRotationY = robot.group.rotation.y
    experience.keyboard.getState.mockReturnValue({
      up: false,
      down: false,
      left: false,
      right: true,
      space: false
    })
    robot.update()
    expect(robot.group.rotation.y).toBeLessThan(initialRotationY)
  })
})
