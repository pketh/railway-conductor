export default {
  all: ['🔮', '☎️', '🅰️', '🍇', '🌺', '💐', '🚛', '💁‍♀️', '🐸', '♥️'],
  random () {
    return this.all[Math.floor(Math.random() * this.all.length)]
  }
}