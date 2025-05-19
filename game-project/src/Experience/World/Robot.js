import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Sound from './Sound.js'

export default class Robot {
    constructor(experience) {
        this.experience = experience
        this.scene = experience.scene
        this.resources = experience.resources
        this.time = experience.time
        this.physics = experience.physics
        this.keyboard = experience.keyboard
        this.debug = experience.debug
        this.points = 0

        this.setModel()
        this.setSounds()
        this.setPhysics()
        this.setAnimation()
    }

    setModel() {
        const modelData = this.resources.items?.robotModel
        this.model = modelData?.scene || new THREE.Group()
        this.model.scale.set(0.3, 0.3, 0.3)
        this.model.position.set(0, -0.3, 0)

        this.group = new THREE.Group()
        this.group.add(this.model)
        this.scene.add(this.group)

        this.model.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
    }

    setPhysics() {
        const shape = new CANNON.Sphere(0.4)

        this.body = new CANNON.Body({
            mass: 2,
            shape,
            position: new CANNON.Vec3(0, 1, 0),
            linearDamping: 0.05,
            angularDamping: 0.9
        })

        this.body.angularFactor.set(0, 1, 0)
        this.body.velocity.setZero()
        this.body.angularVelocity.setZero()
        this.body.sleep()
        this.body.material = this.physics.robotMaterial

        this.physics.world.addBody(this.body)

        setTimeout(() => {
            this.body.wakeUp()
        }, 100)
    }

    setSounds() {
        this.walkSound = new Sound('/sounds/robot/walking.mp3', { loop: true, volume: 0.5 })
        this.jumpSound = new Sound('/sounds/robot/jump.mp3', { volume: 0.8 })
    }

    setAnimation() {
        const clips = this.resources.items?.robotModel?.animations || []
        const mixer = new THREE.AnimationMixer(this.model)
        const getClip = index => clips[index] || new THREE.AnimationClip(`clip${index}`, -1, [])

        this.animation = {
            mixer,
            actions: {
                dance: mixer.clipAction(getClip(0)),
                death: mixer.clipAction(getClip(1)),
                idle: mixer.clipAction(getClip(2)),
                jump: mixer.clipAction(getClip(3)),
                walking: mixer.clipAction(getClip(10))
            },
            play: name => this._playAnimation(name)
        }

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        const jumpAction = this.animation.actions.jump
        jumpAction.setLoop(THREE.LoopOnce)
        jumpAction.clampWhenFinished = true
        jumpAction.onFinished = () => {
            this.animation.play('idle')
        }
    }

    _playAnimation(name) {
    const newAction = this.animation.actions[name];
    const oldAction = this.animation.actions.current;
    if (!newAction || !oldAction) return;

    newAction.reset();
    newAction.play();
    newAction.crossFadeFrom(oldAction, 0.3);
    this.animation.actions.current = newAction;

    // Manejo seguro de walkSound
    if (name === 'walking') {
        if (this.walkSound && typeof this.walkSound.play === 'function') {
            this.walkSound.play().catch(e => console.warn("Error al reproducir walkSound:", e));
        }
    } else {
        if (this.walkSound) {
            // Soporte para Howler.js, Web Audio API y otros
            if (typeof this.walkSound.stop === 'function') {
                this.walkSound.stop();
            } else if (typeof this.walkSound.pause === 'function') {
                this.walkSound.pause();
                this.walkSound.currentTime = 0; // Reinicia el audio
            }
        }
    }

    // Manejo seguro de jumpSound
    if (name === 'jump' && this.jumpSound && typeof this.jumpSound.play === 'function') {
        this.jumpSound.play().catch(e => console.warn("Error al reproducir jumpSound:", e));
    }
}
    update() {
        const delta = this.time.delta * 0.001
        this.animation.mixer.update(delta)

        const keys = this.keyboard.getState()
        const moveForce = 80
        const turnSpeed = 2.5
        let isMoving = false

        const maxSpeed = 15
        this.body.velocity.x = Math.max(Math.min(this.body.velocity.x, maxSpeed), -maxSpeed)
        this.body.velocity.z = Math.max(Math.min(this.body.velocity.z, maxSpeed), -maxSpeed)

        const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.group.quaternion)

        if (keys.space && this.body.position.y <= 0.51) {
            this.body.applyImpulse(new CANNON.Vec3(forward.x * 0.5, 3, forward.z * 0.5))
            this.animation.play('jump')
            return
        }

        if (this.body.position.y > 10) {
            this.body.position.set(0, 1, 0)
            this.body.velocity.set(0, 0, 0)
        }

        if (keys.up) {
            this._applyMoveForce(new THREE.Vector3(0, 0, 1), moveForce)
            isMoving = true
        }

        if (keys.down) {
            this._applyMoveForce(new THREE.Vector3(0, 0, -1), moveForce)
            isMoving = true
        }

        if (keys.left) {
            this.group.rotation.y += turnSpeed * delta
            this.body.quaternion.setFromEuler(0, this.group.rotation.y, 0)
        }
        if (keys.right) {
            this.group.rotation.y -= turnSpeed * delta
            this.body.quaternion.setFromEuler(0, this.group.rotation.y, 0)
        }

        if (isMoving && this.animation.actions.current !== this.animation.actions.walking) {
            this.animation.play('walking')
        } else if (!isMoving && this.animation.actions.current !== this.animation.actions.idle) {
            this.animation.play('idle')
        }

        this.group.position.copy(this.body.position)
    }

    _applyMoveForce(direction, force) {
        direction.applyQuaternion(this.group.quaternion)
        this.body.applyForce(new CANNON.Vec3(direction.x * force, 0, direction.z * force), this.body.position)
    }

    moveInDirection(dir, speed) {
        if (!window.userInteracted || !this.experience.renderer?.instance?.xr?.isPresenting) return

        const mobile = window.experience?.mobileControls
        if (mobile?.intensity > 0) {
            const dir3D = new THREE.Vector3(mobile.directionVector.x, 0, mobile.directionVector.y).normalize()
            const adjustedSpeed = 250 * mobile.intensity
            const force = new CANNON.Vec3(dir3D.x * adjustedSpeed, 0, dir3D.z * adjustedSpeed)

            this.body.applyForce(force, this.body.position)

            if (this.animation.actions.current !== this.animation.actions.walking) {
                this.animation.play('walking')
            }

            const angle = Math.atan2(dir3D.x, dir3D.z)
            this.group.rotation.y = angle
            this.body.quaternion.setFromEuler(0, angle, 0)
        }
    }
}
