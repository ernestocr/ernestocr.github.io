let app = new Vue({
  el: '#app',
  data: {
    raw: '',
    clippings: [],
    search: '',
    loading: true,
    authors: []
  },
  mounted() {
    let that = this
    this.$http.get('My Clippings.txt')
      .then((response) => {
        that.raw = response.data
        that.clippings = that.process()
        that.authors = that.setAuthors()
        that.loading = false
      }, (response) => {
        console.log('There was an error loading the text file.')
      })
  },
  methods: {
    viewAuthor(a) {
      this.search = a
      scroll(0,0)
    },
    setAuthors() {
      let authors = []
      this.clippings.forEach((c) => {
        let regExp = /\(([^)]+)\)/
        let matches = regExp.exec(c.title)
        if ( matches != null ) {
          if ( !authors.includes(matches[1]) ) {
            authors.push(matches[1])
          }
        }
      })
      return authors
    },
    process() {
      let data = this.raw.split('==========').reverse()
      let clippings = []
      data.forEach((c, i) => {
        let obj = {}
        let temp = c.split('\n')
        
        if ( i == 0 ) {
          obj.title = temp[0]
          obj.text = temp[3]
          temp[1] = temp[1].split(' | ')
          obj.meta = temp[1][temp[1].length-1]
        } else {
          if ( temp[1] == ''  ) { return }
          obj.title = temp[1]
          obj.text = temp[4]
          temp[2] = temp[2].split(' | ')
          obj.meta = temp[2][temp[2].length-1]
        }

        if ( temp.length > 2 ) {
          clippings.push(obj)
        }
      })
      return clippings
    }
  },
  computed: {
    filteredClippings() {
      let self = this
      return self.clippings.filter((c) => {
        return c.title.toLowerCase().indexOf(self.search.toLowerCase()) !== -1 ||
                c.text.toLowerCase().indexOf(self.search.toLowerCase()) !== -1
      })
    }
  }
})
