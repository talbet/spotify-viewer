<template>
  <div :class="classes" @click="edit">
    <input
      v-show="(mode === 'edit' || mode === 'saving') && multiline === false"
      type="text"
      v-model="newValue"
      @blur="save"
      @keyup.13="save"
      @keyup.27="cancel"
      :disabled="mode === 'saving'"
    >
    <textarea
      v-show="(mode === 'edit' || mode === 'saving') && multiline === true"
      v-model="newValue"
      @keyup.27="cancel"
      :disabled="mode === 'saving'"
    ></textarea>
    <button
      v-show="(mode === 'edit' || mode == 'saving') && multiline === true && id !== '____add-row'"
      @click="save"
      :disabled="mode === 'saving'"
      class="ui icon button btn"
      >&#10003;</button><!-- todo: conditional fa -->
    <button
      v-show="(mode === 'edit' || mode == 'saving') && multiline === true && id !== '____add-row'"
      @click="cancel"
      :disabled="mode === 'saving'"
      class="ui icon button btn"
      >&#10007;</button><!-- todo: conditional fa -->
    <span v-show="mode === 'readOnly'">{{processedText}}</span>
  </div>
</template>

<script lang="babel">
  export default {
    data () {
      return {
        value: undefined,
        newValue: undefined,
        id: undefined,
        col: undefined,
        editable: false,
        compareFunction: undefined,
        mode: 'readOnly'
      }
    },
    props: {
      multiline: {
        type: Boolean,
        default: false
      },
      lexicographicalOrdering: {
        type: Boolean,
        default: false
      }
    },
    compiled () {
      if (this.lexicographicalOrdering === true) {
        this.compareFunction = 'lexicographic'
      }
    },
    computed: {
      processedText () {
        let entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\'': '&#39;',
          '/': '&#x2F;'
        }
        function escapeHtml (string) {
          return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s]
          })
        }
        return escapeHtml(this.value).replace(/\n/g, '<br/>')
      },
      classes () {
        let acc = []
        if (this.editable && this.mode === 'readOnly') {
          acc.push('pointer-cursor full-height')
        }
        if (this.mode === 'edit' || this.mode === 'saving') {
          acc.push('ui input') // semantic ui input
          acc.push('padding') // semantic ui fix
          acc.push('input-group') // bootstrap
        }
        return acc.join(' ')
      }
    },
    methods: {
      cancel () {
        this.$dispatch('cancel', {id: this.id, col: this.col})
      },
      save () {
        this.$dispatch('saveNewValue', {id: this.id, col: this.col})
      },
      edit () {
        this.$dispatch('enterEditMode', {id: this.id, col: this.col})
        this.$nextTick(() => {
          if (this.multiline) {
            this.$el.querySelector('textarea').focus()
          } else {
            this.$el.querySelector('input').focus()
          }
        })
      }
    }
  }
</script>

<style scoped>
  .pointer-cursor {
    cursor: pointer;
  }
  .full-height {
    display: flex;
    padding: 0.71428571em;
    vertical-align: middle;
  }
  .padding {
    padding: 0.71428571em;
  }
</style>
