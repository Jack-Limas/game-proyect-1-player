import { Howl, Howler } from 'howler'

export default class Sound {
    constructor(src, options = {}) {
        this.sound = new Howl({
            src: [src],
            ...options
        })

        this._retryCount = 0
        this._maxRetries = 5
    }

    async play() {
        try {
            const ctx = Howler.ctx

            // ✅ Verificamos si ctx y ctx.state existen
            if (ctx && ctx.state === 'suspended') {
                await ctx.resume()
                console.log('🔊 AudioContext reanudado desde Sound.js')
            }

            if (!this.sound.playing()) {
                this.sound.play()
                this._retryCount = 0
            }
        } catch (e) {
            if (this._retryCount < this._maxRetries) {
                console.warn('⏸️ Error al intentar reproducir. Reintentando...', e)
                this._retryCount++
                setTimeout(() => {
                    this.play()
                }, 500)
            } else {
                console.warn('🛑 Máximo número de intentos de reproducción alcanzado.')
            }
        }
    }

    sstop() {
    if (
        this.sound &&
        typeof this.sound.playing === 'function' &&
        this.sound.playing()
    ) {
        this.sound.stop()
    }
    this._retryCount = 0
    }
}
