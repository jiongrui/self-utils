<template>
  <div class="a-search">
    <div class="input_box">
      <label class="input_box-label">
        起点：
        <input
          class="input_box-input"
          type="number"
          v-model.number="start.x"
        />
        <input
          class="input_box-input"
          type="number"
          v-model.number="start.y"
        />
      </label>
      <label class="input_box-label">
        终点：
        <input
          class="input_box-input"
          type="number"
          v-model.number="end.x"
        />
        <input
          class="input_box-input"
          type="number"
          v-model.number="end.y"
        />
      </label>
      <button
        class="btn"
        @click="handleBegin"
      >开始</button>
    </div>
    <div class="title">{{title}}</div>
    <canvas
      class="canvas"
      id="canvas"
    ></canvas>
  </div>
</template>
<script>
import startGame from '../../utils/aStartSearchRoute2'
export default {
  data() {
    return {
      title: '',
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      }
    }
  },
  mounted() {
    this.canvas = document.getElementById('canvas')
    this.title = this.getTitle()
  },
  methods: {
    getTitle() {
      // console.log('this.canvas', this.start, this.end, this.canvas)
      return startGame(this.start, this.end, this.canvas)
    },
    handleBegin() {
      this.title = this.getTitle()
    }
  }
}
</script>
<style >
.a-search {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.a-search .input_box {
  display: flex;
  padding-bottom: 20px;
}
.a-search .input_box-label {
  display: flex;
  align-items: center;
}
.a-search .input_box > *:nth-child(n + 2) {
  margin-left: 20px;
}
.a-search .input_box .btn {
  padding: 0 10px;
}
.a-search .input_box-input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
}
.a-search .input_box-input:last-child {
  margin-left: 5px;
}

.a-search .title {
  padding-bottom: 30px;
  font-size: 28px;
  font-weight: 500;
}
.canvas {
  width: 300px;
  height: 300px;
}
</style>
