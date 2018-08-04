// 本地储存排序
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15 //存储最大值

export function saveSearch(query){
  let searches = storage.get(SEARCH_KEY,[])
  insertArray(searches,query,(item) => {
    return item === query
  },SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY,searches)
  return searches
}

//开始，从本地缓存中读取
export function loadSearch(){
  return storage.get(SEARCH_KEY,[])
}

//删除
export function deleteSearch(query){
  let searches = storage.get(SEARCH_KEY,[])
  deleteArray(searches,(item) => {
    return item === query
  })
  storage.set(SEARCH_KEY,searches)
  return searches
} 

// 清空
export function clearSearch(){
  storage.remove(SEARCH_KEY)
  return []
}

function deleteArray(arr,compare){
  const index = arr.findIndex(compare)
  if(index > -1){
    arr.splice(index,1)
  }
}

function insertArray(arr,val,compare,maxLen){
  const index = arr.findIndex(compare)
  if(index === 0){
    return
  }
  if(index > 0){
    arr.splice(index,1)
  }
  arr.unshift(val)
  if(maxLen && arr.length > maxLen){
    arr.pop()
  }
}