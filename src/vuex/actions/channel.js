/* eslint-disable no-unused-vars */

let nextNoteId = 1
let nextCatalogId = 1

let savedNoteList = []

const devchannel = {
  noteMessager: {
    add: (data, callback) => {
      const noteId = nextNoteId++
      let newNote = JSON.parse(data)
      newNote.id = noteId
      newNote.is_delete = false
      savedNoteList.push({...newNote})
      callback(noteId)
    },
    update: (data, callback) => {
      const note = JSON.parse(data)
      savedNoteList.forEach(item => {
        if (note.id === item.id) {
          item.content = note.content
          item.label = note.label
          if (note.catalog_id) {
            item.catalog_id = note.catalog_id
          }
        }
      })
      callback()
    },
    delete: (data, callback) => {
      const note = JSON.parse(data)
      savedNoteList.forEach(item => {
        if (note.id === item.id) {
          item.is_delete = true
        }
      })
      callback()
    },
    findAllByCatalogId: (catalogId, callback) => {
      console.log(savedNoteList)
      let noteList = []
      savedNoteList.forEach(item => {
        if (item.catalog_id === catalogId && item.is_delete === false) {
          noteList.push({
            id: item.id,
            title: item.label,
            content: item.content
          })
        }
      })
      callback(JSON.stringify(noteList))
    }
  },
  catalogMessager: {
    initCatalog: (callback) => {
      let data = {
        catalog: [{id: -1, label: '我的文件夹', children: []}],
        catalogKv: {'-1': '0'}
      }
      callback(JSON.stringify(data))
    },
    updateCatalog: (data, callback) => {
      callback()
    },
    add: (data, callback) => {
      const catalogId = nextCatalogId++
      callback(catalogId)
    },
    update: (data, callback) => {
      callback()
    },
    delete: (data, callback) => {
      callback()
    }
  },
  searcherMessager: {
    add: (data, callback) => {},
    update: (data, callback) => {},
    delete: (data, callback) => {},
    all: (condition, callback) => {
      let data = []
      savedNoteList.forEach(item => {
        data.push({
          id: item.id,
          title: item.label,
          content: item.content,
          catalog_id: item.catalog_id,
          isNote: true
        })
      })
      callback(JSON.stringify(data))
    }
  }
}

const channel = {
  get: (name) => {
    let attr = null
    if (typeof window.channel === 'undefined') {
      attr = devchannel[name]
    } else {
      attr = window.channel.objects[name]
    }
    return attr
  }
}

export default channel
